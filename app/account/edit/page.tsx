"use client";
import { useRouter } from "next/navigation";
import { BiLogOut } from "react-icons/bi";
import styles from "./edit.module.css";
import { ChangeEvent, useContext, useState } from "react";
import { UserContext } from "@/components/userProvider";
import { User } from "@/config/types";

export default function Edit() {
  const { user, setUser } = useContext(UserContext);
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/auth/login");
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setImage(file);
  }

  async function uploadImageToCloudinary() {
    if (!image || !user) return;
    try {
      const url = `https://api.cloudinary.com/v1_1/dfh4arkeh/upload`;
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "kfffjhdp");

      const fetched = await fetch(url, {
        method: "POST",
        body: data,
      });
      const parsed = await fetched.json();
      let newUser = new User(
        user.uid,
        user.email,
        user.username,
        user.password,
        user.followers,
        user.following,
        parsed.secure_url
      );
      setUser(newUser);
      await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: newUser }),
      });
    } catch (err: any) {
      console.error(err?.message);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>Edit Profile</h1>
        <button className={styles.logout} onClick={logout}>
          <BiLogOut />
          <span>Logout</span>
        </button>
      </div>
      <div>
        <input
          type="file"
          name="myImage"
          accept=".png, .jpg, .jpeg"
          onChange={handleImageChange}
        />
        <button onClick={uploadImageToCloudinary}>Upload</button>
      </div>
    </main>
  );
}
