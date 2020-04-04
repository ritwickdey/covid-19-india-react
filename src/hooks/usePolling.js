import { useEffect, useRef } from 'react';

export const usePolling = (fn, ms = 5000, deps, cleanupFn) => {
  const working = useRef();
  useEffect(() => {
    fn();
    const timeout = setInterval(async () => {
      if (working.current) return;
      working.current = true;
      try {
        await fn();
      } finally {
        working.current = false;
      }
    }, ms);

    return () => {
      working.current = false;
      cleanupFn && cleanupFn();
      clearInterval(timeout);
    };
  }, deps);
};
