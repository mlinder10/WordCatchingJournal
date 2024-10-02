import styles from "./post-view.module.css";
import { Post } from "../../types";
import { formatDate, getApi } from "../../utils";
import ProfilePic from "../profile-pic/profile-pic";
import { Link } from "react-router-dom";
import {
  VscHeart,
  VscHeartFilled,
  VscStarEmpty,
  VscStarFull,
} from "react-icons/vsc";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthProvider";

type PostProps = {
  post: Post;
};

export default function PostView({ post }: PostProps) {
  const { user } = useContext(AuthContext);
  const date = formatDate(post.createdAt);
  const [likesCount, setLikesCount] = useState<number>(post.likesCount);
  const [favoritesCount, setFavoritesCount] = useState<number>(
    post.favoritesCount
  );
  const [liked, setLiked] = useState<boolean>(post.liked === 1);
  const [favorited, setFavorited] = useState<boolean>(post.favorited === 1);

  async function handleLike() {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    try {
      await getApi().post(`/api/like/${post.liked ? "delete" : ""}`, {
        userId: user?.id,
        postId: post.id,
      });
    } catch (err) {
      console.error(err);
      setLiked(!liked);
      setLikesCount(liked ? likesCount + 1 : likesCount - 1);
    }
  }

  async function handleFavorite() {
    setFavorited(!favorited);
    setFavoritesCount(favorited ? favoritesCount - 1 : favoritesCount + 1);
    try {
      await getApi().post(`/api/favorite/${post.favorited ? "delete" : ""}`, {
        userId: user?.id,
        postId: post.id,
      });
    } catch (err) {
      console.error(err);
      setFavorited(!favorited);
      setFavoritesCount(favorited ? favoritesCount + 1 : favoritesCount - 1);
    }
  }

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
        <div className={styles.buttons}>
          <button className={styles.like} onClick={handleLike}>
            {liked ? <VscHeartFilled /> : <VscHeart />}
            <span>
              {likesCount} {likesCount === 1 ? "Like" : "Likes"}
            </span>
          </button>
          <button className={styles.favorite} onClick={handleFavorite}>
            {liked ? <VscStarFull /> : <VscStarEmpty />}
            <span>
              {favoritesCount} {favoritesCount === 1 ? "Favorite" : "Favorites"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
