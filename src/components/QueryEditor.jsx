import React, { useCallback, useMemo, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql, MySQL } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap } from '@codemirror/view';
import { Prec } from '@codemirror/state';
import { FaPlay, FaBookmark as FaBookmarkSolid, FaRegBookmark, FaSpinner, FaCode, FaTimes, FaPlus } from 'react-icons/fa';
import useStore from '../store/store';
import '../styles/QueryEditor.css';

const QueryEditor = () => {
  const currentQuery = useStore(state => state.currentQuery);
  const executeQuery = useStore(state => state.executeQuery);
  const bookmarkQuery = useStore(state => state.bookmarkQuery);
  const bookmarkedQueries = useStore(state => state.bookmarkedQueries);
  const isLoading = useStore(state => state.isLoading);
  const darkMode = useStore(state => state.darkMode);
  const schema = useStore(state => state.schema);

  // Tab State & Actions
  const editors = useStore(state => state.editors);
  const activeEditorId = useStore(state => state.activeEditorId);
  const createEditor = useStore(state => state.createEditor);
  const deleteEditor = useStore(state => state.deleteEditor);
  const renameEditor = useStore(state => state.renameEditor);
  const setActiveEditorId = useStore(state => state.setActiveEditorId);
  const updateActiveQuery = useStore(state => state.updateActiveQuery);

  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  const isBookmarked = bookmarkedQueries.includes(currentQuery);

  // Build CodeMirror SQL schema from our store schema
  const cmSchema = useMemo(() => schema.reduce((acc, table) => {
    acc[table.tableName] = table.columns.map(c => c.name);
    return acc;
  }, {}), [schema]);

  const handleChange = useCallback((value) => {
    updateActiveQuery(value);
  }, [updateActiveQuery]);

  const handleDoubleClick = (id, currentName) => {
    setRenamingId(id);
    setRenameValue(currentName);
  };

  const handleRenameSave = (id) => {
    if (renameValue.trim()) {
      renameEditor(id, renameValue.trim());
    }
    setRenamingId(null);
  };

  const handleRenameKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      handleRenameSave(id);
    } else if (e.key === 'Escape') {
      setRenamingId(null);
    }
  };

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
            title={isBookmarked ? 'Bookmark/Unbookmark' : 'Bookmark Query'}
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

      {/* Selector Tabs Row */}
      <div className="editor-tabs-bar">
        <div className="editor-tabs-container">
          {editors.map(editor => {
            const isActive = editor.id === activeEditorId;
            const isRenaming = editor.id === renamingId;
            return (
              <div
                key={editor.id}
                className={`editor-tab ${isActive ? 'active' : ''}`}
                onClick={() => !isActive && setActiveEditorId(editor.id)}
              >
                {isRenaming ? (
                  <input
                    type="text"
                    className="tab-rename-input"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => handleRenameSave(editor.id)}
                    onKeyDown={(e) => handleRenameKeyDown(e, editor.id)}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span
                    className="tab-title-text"
                    onDoubleClick={() => handleDoubleClick(editor.id, editor.name)}
                    title="Double-click to rename"
                  >
                    {editor.name}
                  </span>
                )}
                <button
                  className="tab-close-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEditor(editor.id);
                  }}
                  title="Close Tab"
                >
                  <FaTimes />
                </button>
              </div>
            );
          })}
          <button
            className="editor-add-tab-btn"
            onClick={() => createEditor('')}
            title="Create New Blank query sheet"
          >
            <FaPlus /> New Editor
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