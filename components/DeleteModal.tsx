import { Post } from "@/config/types";
import styles from "./styles/deletemodal.module.css";

type DeleteModalProps = {
  visible: boolean;
  close: () => void;
  post: Post | null;
  updateDelete: (post: Post) => void;
};

export default function DeleteModal({
  visible,
  close,
  post,
  updateDelete,
}: DeleteModalProps) {
  async function deletePost() {
    if (post === null) return;
    try {
      const response = await fetch(`/api/delete?pid=${post.pid}`, {
        method: "DELETE",
      });
      if (!response.ok) throw Error();
      updateDelete(post);
      close();
    } catch (err: any) {
      console.error(err?.message);
    }
  }
  return (
    <div className={`${styles.container} ${visible ? styles.visible : ""}`}>
      <div className={styles["inner-container"]}>
        <p>
          Are you sure you want to delete{" "}
          <span className={styles.word}>"{post?.word}"</span>?
        </p>
        <div className={styles.btns}>
          <button onClick={deletePost}>Delete</button>
          <button onClick={close}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
