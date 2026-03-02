import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobFit - AI简历生成与岗位匹配",
  description: "智能岗位匹配与简历生成平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}