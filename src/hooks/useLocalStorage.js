import React, { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const isBrowser = typeof window !== "undefined";

  const readValue = () => {
    if (!isBrowser) return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue);

  const setValue = (value) => {
    try {
      const valueToStore =
        typeof value === "function" ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (isBrowser) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch {
      // ignore write errors
    }
  };

  useEffect(() => {
    if (!isBrowser) return;
    const handleStorage = (event) => {
      if (event.key === key) {
        setStoredValue(event.newValue ? JSON.parse(event.newValue) : initialValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key, initialValue, isBrowser]);

  return [storedValue, setValue];
}
