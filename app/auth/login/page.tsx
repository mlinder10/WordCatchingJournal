"use client";
import { UserContext } from "@/components/userProvider";
import Link from "next/link";
import { useContext, useState } from "react";
import styles from "./login.module.css";

export default function Login() {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    try {
      const response = await fetch("/api/auth/", {
        headers: {
          "Content-Type": "application/json",
          email: email,
          password: password,
        },
      });
      let user = await response.json();
      setUser(user);
    } catch (err: any) {
      console.error(err?.message);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <input
          type="text"
          placeholder="Email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
        <p>
          <span>Don&apos;t have an account?</span>
          <Link href="/auth/register">Register</Link>
        </p>
      </div>
    </main>
  );
}
