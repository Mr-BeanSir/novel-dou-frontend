import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { CategoriesProvider } from "@/providers/CategoriesProvider";
import { UserProvider } from "@/providers/UserProvider";
import { ToastProvider } from "@/providers/ToastProvider";

export const metadata: Metadata = {
  title: "读书豆 - 优质小说阅读平台",
  description: "读书豆是一个优质的小说阅读平台，提供海量小说资源，支持在线阅读、收藏、评论等功能。",
  keywords: "小说,阅读,在线小说,免费小说,小说网站",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 使用本地字体或备用字体，避免网络依赖 */}
      </head>
      <body className="antialiased min-h-screen font-serif">
        <ThemeProvider defaultTheme="system">
          <UserProvider>
            <CategoriesProvider>
              <ToastProvider>
                <div className="min-h-screen bg-light-bg dark:bg-dark-bg
                                text-light-text dark:text-dark-text
                                transition-colors duration-300">
                  <Header />
                  <main>{children}</main>
                <footer className="bg-light-bg-secondary dark:bg-dark-bg-secondary
                                 border-t border-light-border dark:border-dark-border
                                 py-8">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">
                      © 2025 读书豆. All rights reserved.
                    </p>
                  </div>
                </footer>
                </div>
              </ToastProvider>
            </CategoriesProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
