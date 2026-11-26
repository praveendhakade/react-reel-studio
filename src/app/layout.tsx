import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

export const metadata: Metadata = {
  title: "React Reel Studio — Code content, made beautiful",
  description: "Create polished, syntax highlighted code reels for Instagram.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body><AppRouterCacheProvider>{children}</AppRouterCacheProvider></body>
    </html>
  );
}
