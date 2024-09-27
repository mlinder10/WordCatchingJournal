import { ReactNode } from "react";
import styles from "./bordered-button.module.css";

type BorderedButtonProps = {
  onClick: () => void;
  type?: "primary" | "secondary";
  children?: ReactNode | null;
  disabled?: boolean;
  className?: string;
};

export default function BorderedButton({
  onClick,
  type = "primary",
  children = null,
  disabled = false,
  className = "",
}: BorderedButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${styles.button} ${styles[type]} ${className}`}
    >
      {children}
    </button>
  );
}
