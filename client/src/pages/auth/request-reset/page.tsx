import styles from "./styles.module.css";
import { useState } from "react";
import FloatingInput from "../../../components/floating-input/floating-input";
import LoadingButton from "../../../components/loading-button/loading-button";
import axios from "axios";

export default function Page() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleResetRequest() {
    setLoading(true);
    setError(null);
    try {
      await axios.post("/api/auth/password", { email });
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
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          <LoadingButton onClick={handleResetRequest} loading={loading}>
            Send Email
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
