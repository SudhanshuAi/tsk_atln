import React, { useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import useStore from '../../store';
import useDebounce from '../../hooks/useDebounce';
import '../../styles/SearchQueries.css';

const SearchQueries = () => {
  // Get search-related state and methods from the store
  const searchTerm = useStore(state => state.searchTerm);
  const searchResults = useStore(state => state.searchResults);
  const isSearching = useStore(state => state.isSearching);
  const setSearchTerm = useStore(state => state.setSearchTerm);
  const performSearch = useStore(state => state.performSearch);
  const clearSearch = useStore(state => state.clearSearch);
  
  // Get other required store values and methods
  const darkMode = useStore(state => state.darkMode);
  const selectQuery = useStore(state => state.selectQuery);
  const loadQuery = useStore(state => state.loadQuery);
  const setSidebarView = useStore(state => state.setSidebarView);
  
  // Use the debounce hook with the search term from the store
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Use the debounced search term to trigger the search
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, performSearch]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleResultClick = (result) => {
    // First switch to predefined view
    setSidebarView('predefined');

    // Add a small delay to ensure the view has changed before selecting the query
    setTimeout(() => {
      if (result.type === 'predefined' && result.id) {
        selectQuery(result.id);
      } else {
        loadQuery(result.query);
      }
    }, 50);
    
    // Clear the search
    clearSearch();
  };

  return (
    <div className={`search-queries ${darkMode ? 'dark' : 'light'}`}>
      <div className="search-input-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className={`search-input ${darkMode ? 'dark' : 'light'}`}
          placeholder="Search queries..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {isSearching && searchResults.length > 0 && (
        <div className={`search-results ${darkMode ? 'dark' : 'light'}`}>
          {searchResults.map((result, index) => (
            <div 
              key={index} 
              className={`search-result-item ${darkMode ? 'dark' : 'light'}`}
              onClick={() => handleResultClick(result)}
            >
              <span className="search-result-name">{result.name}</span>
              {result.isBookmarked && (
                <span className={`search-result-badge ${darkMode ? 'dark' : 'light'} bookmarked`}>
                  bookmarked
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      
      {isSearching && searchTerm.trim() && !searchResults.length && (
        <div className={`search-results ${darkMode ? 'dark' : 'light'}`}>
          <div className="no-search-results">No matching queries found</div>
        </div>
      )}
    </div>
  );
};

export default SearchQueries;