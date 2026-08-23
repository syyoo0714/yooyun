/**
 * 01 학력 · 자격 · 경력 — 260813_유연_CV_경력기술서.html 정본.
 * ⚠️ 연도·기관명을 임의로 바꾸지 않는다(G1 거짓광고).
 */

export type TimelineItem = {
  period: string;
  title: string;
  note?: string;
};

export const education: TimelineItem[] = [
  {
    period: "2017–2020",
    title: "성균관대학교 법학전문대학원",
    note: "법학전문석사 · 수석 졸업",
  },
  {
    period: "2004–2010",
    title: "서울대학교 공과대학 전기공학부",
    note: "공학사",
  },
  {
    period: "2001–2004",
    title: "과천고등학교",
  },
];

export const credentials: TimelineItem[] = [
  {
    period: "2020",
    title: "제9회 변호사시험 합격",
    note: "대한변호사협회 회원",
  },
  {
    period: "2010",
    title: "제46회 변리사시험 합격",
    note: "대한변리사회(KPAA) 회원",
  },
];

export const career: TimelineItem[] = [
  {
    period: "2025. 7.–현재",
    title: "법무법인 리브로",
    note: "대표변호사",
  },
  {
    period: "2022. 6.–2025. 7.",
    title: "법무법인(유) 세종",
    note: "지식재산권그룹",
  },
  {
    period: "2020. 2.–2022. 6.",
    title: "법무법인(유한) 바른",
  },
  {
    period: "2010–2017",
    title: "특허법인 신성",
    note: "변리사",
  },
];

/** 03 특허 · 기술 실무 이력 (변리사 재직기) */
export const patentPractice: string[] = [
  "국내 대형 반도체 제조사를 주 고객으로 한 반도체 설계 전문 변리사로 7년간 근무",
  "DRAM · 플래시메모리 · SSD 등 반도체 설계 핵심기술의 국내·해외 특허 200건 이상 출원",
  "고객사와 협업한 전략특허 개발, 자율주행 기술 특허전략 지원",
  "NFT 관련 기술의 특허출원 자문 및 출원",
  "특허맵 작성 및 국가과제 수행",
];
