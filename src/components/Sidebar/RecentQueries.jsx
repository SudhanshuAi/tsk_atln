import React from 'react';
import { FaHistory, FaChevronUp, FaChevronDown } from 'react-icons/fa';

const RecentQueries = ({ recentQueries, showHistory, setShowHistory, darkMode }) => {
  return (
    <div className="recent-queries">
      <div 
        className="recent-header"
        onClick={() => setShowHistory(!showHistory)}
        title={showHistory ? "Hide history" : "Show history"}
      >
        <div className="sidebar-heading-container">
          <FaHistory className="sidebar-icon" />
          <h2 className="sidebar-heading">Recent Queries</h2>
        </div>
        <div className="sidebar-up">
            {showHistory ? <FaChevronUp /> : <FaChevronDown />}
        </div>
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