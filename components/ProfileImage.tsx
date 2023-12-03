import Image from "next/image";
import { useState } from "react";
import { VscAccount } from "react-icons/vsc";

type ProfileImageProps = {
  url: string;
  size?: number;
};

export default function ProfileImage({ url, size = 30 }: ProfileImageProps) {
  const [error, setError] = useState(false);
  if (url === "" || error)
    return <VscAccount style={{ width: size, height: size }} />;

  return (
    <Image
      src={url}
      alt=""
      onError={() => setError(true)}
      width={size}
      height={size}
      style={{ borderRadius: size }}
    />
  );
}
