import { useState, useEffect } from "react";
import Select from "./Select";
import styles from "./CurrencyInput.module.css";

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

function CurrencyInput({ symbols, setAmount, currency, setCurrency }) {
  const [value, setValue] = useState("");
  const options = Object.entries(symbols).map(symbol => {
    return { label: `${symbol[0]} — ${symbol[1]}`, value: symbol[0] };
  });

  useEffect(
    function () {
      if (isNumeric(value.replaceAll(",", ""))) {
        setAmount(Number(value.replaceAll(",", "")));
      } else {
        setAmount(null);
      }
    },
    [value]
  );

  return (
    <div className={styles["input-container"]}>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        className={styles.input}
        inputMode={"numeric"}
      />
      <Select
        options={options}
        value={currency}
        onChange={c => setCurrency(c)}
      />
    </div>
  );
}

export default CurrencyInput;
