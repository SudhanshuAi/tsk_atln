import React from 'react';
import { FaBookmark, FaChevronUp, FaChevronDown, FaTimes } from 'react-icons/fa';
import useStore from '../../store';
import PREDEFINED_QUERIES from '../../data/queries';

const BookmarkedQueries = () => {
  const bookmarkedQueries = useStore(state => state.bookmarkedQueries);
  const showBookmarks = useStore(state => state.showBookmarks);
  const toggleBookmarks = useStore(state => state.toggleBookmarks);
  const loadQuery = useStore(state => state.loadQuery);
  const removeBookmark = useStore(state => state.removeBookmark);
  const darkMode = useStore(state => state.darkMode);

  // Get query name from predefined queries, if available
  const getQueryName = (query) => {
    const predefinedQuery = PREDEFINED_QUERIES.find(q => q.query === query);
    return predefinedQuery.name;
  };

  return (
    <div className="bookmarked-queries">
      <div 
        className="recent-header"
        onClick={toggleBookmarks}
        title={showBookmarks ? "Hide bookmarks" : "Show bookmarks"}
      >
        <div className="sidebar-heading-container">
          <FaBookmark className="sidebar-icon" />
          <h2 className="sidebar-heading">Bookmarked Queries</h2>
        </div>
        <div className="sidebar-up">
          {showBookmarks ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
      
      {showBookmarks && (
        <div className={`history-list ${darkMode ? 'dark' : 'light'}`}>
          {bookmarkedQueries.length > 0 ? (
            bookmarkedQueries.map((query, index) => (
              <div key={index} className="bookmark-item">
                <div 
                  className="bookmark-text"
                  onClick={() => loadQuery(query)}
                  title="Load this query"
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
      )}
    </div>
  );
};

export default BookmarkedQueries; 