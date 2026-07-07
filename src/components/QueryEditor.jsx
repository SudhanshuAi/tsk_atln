import React, { useCallback, useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql, MySQL } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap } from '@codemirror/view';
import { Prec } from '@codemirror/state';
import { FaPlay, FaBookmark as FaBookmarkSolid, FaRegBookmark, FaSpinner, FaCode } from 'react-icons/fa';
import useStore from '../store/store';
import '../styles/QueryEditor.css';

const QueryEditor = () => {
  const currentQuery = useStore(state => state.currentQuery);
  const setCurrentQuery = useStore(state => state.setCurrentQuery);
  const executeQuery = useStore(state => state.executeQuery);
  const bookmarkQuery = useStore(state => state.bookmarkQuery);
  const bookmarkedQueries = useStore(state => state.bookmarkedQueries);
  const isLoading = useStore(state => state.isLoading);
  const darkMode = useStore(state => state.darkMode);
  const schema = useStore(state => state.schema);

  const isBookmarked = bookmarkedQueries.includes(currentQuery);

  // Build CodeMirror SQL schema from our store schema
  const cmSchema = useMemo(() => schema.reduce((acc, table) => {
    acc[table.tableName] = table.columns.map(c => c.name);
    return acc;
  }, {}), [schema]);

  const handleChange = useCallback((value) => {
    setCurrentQuery(value);
  }, [setCurrentQuery]);

  // Using high-priority keymap for Mod-Enter
  const extensions = useMemo(() => [
    sql({ dialect: MySQL, schema: cmSchema, upperCaseKeywords: true }),
    Prec.highest(keymap.of([
      {
        key: 'Mod-Enter',
        run: () => {
          executeQuery();
          return true;
        }
      }
    ]))
  ], [cmSchema, executeQuery]);

  return (
    <div className={`query-editor ${darkMode ? 'dark' : 'light'}`}>
      <div className="editor-header">
        <div className="section-title">
          <FaCode className="section-icon" />
          <h2>SQL Query Editor</h2>
          <span className="shortcut-hint">Ctrl+Enter to run</span>
        </div>
        <div className="editor-controls">
          <button
            onClick={bookmarkQuery}
            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Query'}
          >
            {isBookmarked ? <FaBookmarkSolid /> : <FaRegBookmark />}
          </button>
          <button
            onClick={executeQuery}
            className={`run-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
            id="run-query-btn"
          >
            {isLoading ? (
              <><FaSpinner className="spinner-icon" /> Running...</>
            ) : (
              <><FaPlay /> Run Query</>
            )}
          </button>
        </div>
      </div>

      <div className="editor-container">
        <CodeMirror
          value={currentQuery}
          onChange={handleChange}
          theme={darkMode ? oneDark : 'light'}
          extensions={extensions}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            history: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: false,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            searchKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
          style={{ height: '100%', fontSize: '14px' }}
          height="100%"
          placeholder="Write your SQL query here... (Ctrl+Enter to run)"
        />
      </div>
    </div>
  );
};

export default QueryEditor;