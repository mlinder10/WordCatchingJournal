import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: User | null;
  authLoading: boolean;
  checkToken: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
};

const defaultAuthContext = {
  user: null,
  authLoading: true,
  checkToken: async () => {},
  login: async () => {},
  register: async () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  async function login(email: string, password: string) {
    const res = await axios.post("/api/auth/login", { email, password });
    setUser(res.data);
  }

  async function register(username: string, email: string, password: string) {
    const res = await axios.post("/api/auth/register", {
      username,
      email,
      password,
    });
    setUser(res.data);
  }

  async function logout() {
    try {
      await axios.delete(`/api/auth/logout/${user?.token}`);
      setUser(null);
      window.localStorage.removeItem("user");
    } catch (err) {
      console.error(err);
    }
  }

  async function checkToken() {
    const storedUser = window.localStorage.getItem("user");
    if (!storedUser) {
      throw new Error("No user found");
    }
    const user = JSON.parse(storedUser);
    if (!user) {
      throw new Error("No user found");
    }
    await axios.get(`/api/auth/token/${user.token}`);
    setUser(user);
  }

  useEffect(() => {
    checkToken()
      .catch((_) => {})
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, authLoading, login, register, logout, checkToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, checkToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      checkToken().catch(() => {
        navigate("/login");
      });
    }
  }, [user]);

  return <>{children}</>;
}
