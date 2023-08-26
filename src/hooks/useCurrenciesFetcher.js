import { useState, useEffect } from "react";

const URL = "/.netlify/functions/symbols";

export function useCurrenciesFetcher() {
  const [symbols, setSymbols] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(function () {
    async function fetchSymbols() {
      try {
        setError(false);
        setIsLoading(true);
        const res = await fetch(URL);
        const data = await res.json();
        setSymbols(data);
      } catch (err) {
        console.error(err.message);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSymbols();
  }, []);

  return { symbols, isLoading, error };
}
