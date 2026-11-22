/** 사이트 전역 상수 — 네비게이션 · SEO · 면책문구를 한 곳에서 관리한다. */

export const NAV = [
  { href: "/profile", label: "프로필" },
  { href: "/practice", label: "업무분야" },
  { href: "/cases", label: "수행사건" },
  { href: "/notes", label: "기업법 노트" },
  { href: "/press", label: "언론보도" },
  { href: "/contact", label: "문의" },
] as const;

/** 상단 메뉴 오른쪽 끝 강조 버튼. */
export const NAV_CTA = { href: "/diagnosis", label: "전직금지 무료진단" } as const;

/** 하단 메뉴 — 상단에서 뺀 CV·FAQ와 진단까지 모두 싣는다. */
export const FOOTER_NAV = [
  { href: "/profile", label: "프로필" },
  { href: "/practice", label: "업무분야" },
  { href: "/cases", label: "수행사건" },
  { href: "/diagnosis", label: "전직금지 진단" },
  { href: "/press", label: "언론보도" },
  { href: "/notes", label: "기업법 노트" },
  { href: "/cv", label: "CV" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "문의" },
] as const;

/**
 * 이 사이트의 배포 주소. canonical · OG · sitemap · JSON-LD 가 모두 여기서 나온다.
 * ⚠️ lawlebro.com 은 법무법인 리브로 공식 홈페이지(별개 사이트)다. 여기 넣지 않는다.
 *    커스텀 도메인을 붙이면 Vercel 환경변수 NEXT_PUBLIC_SITE_URL 만 바꾸면 된다.
 */
export const SITE = {
  name: "유연 변호사 · 변리사",
  firm: "법무법인 리브로",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://seoyeonpapa.com").replace(/\/+$/, ""),
} as const;

/** 사이트 내부 경로 → 절대 URL. next.config 의 trailingSlash:true 에 맞춰 끝에 / 를 붙인다. */
export function absUrl(path = "/"): string {
  const [p, hash] = path.split("#");
  let out = p.startsWith("/") ? p : `/${p}`;
  if (!out.endsWith("/") && !/\.[a-z0-9]+$/i.test(out)) out += "/";
  return `${SITE.url}${out === "/" ? "/" : out}${hash ? `#${hash}` : ""}`;
}

/** 노트 상세 경로 (한글 slug 인코딩) */
export const notePath = (slug: string) => `/notes/${encodeURIComponent(slug)}/`;

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

/** 전직금지·경업금지 진단(/diagnosis) 전용 고지 — 261118 대표변호사님 확정 문언. */
export const DIAG_SHORT =
  "이 진단은 공개된 전직금지·경업금지 판결을 분석해 비슷한 사정에서 법원이 어떻게 판단했는지 보여 드리는 참고 정보입니다. 법률자문이 아니며 개별 사건의 결과를 예측하거나 보장하지 않습니다.";

export const DIAG_INDEX =
  "이 지수는 법무법인 리브로가 분석한 전직금지·경업금지 판결 가운데 법원이 약정의 효력을 판단한 근로자 사건 549건(2026. 11. 기준)에서, 입력하신 사정이 약정이 유지되기 쉬운 순서로 어디쯤인지를 0~100으로 나타낸 것입니다. 구간 비율은 그 구간 판결에서 약정이 전부 또는 일부 유효로 인정된 실제 비율입니다. 입력하신 답만을 기초로 계산하며, 약정서 전문, 증거, 담당 재판부의 판단에 따라 실제 결과는 달라질 수 있습니다.";

export const DIAG_FULL: string[] = [
  "이 진단 결과는 일반적인 정보 제공을 위한 것으로, 특정 사안에 대한 법률자문이나 법률사무의 처리가 아닙니다. 진단을 이용하거나 결과를 받으신 것만으로 법무법인 리브로와 이용자 사이에 위임관계가 성립하지 않습니다.",
  "진단 결과는 과거 판결의 경향을 바탕으로 한 참고 지표로, 이용자 사건의 승소·패소, 약정의 유효·무효, 전직금지가처분의 인용·기각을 보장하지 않습니다.",
  "퇴사, 이직, 창업, 계약 체결이나 변경 등 중요한 결정은 진단 결과만으로 하지 마시고, 약정서와 관련 자료를 갖추어 변호사와 상담하신 뒤 하시기 바랍니다.",
  "법무법인 리브로는 이용자가 진단 결과에 의존해 내린 결정으로 생긴 손해에 대하여 책임을 지지 않습니다.",
  "입력하신 내용은 상담을 신청하시기 전까지 저장되지 않으며, 상담을 신청하시면 회신 목적으로만 이용합니다.",
];
