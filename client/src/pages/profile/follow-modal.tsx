import styles from "./follow-modal.module.css";
import { useEffect, useState } from "react";
import LoadableData from "../../components/loadable-data/loadable-data";
import { FaX } from "react-icons/fa6";
import BorderedButton from "../../components/bordered-button/bordered-button";
import ProfilePic from "../../components/profile-pic/profile-pic";
import { getApi } from "../../utils";
import { Link } from "react-router-dom";

type UserResponse = {
  id: string;
  username: string;
  profilePic: string | null;
  postsCount: number;
  followersCount: number;
  followingCount: number;
};

type FollowModalProps = {
  userId: string;
  type: "following" | "followers" | null;
  onClose: () => void;
};

export default function FollowModal({
  userId,
  type,
  onClose,
}: FollowModalProps) {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  async function fetchUsers(clear: boolean = false) {
    console.log(type);
    setUsersLoading(true);
    setUsersError(null);
    try {
      const res = await getApi().get<UserResponse[]>(
        `/api/follow/${type}/${userId}?limit=10&offset=${users.length}`
      );
      const newUsers = clear ? res.data : [...users, ...res.data];
      setUsers(newUsers);
    } catch (err) {
      console.error(err);
      setUsersError("Failed to fetch users");
    } finally {
      setUsersLoading(false);
    }
  }

  useEffect(() => {
    if (type !== null) {
      fetchUsers(true);
    }
  }, [type]);

  if (!type) {
    return null;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.container}>
        <div className={styles.header}>
          <BorderedButton
            onClick={onClose}
            type="secondary"
            className={styles.close}
          >
            <FaX />
            <span>Close</span>
          </BorderedButton>
          <p className={styles.title}>{type}</p>
        </div>
        <LoadableData loading={usersLoading} error={usersError}>
          <div>
            {users.map((u) => (
              <UserView key={u.id} user={u} />
            ))}
          </div>
        </LoadableData>
      </div>
    </div>
  );
}

type UserViewProps = {
  user: UserResponse;
};

function UserView({ user }: UserViewProps) {
  return (
    <Link to={`/profile/${user.id}`} className={styles["user-link"]}>
      <div className={styles["user-cell"]}>
        <div className={styles["user-info"]}>
          <ProfilePic profilePic={user.profilePic} username={user.username} />
          <p>{user.username}</p>
        </div>
        <div className={styles["user-stats"]}>
          <div className={styles.stat}>
            <span>{user.postsCount}</span>
            <span>Posts</span>
          </div>
          <div className={styles.stat}>
            <span>{user.followersCount}</span>
            <span>Followers</span>
          </div>
          <div className={styles.stat}>
            <span>{user.followingCount}</span>
            <span>Following</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
