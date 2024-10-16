import styles from "./navbar.module.css";
import { Link } from "react-router-dom";
import { FaNewspaper, FaPlus } from "react-icons/fa";
import ProfilePic from "../profile-pic/profile-pic";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { VscHeart, VscStarEmpty } from "react-icons/vsc";

type Route = "/" | "/create" | "/search" | "/likes" | "/favorites";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const route = window.location.pathname as Route;

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
      <Link
        className={`${styles.link} ${route === "/" ? styles.active : null}`}
        to="/"
      >
        <FaNewspaper />
        <span>Feed</span>
      </Link>
      <Link
        className={`${styles.link} ${
          route === "/create" ? styles.active : null
        }`}
        to="/create"
      >
        <FaPlus />
        <span>Create</span>
      </Link>
      <Link
        className={`${styles.link} ${
          route === "/search" ? styles.active : null
        }`}
        to="/search"
      >
        <FaMagnifyingGlass />
        <span>Search</span>
      </Link>
      <Link
        className={`${styles.link} ${
          route === "/likes" ? styles.active : null
        }`}
        to="/likes"
      >
        <VscHeart />
        <span>Likes</span>
      </Link>
      <Link
        className={`${styles.link} ${
          route === "/favorites" ? styles.active : null
        }`}
        to="/favorites"
      >
        <VscStarEmpty />
        <span>Favorites</span>
      </Link>
    </nav>
  );
}
