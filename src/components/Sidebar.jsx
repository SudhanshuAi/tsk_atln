import React, { useState } from 'react';
import PredefinedQueries from './Sidebar/PredefinedQueries';
import RecentQueries from './Sidebar/RecentQueries';
import BookmarkedQueries from './Sidebar/BookmarkedQueries';
import SearchQueries from './Sidebar/SearchQueries';
import useStore from '../store';
import { FaListAlt, FaBookmark, FaHistory, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = ({ queries }) => {
  const darkMode = useStore(state => state.darkMode);
  const sidebarView = useStore(state => state.sidebarView);
  const setSidebarView = useStore(state => state.setSidebarView);
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside className={`sidebar ${darkMode ? 'dark' : 'light'} ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-tabs">
        <button 
          className={`sidebar-tab ${sidebarView === 'predefined' ? 'active' : ''}`}
          onClick={() => setSidebarView('predefined')}
          title="Predefined Queries"
        >
          <FaListAlt />
        </button>
        <button 
          className={`sidebar-tab ${sidebarView === 'bookmarked' ? 'active' : ''}`}
          onClick={() => setSidebarView('bookmarked')}
          title="Bookmarked Queries"
        >
          <FaBookmark />
        </button>
        <button 
          className={`sidebar-tab ${sidebarView === 'recent' ? 'active' : ''}`}
          onClick={() => setSidebarView('recent')}
          title="Recent Queries"
        >
          <FaHistory />
        </button>
      </div>
      
      <div className="sidebar-content">
        <div className={sidebarView !== 'predefined' ? 'hidden' : ''}>
          <PredefinedQueries queries={queries} />
        </div>
        
        {sidebarView === 'bookmarked' && <BookmarkedQueries />}
        {sidebarView === 'recent' && <RecentQueries />}
      </div>
      
      <div className="sidebar-footer">
        <SearchQueries />
      </div>

      <button 
        className={`sidebar-toggle ${darkMode ? 'dark' : 'light'}`}
        onClick={toggleSidebar}
        title={isOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
    </aside>
  );
};

export default Sidebar;