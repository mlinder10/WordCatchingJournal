import styles from "./profile-pic.module.css";
import B64Image from "../b64-image/b64-image";

type ProfilePicProps = {
  profilePic: string | null;
  username: string;
  size?: number;
};

export default function ProfilePic({
  profilePic,
  username,
  size = 30,
}: ProfilePicProps) {
  if (profilePic === null) {
    return (
      <div className={styles.container} style={{ width: size, height: size }}>
        <span style={{ fontSize: size / 2.5 }}>
          {username[0].toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <B64Image
      data={profilePic}
      type="png"
      style={{ width: size, height: size }}
    />
  );
}
