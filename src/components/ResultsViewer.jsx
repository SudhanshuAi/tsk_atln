import React from 'react';
import { FaTable, FaDownload, FaClock, FaSpinner } from 'react-icons/fa';
import TableSkeleton from './Skeleton';
import useStore from '../store';
import '../styles/ResultsViewer.css';

const ResultsViewer = () => {
  const queryResults = useStore(state => state.queryResults);
  const isLoading = useStore(state => state.isLoading);
  const executionTime = useStore(state => state.executionTime);
  const exportResults = useStore(state => state.exportResults);
  const darkMode = useStore(state => state.darkMode);

  return (
    <div className={`results-viewer ${darkMode ? 'dark' : 'light'}`}>
      <div className="results-header">
        <div className="section-title">
          <FaTable className="section-icon" />
          <h2>Query Results</h2>
        </div>
        <div className="results-controls">
          {executionTime && (
            <span className="execution-time">
              <FaClock className="time-icon" />
              Execution time: {executionTime.toFixed(2)}s
            </span>
          )}
          <button
            onClick={exportResults}
            className="export-btn"
            disabled={!queryResults}
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      <div className="results-container">
        {isLoading ? (
          <div className="loading-spinner">
            <FaSpinner className="result-spinner" />
          </div>
        ) : queryResults ? (
          <div className="table-container">
            <table className="results-table">
              <thead>
                <tr>
                  {queryResults.columns.map((column, index) => (
                    <th key={index}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queryResults.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'even-row' : 'odd-row'}>
                    {queryResults.columns.map((column, colIndex) => (
                      <td key={colIndex}>
                        {typeof row[column] === 'number' 
                          ? row[column].toLocaleString() 
                          : row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <TableSkeleton />
        )}
      </div>
    </div>
  );
};

export default ResultsViewer;