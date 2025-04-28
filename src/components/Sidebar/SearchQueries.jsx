import React, { useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import useStore from '../../store/store';
import useDebounce from '../../hooks/useDebounce';
import '../../styles/SearchQueries.css';

const SearchQueries = () => {
  const searchTerm = useStore(state => state.searchTerm);
  const searchResults = useStore(state => state.searchResults);
  const isSearching = useStore(state => state.isSearching);
  const setSearchTerm = useStore(state => state.setSearchTerm);
  const performSearch = useStore(state => state.performSearch);
  const clearSearch = useStore(state => state.clearSearch);
  
  const darkMode = useStore(state => state.darkMode);
  const selectQuery = useStore(state => state.selectQuery);
  const loadQuery = useStore(state => state.loadQuery);
  const setSidebarView = useStore(state => state.setSidebarView);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, performSearch]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleResultClick = (result) => {
    setSidebarView('predefined');

    setTimeout(() => {
      if (result.type === 'predefined' && result.id) {
        selectQuery(result.id);
      } else {
        loadQuery(result.query);
      }
    }, 50);
    
    clearSearch();
  };

  return (
    <div className={`search-queries ${darkMode ? 'dark' : 'light'}`}>
      <div className="search-input-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className='search-input'
          placeholder="Search queries..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {isSearching && searchResults.length > 0 && (
        <div className='search-results'>
          {searchResults.map((result, index) => (
            <div 
              key={index} 
              className='search-result-item'
              onClick={() => handleResultClick(result)}
            >
              <span className="search-result-name">{result.name}</span>
              {result.isBookmarked && (
                <span className='search-result-badge bookmarked'>
                  bookmarked
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      
      {isSearching && searchTerm.trim() && !searchResults.length && (
        <div className='search-results'>
          <div className="no-search-results">No matching queries found</div>
        </div>
      )}
    </div>
  );
};

export default SearchQueries;