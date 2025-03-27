import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import useStore from '../../store';
import PREDEFINED_QUERIES from '../../data/queries';
import '../../styles/SearchQueries.css';

const SearchQueries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);
  const darkMode = useStore(state => state.darkMode);
  const selectQuery = useStore(state => state.selectQuery);
  const loadQuery = useStore(state => state.loadQuery);
  const bookmarkedQueries = useStore(state => state.bookmarkedQueries);
  const recentQueries = useStore(state => state.recentQueries);

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear any existing timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    if (value.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    // Set a new timeout for debouncing (300ms)
    searchTimeout.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  // Perform the actual search
  const performSearch = (term) => {
    const lowercaseTerm = term.toLowerCase();
    
    // Search in predefined queries
    const matchedPredefined = PREDEFINED_QUERIES.filter(query => 
      query.name.toLowerCase().includes(lowercaseTerm) || 
      query.query.toLowerCase().includes(lowercaseTerm)
    );
    
    // Search in recent queries (get names from predefined)
    const matchedRecent = recentQueries.filter(queryText => {
      const query = PREDEFINED_QUERIES.find(q => q.query === queryText);
      return query && (
        query.name.toLowerCase().includes(lowercaseTerm) || 
        queryText.toLowerCase().includes(lowercaseTerm)
      );
    });
    
    // Search in bookmarked queries (get names from predefined)
    const matchedBookmarked = bookmarkedQueries.filter(queryText => {
      const query = PREDEFINED_QUERIES.find(q => q.query === queryText);
      return query && (
        query.name.toLowerCase().includes(lowercaseTerm) || 
        queryText.toLowerCase().includes(lowercaseTerm)
      );
    });
    
    // Combine results with type labels
    const results = [
      ...matchedPredefined.map(query => ({ 
        id: query.id, 
        name: query.name, 
        type: 'predefined', 
        query: query.query 
      })),
      ...matchedRecent.map(queryText => {
        const query = PREDEFINED_QUERIES.find(q => q.query === queryText);
        return { 
          id: query?.id, 
          name: query?.name || 'Custom Query', 
          type: 'recent', 
          query: queryText 
        };
      }),
      ...matchedBookmarked.map(queryText => {
        const query = PREDEFINED_QUERIES.find(q => q.query === queryText);
        return { 
          id: query?.id, 
          name: query?.name || 'Custom Query', 
          type: 'bookmarked', 
          query: queryText 
        };
      })
    ];
    
    // Remove duplicates based on query text
    const uniqueResults = Array.from(new Map(results.map(item => [item.query, item])).values());
    
    setSearchResults(uniqueResults);
  };

  // Handle click on a search result
  const handleResultClick = (result) => {
    // For predefined queries, still use selectQuery which will set the ID correctly
    // but we don't force navigation to predefined view
    if (result.type === 'predefined' && result.id) {
      selectQuery(result.id);
    } else {
      // For other types, use loadQuery which now also sets selectedQueryId if it matches a predefined query
      loadQuery(result.query);
    }
    
    // Clear search after selection
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  };

  // Get badge color based on type
  const getBadgeClass = (type) => {
    const baseClass = `search-result-badge ${darkMode ? 'dark' : 'light'}`;
    
    switch (type) {
      case 'predefined':
        return `${baseClass} predefined`;
      case 'bookmarked':
        return `${baseClass} bookmarked`;
      case 'recent':
        return `${baseClass} recent`;
      default:
        return baseClass;
    }
  };

  return (
    <div className={`search-queries ${darkMode ? 'dark' : 'light'}`}>
      {isSearching && searchResults.length > 0 && (
        <div className={`search-results ${darkMode ? 'dark' : 'light'}`}>
          {searchResults.map((result, index) => (
            <div 
              key={index} 
              className={`search-result-item ${darkMode ? 'dark' : 'light'}`}
              onClick={() => handleResultClick(result)}
            >
              <span className="search-result-name">{result.name}</span>
              <span className={getBadgeClass(result.type)}>
                {result.type}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {isSearching && searchTerm.trim() !== '' && searchResults.length === 0 && (
        <div className={`search-results ${darkMode ? 'dark' : 'light'}`}>
          <div className="no-search-results">No matching queries found</div>
        </div>
      )}
      
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
    </div>
  );
};

export default SearchQueries; 