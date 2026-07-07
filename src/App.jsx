import React, { useRef, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import QueryEditor from './components/QueryEditor';
import ResultsViewer from './components/ResultsViewer';
import Resizer from './components/Resizer';
import ConnectionManager from './components/ConnectionManager';
import PREDEFINED_QUERIES from './data/queries';
import useStore from './store/store';
import './styles/App.css';

function App() {
  const darkMode = useStore(s => s.darkMode);
  const queryEditorHeight = useStore(s => s.queryEditorHeight);
  const setQueryEditorHeight = useStore(s => s.setQueryEditorHeight);
  const initDb = useStore(s => s.initDb);
  const dbReady = useStore(s => s.dbReady);
  const dbError = useStore(s => s.dbError);

  const contentRef = useRef(null);
  const queryEditorRef = useRef(null);
  const resizerRef = useRef(null);

  // Initialize the sql.js database on mount
  useEffect(() => {
    initDb();
  }, [initDb]);

  useEffect(() => {
    setQueryEditorHeight(50);
  }, [setQueryEditorHeight]);

  // Drag-to-resize logic
  useEffect(() => {
    const resizer = resizerRef.current;
    const content = contentRef.current;
    if (!resizer || !content) return;

    let isResizing = false;

    const onMouseDown = (e) => {
      isResizing = true;
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      if (!isResizing || !content) return;
      
      const contentRect = content.getBoundingClientRect();
      const relativeY = e.clientY - contentRect.top;
      const newPercent = (relativeY / contentRect.height) * 100;
      
      // Clamp between 20% and 80%
      setQueryEditorHeight(Math.max(20, Math.min(80, newPercent)));
    };

    const onMouseUp = () => {
      isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    resizer.addEventListener('mousedown', onMouseDown);
    return () => {
      resizer.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [setQueryEditorHeight]);

  // ── Loading splash ────────────────────────────────────────────────────
  if (!dbReady && !dbError) {
    return (
      <div className={`app-loading ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="loading-splash">
          <div className="splash-icon">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <ellipse cx="28" cy="14" rx="22" ry="8" stroke="currentColor" strokeWidth="2.5" />
              <path d="M6 14v28c0 4.4 9.9 8 22 8s22-3.6 22-8V14" stroke="currentColor" strokeWidth="2.5" />
              <path d="M6 28c0 4.4 9.9 8 22 8s22-3.6 22-8" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          </div>
          <h2>Initializing SQL Engine</h2>
          <p>Loading WebAssembly runtime and seeding database…</p>
          <div className="splash-bar">
            <div className="splash-bar-fill" />
          </div>
        </div>
      </div>
    );
  }

  // ── Fatal error ───────────────────────────────────────────────────────
  if (dbError) {
    return (
      <div className={`app-loading ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="loading-splash error">
          <h2>⚠️ Failed to Initialize</h2>
          <p>{dbError}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

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
            style={{ height: `calc(100% - ${queryEditorHeight}% - 6px)` }}
          >
            <ResultsViewer />
          </div>
        </main>
      </div>

      {/* Global overlays */}
      <ConnectionManager />
    </div>
  );
}

export default App;
