import type { MetadataRoute } from "next";
import { absUrl, notePath } from "@/lib/site";
import { getNotes } from "@/lib/notes";

/** 정적 페이지 + 기업법 노트 전편. 네이버 서치어드바이저 · 구글 서치콘솔에 이 주소를 제출한다. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const notes = await getNotes();
  const latest = notes.map((n) => n.publishedAt).sort().at(-1);
  const now = new Date();

  const pages: { path: string; priority: number; freq: "weekly" | "monthly" }[] = [
    { path: "/", priority: 1, freq: "weekly" },
    { path: "/profile", priority: 0.9, freq: "monthly" },
    { path: "/practice", priority: 0.9, freq: "monthly" },
    { path: "/faq", priority: 0.8, freq: "monthly" },
    { path: "/cases", priority: 0.8, freq: "monthly" },
    { path: "/cv", priority: 0.7, freq: "monthly" },
    { path: "/notes", priority: 0.8, freq: "weekly" },
    { path: "/contact", priority: 0.6, freq: "monthly" },
  ];

  return [
    ...pages.map((p) => ({
      url: absUrl(p.path),
      lastModified: p.path === "/notes" && latest ? new Date(latest) : now,
      changeFrequency: p.freq,
      priority: p.priority,
    })),
    ...notes.map((n) => ({
      url: absUrl(notePath(n.slug)),
      lastModified: n.publishedAt ? new Date(n.publishedAt) : now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
