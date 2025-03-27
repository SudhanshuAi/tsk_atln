import React from 'react';
import { FaPlay, FaBookmark as FaBookmarkSolid, FaRegBookmark, FaSpinner, FaCode } from 'react-icons/fa';
import useStore from '../store';
import '../styles/QueryEditor.css';

const QueryEditor = () => {
  const currentQuery = useStore(state => state.currentQuery);
  const setCurrentQuery = useStore(state => state.setCurrentQuery);
  const executeQuery = useStore(state => state.executeQuery);
  const bookmarkQuery = useStore(state => state.bookmarkQuery);
  const bookmarkedQueries = useStore(state => state.bookmarkedQueries);
  const isLoading = useStore(state => state.isLoading);
  const darkMode = useStore(state => state.darkMode);

  // Check if current query is bookmarked
  const isBookmarked = bookmarkedQueries.includes(currentQuery);

  return (
    <div className={`query-editor ${darkMode ? 'dark' : 'light'}`}>
      <div className="editor-header">
        <div className="section-title">
          <FaCode className="section-icon" />
          <h2>SQL Query Editor</h2>
        </div>
        <div className="editor-controls">
          <button 
            onClick={bookmarkQuery}
            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Query"}
          >
            {isBookmarked ? <FaBookmarkSolid /> : <FaRegBookmark />}
          </button>
          <button 
            onClick={executeQuery}
            className={`run-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spinner-icon" /> Running...
              </>
            ) : (
              <>
                <FaPlay /> Run Query
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className={`editor-container ${darkMode ? 'dark' : 'light'}`}>
        <textarea
          value={currentQuery}
          onChange={(e) => setCurrentQuery(e.target.value)}
          className="query-textarea"
          placeholder="Enter your SQL query here..."
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default QueryEditor;