"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

/**
 * 공개 페이지에는 Header/Footer를 씌우고 관리자(/admin)에는 씌우지 않는다.
 * (관리자는 자체 전체화면 레이아웃 사용)
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      <a className="skip-link" href="#main">본문 바로가기</a>
      <Header />
      <main id="main" style={{ flex: 1 }}>{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
