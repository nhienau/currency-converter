import { useState, useEffect } from "react";
import CurrencyConverter from "./components/CurrencyConverter";
import "./index.css";

function App() {
  const [symbols, setSymbols] = useState({});

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
      <CurrencyConverter symbols={symbols} />
      <CurrencyConverter symbols={symbols} />
    </div>
  );
}

export default App;
