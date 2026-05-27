import type { Metadata } from "next";

import { DesktopCloseGuard } from "@/components/desktop/desktop-close-guard";

import "./globals.css";

export const metadata: Metadata = {
  title: "今日轨迹",
  description: "用专注记录看见今天做了哪些事。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <DesktopCloseGuard />
        {children}
      </body>
    </html>
  );
}
