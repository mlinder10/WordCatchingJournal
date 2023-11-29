"use client";
import { User } from "@/config/types";
import { usePathname, useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

type UserContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
};

type UserProviderProps = {
  children: React.ReactNode;
};

export default function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  function getLocalUser() {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  useEffect(() => {
    const localUser = user ?? getLocalUser();
    if (user === null && localUser !== null) setUser(localUser);

    if (
      pathname !== "/auth/login" &&
      pathname !== "/auth/register" &&
      localUser === null
    ) {
      router.replace("/auth/login");
    }

    if (
      localUser !== null &&
      (pathname === "/auth/login" || pathname === "/auth/register")
    ) {
      router.replace("/");
    }
  }, [user, pathname, router]);

  useEffect(() => {
    function setLocalUser() {
      if (user === null) return;
      localStorage.setItem("user", JSON.stringify(user));
    }
    setLocalUser();
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
