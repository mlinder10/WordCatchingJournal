"use client";
import { useRouter } from "next/navigation";
import { VscArrowLeft } from "react-icons/vsc";
import styles from "./edit.module.css";
import { useContext, useState } from "react";
import { UserContext } from "@/components/userProvider";
import ProfileImage from "@/components/ProfileImage";

export default function Edit() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>(user?.profileImageUrl || "");

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/auth/login");
  }

  return (
    <main className={styles.main}>
      <div>
        <h1>Edit Profile</h1>
        <button onClick={() => router.back()}>
          <VscArrowLeft />
          <span>Back</span>
        </button>
      </div>
      <div>
        <ProfileImage url={imageUrl} />
        <input
          type="file"
          name="myImage"
          accept=".png, .jpg, .jpeg"
          onChange={(e) => console.log(e.target.files)}
        />
      </div>
      <button onClick={logout}>Logout</button>
    </main>
  );
}
