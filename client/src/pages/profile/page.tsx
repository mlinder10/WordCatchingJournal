import { useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Post, User } from "../../types";
import axios from "axios";
import LoadableData from "../../components/loadable-data/loadable-data";
import PostView from "../../components/post-view/post-view";
import ProfilePic from "../../components/profile-pic/profile-pic";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";
import FollowModal from "./follow-modal";
import { FaEdit, FaSignOutAlt } from "react-icons/fa";
import BorderedButton from "../../components/bordered-button/bordered-button";
import LoadingButton from "../../components/loading-button/loading-button";

type UserResponse = {
  user: {
    id: string;
    username: string;
    profilePic: string;
    followers: number;
    following: number;
    posts: number;
  };
  posts: Post[];
  isFollowing: boolean;
};

export default function Page() {
  const { userId } = useParams();
  const { user: localUser } = useContext(AuthContext);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postCount, setPostCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showFollow, setShowFollow] = useState<
    "following" | "followers" | null
  >(null);

  async function fetchUser() {
    if (!localUser) {
      return;
    }

    setUserLoading(true);
    setUserError(null);
    try {
      const res = await axios.get<UserResponse>(
        `/api/users/${userId}/${localUser.id}`
      );
      setUser({
        id: res.data.user.id,
        username: res.data.user.username,
        token: "",
        profilePic: res.data.user.profilePic,
      });
      setPostCount(res.data.user.posts);
      setFollowerCount(res.data.user.followers);
      setFollowingCount(res.data.user.following);
      setPosts(res.data.posts);
      setFollowing(res.data.isFollowing);
    } catch (err) {
      console.error(err);
      setUserError("Failed to fetch user");
    } finally {
      setUserLoading(false);
    }
  }

  async function followUser() {
    if (localUser?.id === user?.id) {
      return;
    }
    setFollowLoading(true);
    try {
      if (following) {
        await axios.post("/api/follow/delete", {
          userId: localUser?.id,
          followedUserId: user?.id,
        });
        setFollowing(false);
      } else {
        await axios.post("/api/follow", {
          userId: localUser?.id,
          followedUserId: user?.id,
        });
        setFollowing(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFollowLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [localUser, userId]);

  if (!user) {
    return null;
  }

  return (
    <>
      <div className={styles.page}>
        <LoadableData loading={userLoading} error={userError}>
          <div className={styles.upper}>
            <div className={styles.profile}>
              <ProfilePic
                size={45}
                profilePic={user.profilePic}
                username={user.username}
              />
              <p className={styles.username}>{user?.username}</p>
            </div>
            <div className={styles.follows}>
              <div className={styles.follow}>
                <p>{postCount}</p>
                <p>Posts</p>
              </div>
              <button
                className={styles.follow}
                onClick={setShowFollow.bind(null, "followers")}
              >
                <p>{followerCount}</p>
                <p>Followers</p>
              </button>
              <button
                className={styles.follow}
                onClick={setShowFollow.bind(null, "following")}
              >
                <p>{followingCount}</p>
                <p>Following</p>
              </button>
            </div>
          </div>
          {userId === localUser?.id ? (
            <EditProfileButtons />
          ) : (
            <FollowButton
              following={following}
              toggleFollowing={followUser}
              loading={followLoading}
            />
          )}
          <div className={styles.posts}>
            {posts.map((post) => (
              <PostView key={post.id} post={post} />
            ))}
          </div>
        </LoadableData>
      </div>
      <FollowModal
        type={showFollow}
        userId={user.id}
        onClose={setShowFollow.bind(null, null)}
      />
    </>
  );
}

function EditProfileButtons() {
  const { logout } = useContext(AuthContext);

  return (
    <div className={styles["sub-header"]}>
      <BorderedButton
        type="secondary"
        onClick={() => {}}
        className={styles["edit-btn"]}
      >
        <FaEdit />
        <span>Edit Profile</span>
      </BorderedButton>
      <BorderedButton onClick={logout} className={styles["logout-btn"]}>
        <FaSignOutAlt />
        <span>Logout</span>
      </BorderedButton>
    </div>
  );
}

type FollowButtonProps = {
  following: boolean;
  toggleFollowing: () => void;
  loading: boolean;
};

function FollowButton({
  following,
  toggleFollowing,
  loading,
}: FollowButtonProps) {
  return (
    <div className={styles["sub-header"]}>
      <LoadingButton
        type={following ? "secondary" : "primary"}
        onClick={toggleFollowing}
        loading={loading}
        className={styles["follow-btn"]}
      >
        {following ? "Unfollow" : "Follow"}
      </LoadingButton>
    </div>
  );
}
