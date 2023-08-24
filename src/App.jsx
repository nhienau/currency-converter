import { useState, useEffect } from "react";
import CurrencyConverter from "./components/CurrencyConverter";
import "./index.css";
import { useSessionStorageState } from "./hooks/useSessionStorageState";

function App() {
  const [symbols, setSymbols] = useState({});
  const [fetchedRates, setFetchedRates] = useSessionStorageState(
    "exchangeRate",
    []
  );

  useEffect(function () {
    async function fetchSymbols() {
      const res = await fetch("http://localhost:9000/symbols");
      const data = await res.json();
      setSymbols(data);
    }
    fetchSymbols();
  }, []);

  return (
    <div className="app">
      <CurrencyConverter
        symbols={symbols}
        fetchedRates={fetchedRates}
        setFetchedRates={setFetchedRates}
      />
      <CurrencyConverter
        symbols={symbols}
        fetchedRates={fetchedRates}
        setFetchedRates={setFetchedRates}
      />
    </div>
  );
}

export default App;
