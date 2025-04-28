import { useState, useEffect } from 'react';

/**
 * A custom hook that debounces a value.
 * @param {any} value - The value to be debounced
 * @param {number} delay - The delay in milliseconds
 * @returns {any} - The debounced value
 */
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
