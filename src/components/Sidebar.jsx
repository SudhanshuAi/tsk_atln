import React from 'react';
import PredefinedQueries from './Sidebar/PredefinedQueries';
import RecentQueries from './Sidebar/RecentQueries';
import BookmarkedQueries from './Sidebar/BookmarkedQueries';
import useStore from '../store';
import '../styles/Sidebar.css';

const Sidebar = ({ queries }) => {
  const darkMode = useStore(state => state.darkMode);

  return (
    <aside className={`sidebar ${darkMode ? 'dark' : 'light'}`}>
      <PredefinedQueries queries={queries} />
      
      <div className="sidebar-footer">
        <BookmarkedQueries />
        <RecentQueries />
      </div>
    </aside>
  );
};

export default Sidebar;