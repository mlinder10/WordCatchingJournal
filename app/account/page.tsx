"use client";
import { UserContext } from "@/components/userProvider";
import { useContext, useEffect, useState } from "react";
import styles from "./account.module.css";
import { Post } from "@/config/types";
import PostCell from "@/components/Post";
import ProfileImage from "@/components/ProfileImage";
import Link from "next/link";
import { VscSettings } from "react-icons/vsc";

export default function Account() {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      if (user === null) return;
      try {
        const response = await fetch(`/api/posts?uid=${user.uid}`);
        const data = await response.json();
        setPosts(data);
      } catch (err: any) {
        console.error(err?.message);
      }
    }
    fetchPosts();
  }, [user]);

  function updatePosts(post: Post) {
    let newPosts = [...posts];
    for (let i = 0; i < newPosts.length; i++) {
      if (newPosts[i].pid === post.pid) {
        newPosts[i] = post;
        break;
      }
    }
    setPosts(newPosts);
  }

  // should never happen, just makes typescript happy
  if (user === null) return <></>;

  return (
    <main className={styles.main}>
      <div className={styles.info}>
        <div className={styles["profile-info"]}>
          <ProfileImage url={user.profileImageUrl} size={60} />
          <div className={styles["profile-info-text"]}>
            <h1>{user.username}</h1>
            <Link href="/account/edit">
              <VscSettings />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>
        <div className={styles.stats}>
          <div>
            <p>Posts</p>
            <p>{posts.length}</p>
          </div>
          <div>
            <p>Following</p>
            <p>{user.following.length}</p>
          </div>
          <div>
            <p>Followers</p>
            <p>{user.followers.length}</p>
          </div>
        </div>
      </div>
      <div className={styles.posts}>
        {posts.map((post) => (
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
