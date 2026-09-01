import { useState, useEffect } from "react";

/**
 * Custom hook to debounce any rapidly changing value.
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds (default: 350)
 * @returns {*} Debounced value
 */
export function useDebounce(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
