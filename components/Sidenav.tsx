"use client";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles/sidenav.module.css";
import { FaNewspaper, FaUser, FaSearch, FaPlus } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function Sidenav() {
  const pathname = usePathname();

  if (pathname === "/auth/login" || pathname === "/auth/register") {
    return <></>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image src="/logo.png" alt="logo" layout="fill" />
      </div>
      <Link href="/">
        <div className={pathname === "/" ? styles.active : ""}>
          <FaNewspaper />
          <p className={styles["link-text"]}>Feed</p>
        </div>
      </Link>
      <Link href="/post">
        <div className={pathname === "/post" ? styles.active : ""}>
          <FaPlus />
          <p className={styles["link-text"]}>Post</p>
        </div>
      </Link>
      <Link href="/search">
        <div className={pathname === "/search" ? styles.active : ""}>
          <FaSearch />
          <p className={styles["link-text"]}>Search</p>
        </div>
      </Link>
      <Link href="/account">
        <div
          className={
            pathname === "/account" || pathname === "/account/edit"
              ? styles.active
              : ""
          }
        >
          <FaUser />
          <p className={styles["link-text"]}>Account</p>
        </div>
      </Link>
    </div>
  );
}
