import React from 'react';
import { FaHistory, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import useStore from '../../store';
import PREDEFINED_QUERIES from '../../data/queries';

const RecentQueries = () => {
  const recentQueries = useStore(state => state.recentQueries);
  const showHistory = useStore(state => state.showHistory);
  const toggleHistory = useStore(state => state.toggleHistory);
  const loadQuery = useStore(state => state.loadQuery);
  const darkMode = useStore(state => state.darkMode);

  // Get query name from predefined queries, if available
  const getQueryName = (query) => {
    const predefinedQuery = PREDEFINED_QUERIES.find(q => q.query === query);
    return predefinedQuery.name;
  };

  return (
    <div className="recent-queries">
      <div 
        className="recent-header"
        onClick={toggleHistory}
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
              <div 
                key={index} 
                className={`history-item ${darkMode ? 'dark' : 'light'}`}
                onClick={() => loadQuery(query)}
                title="Load this query"
              >
                {getQueryName(query)}
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