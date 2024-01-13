"use client";
import ProfileImage from "@/components/ProfileImage";
import styles from "./follow.module.css";
import { useSearchParams } from "next/navigation";
import { User } from "@/config/types";
import { useEffect, useState } from "react";
import LoadingView from "@/components/LoadingView";
import Link from "next/link";

export default function Follow() {
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
  }, []);

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
          </div>
        </div>
        <div className={styles.buttons}>
          <div
            className={type === "following" ? styles.active : undefined}
            onClick={() => setType("following")}
          >
            <p>Following</p>
            <p>{user.following.length}</p>
          </div>
          <div
            className={type === "followers" ? styles.active : undefined}
            onClick={() => setType("followers")}
          >
            <p>Followers</p>
            <p>{user.followers.length}</p>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        {type === "followers" ? (
          <FollowList followList={followers} />
        ) : (
          <FollowList followList={following} />
        )}
      </div>
    </main>
  );
}

type FollowListProps = {
  followList: User[] | "loading" | "error";
};

function FollowList({ followList }: FollowListProps) {
  if (followList === "loading") return <LoadingView />;
  if (followList === "error") return <p>Error fetching users</p>;
  return followList.map((user) => <UserCell key={user.uid} user={user} />);
}

type UserCellProps = {
  user: User;
};

function UserCell({ user }: UserCellProps) {
  return (
    <Link href={`/user/${user.uid}`} className={styles.user} key={user.uid}>
      <div className={styles["user-info"]}>
        <div className={styles["user-img"]}>
          <ProfileImage url={user.profileImageUrl} />
        </div>
        <p className={styles.username}>{user.username}</p>
      </div>
      <div className={styles["user-stats"]}>
        <div>
          <p>Following</p>
          <p className={styles.following}>{user.following.length}</p>
        </div>
        <div>
          <p>Followers</p>
          <p className={styles.followers}>{user.followers.length}</p>
        </div>
      </div>
    </Link>
  );
}
