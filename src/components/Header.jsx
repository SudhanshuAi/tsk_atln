import React from 'react';
import '../styles/Header.css';

const Header = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className={`header ${darkMode ? 'dark' : 'light'}`}>
      <h1 className="app-title">SQL Query Runner</h1>
      <div className="header-controls">
        <button 
          onClick={toggleDarkMode} 
          className="theme-toggle-btn"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
};

export default Header;