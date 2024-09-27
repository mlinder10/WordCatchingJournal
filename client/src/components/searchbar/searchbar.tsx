import styles from "./searchbar.module.css";
import { ChangeEvent } from "react";
import { FaMagnifyingGlass, FaX } from "react-icons/fa6";

type SearchbarProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  clear: () => void;
  placeholder?: string;
};

export default function Searchbar({
  value,
  onChange,
  clear,
  placeholder = "",
}: SearchbarProps) {
  return (
    <div className={styles.container}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={styles.input}
        placeholder={placeholder}
      />
      <FaMagnifyingGlass />
      {value.length !== 0 && (
        <button onClick={clear} className={styles.clear}>
          <FaX />
        </button>
      )}
    </div>
  );
}
