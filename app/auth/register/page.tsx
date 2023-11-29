"use client";
import { UserContext } from "@/components/userProvider";
import Link from "next/link";
import { useContext, useState } from "react";
import styles from "./register.module.css";

export default function Register() {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function register() {
    try {
      const response = await fetch("/api/auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });
      if (!response.ok) throw Error();
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
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={register}>Register</button>
        <p>
          <span>Already have an account?</span>
          <Link href="/auth/login">Login</Link>
        </p>
      </div>
    </main>
  );
}
