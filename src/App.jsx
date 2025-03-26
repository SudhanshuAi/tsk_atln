import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import QueryEditor from './components/QueryEditor';
import ResultsViewer from './components/ResultsViewer';
import PREDEFINED_QUERIES from './data/queries';
import DUMMY_RESULTS from './data/dummyResults';
import './styles/App.css';

function App() {
  // State management
  const [currentQuery, setCurrentQuery] = useState(PREDEFINED_QUERIES[0].query);
  const [selectedQueryId, setSelectedQueryId] = useState(1);
  const [queryResults, setQueryResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentQueries, setRecentQueries] = useState([]);
  const [bookmarkedQueries, setBookmarkedQueries] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // Effect to set initial results
  useEffect(() => {
    setQueryResults(DUMMY_RESULTS[selectedQueryId]);
  }, [selectedQueryId]);

  // Handle query selection
  const handleQuerySelect = (queryId) => {
    const selectedQuery = PREDEFINED_QUERIES.find(q => q.id === queryId);
    setSelectedQueryId(queryId);
    setCurrentQuery(selectedQuery.query);
  };

  // Execute query
  const executeQuery = () => {
    setIsLoading(true);
    
    // Simulate network delay
    const startTime = performance.now();
    
    setTimeout(() => {
      setQueryResults(DUMMY_RESULTS[selectedQueryId]);
      const endTime = performance.now();
      setExecutionTime((endTime - startTime) / 1000); // Convert to seconds
      
      // Add to recent queries
      if (!recentQueries.includes(currentQuery)) {
        setRecentQueries(prev => [currentQuery, ...prev.slice(0, 9)]);
      }
      
      setIsLoading(false);
    }, 800);
  };

  // Bookmark a query
  const bookmarkQuery = () => {
    if (!bookmarkedQueries.includes(currentQuery)) {
      setBookmarkedQueries(prev => [...prev, currentQuery]);
    }
  };

  // Export results as CSV
  const exportResults = () => {
    if (!queryResults) return;
    
    // Create CSV content
    const headers = queryResults.columns.join(',');
    const rows = queryResults.rows.map(row => 
      queryResults.columns.map(col => row[col]).join(',')
    );
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows.join('\n')}`;
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `query_results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
      />
      
      <div className="main-container">
        <Sidebar 
          queries={PREDEFINED_QUERIES}
          selectedQueryId={selectedQueryId}
          handleQuerySelect={handleQuerySelect}
          recentQueries={recentQueries}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
          darkMode={darkMode}
        />
        
        <main className="content">
          <QueryEditor 
            currentQuery={currentQuery}
            setCurrentQuery={setCurrentQuery}
            executeQuery={executeQuery}
            bookmarkQuery={bookmarkQuery}
            isLoading={isLoading}
            darkMode={darkMode}
          />
          
          <ResultsViewer 
            queryResults={queryResults}
            isLoading={isLoading}
            executionTime={executionTime}
            exportResults={exportResults}
            darkMode={darkMode}
          />
        </main>
      </div>
    </div>
  );
}

export default App;