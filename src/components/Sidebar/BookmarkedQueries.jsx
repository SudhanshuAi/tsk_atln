import React from 'react';
import { FaTimes } from 'react-icons/fa';
import useStore from '../../store';
import PREDEFINED_QUERIES from '../../data/queries';
import '../../styles/BookmarkedQueries.css';

const BookmarkedQueries = () => {
  const bookmarkedQueries = useStore(state => state.bookmarkedQueries);
  const loadQuery = useStore(state => state.loadQuery);
  const removeBookmark = useStore(state => state.removeBookmark);
  const darkMode = useStore(state => state.darkMode);
  const selectedQueryId = useStore(state => state.selectedQueryId);
  const currentQuery = useStore(state => state.currentQuery);

  // Get query name from predefined queries, if available
  const getQueryName = (query) => {
    const predefinedQuery = PREDEFINED_QUERIES.find(q => q.query === query);
    return predefinedQuery ? predefinedQuery.name : "Custom Query";
  };

  // Check if query is the currently selected one
  const isSelectedQuery = (query) => {
    return query === currentQuery;
  };

  // Get predefined query ID if it exists
  const getPredefinedQueryId = (query) => {
    const predefinedQuery = PREDEFINED_QUERIES.find(q => q.query === query);
    return predefinedQuery ? predefinedQuery.id : null;
  };

  return (
    <div className="bookmarked-queries">
      <div className="sidebar-heading-container">
        <h2 className="sidebar-heading">Bookmarked Queries</h2>
      </div>
      
      <div className={`history-list ${darkMode ? 'dark' : 'light'}`}>
        {bookmarkedQueries.length > 0 ? (
          bookmarkedQueries.map((query, index) => (
            <div key={index} className={`bookmark-item ${isSelectedQuery(query) ? 'is-selected' : ''}`}>
              <div 
                className="bookmark-text"
                onClick={() => loadQuery(query)}
                title={isSelectedQuery(query) ? "Currently selected query" : "Load this query"}
              >
                {getQueryName(query)}
              </div>
              <button 
                className="remove-bookmark-btn"
                onClick={() => removeBookmark(query)}
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