/**
 * 260813_유연_CV_경력기술서.html → src/data/cv.generated.json
 *
 *   node scripts/import-cv.mjs
 *
 * 손으로 옮겨 적으면 사건 문구가 틀어질 수 있어 원본에서 직접 뽑는다.
 * (CV는 이미 익명화본이다 — 당사자명·사건번호가 제거되어 있어 그대로 게시 가능)
 *
 * 뽑는 것: 04~14 사건 섹션(ul.cases), 15 저술·연재·강연, 17 부록 성공사례 표.
 * 01(학력·자격·경력) · 02(전문분야) · 03(특허 실무)은 src/data/*.ts 에 이미 정본으로 있다.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.resolve(ROOT, "..", "260813_유연_CV_경력기술서.html");
const OUT = path.join(ROOT, "src/data/cv.generated.json");

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const strip = (s) => decode(s.replace(/<[^>]*>/g, ""));

function main() {
  const html = fs.readFileSync(SRC, "utf8");

  // <h2><span class="no">NN</span>제목</h2> 위치로 섹션을 자른다.
  const heads = [...html.matchAll(/<h2><span class="no">(\d+)<\/span>([^<]*)<\/h2>/g)];
  const sections = heads.map((m, i) => {
    const start = m.index + m[0].length;
    const end = i + 1 < heads.length ? heads[i + 1].index : html.length;
    return { no: m[1], title: decode(m[2]), html: html.slice(start, end) };
  });

  const caseSections = [];
  for (const s of sections) {
    if (!/^(0[4-9]|1[0-4])$/.test(s.no)) continue;
    const items = [...s.html.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => {
      const raw = m[1];
      const em = raw.match(/<em>([\s\S]*?)<\/em>/);
      return {
        text: strip(raw.replace(/<em>[\s\S]*?<\/em>/, "")),
        outcome: em ? strip(em[1]) : null,
      };
    });
    if (items.length) caseSections.push({ no: s.no, title: s.title, items });
  }

  // 15 저술 · 연재 · 강연 — h3 하위 목록
  const pub = sections.find((s) => s.no === "15");
  const writings = [];
  if (pub) {
    const parts = [...pub.html.matchAll(/<h3>([^<]*)<\/h3>([\s\S]*?)(?=<h3>|$)/g)];
    for (const p of parts) {
      const items = [...p[2].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => {
        const raw = m[1];
        const em = raw.match(/<em>([\s\S]*?)<\/em>/);
        return {
          text: strip(raw.replace(/<em>[\s\S]*?<\/em>/, "")),
          outcome: em ? strip(em[1]) : null,
        };
      });
      writings.push({ group: decode(p[1]), items });
    }
  }

  // 17 부록 — 홈페이지 기게시 성공사례 표
  const appendix = sections.find((s) => s.no === "17");
  const published = [];
  if (appendix) {
    for (const m of appendix.html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
      const tds = [...m[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((x) => strip(x[1]));
      if (tds.length >= 2) published.push({ no: tds[0], title: tds[1] });
    }
  }

  const out = { caseSections, writings, published, source: path.basename(SRC) };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2), "utf8");

  const total = caseSections.reduce((n, s) => n + s.items.length, 0);
  console.log(`사건 섹션 ${caseSections.length}개 · 항목 ${total}건`);
  caseSections.forEach((s) => console.log(`   ${s.no} ${s.title} — ${s.items.length}건`));
  console.log(`저술 그룹 ${writings.length}개 · 기게시 성공사례 ${published.length}건`);
  console.log(`→ ${path.relative(ROOT, OUT)}`);
}

main();
