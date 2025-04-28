import React from 'react';
import { FaPlay } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../styles/Skeleton.css';
import useStore from '../store/store';

const TableSkeleton = () => {
  const darkMode = useStore(state => state.darkMode);
  
  return (
    <div className={`skeleton-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="skeleton-content">
        <div className="skeleton-icon-container">
          <FaPlay className="skeleton-icon" />
        </div>
        <h3 className="skeleton-title">No Results Yet</h3>
        <p className="skeleton-text">Click "Run Query" to execute your SQL query and see results</p>
        
        <div className="skeleton-table">
          <div className="skeleton-header">
            {Array(4).fill().map((_, index) => (
              <div key={index} className="skeleton-cell">
                <Skeleton height={30} />
              </div>
            ))}
          </div>
          
          {Array(3).fill().map((_, rowIndex) => (
            <div key={rowIndex} className="skeleton-row">
              {Array(4).fill().map((_, colIndex) => (
                <div key={colIndex} className="skeleton-cell">
                  <Skeleton height={25} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;