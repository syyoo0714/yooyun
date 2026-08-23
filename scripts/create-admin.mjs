/**
 * 관리자 계정 생성 — Supabase Auth 에 단일 관리자 사용자를 만든다.
 *
 *   node scripts/create-admin.mjs                # 생성(이미 있으면 비밀번호만 갱신)
 *   node scripts/create-admin.mjs --no-schema    # schema.sql 의 admin_uid 를 건드리지 않는다
 *
 * 필요 env (.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   ← Auth Admin API 는 service_role 만 쓸 수 있다. 절대 커밋 금지.
 *   ADMIN_ID                    ← 로그인 아이디(기본 yooyeon). 이메일은 lib/admin.ts 규칙으로 변환.
 *   ADMIN_PASSWORD              ← 8자 이상 권장.
 *
 * 왜 스크립트로만 만드나
 *   공개 가입(sign-up)을 대시보드에서 꺼 두고 계정은 여기서만 만든다.
 *   schema.sql 의 쓰기 정책은 admin_uid 하나만 허용하므로(심층 방어),
 *   설령 누가 가입하더라도 콘텐츠를 건드릴 수 없다.
 *
 * ⚠️ 계정을 만든 것만으로는 쓰기 권한이 생기지 않는다.
 *    출력된 uid 가 schema.sql 의 admin_uid 에 들어가고, 그 SQL 을 한 번 더 실행해야 한다.
 *    (--no-schema 를 주지 않으면 이 스크립트가 schema.sql 을 대신 고쳐 둔다.)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// .env.local 간이 로더 — seed-supabase.mjs 와 같은 방식
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
const id = (process.env.ADMIN_ID || "yooyeon").trim();
const password = process.env.ADMIN_PASSWORD || "";

if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL 과 SUPABASE_SERVICE_ROLE_KEY 가 필요합니다.");
  process.exit(1);
}
if (!password) {
  console.error("ADMIN_PASSWORD 가 비어 있습니다. .env.local 에 직접 넣어 주십시오(셸 히스토리에 남기지 마십시오).");
  process.exit(1);
}
if (password.length < 8) {
  console.error(`ADMIN_PASSWORD 가 ${password.length}자입니다. 8자 이상으로 정해 주십시오.`);
  process.exit(1);
}

/** 아이디 → 이메일 변환은 화면과 같은 규칙을 써야 한다(어긋나면 로그인 불가). */
const { adminIdToEmail } = await import("../src/lib/admin.ts").catch((e) => {
  console.error(`src/lib/admin.ts 를 읽지 못했습니다(Node ${process.versions.node}). Node 22.6+ 필요.`);
  console.error(e.message);
  process.exit(1);
});

const email = adminIdToEmail(id);
const db = createClient(url, key, { auth: { persistSession: false } });

/** 같은 이메일의 계정이 이미 있는지 — 여러 번 돌려도 안전해야 한다. */
async function findByEmail(target) {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === target.toLowerCase());
    if (hit) return hit;
    if (data.users.length < 100) return null;
  }
  return null;
}

const existing = await findByEmail(email);
let user;

if (existing) {
  const { data, error } = await db.auth.admin.updateUserById(existing.id, { password });
  if (error) {
    console.error("비밀번호 갱신 실패 —", error.message);
    process.exit(1);
  }
  user = data.user;
  console.log(`✓ 기존 계정의 비밀번호를 갱신했습니다 — ${email}`);
} else {
  const { data, error } = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // 실제로 수신 가능한 주소가 아니므로 확인 절차를 건너뛴다
    user_metadata: { role: "admin", admin_id: id },
  });
  if (error) {
    console.error("계정 생성 실패 —", error.message);
    process.exit(1);
  }
  user = data.user;
  console.log(`✓ 관리자 계정을 만들었습니다 — ${email}`);
}

console.log(`   로그인 아이디 : ${id}   (화면에서는 아이디만 입력합니다)`);
console.log(`   uid           : ${user.id}`);

// ---- schema.sql 의 admin_uid 채우기 ------------------------------------
const SCHEMA = path.join(ROOT, "supabase/schema.sql");
const PLACEHOLDER = "00000000-0000-0000-0000-000000000000";

if (process.argv.includes("--no-schema")) {
  console.log("\n(--no-schema) schema.sql 은 건드리지 않았습니다.");
} else if (!fs.existsSync(SCHEMA)) {
  console.log("\n⚠️ supabase/schema.sql 이 없습니다. admin_uid 를 직접 넣어 주십시오.");
} else {
  const sql = fs.readFileSync(SCHEMA, "utf8");
  const current = sql.match(/admin_uid constant text := '([0-9a-fA-F-]+)'/);
  if (!current) {
    console.log("\n⚠️ schema.sql 에서 admin_uid 선언을 찾지 못했습니다. 직접 넣어 주십시오.");
  } else if (current[1] === user.id) {
    console.log("\n· schema.sql 의 admin_uid 가 이미 이 계정입니다.");
  } else {
    fs.writeFileSync(SCHEMA, sql.replace(current[0], `admin_uid constant text := '${user.id}'`), "utf8");
    const was = current[1] === PLACEHOLDER ? "플레이스홀더" : current[1];
    console.log(`\n✓ supabase/schema.sql 의 admin_uid 를 교체했습니다 (${was} → ${user.id})`);
  }
}

console.log(`
다음 순서로 마무리하십시오.
  1. supabase/schema.sql 을 Supabase 대시보드 > SQL Editor 에 붙여넣고 다시 Run.
     (RLS 쓰기 정책이 위 uid 로 다시 만들어집니다. 재실행해도 안전합니다.)
  2. Authentication > Providers 에서 공개 가입(Allow new users to sign up)을 끄십시오.
  3. /admin/login 에서 아이디 ${id} 로 로그인.
`);
