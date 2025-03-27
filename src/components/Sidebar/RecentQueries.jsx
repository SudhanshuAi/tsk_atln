import React from 'react';
import useStore from '../../store';
import PREDEFINED_QUERIES from '../../data/queries';
import '../../styles/RecentQueries.css';

const RecentQueries = () => {
  const recentQueries = useStore(state => state.recentQueries);
  const loadQuery = useStore(state => state.loadQuery);
  const darkMode = useStore(state => state.darkMode);
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

  return (
    <div className="recent-queries">
      <div className="sidebar-heading-container">
        <h2 className="sidebar-heading">Recent Queries</h2>
      </div>
      
      <div className={`history-list ${darkMode ? 'dark' : 'light'}`}>
        {recentQueries.length > 0 ? (
          recentQueries.map((query, index) => (
            <div 
              key={index} 
              className={`history-item ${isSelectedQuery(query) ? 'is-selected' : ''} ${darkMode ? 'dark' : 'light'}`}
              onClick={() => loadQuery(query)}
              title={isSelectedQuery(query) ? "Currently selected query" : "Load this query"}
            >
              {getQueryName(query)}
            </div>
          ))
        ) : (
          <p className="empty-history">No recent queries</p>
        )}
      </div>
    </div>
  );
};

export default RecentQueries;