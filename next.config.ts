import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // 禁用严格模式以避免开发环境下的重复Effect执行
};

export default nextConfig;
