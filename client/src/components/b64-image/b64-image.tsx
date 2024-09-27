export type ImageType = "png" | "jpg" | "jpeg" | "gif" | "webp";

type Base64ImageProps = {
  data: string | null;
  type?: ImageType;
  style?: React.CSSProperties | undefined;
};

export default function B64Image({
  data,
  type = "png",
  style,
}: Base64ImageProps) {
  if (!data) return null;

  const binaryString = atob(data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([bytes.buffer], { type: `image/${type}` });
  const url = URL.createObjectURL(blob);

  return (
    <img
      src={url}
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
        ...style,
      }}
    />
  );
}
