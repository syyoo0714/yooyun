"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { adminIdToEmail } from "@/lib/admin";

/**
 * 관리자 로그인 — 아이디(예: yooyeon) + 비밀번호.
 * Supabase Auth 는 이메일을 요구하므로 adminIdToEmail 로 변환한다.
 * 공개 가입(sign-up)은 대시보드에서 비활성화하고, 계정은 scripts/create-admin.mjs 로만 만든다.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: adminIdToEmail(id),
        password: pw,
      });
      if (error) throw error;
      router.replace("/admin");
      router.refresh();
    } catch {
      setErr("아이디 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "var(--bg)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 380 }}>
        <span className="eyebrow">Admin</span>
        <h1 style={{ margin: "8px 0 24px", fontSize: "var(--text-xl)" }}>관리자 로그인</h1>

        <form onSubmit={onSubmit} className="card">
          <label className="field">
            <span>아이디</span>
            <input
              className="input"
              value={id}
              onChange={(e) => setId(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="field">
            <span>비밀번호</span>
            <input
              className="input"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={busy} style={{ width: "100%" }}>
            {busy ? "확인 중…" : "로그인"}
          </button>
          {err && (
            <p style={{ marginTop: 12, fontSize: "var(--text-sm)", color: "var(--danger)" }}>
              {err}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
