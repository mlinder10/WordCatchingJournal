import styles from "./multiselect.module.css";
import { ReactNode, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

type MultiselectProps<T> = {
  options: T[];
  selected: T[];
  setSelected: (selected: T[]) => void;
  alias?: (option: T) => ReactNode;
  placeholder?: string;
};

export default function Multiselect<T>({
  options,
  selected,
  setSelected,
  alias = (o: T) => o as ReactNode,
  placeholder = "Select options",
}: MultiselectProps<T>) {
  const [open, setOpen] = useState(false);
  const notSelected = options.filter((o) => !selected.includes(o));

  function remove(option: T) {
    setSelected(selected.filter((o) => o !== option));
  }

  function add(option: T) {
    if (selected.length + 1 === options.length) {
      setOpen(false);
    }
    setSelected([...selected, option]);
  }

  return (
    <div className={styles.container}>
      <div className={styles["selected-container"]}>
        {selected.map((s, i) => (
          <SelectedView key={i} option={s} onClick={remove} alias={alias} />
        ))}
        <p
          className={`${styles.placeholder} ${
            selected.length === 0 ? "" : styles.hidden
          }`}
        >
          {placeholder}
        </p>
      </div>
      <div className={styles["button-container"]}>
        <button
          onClick={setOpen.bind(null, !open)}
          className={`${styles.button} ${open ? styles.open : ""}`}
        >
          <FaChevronLeft />
        </button>
      </div>
      <div
        className={`${styles["option-container"]} ${open ? styles.open : ""}`}
      >
        {notSelected.map((o, i) => (
          <OptionView key={i} option={o} onClick={add} alias={alias} />
        ))}
      </div>
    </div>
  );
}

type SelectedViewProps<T> = {
  option: T;
  onClick: (option: T) => void;
  alias: (option: T) => ReactNode;
};

function SelectedView<T>({ option, onClick, alias }: SelectedViewProps<T>) {
  return (
    <div className={styles.selected}>
      {alias(option)}
      <button
        onClick={onClick.bind(null, option)}
        className={styles["clear-btn"]}
      >
        <FaX />
      </button>
    </div>
  );
}

type OptionViewProps<T> = {
  option: T;
  onClick: (option: T) => void;
  alias: (option: T) => ReactNode;
};

function OptionView<T>({ option, onClick, alias }: OptionViewProps<T>) {
  return (
    <div onClick={onClick.bind(null, option)} className={styles.option}>
      {alias(option)}
    </div>
  );
}
