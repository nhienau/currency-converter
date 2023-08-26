import { useState } from "react";
import CurrencyConverter from "./components/CurrencyConverter";
import Loader from "./components/Loader";
import "./index.css";
import { useSessionStorageState } from "./hooks/useSessionStorageState";
import LoadingStatus from "./components/LoadingStatus";
import { useCurrenciesFetcher } from "./hooks/useCurrenciesFetcher";
import NumConverter from "./components/NumConverter";

function App() {
  const { symbols, isLoading, error } = useCurrenciesFetcher();
  const [fetchedRates, setFetchedRates] = useSessionStorageState(
    "exchangeRate",
    []
  );
  const [listConverter, setListConverter] = useState([
    { id: crypto.randomUUID() },
  ]);
  const numConverter = listConverter.length;
  const maxConverter = 5;

  function handleAddConverter() {
    if (numConverter === maxConverter) return;
    const newConverter = { id: crypto.randomUUID() };
    setListConverter(listConverter => [...listConverter, newConverter]);
  }

  function handleDeleteConverter(id) {
    setListConverter(listConverter => listConverter.filter(c => c.id !== id));
  }

  if (isLoading)
    return (
      <LoadingStatus>
        <Loader size={"large"} />
        <span>Loading currencies...</span>
      </LoadingStatus>
    );

  if (error)
    return (
      <LoadingStatus>
        <span role="img">❌</span>
        <span>There was an error fetching currencies, please try again.</span>
      </LoadingStatus>
    );

  return (
    <div className="app">
      <NumConverter
        numConverter={numConverter}
        maxConverter={maxConverter}
        onAddConverter={handleAddConverter}
      />
      {listConverter.map(converter => (
        <CurrencyConverter
          symbols={symbols}
          fetchedRates={fetchedRates}
          setFetchedRates={setFetchedRates}
          key={converter.id}
          id={converter.id}
          onDeleteConverter={handleDeleteConverter}
          disabled={numConverter === 1}
        />
      ))}
    </div>
  );
}

export default App;
