"use client";
import { UserContext } from "@/components/userProvider";
import { useContext, useEffect, useState } from "react";
import styles from "./account.module.css";
import { Post } from "@/config/types";
import PostCell from "@/components/Post";
import ProfileImage from "@/components/ProfileImage";
import Link from "next/link";
import { VscSettings } from "react-icons/vsc";
import LoadingView from "@/components/LoadingView";
import DeleteModal from "@/components/DeleteModal";

type DeleteModal = {
  visible: boolean;
  post: Post | null;
};

export default function Account() {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState<Post[] | "loading" | "error" | "empty">(
    "loading"
  );
  const [deleteModal, setDeleteModal] = useState<DeleteModal>({
    visible: false,
    post: null,
  });

  useEffect(() => {
    async function fetchPosts() {
      if (user === null) return;
      setPosts("loading");
      try {
        const response = await fetch(`/api/posts?uid=${user.uid}`);
        if (!response.ok) throw Error();
        const data = await response.json();
        if (data.length === 0) return setPosts("empty");
        setPosts(data);
      } catch (err: any) {
        setPosts("error");
        console.error(err?.message);
      }
    }
    fetchPosts();
  }, [user]);

  function updateLike(post: Post) {
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

  function updateDelete(post: Post) {
    if (posts === "loading" || posts === "error" || posts === "empty") return;
    setPosts(posts.filter((p) => p.pid !== post.pid));
  }

  // should never happen, just makes typescript happy
  if (user === null) return <></>;

  return (
    <main className={styles.main}>
      <div className={styles.info}>
        <div className={styles["profile-info"]}>
          <div className={styles.img}>
            <ProfileImage url={user.profileImageUrl} />
          </div>
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
            <p>
              {posts === "loading" || posts === "error" || posts === "empty"
                ? 0
                : posts.length}
            </p>
          </div>
          <Link
            href={{
              pathname: "/follow",
              query: { type: "following", user: JSON.stringify(user) },
            }}
          >
            <p>Following</p>
            <p>{user.following.length}</p>
          </Link>
          <Link
            href={{
              pathname: "/follow",
              query: { type: "followers", user: JSON.stringify(user) },
            }}
          >
            <p>Followers</p>
            <p>{user.followers.length}</p>
          </Link>
        </div>
      </div>
      <div className={styles.posts}>
        {posts === "loading" && <LoadingView />}
        {posts === "error" && <p>Error fetching posts</p>}
        {posts === "empty" && <p>No posts yet</p>}
        {posts !== "loading" &&
          posts !== "error" &&
          posts !== "empty" &&
          posts.map((post) => (
            <PostCell
              key={post.pid}
              post={post}
              user={user}
              updateLike={updateLike}
              deleteFunc={() => setDeleteModal({ visible: true, post })}
              owned
            />
          ))}
      </div>
      <DeleteModal
        visible={deleteModal.visible}
        close={() => setDeleteModal({ visible: false, post: null })}
        post={deleteModal.post}
        updateDelete={updateDelete}
      />
    </main>
  );
}
