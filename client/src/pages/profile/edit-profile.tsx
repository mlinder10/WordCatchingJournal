import { useContext, useState } from "react";
import Base64ImageUploader from "../../components/b64-image/b64-image-uploader";
import styles from "./edit-profile.module.css";
import { AuthContext } from "../../contexts/AuthProvider";
import { getApi } from "../../utils";
import LoadingButton from "../../components/loading-button/loading-button";

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
      // TODO: do something with
      await getApi().patch(`/api/users/${user.id}`, {
        username,
        profilePic: imgData,
      });
      updateUser({ ...user, username, profilePic: imgData });
    } catch (err) {
      console.error(err);
      setSaveError("Error saving changes");
      console.log(saveError); // TODO: remove
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
        <LoadingButton
          type="primary"
          onClick={handleSave}
          loading={saveLoading}
        >
          Save
        </LoadingButton>
        <button onClick={handleDiscard}>Discard</button>
      </div>
    </div>
  );
}
