import React, { useEffect, useRef } from 'react';
import useStore from '../../store';
import '../../styles/PredefinedQueries.css';

const PredefinedQueries = ({ queries }) => {
  const selectedQueryId = useStore(state => state.selectedQueryId);
  const selectQuery = useStore(state => state.selectQuery);
  const darkMode = useStore(state => state.darkMode);
  const selectedQueryRef = useRef(null);

  // Auto-scroll to selected query
  useEffect(() => {
    if (selectedQueryId && selectedQueryRef.current) {
      selectedQueryRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [selectedQueryId]);

  return (
    <div className="predefined-queries">
      <div className="sidebar-heading-container">
        <h2 className="sidebar-heading">Predefined Queries</h2>
      </div>
      
      <div className="query-list">
        {queries.map(query => (
          <button
            key={query.id}
            ref={query.id === selectedQueryId ? selectedQueryRef : null}
            onClick={() => selectQuery(query.id)}
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