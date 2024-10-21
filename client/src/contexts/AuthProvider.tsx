import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../types";
import { useNavigate } from "react-router-dom";
import { getApi } from "../utils";

type AuthContextType = {
  user: User | null;
  updateUser: (user: User | null) => void;
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
  updateUser: () => {},
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

  function updateUser(user: User | null) {
    setUser(user);
  }

  async function login(email: string, password: string) {
    const res = await getApi().post("/api/auth/login", { email, password });
    setUser(res.data);
  }

  async function register(username: string, email: string, password: string) {
    const res = await getApi().post("/api/auth/register", {
      username,
      email,
      password,
    });
    setUser(res.data);
  }

  async function logout() {
    try {
      await getApi().delete(`/api/auth/logout/${user?.token}`);
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
    await getApi().get(`/api/auth/token/${user.token}`);
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
      value={{
        user,
        updateUser,
        authLoading,
        login,
        register,
        logout,
        checkToken,
      }}
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
