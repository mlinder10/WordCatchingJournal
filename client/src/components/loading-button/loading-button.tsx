import { ReactNode } from "react";
import BorderedButton from "../bordered-button/bordered-button";
import Spinner from "../spinner/spinner";

type LoadingButtonProps = {
  onClick: () => void;
  loading: boolean;
  type?: "primary" | "secondary";
  children?: ReactNode | null;
  disabled?: boolean;
  className?: string;
};

export default function LoadingButton({
  onClick,
  loading,
  type = "primary",
  children = null,
  disabled = false,
  className = "",
}: LoadingButtonProps) {
  return (
    <BorderedButton
      onClick={onClick}
      type={type}
      disabled={loading || disabled}
      className={className}
    >
      {loading ? (
        <>
          <Spinner />
          <span>Loading</span>
        </>
      ) : (
        children
      )}
    </BorderedButton>
  );
}
