import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import PREDEFINED_QUERIES from '../data/queries';
import DUMMY_RESULTS from '../data/dummyResults';

// Create the store with persist middleware to save state to localStorage
const useStore = create(
  persist(
    (set, get) => ({
      // Query state
      currentQuery: PREDEFINED_QUERIES[0].query,
      selectedQueryId: 1,
      queryResults: null,
      isLoading: false,
      executionTime: null,
      
      // Collections
      recentQueries: [],
      bookmarkedQueries: [],
      
      // UI state
      darkMode: false,
      showHistory: true,
      showBookmarks: true,
      queryEditorHeight: 40, // percentage
      
      // Actions
      setCurrentQuery: (query) => set({ currentQuery: query }),
      
      selectQuery: (queryId) => {
        const selectedQuery = PREDEFINED_QUERIES.find(q => q.id === queryId);
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
        
        // Simulate network delay
        const startTime = performance.now();
        
        setTimeout(() => {
          const endTime = performance.now();
          
          // Add to recent queries
          let updatedRecentQueries = [...recentQueries];
          if (!recentQueries.includes(currentQuery)) {
            updatedRecentQueries = [currentQuery, ...recentQueries.slice(0, 9)];
          }
          
          set({
            queryResults: DUMMY_RESULTS[selectedQueryId],
            executionTime: (endTime - startTime) / 1000,
            recentQueries: updatedRecentQueries,
            isLoading: false
          });
        }, 800);
      },
      
      bookmarkQuery: () => {
        const { currentQuery, bookmarkedQueries } = get();
        if (bookmarkedQueries.includes(currentQuery)) {
          // If already bookmarked, remove it
          set({ 
            bookmarkedQueries: bookmarkedQueries.filter(q => q !== currentQuery) 
          });
        } else {
          // If not bookmarked, add it
          set({ 
            bookmarkedQueries: [...bookmarkedQueries, currentQuery],
            // Show bookmarks section when adding a new bookmark
            showBookmarks: true
          });
        }
      },
      
      removeBookmark: (query) => {
        const { bookmarkedQueries } = get();
        set({ 
          bookmarkedQueries: bookmarkedQueries.filter(q => q !== query) 
        });
      },
      
      loadQuery: (query) => {
        set({ 
          currentQuery: query,
          queryResults: null,
          executionTime: null
        });
      },
      
      exportResults: () => {
        const { queryResults } = get();
        if (!queryResults) return;
        
        // Create CSV content
        const headers = queryResults.columns.join(',');
        const rows = queryResults.rows.map(row => 
          queryResults.columns.map(col => row[col]).join(',')
        );
        const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows.join('\n')}`;
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `query_results_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      
      toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),
      setShowHistory: (value) => set({ showHistory: value }),
      toggleHistory: () => set(state => ({ showHistory: !state.showHistory })),
      setShowBookmarks: (value) => set({ showBookmarks: value }),
      toggleBookmarks: () => set(state => ({ showBookmarks: !state.showBookmarks })),
      setQueryEditorHeight: (height) => set({ queryEditorHeight: height }),
    }),
    {
      name: 'sql-editor-storage',
      // Only persist specific parts of the state to localStorage
      partialize: (state) => ({
        darkMode: state.darkMode,
        bookmarkedQueries: state.bookmarkedQueries,
        recentQueries: state.recentQueries,
        queryEditorHeight: state.queryEditorHeight,
        showHistory: state.showHistory,
        showBookmarks: state.showBookmarks
      })
    }
  )
);

export default useStore; 