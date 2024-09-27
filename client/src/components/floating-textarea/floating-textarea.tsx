import { ChangeEvent } from "react";
import styles from "./floating-textarea.module.css";

type FloatingTextareaProps = {
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  style?: React.CSSProperties;
};

export default function FloatingTextarea({
  placeholder,
  value,
  onChange,
}: FloatingTextareaProps) {
  return (
    <div className={styles.container}>
      <textarea value={value} onChange={onChange} className={styles.input} />
      <p
        className={`${styles.placeholder} ${
          value.length !== 0 ? styles.hidden : ""
        }`}
      >
        {placeholder}
      </p>
    </div>
  );
}
