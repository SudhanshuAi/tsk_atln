import React, { useState } from 'react';
import { FaTimes, FaPlug, FaDatabase, FaCheck, FaSpinner, FaTrash, FaChevronRight } from 'react-icons/fa';
import { SiMysql, SiPostgresql } from 'react-icons/si';
import useStore from '../store/store';
import '../styles/ConnectionManager.css';

const DEFAULT_FORM = {
  type: 'mysql',
  host: 'localhost',
  port: '3306',
  database: '',
  user: '',
  password: '',
};

const ConnectionManager = () => {
  const showConnectionManager = useStore(s => s.showConnectionManager);
  const setShowConnectionManager = useStore(s => s.setShowConnectionManager);
  const connections = useStore(s => s.connections);
  const activeConnectionId = useStore(s => s.activeConnectionId);
  const connectToDb = useStore(s => s.connectToDb);
  const disconnectDb = useStore(s => s.disconnectDb);
  const setActiveConnection = useStore(s => s.setActiveConnection);
  const isConnecting = useStore(s => s.isConnecting);
  const connectionError = useStore(s => s.connectionError);
  const darkMode = useStore(s => s.darkMode);

  const [form, setForm] = useState(DEFAULT_FORM);
  const [testStatus, setTestStatus] = useState(null); // null | 'testing' | 'ok' | 'fail'
  const [testError, setTestError] = useState('');

  if (!showConnectionManager) return null;

  const handleTypeChange = (type) => {
    setForm(f => ({
      ...f,
      type,
      port: type === 'mysql' ? '3306' : '5432',
    }));
    setTestStatus(null);
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setTestStatus(null);
  };

  const handleConnect = async () => {
    const ok = await connectToDb(form);
    if (ok) setForm(DEFAULT_FORM);
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestError('');
    try {
      // We do a real connect but then disconnect immediately
      const { apiClient } = await import('../services/apiClient');
      const result = await apiClient.connectToDb(form);
      if (result.error) {
        setTestStatus('fail');
        setTestError(result.error);
        // Disconnect the test connection
      } else {
        setTestStatus('ok');
        // Disconnect the test connection
        await apiClient.disconnectDb(result.connectionId);
      }
    } catch (err) {
      setTestStatus('fail');
      setTestError(err.message);
    }
  };

  const dbIcon = (type) =>
    type === 'mysql'
      ? <SiMysql className="conn-type-icon mysql-icon" />
      : <SiPostgresql className="conn-type-icon pg-icon" />;

  return (
    <div className={`cm-overlay ${darkMode ? 'dark' : 'light'}`}>
      <div className="cm-modal">
        {/* Header */}
        <div className="cm-header">
          <div className="cm-title">
            <FaPlug className="cm-title-icon" />
            <h2>Database Connections</h2>
          </div>
          <button className="cm-close" onClick={() => setShowConnectionManager(false)}>
            <FaTimes />
          </button>
        </div>

        <div className="cm-body">
          {/* Existing Connections */}
          {connections.length > 0 && (
            <div className="cm-section">
              <h3 className="cm-section-title">Active Connections</h3>
              <div className="cm-connection-list">
                {connections.map(conn => (
                  <div
                    key={conn.connectionId}
                    className={`cm-connection-item ${activeConnectionId === conn.connectionId ? 'active' : ''}`}
                  >
                    <div
                      className="cm-connection-info"
                      onClick={() => setActiveConnection(conn.connectionId)}
                    >
                      {dbIcon(conn.type)}
                      <div className="cm-connection-text">
                        <span className="cm-conn-name">{conn.name}</span>
                        <span className="cm-conn-meta">{conn.type.toUpperCase()} · {conn.database}</span>
                      </div>
                      {activeConnectionId === conn.connectionId && (
                        <FaCheck className="cm-active-check" />
                      )}
                    </div>
                    <button
                      className="cm-disconnect-btn"
                      onClick={() => disconnectDb(conn.connectionId)}
                      title="Disconnect"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Connection Form */}
          <div className="cm-section">
            <h3 className="cm-section-title">New Connection</h3>

            {/* DB Type selector */}
            <div className="cm-type-selector">
              <button
                className={`cm-type-btn ${form.type === 'mysql' ? 'selected' : ''}`}
                onClick={() => handleTypeChange('mysql')}
              >
                <SiMysql /> MySQL
              </button>
              <button
                className={`cm-type-btn ${form.type === 'postgres' ? 'selected' : ''}`}
                onClick={() => handleTypeChange('postgres')}
              >
                <SiPostgresql /> PostgreSQL
              </button>
            </div>

            <div className="cm-form-grid">
              <div className="cm-field cm-field-wide">
                <label>Host</label>
                <input name="host" value={form.host} onChange={handleChange} placeholder="localhost" />
              </div>
              <div className="cm-field">
                <label>Port</label>
                <input name="port" value={form.port} onChange={handleChange} placeholder="3306" />
              </div>
              <div className="cm-field cm-field-wide">
                <label>Database</label>
                <input name="database" value={form.database} onChange={handleChange} placeholder="my_database" />
              </div>
              <div className="cm-field cm-field-wide">
                <label>Username</label>
                <input name="user" value={form.user} onChange={handleChange} placeholder="root" />
              </div>
              <div className="cm-field cm-field-wide">
                <label>Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
              </div>
            </div>

            {/* Test status */}
            {testStatus === 'ok' && (
              <div className="cm-test-status ok">
                <FaCheck /> Connection successful!
              </div>
            )}
            {testStatus === 'fail' && (
              <div className="cm-test-status fail">
                <FaTimes /> {testError || 'Connection failed'}
              </div>
            )}

            {/* Connection errors from store */}
            {connectionError && (
              <div className="cm-test-status fail">
                <FaTimes /> {connectionError}
              </div>
            )}

            <div className="cm-form-actions">
              <button
                className="cm-test-btn"
                onClick={handleTestConnection}
                disabled={testStatus === 'testing' || isConnecting}
              >
                {testStatus === 'testing' ? <><FaSpinner className="spin" /> Testing…</> : 'Test Connection'}
              </button>
              <button
                className="cm-connect-btn"
                onClick={handleConnect}
                disabled={isConnecting || !form.database || !form.user}
              >
                {isConnecting
                  ? <><FaSpinner className="spin" /> Connecting…</>
                  : <><FaChevronRight /> Connect</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionManager;
