import { useState, useEffect } from "react";
import styles from "./CurrencyConverter.module.css";
import CurrencyInput from "./CurrencyInput";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

function CurrencyConverter({ symbols }) {
  const [fromAmount, setFromAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState(null);
  const [toAmount, setToAmount] = useState("");
  const [toCurrency, setToCurrency] = useState(null);

  function handleSwap() {
    if (fromCurrency === null || toCurrency === null) return;
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

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
      <summary className={styles["rate-summary"]}>
        X USD ~= Y EUR &bull; Aug 20, 2023
      </summary>
    </section>
  );
}

export default CurrencyConverter;
