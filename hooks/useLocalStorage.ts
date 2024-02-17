import { useEffect, useState } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsedItem = JSON.parse(item);
        if (JSON.stringify(parsedItem) !== JSON.stringify(storedValue)) {
          setStoredValue(parsedItem);
        }
      }
    }
  }, [key, storedValue]);

  const setValue = (value: T) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
      setStoredValue(value);
    }
  };

  return [storedValue, setValue] as const;
};
