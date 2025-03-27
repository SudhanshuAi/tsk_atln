import React from 'react';
import PredefinedQueries from './Sidebar/PredefinedQueries';
import RecentQueries from './Sidebar/RecentQueries';
import BookmarkedQueries from './Sidebar/BookmarkedQueries';
import SearchQueries from './Sidebar/SearchQueries';
import useStore from '../store';
import { FaListAlt, FaBookmark, FaHistory } from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = ({ queries }) => {
  const darkMode = useStore(state => state.darkMode);
  const sidebarView = useStore(state => state.sidebarView);
  const setSidebarView = useStore(state => state.setSidebarView);

  return (
    <aside className={`sidebar ${darkMode ? 'dark' : 'light'}`}>
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
    </aside>
  );
};

export default Sidebar;