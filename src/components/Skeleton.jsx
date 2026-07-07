import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../styles/Skeleton.css';
import useStore from '../store/store';

const TableSkeleton = () => {
  const darkMode = useStore(state => state.darkMode);
  
  const baseColor = darkMode ? '#2c313c' : '#f0f3f6';
  const highlightColor = darkMode ? '#3e4451' : '#e2e8f0';

  return (
    <div className={`skeleton-container ${darkMode ? 'dark' : 'light'}`}>
      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
        <div className="skeleton-table">
          <div className="skeleton-header">
            {Array(5).fill().map((_, index) => (
              <div key={index} className="skeleton-cell">
                <Skeleton height={32} />
              </div>
            ))}
          </div>
          
          {Array(8).fill().map((_, rowIndex) => (
            <div key={rowIndex} className="skeleton-row">
              {Array(5).fill().map((_, colIndex) => (
                <div key={colIndex} className="skeleton-cell">
                  <Skeleton height={24} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default TableSkeleton;