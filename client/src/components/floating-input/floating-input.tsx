import { ChangeEvent, HTMLInputTypeAttribute } from "react";
import styles from "./floating-input.module.css";

type FloatingInputProps = {
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: HTMLInputTypeAttribute;
};

export default function FloatingInput({
  placeholder,
  value,
  onChange,
  type = "text",
}: FloatingInputProps) {
  return (
    <div className={styles.container}>
      <input
        type={type}
        className={styles.input}
        value={value}
        onChange={onChange}
      />
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
