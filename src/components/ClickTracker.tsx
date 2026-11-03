"use client";

import { useEffect } from "react";

/**
 * 연락·외부 링크 클릭 기록 — 15일 유입 분석 보고서의 「연락 행동」 지표.
 * 전화·메일·카카오·로톡·블로그 등으로 나가는 클릭만 page_views(kind='click')에 남긴다.
 */
function label(href: string) {
  if (href.startsWith("tel:")) return "전화";
  if (href.startsWith("mailto:")) return "메일";
  if (/kakao/i.test(href)) return "카카오톡";
  if (/lawtalk\.co\.kr/i.test(href)) return "로톡";
  if (/blog\.naver\.com/i.test(href)) return "네이버블로그";
  if (/lawlebro\.com/i.test(href)) return "리브로홈페이지";
  if (/linkedin\.com/i.test(href)) return "링크드인";
  if (/facebook\.com/i.test(href)) return "페이스북";
  return null;
}

export default function ClickTracker() {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    function onClick(e: MouseEvent) {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      const href = a?.getAttribute("href") || "";
      let target = label(href);
      if (!target && /^https?:\/\//.test(href) && !href.includes(location.hostname)) target = "기타외부";
      if (!target) return;
      let path = location.pathname;
      try {
        path = decodeURIComponent(path);
      } catch {
        /* 그대로 둔다 */
      }
      fetch(`${url}/rest/v1/page_views`, {
        method: "POST",
        keepalive: true,
        headers: {
          apikey: key!,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ kind: "click", path: path.slice(0, 300), target: `${target}|${href}`.slice(0, 300) }),
      }).catch(() => undefined);
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
