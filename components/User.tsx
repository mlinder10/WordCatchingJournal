import { User } from "@/config/types";
import ProfileImage from "./ProfileImage";
import styles from "./styles/user.module.css";
import Link from "next/link";

type UserCellProps = {
  user: User;
};

export default function UserCell({ user }: UserCellProps) {
  return (
    <Link className={styles.container} href={`/user/${user.uid}`}>
      <div className={styles.img}>
        <ProfileImage url={user.profileImageUrl} />
      </div>
      <p className={styles.username}>{user.username}</p>
    </Link>
  );
}
