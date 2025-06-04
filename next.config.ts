// next.config.js
import type { NextConfig } from "next";
const withPWA = require('next-pwa')({
dest: 'public', // PWA ファイルの出力先ディレクトリ
disable: process.env.NODE_ENV === 'development', // 開発環境ではPWAを無効にする
});

const nextConfig: NextConfig = {
  /* ここに既存の Next.js の設定を記述します */
  // 例: reactStrictMode: true,
  // output: 'standalone', // Docker などでデプロイする場合に推奨される設定
};

// withPWA で nextConfig をラップしてエクスポートします
export default withPWA(nextConfig);