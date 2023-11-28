import { VscLoading } from "react-icons/vsc";
import styles from "./styles/loadingview.module.css"

export default function LoadingView() {
  return (
    <div className={styles.container}>
      <VscLoading className={styles.icon} />
      <p className={styles.text}>Loading...</p>
    </div>
  );
}
