/**
 * 언론보도 — 유연 변호사 · 법무법인 리브로 관련 기사와 기고.
 *
 * 기사 추가 = 아래 PRESS 배열에 한 줄 블록을 더한다(순서 무관, 화면은 날짜 최신순).
 *   kind  : "기고"(본인이 쓴 글) | "인터뷰" | "보도"
 *   date  : 기사 입력일 YYYY-MM-DD
 *   dek   : 선택. 기사에 있는 문장만 쓴다(광고 가드 G1 — 기사에 없는 평가를 덧붙이지 않는다).
 */
export type PressItem = {
  title: string;
  outlet: string;
  date: string;
  url: string;
  kind: "기고" | "인터뷰" | "보도";
  section?: string;
  dek?: string;
};

export const PRESS: PressItem[] = [
  {
    title: "대학 리뷰 데이터 무단 사용의 증명책임",
    outlet: "법률신문",
    section: "판례평석",
    date: "2026-10-24",
    url: "https://www.lawtimes.co.kr/news/articleView.html?idxno=228179",
    kind: "기고",
  },
];

export const pressSorted = (): PressItem[] =>
  [...PRESS].sort((a, b) => b.date.localeCompare(a.date));
