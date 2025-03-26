import React from 'react';
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
        <h2 className="section-title">SQL Query Editor</h2>
        <div className="editor-controls">
          <button 
            onClick={bookmarkQuery}
            className="bookmark-btn"
            title="Bookmark Query"
          >
            📑
          </button>
          <button 
            onClick={executeQuery}
            className={`run-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Running...' : '▶ Run Query'}
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