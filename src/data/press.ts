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
  {
    title: "“약국을 지키는 법률 전략”… 한국젊은약사회 세미나 성료",
    outlet: "약사공론",
    date: "2026-08-11",
    url: "https://www.kpanews.co.kr/news/articleView.html?idxno=540247",
    kind: "보도",
  },
  {
    title: "“약국 성장을 위한 법률 전략” KYPG, 리브로와 세미나",
    outlet: "데일리팜",
    date: "2026-08-10",
    url: "https://new.dailypharm.com/user/news/341289",
    kind: "보도",
  },
  {
    title: "영업비밀침해, 퇴사자·협력업체의 기술자료 유출에 대응하는 방법",
    outlet: "로이슈",
    date: "2026-07-07",
    url: "https://www.lawissue.co.kr/view.php?ud=2026070712095127846cf2d78c68_12",
    kind: "보도",
  },
  {
    title: "지식재산권 분쟁에 휘말리지 않고 ‘내 아이디어 지키는 법’",
    outlet: "로이슈",
    date: "2026-04-29",
    url: "https://www.lawissue.co.kr/view.php?ud=2026042910234863676cf2d78c68_12",
    kind: "보도",
  },
];

export const pressSorted = (): PressItem[] =>
  [...PRESS].sort((a, b) => b.date.localeCompare(a.date));
