import { useState, useEffect } from "react";

const URL = `${import.meta.env.VITE_API_URL}/symbols`;

export function useCurrenciesFetcher() {
  const [symbols, setSymbols] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(function () {
    async function fetchSymbols() {
      try {
        setError(false);
        setIsLoading(true);
        const headers = new Headers();
        headers.append("apikey", import.meta.env.VITE_API_KEY);

        const requestOptions = {
          method: "GET",
          redirect: "follow",
          headers,
          withCredentials: true,
          credentials: "same-origin",
        };

        const response = await fetch(URL, requestOptions);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            `${data.message} (${response.status} ${response.statusText})`
          );
        }
        if (!data.success) {
          throw new Error(`${data.error.code} ${data.error.type}`);
        }
        setSymbols(data.symbols);
      } catch (err) {
        setError(true);
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSymbols();
  }, []);

  return { symbols, isLoading, error };
}
