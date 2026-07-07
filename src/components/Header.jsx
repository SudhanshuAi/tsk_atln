import React from 'react';
import { FaSun, FaMoon, FaDatabase, FaPlug, FaCheckCircle } from 'react-icons/fa';
import { SiMysql, SiPostgresql } from 'react-icons/si';
import useStore from '../store/store';
import '../styles/Header.css';

const Header = () => {
  const darkMode = useStore(s => s.darkMode);
  const toggleDarkMode = useStore(s => s.toggleDarkMode);
  const mode = useStore(s => s.mode);
  const activeConnectionId = useStore(s => s.activeConnectionId);
  const connections = useStore(s => s.connections);
  const setShowConnectionManager = useStore(s => s.setShowConnectionManager);
  const switchToSample = useStore(s => s.switchToSample);
  const dbReady = useStore(s => s.dbReady);

  const activeConn = connections.find(c => c.connectionId === activeConnectionId);

  return (
    <header className={`header ${darkMode ? 'dark' : 'light'}`}>
      <div className="app-title">
        <FaDatabase className="header-icon" />
        <h4>SQL IDE</h4>
      </div>

      {/* Mode Switch */}
      <div className="mode-switch">
        <button
          className={`mode-btn ${mode === 'sample' ? 'active' : ''}`}
          onClick={switchToSample}
          title="Use built-in sample database"
        >
          <FaDatabase className="mode-icon" />
          <span>Sample DB</span>
          {mode === 'sample' && dbReady && (
            <FaCheckCircle className="mode-active-dot" />
          )}
        </button>

        <div className="mode-divider" />

        <button
          className={`mode-btn ${mode === 'connected' ? 'active' : ''}`}
          onClick={() => setShowConnectionManager(true)}
          title="Connect to MySQL or PostgreSQL"
        >
          <FaPlug className="mode-icon" />
          {mode === 'connected' && activeConn ? (
            <span className="mode-conn-label">
              {activeConn.type === 'mysql' ? <SiMysql /> : <SiPostgresql />}
              {activeConn.database}
            </span>
          ) : (
            <span>Connect to DB</span>
          )}
          {mode === 'connected' && (
            <FaCheckCircle className="mode-active-dot" />
          )}
        </button>
      </div>

      <div className="header-controls">
        <button
          onClick={toggleDarkMode}
          className="theme-toggle-btn"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </header>
  );
};

export default Header;