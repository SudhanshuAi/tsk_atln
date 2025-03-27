import React from 'react';
import { FaListAlt } from 'react-icons/fa';
import useStore from '../../store';

const PredefinedQueries = ({ queries }) => {
  const selectedQueryId = useStore(state => state.selectedQueryId);
  const selectQuery = useStore(state => state.selectQuery);
  const darkMode = useStore(state => state.darkMode);

  return (
    <div className="predefined-queries">
      <div className="sidebar-heading-container">
        <FaListAlt className="sidebar-icon" />
        <h2 className="sidebar-heading">Predefined Queries</h2>
      </div>
      <div className="query-list">
        {queries.map(query => (
          <button
            key={query.id}
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