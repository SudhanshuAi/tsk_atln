import React from 'react';

const RecentQueries = ({ recentQueries, showHistory, setShowHistory, darkMode }) => {
  return (
    <div className="recent-queries">
      <div className="recent-header">
        <h2 className="sidebar-heading">Recent Queries</h2>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="history-toggle"
          title={showHistory ? "Hide history" : "Show history"}
        >
          {showHistory ? "↑" : "↓"}
        </button>
      </div>
      
      {showHistory && (
        <div className={`history-list ${darkMode ? 'dark' : 'light'}`}>
          {recentQueries.length > 0 ? (
            recentQueries.map((query, index) => (
              <div key={index} className="history-item">
                {query.length > 30 ? `${query.substring(0, 30)}...` : query}
              </div>
            ))
          ) : (
            <p className="empty-history">No recent queries</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentQueries;