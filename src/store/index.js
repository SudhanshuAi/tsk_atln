import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import PREDEFINED_QUERIES from '../data/queries';
import DUMMY_RESULTS from '../data/dummyResults';

const useStore = create(
  persist(
    (set, get) => ({
      currentQuery: PREDEFINED_QUERIES[0].query,
      selectedQueryId: 1,
      queryResults: null,
      isLoading: false,
      executionTime: null,
      recentQueries: [],
      bookmarkedQueries: [],
      darkMode: false,
      queryEditorHeight: 40,
      sidebarView: 'predefined',
      searchTerm: '',
      searchResults: [],
      isSearching: false,
      
      setCurrentQuery: (query) => set({ currentQuery: query }),
      
      // Search-related actions
      setSearchTerm: (term) => {
        set({ 
          searchTerm: term,
          isSearching: term.trim().length > 0
        });
        
        if (!term.trim()) {
          set({ searchResults: [] });
        }
      },
      
      performSearch: (debouncedTerm) => {
        if (!debouncedTerm.trim()) {
          set({ searchResults: [], isSearching: false });
          return;
        }
        
        const { bookmarkedQueries, recentQueries } = get();
        const lowercaseTerm = debouncedTerm.toLowerCase();
        
        // Optimized approach: search only in predefined queries
        const results = PREDEFINED_QUERIES
          .filter(query => 
            query.name.toLowerCase().includes(lowercaseTerm) || 
            query.query.toLowerCase().includes(lowercaseTerm)
          )
          .map(query => ({
            id: query.id,
            name: query.name,
            type: 'predefined',
            query: query.query,
            isBookmarked: bookmarkedQueries.includes(query.query),
            isRecent: recentQueries.includes(query.query)
          }));
        
        set({ 
          searchResults: results,
          isSearching: true
        });
      },
      
      clearSearch: () => {
        set({ 
          searchTerm: '',
          searchResults: [],
          isSearching: false
        });
      },
      
      selectQuery: (queryId) => {
        const selectedQuery = PREDEFINED_QUERIES.find(q => q.id === queryId);
        if (!selectedQuery) return;
        
        set({ 
          selectedQueryId: queryId, 
          currentQuery: selectedQuery.query,
          queryResults: null,
          executionTime: null
        });
      },
      
      executeQuery: () => {
        const { selectedQueryId, currentQuery, recentQueries } = get();
        set({ isLoading: true });
        
        const startTime = performance.now();
        setTimeout(() => {
          const endTime = performance.now();
          
          set({
            queryResults: DUMMY_RESULTS[selectedQueryId],
            executionTime: (endTime - startTime) / 1000,
            recentQueries: !recentQueries.includes(currentQuery)
              ? [currentQuery, ...recentQueries.slice(0, 9)]
              : recentQueries,
            isLoading: false
          });
        }, 800);
      },
      
      bookmarkQuery: () => {
        const { currentQuery, bookmarkedQueries, searchTerm, isSearching } = get();
        const isBookmarked = bookmarkedQueries.includes(currentQuery);
        
        if (isBookmarked) {
          // When unbookmarking, just update the bookmarks array
          set({ 
            bookmarkedQueries: bookmarkedQueries.filter(q => q !== currentQuery)
          });
          
          // Update search results if there's an active search
          if (searchTerm.trim() && isSearching) {
            get().performSearch(searchTerm);
          }
        } else {
          // When bookmarking, update bookmarks and switch to bookmarked view
          set({ 
            bookmarkedQueries: [...bookmarkedQueries, currentQuery],
            sidebarView: 'bookmarked'
          });
          
          // Update search results if there's an active search
          if (searchTerm.trim() && isSearching) {
            get().performSearch(searchTerm);
          }
        }
      },
      
      removeBookmark: (query) => {
        const { bookmarkedQueries, searchTerm, isSearching } = get();
        const updatedBookmarks = bookmarkedQueries.filter(q => q !== query);
        
        // Only update bookmarks array, don't change the sidebar view
        set({ bookmarkedQueries: [...updatedBookmarks] });
        
        // Update search results if there's an active search
        if (searchTerm.trim() && isSearching) {
          get().performSearch(searchTerm);
        }
      },
      
      loadQuery: (query) => {
        const matchingPredefinedQuery = PREDEFINED_QUERIES.find(q => q.query === query);
        set({ 
          currentQuery: query,
          selectedQueryId: matchingPredefinedQuery?.id || null,
          queryResults: null,
          executionTime: null
        });
      },
      
      exportResults: () => {
        const { queryResults } = get();
        if (!queryResults) return;
        
        const headers = queryResults.columns.join(',');
        const rows = queryResults.rows.map(row => 
          queryResults.columns.map(col => row[col]).join(',')
        );
        
        const link = document.createElement('a');
        link.href = encodeURI(`data:text/csv;charset=utf-8,${headers}\n${rows.join('\n')}`);
        link.download = `query_results_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
      },
      
      toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),
      setQueryEditorHeight: (height) => set({ queryEditorHeight: height }),
      setSidebarView: (view) => set({ sidebarView: view })
    }),
    {
      name: 'sql-editor-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        bookmarkedQueries: state.bookmarkedQueries,
        recentQueries: state.recentQueries,
        queryEditorHeight: state.queryEditorHeight
      })
    }
  )
);

export default useStore;