/**
 * 04~14 수행사건 · 15 저술 · 17 부록 — CV 원본에서 기계 추출.
 * 원본 = 260813_유연_CV_경력기술서.html · 추출 = scripts/import-cv.mjs
 *
 * ⚠️ CV는 이미 익명화본이다(당사자명·사건번호 제거, 기술·분야만 기재).
 *    송무서면_md / 자문의견서_md 원본에는 실명과 사건번호가 남아 있으므로
 *    그쪽 문구를 이 사이트로 옮기지 않는다(변리사법 제23조 · 비밀유지의무).
 */

import cv from "./cv.generated.json";

export type CaseItem = { text: string; outcome: string | null };
export type CaseSection = { no: string; title: string; items: CaseItem[] };
export type WritingGroup = { group: string; items: CaseItem[] };
export type PublishedCase = { no: string; title: string };

export const caseSections: CaseSection[] = cv.caseSections;
export const writings: WritingGroup[] = cv.writings;
export const publishedCases: PublishedCase[] = cv.published;

export const totalCases = caseSections.reduce((n, s) => n + s.items.length, 0);

/** 결과가 표기된 사건만 — 랜딩의 "대표 수행" 블록에 쓴다 */
export const casesWithOutcome = caseSections.flatMap((s) =>
  s.items
    .filter((i) => i.outcome && !i.outcome.includes("진행 중"))
    .map((i) => ({ ...i, section: s.title }))
);
