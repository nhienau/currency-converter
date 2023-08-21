import { useState, useEffect } from "react";
import styles from "./CurrencyConverter.module.css";
import CurrencyInput from "./CurrencyInput";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

function toDateString(timestamp) {
  return new Intl.DateTimeFormat(navigator.language, {
    dateStyle: "medium",
  }).format(new Date(timestamp));
}

function CurrencyConverter({ symbols }) {
  const [fromAmount, setFromAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState(null);
  const [toAmount, setToAmount] = useState("");
  const [toCurrency, setToCurrency] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);

  function handleSwap() {
    if (fromCurrency === null || toCurrency === null) return;
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  useEffect(
    function () {
      if (fromCurrency === null || toCurrency === null) return;
      async function fetchExchangeRate() {
        try {
          setExchangeRate(null);

          const myHeaders = new Headers();
          myHeaders.append("apikey", import.meta.env.VITE_API_KEY);

          const requestOptions = {
            method: "GET",
            redirect: "follow",
            headers: myHeaders,
            withCredentials: true, // in order to work fine in Firefox
          };

          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/latest?symbols=${
              toCurrency.value
            }&base=${fromCurrency.value}`,
            requestOptions
          );
          const data = await response.json();
          const result = {
            fromCur: data.base,
            toCur: Object.keys(data.rates)[0],
            rate: Object.values(data.rates)[0],
            timestamp: data.timestamp * 1000,
          };
          setExchangeRate(result);
        } catch (err) {
          console.error(err);
        }
      }
      fetchExchangeRate();
    },
    [fromCurrency, toCurrency]
  );

  return (
    <section className={styles.converter}>
      <div className={styles["input-box"]}>
        <CurrencyInput
          symbols={symbols}
          setAmount={setFromAmount}
          currency={fromCurrency}
          setCurrency={setFromCurrency}
        />
        <button className={styles["btn-swap"]} onClick={handleSwap}>
          <SwapHorizIcon />
        </button>
        <CurrencyInput
          symbols={symbols}
          setAmount={setToAmount}
          currency={toCurrency}
          setCurrency={setToCurrency}
        />
      </div>
      {exchangeRate && (
        <summary className={styles["rate-summary"]}>
          1 {fromCurrency.value} &asymp; {exchangeRate.rate} {toCurrency.value}{" "}
          &bull; {toDateString(exchangeRate.timestamp)}
        </summary>
      )}
    </section>
  );
}

export default CurrencyConverter;
