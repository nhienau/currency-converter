import { useState, useEffect } from "react";

export function useSessionStorageState(key, initialState) {
  const [value, setValue] = useState(function () {
    const storedValue = sessionStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    function () {
      sessionStorage.setItem(key, JSON.stringify(value));
    },
    [key, value]
  );

  return [value, setValue];
}
