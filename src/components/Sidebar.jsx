import React, { useState } from 'react';
import PredefinedQueries from './Sidebar/PredefinedQueries';
import RecentQueries from './Sidebar/RecentQueries';
import BookmarkedQueries from './Sidebar/BookmarkedQueries';
import SearchQueries from './Sidebar/SearchQueries';
import SchemaExplorer from './Sidebar/SchemaExplorer';
import useStore from '../store/store';
import { FaListAlt, FaBookmark, FaHistory, FaChevronLeft, FaChevronRight, FaProjectDiagram } from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = ({ queries }) => {
  const darkMode = useStore(s => s.darkMode);
  const sidebarView = useStore(s => s.sidebarView);
  const setSidebarView = useStore(s => s.setSidebarView);
  const [isOpen, setIsOpen] = useState(true);

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
        <button
          className={`sidebar-tab ${sidebarView === 'schema' ? 'active' : ''}`}
          onClick={() => setSidebarView('schema')}
          title="Schema Explorer"
        >
          <FaProjectDiagram />
        </button>
      </div>

      <div className="sidebar-content">
        {sidebarView === 'predefined' && <PredefinedQueries queries={queries} />}
        {sidebarView === 'bookmarked' && <BookmarkedQueries />}
        {sidebarView === 'recent' && <RecentQueries />}
        {sidebarView === 'schema' && <SchemaExplorer />}
      </div>

      {sidebarView !== 'schema' && (
        <div className="sidebar-footer">
          <SearchQueries />
        </div>
      )}

      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(o => !o)}
        title={isOpen ? 'Close Sidebar' : 'Open Sidebar'}
      >
        {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
    </aside>
  );
};

export default Sidebar;