import styles from "./styles.module.css";
import { useContext, useEffect, useState } from "react";
import { Post } from "../../types";
import axios from "axios";
import LoadableData from "../../components/loadable-data/loadable-data";
import PostView from "../../components/post-view/post-view";
import { AuthContext } from "../../contexts/AuthProvider";

async function fetchRecentPosts(
  limit: number,
  offset: number
): Promise<Post[]> {
  const res = await axios.get<Post[]>(
    `/api/posts?limit=${limit}&offset=${offset}`
  );
  return res.data;
}

async function fetchFollowingPosts(
  userId: string,
  limit: number,
  offset: number
): Promise<Post[]> {
  const res = await axios.get<Post[]>(
    `/api/posts/following/${userId}?limit=${limit}&offset=${offset}`
  );
  return res.data;
}

export default function Page() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<"recent" | "following">("recent");

  async function fetchPosts(clear: boolean = false) {
    setLoading(true);
    setError(null);
    try {
      if (page === "recent") {
        const res = await fetchRecentPosts(10, 0);
        if (clear) {
          setPosts(res);
        } else {
          setPosts([...posts, ...res]);
        }
      } else if (page === "following") {
        const res = await fetchFollowingPosts(user?.id as string, 10, 0);
        if (clear) {
          setPosts(res);
        } else {
          setPosts([...posts, ...res]);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts(true);
  }, [page]);

  return (
    <div className={styles.page}>
      <div className={styles.buttons}>
        <button onClick={setPage.bind(null, "recent")}>
          <p className={page === "recent" ? styles.active : ""}>Recent</p>
        </button>
        <button onClick={setPage.bind(null, "following")}>
          <p className={page === "following" ? styles.active : ""}>Following</p>
        </button>
      </div>
      <LoadableData loading={loading} error={error}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <PostView key={post.id} post={post} />
          ))}
        </div>
      </LoadableData>
    </div>
  );
}
