"use server";

import { createClient } from "@/lib/supabase/server";

export type InquiryState = { ok: boolean; message: string } | null;

/**
 * 상담 문의 접수 — public.inquiries 에 insert.
 * RLS: anon 은 insert 만 가능하고 select 는 관리자만 가능하다(schema.sql 참조).
 *
 * ⚠️ 접수 자체가 위임계약 성립이나 자문 제공을 뜻하지 않는다.
 *    폼 하단 고지와 문언을 어긋나게 바꾸지 말 것.
 */
export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData
): Promise<InquiryState> {
  const name = String(formData.get("name") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const agree = formData.get("agree") === "on";

  if (!name || !contact || !message) {
    return { ok: false, message: "성함, 연락처, 문의 내용을 모두 적어 주십시오." };
  }
  if (!agree) {
    return { ok: false, message: "개인정보 수집·이용에 동의해 주셔야 접수됩니다." };
  }
  if (message.length > 4000) {
    return { ok: false, message: "문의 내용이 너무 깁니다. 4,000자 이내로 적어 주십시오." };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return {
      ok: false,
      message:
        "현재 온라인 접수가 준비 중입니다. lebro@lawlebro.com 또는 02-532-9824 로 연락해 주십시오.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("inquiries")
      .insert({ name, contact, category: category || null, message });
    if (error) throw error;
  } catch {
    return {
      ok: false,
      message:
        "접수 중 문제가 발생했습니다. lebro@lawlebro.com 또는 02-532-9824 로 연락해 주십시오.",
    };
  }

  return {
    ok: true,
    message: "문의가 접수되었습니다. 확인 후 남겨 주신 연락처로 회신드리겠습니다.",
  };
}
