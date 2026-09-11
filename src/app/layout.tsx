import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import JsonLd from "@/components/JsonLd";
import { SITE, absUrl } from "@/lib/site";
import { siteGraph } from "@/lib/seo";

/**
 * 전역 기본값. canonical 은 여기 두지 않는다 — 두면 canonical 을 빠뜨린 하위 페이지가
 * 전부 홈을 가리키게 된다. 페이지마다 lib/seo.ts 의 pageMeta() 로 넣는다.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  authors: [{ name: "유연", url: absUrl("/profile") }],
  creator: "유연",
  publisher: "법무법인 리브로",
  formatDetection: { telephone: false, email: false, address: false },
  title: {
    default: "유연 변호사 · 변리사 | 법무법인 리브로",
    template: "%s | 유연 변호사",
  },
  description:
    "유연 변호사·변리사. 서울대 전기공학부, 변리사 7년, 성균관대 법학전문대학원 수석 졸업. 특허침해소송·영업비밀·전직금지·디자인·상표 등 지식재산 및 기술분쟁을 다룹니다.",
  keywords: [
    "유연 변호사",
    "변리사 출신 변호사",
    "법무법인 리브로",
    "특허침해소송",
    "심결취소소송",
    "영업비밀",
    "산업기술보호",
    "전직금지",
    "직무발명",
    "IP 실사",
  ],
  openGraph: {
    title: "유연 변호사 · 변리사 | 법무법인 리브로",
    description: "청구항을 직접 읽는 지식재산 · 기술분쟁 변호사.",
    siteName: SITE.name,
    type: "profile",
    locale: "ko_KR",
    images: [{ url: "/portrait-sq-960.jpg", width: 960, height: 960, alt: "유연 변호사 · 변리사" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
      </head>
      <body>
        <JsonLd data={siteGraph()} />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
