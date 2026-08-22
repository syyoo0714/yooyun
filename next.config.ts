import type { NextConfig } from "next";

/**
 * 유연 변호사 홈페이지 — 서버 렌더링 앱(Vercel 배포 전제).
 * 관리자(/admin) 로그인·저장과 Supabase 세션 쿠키 갱신을 위해 서버가 필요하다.
 * (정적 export를 쓰지 않는 이유)
 */
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
