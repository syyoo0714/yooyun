/**
 * 로컬 정본(CV·노트) → Supabase 적재.
 *
 *   node scripts/seed-supabase.mjs            # 전체
 *   node scripts/seed-supabase.mjs notes      # 노트만
 *
 * 필요 env (.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   ← RLS를 우회해야 하므로 service_role. 절대 커밋·클라이언트 노출 금지.
 *
 * 먼저 supabase/schema.sql 을 SQL Editor에서 한 번 실행해 두어야 한다.
 * upsert 이므로 여러 번 돌려도 안전하다.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// .env.local 간이 로더
for (const f of [".env.local", ".env"]) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL 과 SUPABASE_SERVICE_ROLE_KEY 가 필요합니다.");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });

const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
const only = process.argv[2];
const want = (name) => !only || only === name;

async function run(name, fn) {
  if (!want(name)) return;
  try {
    const n = await fn();
    console.log(`✓ ${name} — ${n}건`);
  } catch (e) {
    console.error(`✗ ${name} —`, e.message ?? e);
    process.exitCode = 1;
  }
}

// ---- profile / timeline / practice ------------------------------------
async function seedProfile() {
  const { profile } = await import("../src/data/profile.ts").catch(() => ({}));
  // ts 직접 import가 안 되는 환경을 위해 JSON 경유가 아닌 하드 복사는 하지 않는다.
  // 대신 CV 정본이 이미 폴백으로 동작하므로 profile 은 관리자 화면에서 채우는 것을 기본으로 한다.
  if (!profile) {
    console.log("  (profile 은 관리자 화면에서 입력하십시오 — 폴백이 이미 CV 정본입니다)");
    return 0;
  }
  const { error } = await db.from("profile").upsert({ id: 1, ...profile });
  if (error) throw error;
  return 1;
}

// ---- cases -------------------------------------------------------------
async function seedCases() {
  const cv = readJson("src/data/cv.generated.json");
  const rows = cv.caseSections.flatMap((s) =>
    s.items.map((it, i) => ({
      section_no: s.no,
      section_title: s.title,
      text: it.text,
      outcome: it.outcome,
      sort_order: i,
    }))
  );
  await db.from("cases").delete().neq("id", -1);
  const { error } = await db.from("cases").insert(rows);
  if (error) throw error;
  return rows.length;
}

async function seedWritings() {
  const cv = readJson("src/data/cv.generated.json");
  const rows = cv.writings.flatMap((g) =>
    g.items.map((it, i) => ({
      group_name: g.group,
      text: it.text,
      outcome: it.outcome,
      sort_order: i,
    }))
  );
  await db.from("writings").delete().neq("id", -1);
  const { error } = await db.from("writings").insert(rows);
  if (error) throw error;
  return rows.length;
}

// ---- notes -------------------------------------------------------------
async function seedNotes() {
  const meta = readJson("src/data/notes.generated.json");
  const bodyDir = path.join(ROOT, "content/notes");
  const rows = meta.map((n) => ({
    slug: n.slug,
    title: n.title,
    series_key: n.seriesKey,
    series_label: n.seriesLabel,
    dek: n.dek,
    summary: n.summary,
    tags: n.tags,
    body: fs.existsSync(path.join(bodyDir, `${n.slug}.txt`))
      ? fs.readFileSync(path.join(bodyDir, `${n.slug}.txt`), "utf8")
      : "",
    published_at: n.publishedAt,
    is_published: true,
    source_file: n.sourceFile,
  }));

  // 본문이 커서 나눠 올린다
  for (let i = 0; i < rows.length; i += 20) {
    const { error } = await db.from("notes").upsert(rows.slice(i, i + 20), {
      onConflict: "slug",
    });
    if (error) throw error;
  }
  return rows.length;
}

await run("profile", seedProfile);
await run("cases", seedCases);
await run("writings", seedWritings);
await run("notes", seedNotes);
console.log("완료.");
