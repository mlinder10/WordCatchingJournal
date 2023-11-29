"use client";
import ProfileImage from "@/components/ProfileImage";
import styles from "./follow.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { VscArrowLeft } from "react-icons/vsc";
import { User } from "@/config/types";
import { useEffect, useState } from "react";
import LoadingView from "@/components/LoadingView";
import Link from "next/link";

export default function Follow() {
  const router = useRouter();
  const params = useSearchParams();
  const user = (JSON.parse(params.get("user") || "null") as User) || null;
  const [type, setType] = useState<"followers" | "following">(
    (params.get("type") as "following") || "follwoing" || "followers"
  );
  const [followers, setFollowers] = useState<User[] | "loading" | "error">(
    "loading"
  );
  const [following, setFollowing] = useState<User[] | "loading" | "error">(
    "loading"
  );

  useEffect(() => {
    async function fetchUsers() {
      if (user === null) return;
      setFollowers("loading");
      setFollowing("loading");
      try {
        const response = await fetch(`/api/follow`, {
          headers: { uid: user.uid },
        });
        if (!response.ok) throw Error();
        const data = await response.json();
        setFollowers(data.followers);
        setFollowing(data.following);
      } catch (err: any) {
        setFollowers("error");
        setFollowing("error");
        console.error(err?.message);
      }
    }
    fetchUsers();
  }, [user]);

  if (user === null) return <></>;

  return (
    <main>
      <div className={styles.info}>
        <div className={styles["profile-info"]}>
          <ProfileImage url={user.profileImageUrl} size={60} />
          <div className={styles["profile-info-text"]}>
            <h1>{user.username}</h1>
            <button onClick={() => router.back()}>
              <VscArrowLeft />
              <span>Back</span>
            </button>
          </div>
        </div>
        <div className={styles.buttons}>
          <button
            className={type === "following" ? styles.active : undefined}
            onClick={() => setType("following")}
          >
            Following
          </button>
          <button
            className={type === "followers" ? styles.active : undefined}
            onClick={() => setType("followers")}
          >
            Followers
          </button>
        </div>
      </div>
      <div className={styles.container}>
        <Followers type={type} followers={followers} />
        <Following type={type} following={following} />
      </div>
    </main>
  );
}

type FollowersProps = {
  type: string;
  followers: User[] | "loading" | "error";
};

function Followers({ type, followers }: FollowersProps) {
  if (type !== "followers") return <></>;
  if (followers === "loading") return <LoadingView />;
  if (followers === "error") return <p>Error fetching followers</p>;
  return followers.map((user) => (
    <Link href={`/user/${user.uid}`} className={styles.user} key={user.uid}>
      <ProfileImage url={user.profileImageUrl} size={40} />
      <p>{user.username}</p>
    </Link>
  ));
}

type FollowingProps = {
  type: string;
  following: User[] | "loading" | "error";
};

function Following({ type, following }: FollowingProps) {
  if (type !== "following") return <></>;
  if (following === "loading") return <LoadingView />;
  if (following === "error") return <p>Error fetching following</p>;
  return following.map((user) => (
    <Link href={`/user/${user.uid}`} className={styles.user} key={user.uid}>
      <ProfileImage url={user.profileImageUrl} size={40} />
      <p>{user.username}</p>
    </Link>
  ));
}
