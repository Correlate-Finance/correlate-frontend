import { useEffect, useState } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem(key);
      if (item) {
        try {
          const parsedItem = JSON.parse(item);
          setStoredValue(parsedItem);

          if (JSON.stringify(parsedItem) !== JSON.stringify(storedValue)) {
            setStoredValue(parsedItem);
          }
        } catch (error) {
          // If the item is not a valid JSON, remove it from localStorage
          window.localStorage.removeItem(key);
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
