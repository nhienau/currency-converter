import { useState, useEffect } from "react";
import styles from "./CurrencyConverter.module.css";
import CurrencyInput from "./CurrencyInput";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import Loader from "./Loader";

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

function commafy(num) {
  const str = num.toString().split(".");
  if (str[0].length >= 3) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  }
  return str.join(".");
}

function toDateString(timestamp) {
  return new Intl.DateTimeFormat(navigator.language, {
    dateStyle: "medium",
  }).format(new Date(timestamp));
}

function getOutputString(value) {
  return commafy(value.toFixed(value < 1 ? 6 : 2));
}

function CurrencyConverter({ symbols }) {
  const [fromCurrency, setFromCurrency] = useState(null);
  const [toCurrency, setToCurrency] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState({
    fromAmount: "",
    toAmount: "",
  });
  const [error, setError] = useState(false);

  function handleAmountChange(e) {
    const inputValue = e.target.value;
    if (
      !isLoading &&
      exchangeRate &&
      isNumeric(inputValue.replaceAll(",", ""))
    ) {
      const value = Number(inputValue.replaceAll(",", ""));
      const result =
        e.target.name === "fromAmount"
          ? value * exchangeRate.rate
          : value / exchangeRate.rate;
      const output = getOutputString(result);
      const otherInput =
        e.target.name === "fromAmount" ? "toAmount" : "fromAmount";
      setInput({
        ...input,
        [e.target.name]: inputValue,
        [otherInput]: output,
      });
    } else {
      setInput({
        ...input,
        [e.target.name]: inputValue,
      });
    }
  }

  function handleSwap() {
    if (fromCurrency === null || toCurrency === null) return;
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  useEffect(
    function () {
      if (fromCurrency === null || toCurrency === null) return;
      const controller = new AbortController();

      async function fetchExchangeRate() {
        try {
          setError(false);
          setIsLoading(true);
          setExchangeRate(null);

          const myHeaders = new Headers();
          myHeaders.append("apikey", import.meta.env.VITE_API_KEY);

          const requestOptions = {
            method: "GET",
            redirect: "follow",
            headers: myHeaders,
            withCredentials: true,
            signal: controller.signal,
          };

          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/latest?symbols=${
              toCurrency.value
            }&base=${fromCurrency.value}`,
            requestOptions
          );
          const data = await response.json();
          if (!response.ok) {
            throw new Error(
              `${data.message} (${response.status} ${response.statusText})`
            );
          }
          if (!data.success) {
            throw new Error(`${data.error.code} ${data.error.type}`);
          }
          const result = {
            fromCur: data.base,
            toCur: Object.keys(data.rates)[0],
            rate: Object.values(data.rates)[0],
            timestamp: data.timestamp * 1000,
          };
          setExchangeRate(result);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(true);
            console.error(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (
        exchangeRate?.fromCur === fromCurrency.value &&
        exchangeRate?.toCur === toCurrency.value
      )
        return;

      if (fromCurrency.value === toCurrency.value) {
        setExchangeRate({
          ...exchangeRate,
          fromCur: fromCurrency.value,
          toCur: toCurrency.value,
          rate: 1,
          timestamp: new Date().getTime(),
        });
      } else if (
        exchangeRate?.fromCur === toCurrency.value &&
        exchangeRate?.toCur === fromCurrency.value
      ) {
        setExchangeRate({
          ...exchangeRate,
          fromCur: exchangeRate.toCur,
          toCur: exchangeRate.fromCur,
          rate: 1 / exchangeRate.rate,
        });
      } else {
        fetchExchangeRate();
      }

      return function () {
        controller.abort();
      };
    },
    [fromCurrency, toCurrency]
  );

  useEffect(
    function () {
      if (!exchangeRate) return;
      setInput(prevInput => ({
        ...prevInput,
        toAmount: isNumeric(prevInput.fromAmount.replaceAll(",", ""))
          ? getOutputString(
              Number(prevInput.fromAmount.replaceAll(",", "")) *
                exchangeRate.rate
            )
          : "",
      }));
    },
    [exchangeRate]
  );

  return (
    <section className={styles.converter}>
      <div className={styles["input-box"]}>
        <CurrencyInput
          symbols={symbols}
          name="fromAmount"
          amount={input.fromAmount}
          onChangeAmount={handleAmountChange}
          currency={fromCurrency}
          setCurrency={setFromCurrency}
        />
        <button className={styles["btn-swap"]} onClick={handleSwap}>
          <SwapHorizIcon />
        </button>
        <CurrencyInput
          symbols={symbols}
          name="toAmount"
          amount={input.toAmount}
          onChangeAmount={handleAmountChange}
          currency={toCurrency}
          setCurrency={setToCurrency}
        />
      </div>
      {exchangeRate && (
        <summary className={styles["rate-summary"]}>
          1 {fromCurrency.value} &asymp; {getOutputString(exchangeRate.rate)}{" "}
          {toCurrency.value} &bull; {toDateString(exchangeRate.timestamp)}
        </summary>
      )}
      {isLoading && (
        <div className={styles["loader-container"]}>
          <Loader size={"small"} />
          <span>Loading exchange rate, please wait...</span>
        </div>
      )}

      {error && (
        <summary className={styles["error-message"]}>
          <span>❌</span> Something went wrong with fetching data. Please try
          again.
        </summary>
      )}
    </section>
  );
}

export default CurrencyConverter;
