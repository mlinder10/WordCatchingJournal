import styles from "./styles.module.css";
import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import FloatingInput from "../../../components/floating-input/floating-input";
import LoadingButton from "../../../components/loading-button/loading-button";

export default function Page() {
  const { userId } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReset() {
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    setLoading(true);
    setError(null);
    try {
      await axios.patch("/api/auth/password", {
        userId,
        password,
      });
    } catch (err) {
      console.error(err);
      setError("Invalid email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`page ${styles.page}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p>Reset Password</p>
        </div>
        <div className={styles.body}>
          <FloatingInput
            placeholder="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FloatingInput
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          <LoadingButton type="primary" onClick={handleReset} loading={loading}>
            Reset Password
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
