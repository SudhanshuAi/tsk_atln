import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const setSidebarView = useStore(state => state.setSidebarView);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    if (!value.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    searchTimeout.current = setTimeout(() => performSearch(value), 300);
  }, []);

  const performSearch = useCallback((term) => {
    const lowercaseTerm = term.toLowerCase();
    
    const results = [
      ...PREDEFINED_QUERIES.filter(query => 
        query.name.toLowerCase().includes(lowercaseTerm) || 
        query.query.toLowerCase().includes(lowercaseTerm)
      ).map(query => ({ 
        id: query.id, 
        name: query.name, 
        type: 'predefined', 
        query: query.query 
      })),
      ...recentQueries.filter(queryText => {
        const query = PREDEFINED_QUERIES.find(q => q.query === queryText);
        return query && (
          query.name.toLowerCase().includes(lowercaseTerm) || 
          queryText.toLowerCase().includes(lowercaseTerm)
        );
      }).map(queryText => {
        const query = PREDEFINED_QUERIES.find(q => q.query === queryText);
        return { 
          id: query?.id, 
          name: query?.name || 'Custom Query', 
          type: 'recent', 
          query: queryText 
        };
      }),
      ...bookmarkedQueries.filter(queryText => {
        const query = PREDEFINED_QUERIES.find(q => q.query === queryText);
        return query && (
          query.name.toLowerCase().includes(lowercaseTerm) || 
          queryText.toLowerCase().includes(lowercaseTerm)
        );
      }).map(queryText => {
        const query = PREDEFINED_QUERIES.find(q => q.query === queryText);
        return { 
          id: query?.id, 
          name: query?.name || 'Custom Query', 
          type: 'bookmarked', 
          query: queryText 
        };
      })
    ];
    
    setSearchResults(Array.from(new Map(results.map(item => [item.query, item])).values()));
  }, [bookmarkedQueries, recentQueries]);

  const handleResultClick = useCallback((result) => {
    // First switch to predefined view
    setSidebarView('predefined');

    // Add a small delay to ensure the view has changed before selecting the query
    setTimeout(() => {
      if (result.type === 'predefined' && result.id) {
        selectQuery(result.id);
      } else {
        const predefinedQuery = PREDEFINED_QUERIES.find(q => q.query === result.query);
        if (predefinedQuery) {
          selectQuery(predefinedQuery.id);
        } else {
          loadQuery(result.query);
        }
      }
    }, 50);
    
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  }, [setSidebarView, selectQuery, loadQuery]);

  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

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
              {result.type === 'bookmarked' && (
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