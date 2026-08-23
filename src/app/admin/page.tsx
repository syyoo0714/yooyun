import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

/**
 * 관리자 대시보드 — 골격.
 * 접근 제어는 src/proxy.ts(구 middleware)에서 처리한다.
 * 다음 단계에서 각 편집 화면(프로필·경력·사건·노트·문의)을 채운다.
 */
const PANELS = [
  { href: "/admin/profile", label: "프로필 · 연락처", note: "이름·소개·연락처·지표", ready: false },
  { href: "/admin/timeline", label: "학력 · 자격 · 경력", note: "연혁 3종", ready: false },
  { href: "/admin/practice", label: "업무분야", note: "6개 분야 · 태그", ready: false },
  { href: "/admin/cases", label: "수행사건", note: "149건 · 결과 표기", ready: false },
  { href: "/admin/notes", label: "기업법 노트", note: "119편 · 발행 여부", ready: false },
  { href: "/admin/inquiries", label: "상담 문의", note: "접수함", ready: false },
];

export default async function AdminHome() {
  let email = "";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? "";
  } catch {
    // 환경변수 미설정 — 로컬 골격 확인용
  }

  return (
    <main style={{ minHeight: "100dvh", background: "var(--bg)" }}>
      <div className="container" style={{ paddingBlock: 40 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div>
            <span className="eyebrow">Admin</span>
            <h1 style={{ fontSize: "var(--text-xl)", marginTop: 6 }}>콘텐츠 관리</h1>
            {email && (
              <p className="small muted mono" style={{ marginTop: 4 }}>
                {email}
              </p>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/" className="btn btn-ghost">
              사이트 보기
            </Link>
            <LogoutButton />
          </div>
        </div>

        <div className="grid-3">
          {PANELS.map((p) => (
            <div className="card" key={p.href}>
              <h3>{p.label}</h3>
              <p>{p.note}</p>
              <div className="items">
                <span className={`chip ${p.ready ? "chip-accent" : "chip-status"}`}>
                  {p.ready ? "사용 가능" : "구현 예정"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="disclaimer" style={{ marginTop: 32 }}>
          <p>
            <strong>※ 데이터 우선순위</strong> 각 화면은 Supabase 테이블을 1순위로 읽고, 값이
            없거나 오류이면 CV 정본(src/data/*.ts, cv.generated.json)으로 폴백합니다. 따라서 DB를
            비워 두어도 사이트는 CV 내용 그대로 표시됩니다.
          </p>
        </div>
      </div>
    </main>
  );
}
