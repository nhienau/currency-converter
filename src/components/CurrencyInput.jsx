import Select from "./Select";
import styles from "./CurrencyInput.module.css";

function CurrencyInput({
  symbols,
  amount,
  onChangeAmount,
  currency,
  setCurrency,
  name,
}) {
  const options = Object.entries(symbols).map(symbol => {
    return { label: `${symbol[0]} — ${symbol[1]}`, value: symbol[0] };
  });

  return (
    <div className={styles["input-container"]}>
      <input
        type="text"
        name={name}
        value={amount}
        onChange={onChangeAmount}
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
