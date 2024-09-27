import styles from "./spinner.module.css";
import { FaSpinner } from "react-icons/fa";

export default function Spinner() {
  return (
    <div className={styles.spinner}>
      <FaSpinner />
    </div>
  );
}
