import { useContext, useState } from "react";
import Base64ImageUploader from "../../components/b64-image/b64-image-uploader";
import styles from "./edit-profile.module.css";
import { AuthContext } from "../../contexts/AuthProvider";
import { getApi } from "../../utils";

export default function EditProfile() {
  const { user, updateUser } = useContext(AuthContext);
  const [imgData, setImgData] = useState<string | null>(
    user?.profilePic || null
  );
  const [username, setUsername] = useState<string>(user?.username ?? "");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function handleDiscard() {
    setImgData(user?.profilePic || null);
    setUsername(user?.username ?? "");
  }

  async function handleSave() {
    if (!user) {
      return;
    }
    setSaveLoading(true);
    setSaveError(null);
    try {
      const res = await getApi().patch(`/api/users/${user.id}`, {
        username,
        profilePic: imgData,
      });
      updateUser({ ...user, username, profilePic: imgData });
    } catch (err) {
      console.error(err);
      setSaveError("Error saving changes");
    } finally {
      setSaveLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <Base64ImageUploader data={imgData} setData={setImgData} />
      <input
        placeholder="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleDiscard}>Discard</button>
      </div>
    </div>
  );
}
