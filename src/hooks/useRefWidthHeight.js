/* eslint-disable */
import { useRef } from 'react';
import { useState, useCallback } from 'react';
import { useComponentWillUnmount } from './useComponentWillUnmount';

export function useRefWidthHeight() {
  const [height, setHeight] = useState(null);
  const [width, setWidth] = useState(null);
  const lastNodeUpdate = useRef(null);
  const lastHeightWidthUpdateFn = useRef(null);

  useComponentWillUnmount(() => {
    window.removeEventListener('resize', lastHeightWidthUpdateFn.current);
  }, []);

  const refUpdaterCallback = useCallback(
    (node) => {
      function updateHeightWidth() {
        const rect = node && node.getBoundingClientRect();
        if (node !== null) {
          clearTimeout(lastNodeUpdate.current);
          lastNodeUpdate.current = setTimeout(() => {
            if (rect.height != height) {
              setHeight(rect.height);
            }
            if (rect.width != width) {
              setWidth(rect.width);
            }
          }, 200);
        }
      }
      setTimeout(() => {
        updateHeightWidth();
      });
      window.removeEventListener('resize', lastHeightWidthUpdateFn.current);
      window.addEventListener('resize', updateHeightWidth, false);
      lastHeightWidthUpdateFn.current = updateHeightWidth;
    },
    [width, height]
  );
  return [
    {
      height,
      width,
    },
    refUpdaterCallback,
  ];
}
