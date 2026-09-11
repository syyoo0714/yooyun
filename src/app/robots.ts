import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * 검색엔진 + 생성형 AI 크롤러 모두 허용(GEO). 관리자 화면만 막는다.
 * AI 봇을 따로 적는 것은 "허용"을 명시적으로 알리기 위해서다.
 */
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "Yeti", // 네이버
  "Daumoa", // 다음
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/"] },
      { userAgent: AI_BOTS, allow: "/", disallow: ["/admin/"] },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
