import styles from "./navbar.module.css";
import { Link } from "react-router-dom";
import { FaNewspaper, FaPlus } from "react-icons/fa";
import ProfilePic from "../profile-pic/profile-pic";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <nav className={styles.nav}>
      <Link
        to={`/profile/${user?.id}`}
        className={`${styles.link} ${styles.profile}`}
      >
        <ProfilePic
          profilePic={user?.profilePic ?? null}
          username={user?.username ?? "?"}
        />
        <span>{user?.username}</span>
      </Link>
      <Link className={styles.link} to="/">
        <FaNewspaper />
        <span>Feed</span>
      </Link>
      <Link className={styles.link} to="/create">
        <FaPlus />
        <span>Create</span>
      </Link>
      <Link className={styles.link} to="/search">
        <FaMagnifyingGlass />
        <span>Search</span>
      </Link>
    </nav>
  );
}
