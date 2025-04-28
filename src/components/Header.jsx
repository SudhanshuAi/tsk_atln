import React from 'react';
import { FaSun, FaMoon, FaDatabase } from 'react-icons/fa';
import useStore from '../store/store';
import '../styles/Header.css';

const Header = () => {
  const darkMode = useStore(state => state.darkMode);
  const toggleDarkMode = useStore(state => state.toggleDarkMode);

  return (
    <header className={`header ${darkMode ? 'dark' : 'light'}`}>
      <div className="app-title">
        <FaDatabase className="header-icon" />
        <h4>SQL Query Runner</h4>
      </div>
      <div className="header-controls">
        <button 
          onClick={toggleDarkMode} 
          className="theme-toggle-btn"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </header>
  );
};

export default Header;