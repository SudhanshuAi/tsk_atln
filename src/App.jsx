import React, { useRef, useEffect } from 'react';
// React Icons are imported in their respective components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import QueryEditor from './components/QueryEditor';
import ResultsViewer from './components/ResultsViewer';
import Resizer from './components/Resizer';
import PREDEFINED_QUERIES from './data/queries';
import useStore from './store/store';
import './styles/App.css';

function App() {
  const darkMode = useStore(state => state.darkMode);
  const queryEditorHeight = useStore(state => state.queryEditorHeight);
  const setQueryEditorHeight = useStore(state => state.setQueryEditorHeight);
  
  const contentRef = useRef(null);
  const queryEditorRef = useRef(null);
  const resultsViewerRef = useRef(null);
  const resizerRef = useRef(null);
  
  useEffect(() => {
    setQueryEditorHeight(50);
  }, []);
  
  useEffect(() => {
    const resizer = resizerRef.current;
    if (!resizer) return;
    
    let startY;
    let startHeight;
    
    const onMouseDown = (e) => {
      startY = e.clientY;
      const queryEditorElement = queryEditorRef.current;
      startHeight = queryEditorElement.offsetHeight;
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    };
    
    const onMouseMove = (e) => {
      if (!contentRef.current) return;
      
      const contentHeight = contentRef.current.offsetHeight;
      const deltaY = e.clientY - startY;
      const newHeight = startHeight + deltaY;
      
      const newPercent = (newHeight / contentHeight) * 100;
      
      const limitedPercent = Math.max(20, Math.min(80, newPercent));
      
      setQueryEditorHeight(limitedPercent);
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    
    resizer.addEventListener('mousedown', onMouseDown);
    
    return () => {
      resizer.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [setQueryEditorHeight]);

  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Header />
      
      <div className="main-container">
        <Sidebar queries={PREDEFINED_QUERIES} />
        
        <main className="content" ref={contentRef}>
          <div 
            className="query-editor-wrapper" 
            ref={queryEditorRef}
            style={{ height: `${queryEditorHeight}%` }}
          >
            <QueryEditor />
          </div>
          
          <Resizer ref={resizerRef} />
          
          <div 
            className="results-viewer-wrapper"
            ref={resultsViewerRef}
            style={{ height: `calc(100% - ${queryEditorHeight}% - 8px)` }}
          >
            <ResultsViewer />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;