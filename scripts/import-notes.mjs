/**
 * BrunchFlgu 의 네이버 발행용 원고(*_네이버용.txt)를 홈페이지 콘텐츠로 가져온다.
 *
 *   node scripts/import-notes.mjs
 *
 * 산출물 (DB 없이도 사이트가 렌더된다):
 *   · src/data/notes.generated.json   — 메타데이터(slug/제목/시리즈/부제/3줄요약/태그/날짜)
 *   · content/notes/<slug>.txt        — 본문 원문 사본
 *
 * 원고 포맷 규약(실측):
 *   1행            제목  (예: "[유연의 기업법 노트] ~~~")
 *   2행            부제(dek)
 *   "📌 3줄 요약"  ①②③ 세 줄
 *   마지막 #행     해시태그
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SOURCE_DIR = path.resolve(ROOT, "..");        // = BrunchFlgu
const OUT_JSON = path.join(ROOT, "src/data/notes.generated.json");
const OUT_BODY_DIR = path.join(ROOT, "content/notes");

/** 파일명 접두어 → 시리즈 */
const SERIES = [
  { prefix: "기업법노트_", key: "corporate", label: "유연의 기업법 노트" },
  { prefix: "유연에세이_", key: "essay", label: "유연의 노트" },
  { prefix: "IP금융_", key: "ipfinance", label: "IP 금융" },
];

function detectSeries(filename) {
  return SERIES.find((s) => filename.startsWith(s.prefix)) ?? null;
}

/** 파일명 → slug (한글 유지, 구분자 정리) */
function toSlug(filename, series) {
  let core = filename
    .replace(/\.txt$/, "")
    .replace(/_유연_네이버용$/, "")
    .replace(/_네이버용$/, "")
    .replace(/_유연CLO$/, "");
  if (series) core = core.slice(series.prefix.length);
  return core
    .replace(/[\s_]+/g, "-")
    .replace(/[^0-9A-Za-z가-힣·-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function parse(raw) {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const nonEmpty = (i) => {
    while (i < lines.length && lines[i].trim() === "") i += 1;
    return i;
  };

  let i = nonEmpty(0);
  const titleRaw = (lines[i] ?? "").trim();
  i = nonEmpty(i + 1);
  const dek = (lines[i] ?? "").trim();

  // 시리즈 라벨이 제목 앞에 붙어 있으면 분리
  const m = titleRaw.match(/^\[([^\]]+)\]\s*(.+)$/);
  const seriesLabel = m ? m[1].trim() : null;
  const title = m ? m[2].trim() : titleRaw;

  // 3줄 요약
  const summary = [];
  const sumStart = lines.findIndex((l) => l.includes("3줄 요약"));
  if (sumStart >= 0) {
    for (let k = sumStart + 1; k < Math.min(sumStart + 12, lines.length); k += 1) {
      const t = lines[k].trim();
      if (/^[①②③④⑤]/.test(t)) summary.push(t.replace(/^[①②③④⑤]\s*/, ""));
      if (summary.length >= 3) break;
    }
  }

  // 해시태그 (마지막 # 로 시작하는 줄)
  let tags = [];
  for (let k = lines.length - 1; k >= 0; k -= 1) {
    const t = lines[k].trim();
    if (t.startsWith("#")) {
      tags = t.split(/\s+/).filter((x) => x.startsWith("#")).map((x) => x.slice(1));
      break;
    }
    if (t !== "" && k < lines.length - 25) break;
  }

  return { title, seriesLabel, dek, summary, tags };
}

function main() {
  fs.mkdirSync(OUT_BODY_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });

  const files = fs
    .readdirSync(SOURCE_DIR)
    .filter((f) => f.endsWith("네이버용.txt"))
    .sort();

  const notes = [];
  const seen = new Set();

  for (const file of files) {
    const full = path.join(SOURCE_DIR, file);
    const stat = fs.statSync(full);
    const raw = fs.readFileSync(full, "utf8");
    const series = detectSeries(file);
    const parsed = parse(raw);

    let slug = toSlug(file, series);
    if (!slug) slug = `note-${notes.length + 1}`;
    while (seen.has(slug)) slug += "-2";
    seen.add(slug);

    fs.writeFileSync(path.join(OUT_BODY_DIR, `${slug}.txt`), raw, "utf8");

    notes.push({
      slug,
      title: parsed.title,
      seriesKey: series?.key ?? "essay",
      seriesLabel: parsed.seriesLabel ?? series?.label ?? "유연의 노트",
      dek: parsed.dek,
      summary: parsed.summary,
      tags: parsed.tags.slice(0, 30),
      publishedAt: stat.mtime.toISOString().slice(0, 10),
      sourceFile: file,
      chars: raw.length,
    });
  }

  notes.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  fs.writeFileSync(OUT_JSON, JSON.stringify(notes, null, 2), "utf8");

  const byKey = notes.reduce((acc, n) => {
    acc[n.seriesKey] = (acc[n.seriesKey] ?? 0) + 1;
    return acc;
  }, {});
  console.log(`가져온 원고 ${notes.length}편`, byKey);
  console.log(`메타 → ${path.relative(ROOT, OUT_JSON)}`);
  console.log(`본문 → ${path.relative(ROOT, OUT_BODY_DIR)}/*.txt`);

  const missing = notes.filter((n) => n.summary.length < 3);
  if (missing.length) {
    console.log(`\n⚠️ 3줄 요약을 찾지 못한 원고 ${missing.length}편:`);
    missing.slice(0, 10).forEach((n) => console.log(`   · ${n.sourceFile}`));
  }
}

main();
