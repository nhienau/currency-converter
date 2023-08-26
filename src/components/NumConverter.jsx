import styles from "./NumConverter.module.css";
import AddIcon from "@mui/icons-material/Add";

function NumConverter({ numConverter, maxConverter, onAddConverter }) {
  return (
    <div className={styles["num-converter"]}>
      <span>
        {numConverter} / {maxConverter}
      </span>
      <button
        className={`btn-round ${styles["btn-add"]}`}
        onClick={onAddConverter}
        disabled={numConverter === maxConverter}
      >
        <AddIcon />
      </button>
    </div>
  );
}

export default NumConverter;
