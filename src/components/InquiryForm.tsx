"use client";

import { useActionState } from "react";
import { submitInquiry, type InquiryState } from "@/app/contact/actions";

const CATEGORIES = [
  "특허 분쟁 (소송 · 심판)",
  "특허 자문 · 회피설계",
  "영업비밀 · 산업기술보호",
  "전직금지 · 경업금지",
  "디자인 · 상표 · 저작권",
  "직무발명 · 기술거래 · IP 실사",
  "기업법무 · 계약 분쟁",
  "가상자산 · 개인정보 · 기타",
  "약국 · 의료",
];

export default function InquiryForm() {
  const [state, action, pending] = useActionState<InquiryState, FormData>(
    submitInquiry,
    null
  );

  return (
    <form action={action}>
      <label className="field">
        <span>성함 *</span>
        <input className="input" name="name" required maxLength={60} autoComplete="name" />
      </label>

      <label className="field">
        <span>연락처 (이메일 또는 전화번호) *</span>
        <input className="input" name="contact" required maxLength={120} />
      </label>

      <label className="field">
        <span>문의 분야</span>
        <select className="select" name="category" defaultValue="">
          <option value="">선택해 주세요</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>문의 내용 *</span>
        <textarea
          className="textarea"
          name="message"
          required
          maxLength={4000}
          placeholder="어떤 일이 있었는지, 지금 어느 단계인지, 기한이 걸려 있는지를 적어 주시면 도움이 됩니다."
        />
      </label>

      <label className="field" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <input type="checkbox" name="agree" style={{ marginTop: 6, width: "auto" }} />
        <span style={{ marginBottom: 0 }}>
          상담 회신을 위한 개인정보(성함·연락처·문의 내용) 수집·이용에 동의합니다. 수집한
          정보는 상담 회신 목적에만 쓰고 목적 달성 후 지체 없이 파기합니다.
        </span>
      </label>

      <button type="submit" className="btn btn-accent" disabled={pending}>
        {pending ? "접수 중…" : "문의 보내기"}
      </button>

      {state && (
        <p
          role="status"
          style={{
            marginTop: 16,
            fontSize: "var(--text-sm)",
            color: state.ok ? "var(--success)" : "var(--danger)",
          }}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
