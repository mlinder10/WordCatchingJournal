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
        <Image src="/logo.png" alt="logo" width={80} height={80} />
      </div>
      <Link href="/">
        <div className={pathname === "/" ? styles.active : ""}>
          <FaNewspaper />
          <p>Feed</p>
        </div>
      </Link>
      <Link href="/post">
        <div className={pathname === "/post" ? styles.active : ""}>
          <FaPlus />
          <p>Post</p>
        </div>
      </Link>
      <Link href="/search">
        <div className={pathname === "/search" ? styles.active : ""}>
          <FaSearch />
          <p>Search</p>
        </div>
      </Link>
      <Link href="/account">
        <div className={pathname === "/account" || pathname === "/account/edit" ? styles.active : ""}>
          <FaUser />
          <p>Account</p>
        </div>
      </Link>
    </div>
  );
}
