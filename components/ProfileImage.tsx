import Image from "next/image";
import { VscAccount } from "react-icons/vsc";

type ProfileImageProps = {
  url: string;
  size?: number;
};

export default function ProfileImage({ url, size=30 }: ProfileImageProps) {
  if (url === "") return <VscAccount style={{ width: size, height: size }} />;

  return <Image src={url} alt={""} width={size} height={size} />;
}
