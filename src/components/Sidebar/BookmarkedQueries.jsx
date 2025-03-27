import React, { useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';
import useStore from '../../store';
import PREDEFINED_QUERIES from '../../data/queries';
import '../../styles/BookmarkedQueries.css';

const BookmarkedQueries = () => {
  const bookmarkedQueries = useStore(state => state.bookmarkedQueries);
  const loadQuery = useStore(state => state.loadQuery);
  const removeBookmark = useStore(state => state.removeBookmark);
  const darkMode = useStore(state => state.darkMode);
  const currentQuery = useStore(state => state.currentQuery);

  const getQueryName = useCallback((query) => {
    const predefinedQuery = PREDEFINED_QUERIES.find(q => q.query === query);
    return predefinedQuery ? predefinedQuery.name : "Custom Query";
  }, []);

  const isSelectedQuery = useCallback((query) => 
    query === currentQuery, [currentQuery]);

  const handleRemoveBookmark = useCallback((query, e) => {
    e.stopPropagation(); // Prevent triggering loadQuery
    removeBookmark(query);
  }, [removeBookmark]);

  const handleLoadQuery = useCallback((query) => loadQuery(query), [loadQuery]);

  return (
    <div className="bookmarked-queries">
      <div className="sidebar-heading-container">
        <h2 className="sidebar-heading">Bookmarked Queries</h2>
      </div>
      
      <div className={`history-list ${darkMode ? 'dark' : 'light'}`}>
        {bookmarkedQueries.length > 0 ? (
          bookmarkedQueries.map((query, index) => (
            <div 
              key={index} 
              className={`bookmark-item ${isSelectedQuery(query) ? 'is-selected' : ''}`}
            >
              <div 
                className="bookmark-text"
                onClick={() => handleLoadQuery(query)}
                title={isSelectedQuery(query) ? "Currently selected query" : "Load this query"}
              >
                {getQueryName(query)}
              </div>
              <button 
                className="remove-bookmark-btn"
                onClick={(e) => handleRemoveBookmark(query, e)}
                title="Remove bookmark"
              >
                <FaTimes />
              </button>
            </div>
          ))
        ) : (
          <p className="empty-history">No bookmarked queries</p>
        )}
      </div>
    </div>
  );
};

export default BookmarkedQueries;