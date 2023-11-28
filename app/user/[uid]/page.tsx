"use client";
import LoadingView from "@/components/LoadingView";
import { UserContext } from "@/components/userProvider";
import { Post, User as UserType } from "@/config/types";
import { redirect, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { VscArrowLeft } from "react-icons/vsc";
import styles from "./user.module.css";
import PostCell from "@/components/Post";
import ProfileImage from "@/components/ProfileImage";

type UserProps = {
  params: {
    uid: string;
  };
};

export default function User({ params }: UserProps) {
  const { user } = useContext(UserContext);
  const router = useRouter();
  if (user?.uid === params.uid) redirect("/account");
  const [pageUser, setPageUser] = useState<UserType | "loading" | "error">(
    "loading"
  );
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      if (pageUser === "error" || pageUser === "loading") return;
      try {
        const response = await fetch(`/api/posts?uid=${params.uid}`);
        const data = await response.json();
        setPosts(data);
      } catch (err: any) {
        console.error(err?.message);
      }
    }
    fetchPosts();
  }, [pageUser, params.uid]);

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch("/api/user", {
        headers: {
          uid: params.uid,
        },
      });
      const data = await response.json();
      setPageUser(data);
    }
    fetchUser();
  }, [params.uid]);

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

  if (pageUser === "loading") return <LoadingView />;

  if (pageUser === "error")
    return (
      <main className={styles.main}>
        <p>Error fetching user</p>
        <button onClick={() => router.back()}>
          <VscArrowLeft />
          <span>Back</span>
        </button>
      </main>
    );

  return (
    <main className={styles.main}>
      <div className={styles.info}>
        <div className={styles["profile-info"]}>
          <ProfileImage url={pageUser.profileImageUrl} size={60} />
          <div className={styles["profile-info-text"]}>
            <h1>{pageUser.username}</h1>
            <button onClick={() => router.back()}>
              <VscArrowLeft />
              <span>Back</span>
            </button>
          </div>
        </div>
        <div className={styles.stats}>
          <div>
            <p>Posts</p>
            <p>{posts.length}</p>
          </div>
          <div>
            <p>Following</p>
            <p>{pageUser.following.length}</p>
          </div>
          <div>
            <p>Followers</p>
            <p>{pageUser.followers.length}</p>
          </div>
        </div>
      </div>
      <div className={styles.posts}>
        {posts.map((post) => (
          <PostCell
            key={post.pid}
            post={post}
            user={pageUser}
            updatePosts={updatePosts}
          />
        ))}
      </div>
    </main>
  );
}
