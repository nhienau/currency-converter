import styles from "./LoadingStatus.module.css";

function LoadingStatus({ children }) {
  return <div className={`app ${styles.loading}`}>{children}</div>;
}

export default LoadingStatus;
