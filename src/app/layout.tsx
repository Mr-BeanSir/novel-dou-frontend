import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { UserProvider } from "@/providers/UserProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { getServerUser } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "读书豆 - 优质小说阅读平台",
  description: "读书豆是一个优质的小说阅读平台，提供海量小说资源，支持在线阅读、收藏、评论等功能。",
  keywords: "小说,阅读,在线小说,免费小说,小说网站",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getServerUser();

  return (
    <html lang="zh-CN">
      <head>
        {/* 使用本地字体或备用字体，避免网络依赖 */}
      </head>
      <body className="antialiased min-h-screen font-serif">
        <ThemeProvider defaultTheme="system">
          <UserProvider serverUser={user}>
            <ToastProvider>
              <ScrollToTop />
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </ToastProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
