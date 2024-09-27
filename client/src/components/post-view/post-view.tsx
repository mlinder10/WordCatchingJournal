import styles from "./post-view.module.css";
import { Post } from "../../types";
import { formatDate } from "../../utils";
import ProfilePic from "../profile-pic/profile-pic";
import { Link } from "react-router-dom";

type PostProps = {
  post: Post;
};

export default function PostView({ post }: PostProps) {
  const date = formatDate(post.createdAt);

  return (
    <div className={styles.post}>
      <div className={styles.upper}>
        <Link to={`/profile/${post.userId}`} className={styles.profile}>
          <ProfilePic profilePic={post.profilePic} username={post.username} />
          <p>{post.username}</p>
        </Link>
        <div className={styles.date}>
          <p>{date.date}</p>
          <p>{date.time}</p>
        </div>
      </div>
      <div className={styles.lower}>
        <p className={styles.word}>{post.word}</p>
        <p className={styles.def}>{post.definition}</p>
        <p className={styles.pos}>{post.partOfSpeech}</p>
      </div>
    </div>
  );
}
