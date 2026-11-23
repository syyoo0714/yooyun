import "server-only";
import fs from "node:fs";
import path from "node:path";
import generated from "@/data/notes.generated.json";

/**
 * 노트(발행 원고) 데이터 계층.
 *
 * 1순위 = Supabase `notes` 테이블 (관리자가 편집한 최신본)
 * 폴백  = scripts/import-notes.mjs 가 만든 로컬 사본
 *         (메타 = src/data/notes.generated.json · 본문 = content/notes/<slug>.txt)
 *
 * 폴백을 두는 이유: 환경변수·DB 없이도 사이트가 그대로 뜬다.
 */

export type SeriesKey = "corporate" | "essay" | "ipfinance";

export type NoteMeta = {
  slug: string;
  title: string;
  seriesKey: SeriesKey;
  seriesLabel: string;
  dek: string;
  summary: string[];
  tags: string[];
  publishedAt: string;
  sourceFile?: string;
  chars?: number;
};

export type Note = NoteMeta & { body: string };

export const SERIES_LABEL: Record<SeriesKey, string> = {
  corporate: "유연의 기업법 노트",
  essay: "유연의 노트",
  ipfinance: "IP 금융",
};

const localMeta = generated as NoteMeta[];

const BODY_DIR = path.join(process.cwd(), "content", "notes");

function readLocalBody(slug: string): string {
  try {
    return fs.readFileSync(path.join(BODY_DIR, `${slug}.txt`), "utf8");
  } catch {
    return "";
  }
}

/** 환경변수가 있을 때만 DB를 쓴다. 없으면 조용히 폴백. */
async function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(url, key);
}

export async function getNotes(): Promise<NoteMeta[]> {
  try {
    const client = await db();
    if (!client) return localMeta;
    const { data, error } = await client
      .from("notes")
      .select("slug, title, series_key, series_label, dek, summary, tags, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (error || !data || data.length === 0) return localMeta;
    return data.map((r) => ({
      slug: r.slug,
      title: r.title,
      seriesKey: (r.series_key ?? "essay") as SeriesKey,
      seriesLabel: r.series_label ?? SERIES_LABEL[(r.series_key ?? "essay") as SeriesKey],
      dek: r.dek ?? "",
      summary: (r.summary ?? []) as string[],
      tags: (r.tags ?? []) as string[],
      publishedAt: r.published_at ?? "",
    }));
  } catch {
    return localMeta;
  }
}

export async function getNote(slug: string): Promise<Note | null> {
  const decoded = decodeURIComponent(slug);

  try {
    const client = await db();
    if (client) {
      const { data, error } = await client
        .from("notes")
        .select("slug, title, series_key, series_label, dek, summary, tags, published_at, body, source_file")
        .eq("slug", decoded)
        .eq("is_published", true)
        .maybeSingle();
      if (!error && data) {
        return {
          slug: data.slug,
          title: data.title,
          seriesKey: (data.series_key ?? "essay") as SeriesKey,
          seriesLabel:
            data.series_label ?? SERIES_LABEL[(data.series_key ?? "essay") as SeriesKey],
          dek: data.dek ?? "",
          summary: (data.summary ?? []) as string[],
          tags: (data.tags ?? []) as string[],
          publishedAt: data.published_at ?? "",
          sourceFile: data.source_file ?? undefined,
          body: data.body ?? "",
        };
      }
    }
  } catch {
    // 폴백으로 진행
  }

  const meta = localMeta.find((n) => n.slug === decoded);
  if (!meta) return null;
  return { ...meta, body: readLocalBody(meta.slug) };
}

/** 같은 시리즈의 인접 글 */
export async function getRelatedNotes(note: NoteMeta, limit = 4): Promise<NoteMeta[]> {
  const all = await getNotes();
  return all
    .filter((n) => n.slug !== note.slug && n.seriesKey === note.seriesKey)
    .slice(0, limit);
}

/**
 * 발행 원고 본문 → 화면 블록.
 * 원고는 네이버 발행형 평문이라 마크다운이 아니다. 실제 쓰이는 표지만 해석한다.
 *   ━━━ 구분선 · "▣ PART" 소제목 · "★" 강조문 · 그 밖은 문단
 * 3줄 요약·해시태그·서명은 페이지가 따로 렌더하므로 본문에서 걷어낸다.
 */
export type Block =
  | { kind: "rule" }
  | { kind: "part"; text: string }
  | { kind: "star"; text: string }
  | { kind: "p"; text: string };

export function toBlocks(body: string): Block[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];

  // 페이지가 따로 그리는 줄(제목·부제·①②③ 3줄 요약)만 건너뛴다.
  // 블로그 판결분석형 글은 요약이 본문 중간에 「하나·둘·셋」으로 적혀 있어,
  // ①②③를 끝까지 찾다 본문 전체를 건너뛰지 않도록 요약 머리 뒤 12줄 안에서만 찾는다.
  const skip = new Set<number>([0]);
  const sumIdx = lines.findIndex((l) => l.includes("3줄 요약"));
  if (sumIdx >= 0) {
    let k = sumIdx + 1;
    let found = 0;
    const end = Math.min(lines.length, sumIdx + 12);
    while (k < end && found < 3) {
      if (/^[①②③]/.test(lines[k].trim())) found += 1;
      k += 1;
    }
    if (found === 3) {
      for (let i = sumIdx; i < k; i += 1) skip.add(i);
      if (sumIdx <= 4) for (let i = 0; i < sumIdx; i += 1) skip.add(i); // 제목·부제
    } else {
      skip.add(sumIdx); // 요약 머리만 빼고 본문은 그대로
    }
  } else {
    skip.add(1); // 부제
  }

  for (let i = 0; i < lines.length; i += 1) {
    if (skip.has(i)) continue;
    const t = lines[i].trim();
    if (!t) continue;
    if (t.startsWith("#")) continue; // 해시태그 줄
    if (/^━+$/.test(t)) {
      if (blocks.at(-1)?.kind !== "rule") blocks.push({ kind: "rule" });
      continue;
    }
    if (t.startsWith("▣")) {
      blocks.push({ kind: "part", text: t.replace(/^▣\s*/, "") });
      continue;
    }
    if (t.startsWith("✅")) {
      blocks.push({ kind: "part", text: t.replace(/^✅\s*/, "") });
      continue;
    }
    if (t.startsWith("★")) {
      blocks.push({ kind: "star", text: t.replace(/^★\s*/, "") });
      continue;
    }
    blocks.push({ kind: "p", text: t });
  }

  // 끝의 구분선 정리
  while (blocks.at(-1)?.kind === "rule") blocks.pop();
  return blocks;
}

/**
 * 본문의 「Q. 질문」 줄과 바로 뒤 답 문단을 묶어 FAQ 항목으로 뽑는다(FAQPage 구조화 데이터용).
 * 답은 Q 줄 다음 줄부터 빈 줄·다음 Q·구분선·소제목 전까지. 「A.」 머리는 걷어낸다.
 */
export function extractFaq(body: string): { q: string; a: string }[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n").map((l) => l.trim());
  const out: { q: string; a: string }[] = [];
  for (let i = 0; i < lines.length; i += 1) {
    const m = lines[i].match(/^Q[.:]\s*(.+)$/);
    if (!m) continue;
    const ans: string[] = [];
    let k = i + 1;
    while (k < lines.length && lines[k] && !/^(Q[.:]|▣|━|★|✅)/.test(lines[k])) {
      ans.push(lines[k].replace(/^A[.:]\s*/, ""));
      k += 1;
    }
    if (ans.length) out.push({ q: m[1].trim(), a: ans.join(" ") });
    i = k - 1;
  }
  return out;
}
