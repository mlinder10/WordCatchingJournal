"use client";
import PostCell from "@/components/Post";
import { UserContext } from "@/components/userProvider";
import { Post } from "@/config/types";
import { useContext, useEffect, useState } from "react";
import styles from "./feed.module.css";
import LoadingView from "@/components/LoadingView";

export default function Feed() {
  const { user } = useContext(UserContext);
  const [type, setType] = useState<"recent" | "following">("recent");
  const [posts, setPosts] = useState<Post[] | "loading" | "error" | "empty">(
    "empty"
  );

  useEffect(() => {
    async function fetchFeed() {
      setPosts("loading");
      try {
        const response = await fetch(
          `/api/feed/${type}?following=${JSON.stringify(user?.following)}`
        );
        const data = await response.json();
        if (data.length === 0) return setPosts("empty");
        setPosts(data);
      } catch (err: any) {
        setPosts("error");
        console.error(err?.message);
      }
    }

    fetchFeed();
  }, [type, user?.following]);

  function updatePosts(post: Post) {
    if (posts === "loading" || posts === "error" || posts === "empty") return;
    let newPosts = [...posts];
    for (let i = 0; i < newPosts.length; i++) {
      if (newPosts[i].pid === post.pid) {
        newPosts[i] = post;
        break;
      }
    }
    setPosts(newPosts);
  }

  return (
    <main className={styles.main}>
      <h1>Feed</h1>
      <div className={styles.buttons}>
        <p
          className={type === "recent" ? styles.active : ""}
          onClick={() => setType("recent")}
        >
          Recent
        </p>
        <p
          className={type === "following" ? styles.active : ""}
          onClick={() => setType("following")}
        >
          Following
        </p>
      </div>
      <div className={styles.posts}>
        {posts === "loading" && <LoadingView />}
        {posts === "error" && <p>Error fetching posts</p>}
        {posts === "empty" && <p>No posts</p>}
        {posts !== "loading" &&
          posts !== "error" &&
          posts !== "empty" &&
          posts.map((post) => (
            <PostCell
              key={post.pid}
              post={post}
              user={user}
              updatePosts={updatePosts}
            />
          ))}
      </div>
    </main>
  );
}
