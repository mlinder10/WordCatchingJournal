import type { Metadata } from "next";
import "./globals.css";
import UserProvider from "@/components/userProvider";
import Sidenav from "@/components/Sidenav";

export const metadata: Metadata = {
  title: "Word Catching Journal",
  description: "Log your words!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <UserProvider>
        <body>
          <Sidenav />
          <div style={{ width: "100%", height: "100%" }}>{children}</div>
        </body>
      </UserProvider>
    </html>
  );
}
