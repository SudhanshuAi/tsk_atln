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
      
      setCurrentQuery: (query) => set({ currentQuery: query }),
      
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
        const { currentQuery, bookmarkedQueries } = get();
        const isBookmarked = bookmarkedQueries.includes(currentQuery);
        
        set({ 
          bookmarkedQueries: isBookmarked
            ? bookmarkedQueries.filter(q => q !== currentQuery)
            : [...bookmarkedQueries, currentQuery],
          sidebarView: isBookmarked ? 'predefined' : 'bookmarked'
        });
      },
      
      removeBookmark: (query) => {
        set(state => ({ 
          bookmarkedQueries: state.bookmarkedQueries.filter(q => q !== query),
          sidebarView: state.bookmarkedQueries.length === 1 ? 'predefined' : state.sidebarView
        }));
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