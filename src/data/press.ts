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
    dek: "자료제출명령이 손해액 산정 자료에 머물러 있는 상황에서 권리자가 사용 사실을 어떻게 증명할지는 문서제출명령의 운용과 제휴 계약의 설계에서 함께 다루어질 필요가 있다.",
    kind: "기고",
  },
  {
    title: "“약국을 지키는 법률 전략”… 한국젊은약사회 세미나 성료",
    outlet: "약사공론",
    date: "2026-08-11",
    url: "https://www.kpanews.co.kr/news/articleView.html?idxno=540247",
    dek: "강연 — 약국 양수도, 계약하고 이행하는 법(유연 법무법인 리브로 변호사·변리사)",
    kind: "보도",
  },
  {
    title: "“약국 성장을 위한 법률 전략” KYPG, 리브로와 세미나",
    outlet: "데일리팜",
    date: "2026-08-10",
    url: "https://new.dailypharm.com/user/news/341289",
    dek: "강연 — 약국 양수도, 계약하고 이행하는 법(유연 법무법인 리브로 변호사·변리사)",
    kind: "보도",
  },
  {
    title: "영업비밀침해, 퇴사자·협력업체의 기술자료 유출에 대응하는 방법",
    outlet: "로이슈",
    date: "2026-07-07",
    url: "https://www.lawissue.co.kr/view.php?ud=2026070712095127846cf2d78c68_12",
    dek: "“영업비밀침해 분쟁은 초기 대응 타이밍을 놓치면 증거가 멸실되거나 피해가 걷잡을 수 없이 확산되는 만큼, 침해 정황이 확인된 즉시 법률 전문가의 조력을 받아 가처분 신청 및 형사 고소 등 단계별 법적 절차를 밟아야 기업의 소중한 자산을 온전히 지켜낼 수 있다”",
    kind: "보도",
  },
  {
    title: "지식재산권 분쟁에 휘말리지 않고 ‘내 아이디어 지키는 법’",
    outlet: "로이슈",
    date: "2026-04-29",
    url: "https://www.lawissue.co.kr/view.php?ud=2026042910234863676cf2d78c68_12",
    dek: "“지식재산권 분쟁은 단순한 법리 싸움을 넘어 기업의 미래 가치를 방어하는 경영 전략의 일환이며, 침해 초기 단계에서 기업이 보유한 기술의 본질과 이에 대해 확보하고 있는 권리의 보호범위를 명확하게 파악하고, 내용증명을 통해 어떤 메시지를 전달하느냐가 승패를 가르는 결정적 요소가 된다”",
    kind: "보도",
  },
];

export const pressSorted = (): PressItem[] =>
  [...PRESS].sort((a, b) => b.date.localeCompare(a.date));
