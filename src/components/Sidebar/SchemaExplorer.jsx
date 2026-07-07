import React, { useState } from 'react';
import { FaTable, FaColumns, FaChevronDown, FaChevronRight, FaSpinner, FaDatabase } from 'react-icons/fa';
import useStore from '../../store/store';
import '../../styles/SchemaExplorer.css';

const TYPE_COLORS = {
  INTEGER: '#61afef', INT: '#61afef', BIGINT: '#61afef', SMALLINT: '#61afef',
  REAL: '#e5c07b', FLOAT: '#e5c07b', DOUBLE: '#e5c07b', NUMERIC: '#e5c07b', DECIMAL: '#e5c07b',
  TEXT: '#98c379', VARCHAR: '#98c379', CHAR: '#98c379', CHARACTER: '#98c379',
  DATE: '#c678dd', DATETIME: '#c678dd', TIMESTAMP: '#c678dd', TIME: '#c678dd',
  BOOLEAN: '#e06c75', BOOL: '#e06c75',
};

const getTypeColor = (type) => {
  const base = type?.split('(')[0]?.toUpperCase() || '';
  return TYPE_COLORS[base] || '#abb2bf';
};

const SchemaExplorer = () => {
  const schema = useStore(s => s.schema);
  const dbReady = useStore(s => s.dbReady);
  const darkMode = useStore(s => s.darkMode);
  const mode = useStore(s => s.mode);
  const activeConnectionId = useStore(s => s.activeConnectionId);
  const connections = useStore(s => s.connections);
  const setCurrentQuery = useStore(s => s.setCurrentQuery);
  const refreshSchema = useStore(s => s.refreshSchema);

  const [expandedTables, setExpandedTables] = useState({});

  const toggleTable = (name) =>
    setExpandedTables(prev => ({ ...prev, [name]: !prev[name] }));

  const handleTableClick = (tableName) => {
    setCurrentQuery(`SELECT * FROM ${tableName} LIMIT 100;`);
  };

  const handleColumnClick = (tableName, colName) => {
    setCurrentQuery(prev => {
      if (prev.trim() === '' || prev.trim() === `SELECT * FROM ${tableName} LIMIT 100;`) {
        return `SELECT ${colName} FROM ${tableName} LIMIT 100;`;
      }
      return prev;
    });
  };

  const connName = mode === 'sample'
    ? 'Sample DB (SQLite)'
    : connections.find(c => c.connectionId === activeConnectionId)?.name || 'Connected DB';

  const isLoading = !dbReady && mode === 'sample';

  return (
    <div className={`schema-explorer ${darkMode ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="schema-header">
        <FaDatabase className="schema-db-icon" />
        <span className="schema-source">{connName}</span>
        <button className="schema-refresh-btn" onClick={refreshSchema} title="Refresh schema">
          ↻
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="schema-loading">
          <FaSpinner className="spin" /> Loading schema…
        </div>
      )}

      {/* Empty state */}
      {!isLoading && schema.length === 0 && (
        <div className="schema-empty">
          <FaTable className="schema-empty-icon" />
          <p>No tables found</p>
        </div>
      )}

      {/* Table list */}
      <div className="schema-table-list">
        {schema.map(({ tableName, columns }) => (
          <div key={tableName} className="schema-table-item">
            <div
              className="schema-table-name"
              onClick={() => toggleTable(tableName)}
            >
              <span className="schema-table-arrow">
                {expandedTables[tableName] ? <FaChevronDown /> : <FaChevronRight />}
              </span>
              <FaTable className="schema-table-icon" />
              <span
                className="schema-table-label"
                onDoubleClick={() => handleTableClick(tableName)}
                title="Double-click to SELECT from this table"
              >
                {tableName}
              </span>
              <span className="schema-col-count">{columns.length}</span>
            </div>

            {expandedTables[tableName] && (
              <div className="schema-columns">
                {columns.map(({ name, type }) => (
                  <div
                    key={name}
                    className="schema-column-item"
                    onClick={() => handleColumnClick(tableName, name)}
                    title={`${name} (${type})`}
                  >
                    <FaColumns className="schema-col-icon" />
                    <span className="schema-col-name">{name}</span>
                    <span
                      className="schema-col-type"
                      style={{ color: getTypeColor(type) }}
                    >
                      {type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemaExplorer;
