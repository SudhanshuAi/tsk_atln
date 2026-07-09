import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import PREDEFINED_QUERIES from '../data/queries';
import { initDatabase, executeSQL, getSchema as getSampleSchema } from '../services/sqlEngine';
import { apiClient } from '../services/apiClient';

const useStore = create(
  persist(
    (set, get) => ({
      // ── Editor & Tabs ───────────────────────────────────────────────────
      editors: [
        { id: 'default', name: 'Query 1', query: PREDEFINED_QUERIES[0].query }
      ],
      activeEditorId: 'default',
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
      connections: [],          // [{ id, connectionId, name, type, host, port, user, password, database }]
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

      // ── Tabs Actions ─────────────────────────────────────────────────────
      createEditor: (query = '') => {
        const { editors } = get();
        const newId = Date.now().toString();
        const nextNumber = editors.length + 1;
        const newEditor = { id: newId, name: `Query ${nextNumber}`, query };
        set({
          editors: [...editors, newEditor],
          activeEditorId: newId,
          currentQuery: query,
          selectedQueryId: null,
        });
      },

      deleteEditor: (id) => {
        const { editors, activeEditorId } = get();
        if (editors.length <= 1) {
          set({
            editors: [{ id: 'default', name: 'Query 1', query: '' }],
            activeEditorId: 'default',
            currentQuery: '',
            selectedQueryId: null,
          });
          return;
        }
        const newEditors = editors.filter(e => e.id !== id);
        let nextActiveId = activeEditorId;
        if (activeEditorId === id) {
          const idx = editors.findIndex(e => e.id === id);
          nextActiveId = idx === 0 ? editors[1].id : editors[idx - 1].id;
        }
        const nextActiveEditor = newEditors.find(e => e.id === nextActiveId);
        set({
          editors: newEditors,
          activeEditorId: nextActiveId,
          currentQuery: nextActiveEditor ? nextActiveEditor.query : '',
          selectedQueryId: null, // Reset predefined selection when deleting tabs
        });
      },

      renameEditor: (id, name) => {
        const { editors } = get();
        set({
          editors: editors.map(e => e.id === id ? { ...e, name } : e)
        });
      },

      setActiveEditorId: (id) => {
        const { editors } = get();
        const editor = editors.find(e => e.id === id);
        if (editor) {
          set({
            activeEditorId: id,
            currentQuery: editor.query,
            selectedQueryId: null,
          });
        }
      },

      updateActiveQuery: (query) => {
        const { editors, activeEditorId } = get();
        set({
          editors: editors.map(e => e.id === activeEditorId ? { ...e, query } : e),
          currentQuery: query,
        });
      },

      // ── Execute query ─────────────────────────────────────────────────────
      executeQuery: async () => {
        const { mode, activeConnectionId, currentQuery, recentQueries, connections } = get();
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

          // Auto-reconnect/verify pool in backend
          const ok = await get().ensureActiveConnection();
          if (!ok) {
            set({
              queryError: 'Could not connect to database. Please check your credentials and make sure the server is reachable.',
              isLoading: false
            });
            return;
          }

          const activeConn = get().connections.find(c => c.id === activeConnectionId);
          result = await apiClient.executeQuery(activeConn.connectionId, currentQuery);
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
        const { mode, activeConnectionId, connections } = get();
        if (mode === 'sample') {
          set({ schema: getSampleSchema() });
        } else if (activeConnectionId) {
          const conn = connections.find(c => c.id === activeConnectionId);
          if (conn && conn.connectionId) {
            try {
              const schema = await apiClient.fetchSchema(conn.connectionId);
              if (!schema.error) set({ schema });
            } catch (_) {}
          }
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
          
          const { connections } = get();
          const key = `${config.type}-${config.host}-${config.database}-${config.user}`;
          const existingIdx = connections.findIndex(c => `${c.type}-${c.host}-${c.database}-${c.user}` === key);

          const connectionProfile = {
            id: existingIdx >= 0 ? connections[existingIdx].id : Date.now().toString(),
            connectionId: result.connectionId,
            name: `${config.database}@${config.host}`,
            type: config.type,
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database,
          };

          let newConnections = [...connections];
          if (existingIdx >= 0) {
            newConnections[existingIdx] = connectionProfile;
          } else {
            newConnections.push(connectionProfile);
          }

          set({
            connections: newConnections,
            activeConnectionId: connectionProfile.id,
            mode: 'connected',
            schema: result.schema || [],
            isConnecting: false,
            connectionError: null,
            showConnectionManager: false,
          });
          return true;
        } catch (err) {
          set({ connectionError: err.message, isConnecting: false });
          return false;
        }
      },

      ensureActiveConnection: async () => {
        const { mode, activeConnectionId, connections } = get();
        if (mode !== 'connected' || !activeConnectionId) return true;

        const conn = connections.find(c => c.id === activeConnectionId);
        if (!conn) return false;

        if (!conn.connectionId) {
          return await get().reconnectProfile(conn.id);
        }

        try {
          const schema = await apiClient.fetchSchema(conn.connectionId);
          if (schema.error) {
            return await get().reconnectProfile(conn.id);
          }
          return true;
        } catch (_) {
          return await get().reconnectProfile(conn.id);
        }
      },

      reconnectProfile: async (profileId) => {
        const { connections } = get();
        const conn = connections.find(c => c.id === profileId);
        if (!conn) return false;

        try {
          const result = await apiClient.connectToDb({
            type: conn.type,
            host: conn.host,
            port: conn.port,
            user: conn.user,
            password: conn.password,
            database: conn.database,
          });

          if (result.error) return false;

          const updatedConns = connections.map(c =>
            c.id === profileId ? { ...c, connectionId: result.connectionId } : c
          );
          set({
            connections: updatedConns,
            schema: result.schema || [],
          });
          return true;
        } catch (_) {
          return false;
        }
      },

      disconnectDb: async (profileId) => {
        const { connections } = get();
        const conn = connections.find(c => c.id === profileId);
        if (conn && conn.connectionId) {
          try {
            await apiClient.disconnectDb(conn.connectionId);
          } catch (_) {}
        }
        
        const remaining = connections.filter(c => c.id !== profileId);
        const newActive = remaining.length > 0 ? remaining[remaining.length - 1].id : null;
        set({
          connections: remaining,
          activeConnectionId: newActive,
          mode: newActive ? 'connected' : 'sample',
          schema: [],
        });
        if (newActive) {
          get().refreshSchema();
        } else {
          get().switchToSample();
        }
      },

      setActiveConnection: async (profileId) => {
        set({ activeConnectionId: profileId, mode: 'connected', isLoading: true });
        const ok = await get().reconnectProfile(profileId);
        if (ok) {
          set({ isLoading: false, queryError: null });
        } else {
          set({
            isLoading: false,
            queryError: `Failed to restore connection. Please recheck your credentials.`,
          });
        }
      },

      switchToSample: () => {
        set({ mode: 'sample', activeConnectionId: null, schema: getSampleSchema() });
      },

      // ── Query helpers ─────────────────────────────────────────────────────
      setCurrentQuery: (query) => {
        const { editors, activeEditorId } = get();
        set({
          currentQuery: query,
          editors: editors.map(e => e.id === activeEditorId ? { ...e, query } : e),
        });
      },

      selectQuery: (queryId) => {
        const selectedQuery = PREDEFINED_QUERIES.find(q => q.id === queryId);
        if (!selectedQuery) return;
        const { editors, activeEditorId } = get();
        set({
          selectedQueryId: queryId,
          currentQuery: selectedQuery.query,
          editors: editors.map(e => e.id === activeEditorId ? { ...e, query: selectedQuery.query } : e),
          queryResults: null,
          queryError: null,
          executionTime: null,
          affectedRows: null,
        });
      },

      loadQuery: (query) => {
        const match = PREDEFINED_QUERIES.find(q => q.query === query);
        const { editors, activeEditorId } = get();
        set({
          currentQuery: query,
          editors: editors.map(e => e.id === activeEditorId ? { ...e, query } : e),
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
        connections: state.connections,
        activeConnectionId: state.activeConnectionId,
        mode: state.mode,
        editors: state.editors,
        activeEditorId: state.activeEditorId,
      }),
    }
  )
);

export default useStore;