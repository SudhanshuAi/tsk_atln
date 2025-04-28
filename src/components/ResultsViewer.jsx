import React, { useState } from 'react';
import { FaTable, FaDownload, FaClock } from 'react-icons/fa';
import TableSkeleton from './Skeleton';
import useStore from '../store/store';
import '../styles/ResultsViewer.css';

const ResultsViewer = () => {
  const queryResults = useStore(state => state.queryResults);
  const isLoading = useStore(state => state.isLoading);
  const executionTime = useStore(state => state.executionTime);
  const exportResults = useStore(state => state.exportResults);
  const darkMode = useStore(state => state.darkMode);

  const [selectedField, setSelectedField] = useState('');

  const handleFieldChange = (e) => {
    setSelectedField(e.target.value);
  };

  const filteredRows = queryResults 
  ? queryResults.rows.filter((row) =>
    queryResults.columns.some((column) =>
      row[column] ?
      row[column].toString().toLowerCase().includes(selectedField.toLowerCase()) : false
    )
  )
  : [];


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

          <div className="search-control">
          <input
            type='text'
            placeholder='search all fileds'
            value={selectedField}
            onChange={handleFieldChange}
          />
          </div>
        </div>
      </div>

      <div className="results-container">
        {isLoading ? (
          <div className="loading-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
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
                {filteredRows.length>0 ?(
                  filteredRows.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'even-row' : 'odd-row'}>
                      {queryResults.columns.map((column, colIndex)=> (
                        <td key={colIndex}>
                          {typeof row[column] === 'number'
                            ? row[column].toLocaleString()
                            : row[column]
                          }
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={queryResults.columns.length} className='no-results'>
                      No results found
                    </td>
                  </tr>
                )}
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