import styles from "./loadable-data.module.css";
import { ReactNode } from "react";
import Spinner from "../spinner/spinner";

type LoadableDataProps = {
  loading: boolean;
  error: string | null;
  children: ReactNode;
};

export default function LoadableData({
  loading,
  error,
  children,
}: LoadableDataProps) {
  if (loading) {
    return (
      <div className={styles["spinner-wrapper"]}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return children;
}
