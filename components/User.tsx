import { User } from "@/config/types";
import ProfileImage from "./ProfileImage";
import styles from "./styles/user.module.css";

type UserCellProps = {
  user: User;
};

export default function UserCell({ user }: UserCellProps) {
  return (
    <div className={styles.container}>
      <ProfileImage url={user.profileImageUrl} size={40} />
      <p className={styles.username}>{user.username}</p>
    </div>
  );
}
