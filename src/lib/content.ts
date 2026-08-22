import { profile as fallbackProfile } from "@/data/profile";
import {
  education as fallbackEducation,
  credentials as fallbackCredentials,
  career as fallbackCareer,
  type TimelineItem,
} from "@/data/career";
import { practiceAreas as fallbackPractice, type PracticeArea } from "@/data/practice";
import { caseSections as fallbackCases, type CaseSection } from "@/data/cases";

/**
 * 공개 페이지 데이터 조회 — anon 키(쿠키 없음). RLS로 읽기만 가능하다.
 *
 * 정책: DB가 1순위, TS 정본이 폴백.
 *   · 환경변수 미설정 / DB 오류 / 빈 결과 → 조용히 폴백한다.
 *   · 모듈 로드 시점에 throw 하면 빌드가 통째로 실패하므로 각 getX 안에서만 던진다.
 *   · 따라서 .env 없이도 사이트는 CV 정본 그대로 뜬다.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function requireDb() {
  if (!supabaseUrl || !supabaseAnon) {
    throw new Error("Supabase 환경변수 미설정 — 폴백(CV 정본) 사용");
  }
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(supabaseUrl, supabaseAnon);
}

export type ProfileData = typeof fallbackProfile;

export async function getProfile(): Promise<ProfileData> {
  try {
    const { data, error } = await (await requireDb())
      .from("profile")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error || !data) return fallbackProfile;
    return {
      ...fallbackProfile,
      nameKo: data.name_ko ?? fallbackProfile.nameKo,
      nameEn: data.name_en ?? fallbackProfile.nameEn,
      title: data.title ?? fallbackProfile.title,
      affiliation: data.affiliation ?? fallbackProfile.affiliation,
      affiliationEn: data.affiliation_en ?? fallbackProfile.affiliationEn,
      tagline: data.tagline ?? fallbackProfile.tagline,
      lede: data.lede ?? fallbackProfile.lede,
      creed: data.creed ?? fallbackProfile.creed,
      intro: data.intro?.length ? data.intro : fallbackProfile.intro,
      stats: data.stats?.length ? data.stats : fallbackProfile.stats,
      metrics: data.metrics?.length ? data.metrics : fallbackProfile.metrics,
      contact: { ...fallbackProfile.contact, ...(data.contact ?? {}) },
    } as ProfileData;
  } catch {
    return fallbackProfile;
  }
}

async function timeline(kind: string, fallback: TimelineItem[]): Promise<TimelineItem[]> {
  try {
    const { data, error } = await (await requireDb())
      .from("timeline")
      .select("period, title, note")
      .eq("kind", kind)
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return fallback;
    return data.map((r) => ({
      period: r.period ?? "",
      title: r.title ?? "",
      note: r.note ?? undefined,
    }));
  } catch {
    return fallback;
  }
}

export const getEducation = () => timeline("education", fallbackEducation);
export const getCredentials = () => timeline("credential", fallbackCredentials);
export const getCareer = () => timeline("career", fallbackCareer);

export async function getPracticeAreas(): Promise<PracticeArea[]> {
  try {
    const { data, error } = await (await requireDb())
      .from("practice_areas")
      .select("key, no, title, summary, detail, tags, cv_sections")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return fallbackPractice;
    return data.map((r) => ({
      key: r.key,
      no: r.no ?? "",
      title: r.title ?? "",
      summary: r.summary ?? "",
      detail: r.detail ?? "",
      tags: (r.tags ?? []) as string[],
      cvSections: (r.cv_sections ?? []) as string[],
    }));
  } catch {
    return fallbackPractice;
  }
}

export async function getCaseSections(): Promise<CaseSection[]> {
  try {
    const { data, error } = await (await requireDb())
      .from("cases")
      .select("section_no, section_title, text, outcome, sort_order")
      .order("section_no", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return fallbackCases;

    const bucket = new Map<string, CaseSection>();
    for (const r of data) {
      const no = r.section_no as string;
      if (!bucket.has(no)) {
        bucket.set(no, { no, title: r.section_title ?? "", items: [] });
      }
      bucket.get(no)!.items.push({ text: r.text, outcome: r.outcome ?? null });
    }
    return [...bucket.values()];
  } catch {
    return fallbackCases;
  }
}
