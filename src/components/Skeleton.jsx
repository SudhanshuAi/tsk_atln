import React from 'react';
import { FaPlay } from 'react-icons/fa';
import '../styles/Skeleton.css';

const Skeleton = () => {
  return (
    <div className="skeleton-container">
      <div className="skeleton-content">
        <div className="skeleton-icon-container">
          <FaPlay className="skeleton-icon" />
        </div>
        <h3 className="skeleton-title">No Results Yet</h3>
        <p className="skeleton-text">Click "Run Query" to execute your SQL query and see results</p>
        
        <div className="skeleton-table">
          <div className="skeleton-header">
            <div className="skeleton-cell header"></div>
            <div className="skeleton-cell header"></div>
            <div className="skeleton-cell header"></div>
            <div className="skeleton-cell header"></div>
          </div>
          <div className="skeleton-row">
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
          </div>
          <div className="skeleton-row">
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
          </div>
          <div className="skeleton-row">
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;