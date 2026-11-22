import type { NextRequest } from "next/server";

/**
 * 방문 기록 — 15일 유입 분석 보고서(supabase/analytics.sql 의 page_views)용.
 * proxy 에서 응답을 늦추지 않도록 waitUntil 로 보낸다. 실패해도 사이트에는 영향이 없다.
 * IP 원문은 저장하지 않고, 하루 단위 해시(visitor)만 남긴다.
 */

// 검색·AI 크롤러 이름표. 앞에 있는 것이 먼저 잡힌다.
const BOTS: [RegExp, string][] = [
  [/GPTBot/i, "GPTBot"],
  [/OAI-SearchBot/i, "OAI-SearchBot"],
  [/ChatGPT-User/i, "ChatGPT-User"],
  [/ClaudeBot/i, "ClaudeBot"],
  [/Claude-(User|SearchBot|Web)/i, "Claude-User"],
  [/anthropic-ai/i, "ClaudeBot"],
  [/PerplexityBot/i, "PerplexityBot"],
  [/Perplexity-User/i, "Perplexity-User"],
  [/Google-Extended|GoogleOther/i, "GoogleOther"],
  [/Googlebot|Google-InspectionTool|Storebot-Google/i, "Googlebot"],
  [/bingbot|BingPreview/i, "Bingbot"],
  [/Yeti|Naverbot/i, "Naver(Yeti)"],
  [/Daum|Daumoa/i, "Daum"],
  [/Applebot/i, "Applebot"],
  [/Bytespider/i, "Bytespider"],
  [/meta-externalagent|facebookexternalhit|facebookcatalog/i, "Meta"],
  [/CCBot/i, "CCBot"],
  [/Amazonbot/i, "Amazonbot"],
  [/YandexBot/i, "Yandex"],
  [/DuckDuckBot/i, "DuckDuckGo"],
  // 261120 카톡 안에서 연 화면(브라우저 이름에 KAKAOTALK)은 사람이다 — 미리보기 봇(kakaotalk-scrap)만 잡는다.
  [/kakaotalk-scrap/i, "Kakao미리보기"],
  [/Slackbot|Twitterbot|LinkedInBot|TelegramBot|Discordbot|WhatsApp/i, "링크미리보기"],
  [/bot|crawl|spider|slurp|scrapy|python-requests|curl|wget|httpclient|headless|lighthouse/i, "기타봇"],
];

const SALT = "seoyeonpapa-pv-2611";

function cut(s: string | null | undefined, n: number) {
  if (!s) return null;
  return s.length > n ? s.slice(0, n) : s;
}

async function dailyHash(ip: string, ua: string) {
  const day = new Date().toISOString().slice(0, 10);
  const data = new TextEncoder().encode(`${SALT}|${day}|${ip}|${ua}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .slice(0, 12)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function device(ua: string) {
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile";
  return "desktop";
}

/** 기록할 요청이면 행을 만들어 돌려준다. 기록하지 않을 요청이면 null. */
export async function buildView(request: NextRequest) {
  if (request.method !== "GET") return null;
  const h = request.headers;
  const { pathname, searchParams } = request.nextUrl;
  if (pathname.startsWith("/admin") || pathname.startsWith("/api") || pathname.startsWith("/_vercel")) return null;

  const prefetch =
    h.get("next-router-prefetch") ||
    /prefetch/i.test(h.get("purpose") || "") ||
    /prefetch/i.test(h.get("sec-purpose") || "");
  if (prefetch) return null;

  const ua = h.get("user-agent") || "";
  const bot = BOTS.find(([re]) => re.test(ua))?.[1] ?? (ua ? null : "기타봇");
  const isRsc = h.get("rsc") === "1";
  const isDoc = (h.get("accept") || "").includes("text/html");
  const isMeta = /^\/(llms\.txt|robots\.txt|sitemap\.xml)$/.test(pathname);

  let kind: "page" | "nav" | "bot";
  if (bot) {
    if (isRsc) return null;
    kind = "bot";
  } else if (isRsc) {
    kind = "nav";
  } else if (isDoc) {
    kind = "page";
  } else if (isMeta) {
    kind = "page";
  } else {
    return null;
  }

  let refHost: string | null = null;
  let refPath: string | null = null;
  const ref = h.get("referer");
  if (ref) {
    try {
      const u = new URL(ref);
      refHost = u.hostname.replace(/^www\./, "");
      refPath = u.pathname;
    } catch {
      /* 잘못된 referer 는 버린다 */
    }
  }

  const ip = (h.get("x-forwarded-for") || "").split(",")[0].trim() || h.get("x-real-ip") || "";
  let city = h.get("x-vercel-ip-city");
  if (city) {
    try {
      city = decodeURIComponent(city);
    } catch {
      /* 그대로 둔다 */
    }
  }

  let path = pathname;
  try {
    path = decodeURIComponent(pathname);
  } catch {
    /* 그대로 둔다 */
  }

  return {
    kind,
    path: cut(path, 300),
    ref_host: cut(refHost, 120),
    ref_path: cut(refPath, 300),
    utm_source: cut(searchParams.get("utm_source"), 60),
    utm_medium: cut(searchParams.get("utm_medium"), 60),
    utm_campaign: cut(searchParams.get("utm_campaign"), 100),
    bot: cut(bot, 40),
    device: bot ? null : device(ua),
    country: cut(h.get("x-vercel-ip-country"), 4),
    region: cut(h.get("x-vercel-ip-country-region"), 10),
    city: cut(city, 60),
    visitor: bot ? null : await dailyHash(ip, ua),
  };
}

export async function sendView(row: Record<string, unknown>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return;
  try {
    await fetch(`${url}/rest/v1/page_views`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
    });
  } catch {
    /* 기록 실패는 무시한다 */
  }
}
