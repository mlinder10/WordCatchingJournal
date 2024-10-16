import styles from "./styles.module.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { Post } from "../../types";
import { getApi } from "../../utils";
import LoadableData from "../../components/loadable-data/loadable-data";
import PostView from "../../components/post-view/post-view";

export default function Likes() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchPosts() {
    setLoading(true);
    setError(null);
    try {
      const res = await getApi().get<Post[]>(
        `/api/like/posts/${user?.id}?limit=10&offset=0`
      );
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className={styles.page}>
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
