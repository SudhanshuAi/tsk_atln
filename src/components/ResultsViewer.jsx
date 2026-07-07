import React, { useState } from 'react';
import { FaTable, FaDownload, FaClock, FaExclamationTriangle, FaCheckCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import TableSkeleton from './Skeleton';
import useStore from '../store/store';
import '../styles/ResultsViewer.css';

const PAGE_SIZE = 100;

const ResultsViewer = () => {
  const queryResults = useStore(s => s.queryResults);
  const isLoading = useStore(s => s.isLoading);
  const executionTime = useStore(s => s.executionTime);
  const exportResults = useStore(s => s.exportResults);
  const darkMode = useStore(s => s.darkMode);
  const queryError = useStore(s => s.queryError);
  const affectedRows = useStore(s => s.affectedRows);

  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when results change
  React.useEffect(() => { setCurrentPage(1); }, [queryResults]);

  const filteredRows = queryResults
    ? queryResults.rows.filter(row =>
        queryResults.columns.some(col => {
          const val = row[col];
          return val != null && String(val).toLowerCase().includes(filterText.toLowerCase());
        })
      )
    : [];

  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);
  const pagedRows = filteredRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className={`results-viewer ${darkMode ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="results-header">
        <div className="section-title">
          <FaTable className="section-icon" />
          <h2>Query Results</h2>
          {queryResults && (
            <span className="row-count-badge">
              {filteredRows.length.toLocaleString()} row{filteredRows.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="results-controls">
          {executionTime != null && (
            <span className="execution-time">
              <FaClock className="time-icon" />
              {executionTime.toFixed(3)}s
            </span>
          )}
          {queryResults && queryResults.columns.length > 0 && (
            <div className="search-control">
              <input
                type="text"
                placeholder="Filter results…"
                value={filterText}
                onChange={e => { setFilterText(e.target.value); setCurrentPage(1); }}
              />
            </div>
          )}
          <button
            onClick={exportResults}
            className="export-btn"
            disabled={!queryResults || queryResults.columns.length === 0}
            title="Export as CSV"
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="results-container">
        {isLoading ? (
          <TableSkeleton />

        ) : queryError ? (
          <div className="error-panel">
            <div className="error-panel-header">
              <FaExclamationTriangle className="error-icon" />
              <span>SQL Error</span>
            </div>
            <pre className="error-message">{queryError}</pre>
          </div>

        ) : affectedRows != null && (!queryResults || queryResults.columns.length === 0) ? (
          <div className="dml-success-panel">
            <FaCheckCircle className="dml-icon" />
            <div className="dml-text">
              <strong>Query executed successfully</strong>
              <span>{affectedRows} row{affectedRows !== 1 ? 's' : ''} affected</span>
              {executionTime != null && <span className="dml-time">{executionTime.toFixed(3)}s</span>}
            </div>
          </div>

        ) : queryResults && queryResults.columns.length > 0 ? (
          <>
            <div className="table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    {queryResults.columns.map((col, i) => (
                      <th key={i}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedRows.length > 0 ? (
                    pagedRows.map((row, ri) => (
                      <tr key={ri} className={ri % 2 === 0 ? 'even-row' : 'odd-row'}>
                        {queryResults.columns.map((col, ci) => (
                          <td key={ci}>
                            {row[col] === null || row[col] === undefined
                              ? <span className="null-value">NULL</span>
                              : typeof row[col] === 'number'
                                ? row[col].toLocaleString()
                                : String(row[col])
                            }
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={queryResults.columns.length} className="no-results">
                        No results match your filter
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  <FaChevronLeft />
                </button>
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                  <span className="page-range">
                    ({((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, filteredRows.length)} of {filteredRows.length})
                  </span>
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>

        ) : (
          <div className="welcome-state">
            <div className="welcome-content">
              <div className="welcome-icon-box">
                <FaTable className="welcome-icon" />
              </div>
              <h3>No Results Yet</h3>
              <p>Execute your SQL query above or select a predefined query from the sidebar to see results here.</p>
              <div className="welcome-hints">
                <div className="hint-item"><span className="hint-key">Ctrl + Enter</span> to run query</div>
                <div className="hint-item"><span className="hint-key">Double-click</span> table to SELECT</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsViewer;