import styles from "./styles.module.css";
import { useContext, useEffect, useState } from "react";
import FloatingInput from "../../../components/floating-input/floating-input";
import { AuthContext } from "../../../contexts/AuthProvider";
import LoadingButton from "../../../components/loading-button/loading-button";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../../components/spinner/spinner";

export default function Page() {
  const { login, user, authLoading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleLogin() {
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  if (authLoading) {
    // TODO render something better
    return <Spinner />;
  }

  return (
    <div className={`page ${styles.page}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p>Login</p>
        </div>
        <div className={styles.inputs}>
          <FloatingInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FloatingInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className={styles.actions}>
          <LoadingButton loading={loading} onClick={handleLogin}>
            Login
          </LoadingButton>
          <Link className="link" to="/register">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
