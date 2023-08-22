import styles from "./Loader.module.css";

function Loader({ size = "medium" }) {
  return <div className={`${styles.loader} ${styles[size]}`}></div>;
}

export default Loader;
