import React from 'react';

const PredefinedQueries = ({ queries, selectedQueryId, handleQuerySelect, darkMode }) => {
  return (
    <div className="predefined-queries">
      <h2 className="sidebar-heading">Predefined Queries</h2>
      <div className="query-list">
        {queries.map(query => (
          <button
            key={query.id}
            onClick={() => handleQuerySelect(query.id)}
            className={`query-item ${selectedQueryId === query.id ? 'selected' : ''} ${darkMode ? 'dark' : 'light'}`}
          >
            {query.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PredefinedQueries;