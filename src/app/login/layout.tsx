import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "登录 - 读书豆",
  description: "登录读书豆，开始您的阅读之旅",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 登录页面使用空布局，完全独立
  return <>{children}</>;
}
