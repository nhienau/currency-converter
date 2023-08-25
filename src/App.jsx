import CurrencyConverter from "./components/CurrencyConverter";
import Loader from "./components/Loader";
import "./index.css";
import { useSessionStorageState } from "./hooks/useSessionStorageState";
import LoadingStatus from "./components/LoadingStatus";
import { useCurrenciesFetcher } from "./hooks/useCurrenciesFetcher";

function App() {
  const { symbols, isLoading, error } = useCurrenciesFetcher();
  const [fetchedRates, setFetchedRates] = useSessionStorageState(
    "exchangeRate",
    []
  );

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
