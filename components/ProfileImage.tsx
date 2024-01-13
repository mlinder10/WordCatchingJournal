import Image from "next/image";
import { useState } from "react";
import { VscAccount } from "react-icons/vsc";

type ProfileImageProps = {
  url: string;
};

export default function ProfileImage({ url  }: ProfileImageProps) {
  const [error, setError] = useState(false);
  if (url === "" || error)
    return <VscAccount style={{ width: "100%", height: "100%" }} />;

  return (
    <Image
      src={url}
      alt=""
      layout={"fill"}
      onError={() => setError(true)}
    />
  );
}
