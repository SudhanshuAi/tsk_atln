import React from 'react';
import { FaPlay, FaBookmark, FaSpinner, FaCode } from 'react-icons/fa';
import '../styles/QueryEditor.css';

const QueryEditor = ({ 
  currentQuery, 
  setCurrentQuery, 
  executeQuery, 
  bookmarkQuery, 
  isLoading, 
  darkMode 
}) => {
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
            className="bookmark-btn"
            title="Bookmark Query"
          >
            <FaBookmark />
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