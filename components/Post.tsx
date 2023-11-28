import { VscHeart, VscHeartFilled } from "react-icons/vsc";
import { Post, User } from "../config/types";
import ProfileImage from "./ProfileImage";
import styles from "./styles/post.module.css";
import Link from "next/link";

type PostProps = {
  post: Post;
  user: User | null;
  updatePosts: (post: Post) => void;
};

export default function PostCell({ post, user, updatePosts }: PostProps) {
  async function likePost() {
    if (user === null) return;
    try {
      const response = await fetch("/api/like", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pid: post.pid, uid: user.uid }),
      });
      const data = await response.json();
      updatePosts(data);
    } catch (err: any) {
      console.error(err?.message);
    }
  }

  return (
    <div className={styles.container}>
      <Link href={`/user/${post.uid}`}>
        <ProfileImage url={post.profileImageUrl} />
      </Link>
      <div className={styles.content}>
        <p className={styles.word}>{post.word}</p>
        <p className={styles.definition}>{post.definition}</p>
        <div className={styles.footer}>
          <button className={styles.likeBtn} onClick={likePost}>
            {post.likes.includes(user?.uid ?? "") ? (
              <VscHeartFilled style={{ color: "red" }} />
            ) : (
              <VscHeart />
            )}
            <span>
              {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
            </span>
          </button>
          <Link href={`/user/${post.uid}`}>{post.username}</Link>
          <span>{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
