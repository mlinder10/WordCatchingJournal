import { ReactNode } from "react";

type InfiniteScrollProps = {
  children: ReactNode;
  onScrollToBottom: () => void;
};

export default function InfiniteScroll({
  children,
  onScrollToBottom,
}: InfiniteScrollProps) {
  const ref = (node: HTMLDivElement) => {
    if (!node) return;

    node.addEventListener("scroll", handleScroll);

    return () => {
      node.removeEventListener("scroll", handleScroll);
    };
  };

  function handleScroll(e: Event) {
    const { scrollTop, scrollHeight, clientHeight } =
      e.target as HTMLDivElement;

    if (scrollTop + clientHeight >= scrollHeight) {
      console.log("scrolled");
      onScrollToBottom();
    }
  }

  return (
    <div
      ref={ref}
      style={{ width: "100%", height: "100%", overflowY: "scroll" }}
    >
      {children}
    </div>
  );
}
