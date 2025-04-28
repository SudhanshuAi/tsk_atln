import React, { forwardRef } from 'react';
import useStore from '../store/store';
import '../styles/Resizer.css';

const Resizer = forwardRef((props, ref) => {
  const darkMode = useStore(state => state.darkMode);
  
  return (
    <div 
      className={`horizontal-resizer ${darkMode ? 'dark' : 'light'}`} 
      id="query-result-resizer"
      ref={ref}
    >
      <div className="resizer-handle"></div>
    </div>
  );
});

export default Resizer; 