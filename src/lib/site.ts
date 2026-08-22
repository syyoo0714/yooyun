/** 사이트 전역 상수 — 네비게이션 · SEO · 면책문구를 한 곳에서 관리한다. */

export const NAV = [
  { href: "/", label: "홈" },
  { href: "/profile", label: "프로필" },
  { href: "/practice", label: "업무분야" },
  { href: "/cases", label: "수행사건" },
  { href: "/notes", label: "기업법 노트" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "문의" },
] as const;

export const SITE = {
  name: "유연 변호사 · 변리사",
  firm: "법무법인 리브로",
  /** 배포 도메인이 정해지면 교체 */
  url: "https://lawlebro.com",
} as const;

/**
 * 공통 면책 — 서두·말미 문언을 반드시 일치시킨다(가드 G5 면책·본문 정합).
 * "결과를 예단하지 않는다"가 아니라 "확정적으로 단정하지 않는다"로 낮춰 쓴다.
 */
export const DISCLAIMER =
  "본 사이트의 게시물은 관련 법령과 실무를 이해하기 위한 일반적 정보·교육 목적의 자료이며, 개별 사안에 대한 법률자문이 아닙니다. 법령·판례와 그 해석은 변경될 수 있고 구체적 결론은 사실관계에 따라 달라집니다. 진행 중인 사안의 결과를 확정적으로 단정하지 않습니다.";

/** 수행사건 표기 원칙 — 게시 페이지 하단에 함께 노출한다. */
export const CASE_NOTICE =
  "수행사건은 의뢰인 보호를 위해 당사자명과 사건번호를 제거하고 기술·분야 수준으로만 기재했습니다. 기재된 결과는 해당 사건의 사실관계에 따른 것으로 다른 사건의 결과를 보장하지 않습니다.";

export const AD_NOTICE = "변호사 광고 — 게시자 : 법무법인 리브로 대표변호사 · 변리사 유연";
