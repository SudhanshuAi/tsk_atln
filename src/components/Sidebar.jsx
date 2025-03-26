import React from 'react';
import PredefinedQueries from './Sidebar/PredefinedQueries';
import RecentQueries from './Sidebar/RecentQueries';
import '../styles/Sidebar.css';

const Sidebar = ({ 
  queries, 
  selectedQueryId, 
  handleQuerySelect, 
  recentQueries, 
  showHistory, 
  setShowHistory, 
  darkMode 
}) => {
  return (
    <aside className={`sidebar ${darkMode ? 'dark' : 'light'}`}>
      <PredefinedQueries 
        queries={queries} 
        selectedQueryId={selectedQueryId} 
        handleQuerySelect={handleQuerySelect}
        darkMode={darkMode}
      />
      
      <div className="sidebar-footer">
        <RecentQueries 
          recentQueries={recentQueries} 
          showHistory={showHistory} 
          setShowHistory={setShowHistory}
          darkMode={darkMode}
        />
      </div>
    </aside>
  );
};

export default Sidebar;