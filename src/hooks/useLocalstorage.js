/* eslint-disable */
import { useState, useEffect, useMemo } from 'react';

export const useLocalStorage = (storageKey, initialValue, dataFormater) => {
  const [storageVal, setStorageVal] = useState(
    _localstorage.getItem(storageKey) || initialValue
  );

  useEffect(() => {
    _localstorage.setItem(storageKey, storageVal);
  }, [storageVal]);

  const formatedValue = useMemo(
    () => (dataFormater ? dataFormater(storageVal) : storageVal),
    [storageVal]
  );

  return [formatedValue, setStorageVal];
};

const _localstorage = {
  getItem(key) {
    const val = localStorage.getItem(key);

    if (val === null) return undefined;

    try {
      return JSON.parse(val);
    } catch (error) {
      return val; // if not, simply return the value.
    }
  },

  setItem(key, value) {
    if (value === undefined || value === null) {
      return localStorage.removeItem(key);
    }

    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }

    localStorage.setItem(key, value);
  },
};
