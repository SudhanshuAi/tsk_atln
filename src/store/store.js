import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import PREDEFINED_QUERIES from '../data/queries';
import { initDatabase, executeSQL, getSchema as getSampleSchema } from '../services/sqlEngine';
import { apiClient } from '../services/apiClient';

const useStore = create(
  persist(
    (set, get) => ({
      // ── Editor ──────────────────────────────────────────────────────────
      currentQuery: PREDEFINED_QUERIES[0].query,
      selectedQueryId: 1,

      // ── Results ─────────────────────────────────────────────────────────
      queryResults: null,
      isLoading: false,
      executionTime: null,
      queryError: null,
      affectedRows: null,

      // ── History & bookmarks ──────────────────────────────────────────────
      recentQueries: [],
      bookmarkedQueries: [],

      // ── Sidebar ─────────────────────────────────────────────────────────
      darkMode: false,
      queryEditorHeight: 50,
      sidebarView: 'predefined',
      searchTerm: '',
      searchResults: [],
      isSearching: false,

      // ── DB engine ────────────────────────────────────────────────────────
      mode: 'sample',           // 'sample' | 'connected'
      dbReady: false,
      dbError: null,
      schema: [],               // [{ tableName, columns: [{name,type}] }]

      // ── Connections ──────────────────────────────────────────────────────
      connections: [],          // [{ connectionId, name, type, database }]
      activeConnectionId: null,
      connectionError: null,
      isConnecting: false,
      showConnectionManager: false,

      // ── Init ─────────────────────────────────────────────────────────────
      initDb: async () => {
        try {
          await initDatabase();
          const schema = getSampleSchema();
          set({ dbReady: true, dbError: null, schema });
        } catch (err) {
          set({ dbError: err.message, dbReady: false });
        }
      },

      // ── Execute query ─────────────────────────────────────────────────────
      executeQuery: async () => {
        const { mode, activeConnectionId, currentQuery, recentQueries } = get();
        set({ isLoading: true, queryError: null, affectedRows: null, queryResults: null });

        const startTime = performance.now();
        let result;

        if (mode === 'sample') {
          result = executeSQL(currentQuery);
          result.executionTime = (performance.now() - startTime) / 1000;
        } else {
          if (!activeConnectionId) {
            set({ queryError: 'No active connection. Please connect to a database.', isLoading: false });
            return;
          }
          result = await apiClient.executeQuery(activeConnectionId, currentQuery);
        }

        if (result.error) {
          set({ queryError: result.error, queryResults: null, isLoading: false });
        } else {
          set({
            queryResults: result.columns?.length > 0 ? result : null,
            affectedRows: result.rowsAffected ?? null,
            executionTime: result.executionTime ?? null,
            queryError: null,
            isLoading: false,
            recentQueries: !recentQueries.includes(currentQuery)
              ? [currentQuery, ...recentQueries.slice(0, 9)]
              : recentQueries,
          });
          // Refresh schema after potential DDL
          get().refreshSchema();
        }
      },

      // ── Schema ────────────────────────────────────────────────────────────
      refreshSchema: async () => {
        const { mode, activeConnectionId } = get();
        if (mode === 'sample') {
          set({ schema: getSampleSchema() });
        } else if (activeConnectionId) {
          try {
            const schema = await apiClient.fetchSchema(activeConnectionId);
            if (!schema.error) set({ schema });
          } catch (_) {}
        }
      },

      // ── Connection management ─────────────────────────────────────────────
      setShowConnectionManager: (show) => set({ showConnectionManager: show }),

      connectToDb: async (config) => {
        set({ isConnecting: true, connectionError: null });
        try {
          const result = await apiClient.connectToDb(config);
          if (result.error) {
            set({ connectionError: result.error, isConnecting: false });
            return false;
          }
          const newConn = {
            connectionId: result.connectionId,
            name: result.name,
            type: result.type,
            database: result.database,
          };
          set(state => ({
            connections: [...state.connections, newConn],
            activeConnectionId: result.connectionId,
            mode: 'connected',
            schema: result.schema || [],
            isConnecting: false,
            connectionError: null,
            showConnectionManager: false,
          }));
          return true;
        } catch (err) {
          set({ connectionError: err.message, isConnecting: false });
          return false;
        }
      },

      disconnectDb: async (connectionId) => {
        await apiClient.disconnectDb(connectionId);
        const { connections, activeConnectionId, mode } = get();
        const remaining = connections.filter(c => c.connectionId !== connectionId);
        const newActive = remaining.length > 0 ? remaining[remaining.length - 1].connectionId : null;
        set({
          connections: remaining,
          activeConnectionId: newActive,
          mode: newActive ? 'connected' : 'sample',
          schema: newActive ? get().schema : getSampleSchema(),
        });
        if (!newActive) get().refreshSchema();
      },

      setActiveConnection: async (connectionId) => {
        set({ activeConnectionId: connectionId, mode: 'connected' });
        const schema = await apiClient.fetchSchema(connectionId);
        if (!schema.error) set({ schema });
      },

      switchToSample: () => {
        set({ mode: 'sample', activeConnectionId: null, schema: getSampleSchema() });
      },

      // ── Query helpers ─────────────────────────────────────────────────────
      setCurrentQuery: (query) => set({ currentQuery: query }),

      selectQuery: (queryId) => {
        const selectedQuery = PREDEFINED_QUERIES.find(q => q.id === queryId);
        if (!selectedQuery) return;
        set({
          selectedQueryId: queryId,
          currentQuery: selectedQuery.query,
          queryResults: null,
          queryError: null,
          executionTime: null,
          affectedRows: null,
        });
      },

      loadQuery: (query) => {
        const match = PREDEFINED_QUERIES.find(q => q.query === query);
        set({
          currentQuery: query,
          selectedQueryId: match?.id || null,
          queryResults: null,
          queryError: null,
          executionTime: null,
          affectedRows: null,
        });
      },

      // ── Bookmarks ─────────────────────────────────────────────────────────
      bookmarkQuery: () => {
        const { currentQuery, bookmarkedQueries, searchTerm, isSearching } = get();
        const isBookmarked = bookmarkedQueries.includes(currentQuery);
        if (isBookmarked) {
          set({ bookmarkedQueries: bookmarkedQueries.filter(q => q !== currentQuery) });
        } else {
          set({ bookmarkedQueries: [...bookmarkedQueries, currentQuery], sidebarView: 'bookmarked' });
        }
        if (searchTerm.trim() && isSearching) get().performSearch(searchTerm);
      },

      removeBookmark: (query) => {
        const { bookmarkedQueries, searchTerm, isSearching } = get();
        set({ bookmarkedQueries: bookmarkedQueries.filter(q => q !== query) });
        if (searchTerm.trim() && isSearching) get().performSearch(searchTerm);
      },

      // ── Search ────────────────────────────────────────────────────────────
      setSearchTerm: (term) => {
        set({ searchTerm: term, isSearching: term.trim().length > 0 });
        if (!term.trim()) set({ searchResults: [] });
      },

      performSearch: (debouncedTerm) => {
        if (!debouncedTerm.trim()) {
          set({ searchResults: [], isSearching: false });
          return;
        }
        const { bookmarkedQueries } = get();
        const lower = debouncedTerm.toLowerCase();
        const results = PREDEFINED_QUERIES
          .filter(q => q.name.toLowerCase().startsWith(lower) || q.query.toLowerCase().startsWith(lower))
          .map(q => ({
            id: q.id, name: q.name, type: 'predefined', query: q.query,
            isBookmarked: bookmarkedQueries.includes(q.query),
          }));
        set({ searchResults: results, isSearching: true });
      },

      clearSearch: () => set({ searchTerm: '', searchResults: [], isSearching: false }),

      // ── Export ────────────────────────────────────────────────────────────
      exportResults: () => {
        const { queryResults } = get();
        if (!queryResults) return;
        const headers = queryResults.columns.join(',');
        const rows = queryResults.rows.map(row =>
          queryResults.columns.map(col => {
            const val = row[col];
            if (val === null || val === undefined) return '';
            const s = String(val);
            return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
          }).join(',')
        );
        const csv = [headers, ...rows].join('\n');
        const link = document.createElement('a');
        link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
        link.download = `query_results_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
      },

      // ── UI ────────────────────────────────────────────────────────────────
      toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),
      setQueryEditorHeight: (height) => set({ queryEditorHeight: height }),
      setSidebarView: (view) => set({ sidebarView: view }),
    }),

    {
      name: 'sql-ide-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        bookmarkedQueries: state.bookmarkedQueries,
        recentQueries: state.recentQueries,
        queryEditorHeight: state.queryEditorHeight,
      }),
    }
  )
);

export default useStore;