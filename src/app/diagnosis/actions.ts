"use server";

import { createClient } from "@/lib/supabase/server";

export type DiagState = { ok: boolean; message: string } | null;

/**
 * 경업금지 진단 결과로 상담 신청 — 기존 public.inquiries 에 category "경업금지 진단"으로 넣는다.
 * 텔레그램·웍스 메일 동시 전달은 다음 단계에서 붙인다.
 */
export async function submitDiagnosis(_prev: DiagState, formData: FormData): Promise<DiagState> {
  const name = String(formData.get("name") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim();
  const memo = String(formData.get("memo") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const agree = formData.get("agree") === "on";

  if (!name || !contact) return { ok: false, message: "성함과 연락처를 적어 주십시오." };
  if (!agree) return { ok: false, message: "개인정보 수집·이용에 동의해 주셔야 접수됩니다." };

  const message = `${summary}\n\n[추가 메모]\n${memo || "(없음)"}`.slice(0, 8000);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return {
      ok: false,
      message: "현재 온라인 접수가 준비 중입니다. 02-532-9824 로 전화 주시면 진단 결과를 바탕으로 상담해 드리겠습니다.",
    };
  }
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("inquiries")
      .insert({ name, contact, category: "경업금지 진단", message });
    if (error) throw error;
  } catch {
    return { ok: false, message: "접수 중 문제가 발생했습니다. 02-532-9824 로 연락해 주십시오." };
  }
  return { ok: true, message: "상담 신청이 접수되었습니다. 진단 내용을 확인한 뒤 남겨 주신 연락처로 연락드리겠습니다." };
}
