/**
 * 자주 묻는 질문 — AEO(답변엔진) · GEO(생성형 AI 인용)용.
 *
 * 원칙
 *   · 답은 첫 문장에서 끝낸다(답변 우선). 뒷문장은 근거.
 *   · 새 사실을 만들지 않는다. 문구는 profile.ts · career.ts · practice.ts · cv.generated.json
 *     (= CV 정본)과 문의 페이지의 기존 안내문을 옮겨 쓴다(G1).
 *   · 결과 보장·자기비교·"유일/최고" 금지(G6). 비용·보수 언급 금지.
 *   · 화면에 보이는 문답과 FAQPage JSON-LD 가 같은 배열에서 나온다(구조화 데이터 = 화면 내용).
 */

import { profile } from "@/data/profile";
import { practiceAreas } from "@/data/practice";
import { patentPractice } from "@/data/career";
import type { CaseSection } from "@/data/cases";

export type FaqItem = { q: string; a: string };
export type FaqGroup = { key: string; title: string; items: FaqItem[] };

const area = (key: string) => practiceAreas.find((a) => a.key === key)!;

export function buildFaq(sections: CaseSection[]): FaqGroup[] {
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const count = (no: string) => sections.find((s) => s.no === no)?.items.length ?? 0;
  const top3 = [...sections]
    .sort((a, b) => b.items.length - a.items.length)
    .slice(0, 3)
    .map((s) => `${s.title.split(" — ")[0]} ${s.items.length}건`)
    .join(", ");
  const c = profile.contact;

  return [
    {
      key: "about",
      title: "변호사 소개",
      items: [
        {
          q: "유연 변호사는 어떤 변호사인가요?",
          a:
            "유연 변호사는 법무법인 리브로의 대표변호사이자 변리사로, 특허·영업비밀 등 지식재산과 기술분쟁을 다룹니다. " +
            "서울대학교 전기공학부를 졸업하고 특허법인 신성에서 7년간(2010~2017) 반도체 설계 전문 변리사로 일한 뒤, " +
            "성균관대학교 법학전문대학원을 수석으로 졸업하고 제9회 변호사시험에 합격했습니다. " +
            "법무법인(유한) 바른과 법무법인(유) 세종 지식재산권그룹을 거쳐 2025년 7월 법무법인 리브로를 열었습니다.",
        },
        {
          q: "변호사 자격과 변리사 자격을 모두 가지고 있나요?",
          a:
            "네. 2010년 제46회 변리사시험과 2020년 제9회 변호사시험에 합격했고, 대한변리사회(KPAA)와 대한변호사협회 회원입니다.",
        },
        {
          q: "변리사로 일할 때 어떤 기술을 다뤘나요?",
          a:
            "국내 대형 반도체 제조사를 주 고객으로 DRAM·플래시메모리·SSD 등 반도체 설계 핵심기술의 국내·해외 특허를 200건 이상 출원했습니다. " +
            patentPractice.slice(2).join(", ") +
            " 업무도 했습니다.",
        },
        {
          q: "어떤 분야의 사건을 주로 다루나요?",
          a:
            "특허침해소송과 심결취소소송, 영업비밀·산업기술보호, 전직금지, 디자인·상표·저작권 분쟁을 주로 다룹니다. " +
            "이 밖에 직무발명·기술거래·IP 실사, 기업법무·규제·가상자산, 약국·의료기관 대상 자문을 합니다.",
        },
        {
          q: "지금까지 어떤 사건을 수행했나요?",
          a:
            `수행사건 ${total}건을 ${sections.length}개 분야로 나누어 공개하고 있습니다(${top3} 등). ` +
            "의뢰인 보호를 위해 당사자명과 사건번호는 제거하고 기술·분야 수준으로만 적었으며, 기재된 결과는 해당 사건의 사실관계에 따른 것으로 다른 사건의 결과를 보장하지 않습니다.",
        },
      ],
    },
    {
      key: "practice",
      title: "업무분야",
      items: [
        {
          q: "특허침해 사건은 어떤 방식으로 검토하나요?",
          a:
            area("patent").detail +
            " 침해금지·손해배상 소송과 함께 특허등록무효·권리범위확인 심판, 심결취소소송을 다룹니다.",
        },
        {
          q: "분쟁이 생기기 전에 받을 수 있는 특허 자문은 무엇인가요?",
          a: area("advisory").detail,
        },
        {
          q: "영업비밀 유출 사건에서 중요한 쟁점은 무엇인가요?",
          a: area("trade-secret").detail,
        },
        {
          q: "전직금지·경업금지 가처분 사건도 다루나요?",
          a:
            `네. 기술 유출 민·형사 대응과 함께 전직금지·경업금지 가처분을 다루며, 이 분야 수행사건 ${count("07")}건을 공개하고 있습니다.`,
        },
        {
          q: "디자인·상표·저작권 분쟁은 어떻게 접근하나요?",
          a: area("design-tm").detail,
        },
        {
          q: "직무발명 보상이나 기술기업 인수 실사도 하나요?",
          a: area("tech-deal").detail,
        },
        {
          q: "약국·의료기관 관련 자문도 하나요?",
          a:
            `네. 약국·의료 분야 수행사건 ${count("13")}건을 공개하고 있습니다. ` +
            "『개국 약사를 위한 법률 처방전』(군자출판사, 2026 출간 예정)을 대표저자로 공저했고, 개국준비모임(개준모) 약사 대상 법률칼럼을 연재하고 있으며, " +
            "2026년 8월 KYPG 초청 약사 세미나 「약국 양수도의 법률 리스크」에서 강연했습니다.",
        },
        {
          q: "가상자산·개인정보·오픈소스 문제도 다루나요?",
          a: area("corporate").detail,
        },
      ],
    },
    {
      key: "consult",
      title: "상담 · 연락",
      items: [
        {
          q: "상담은 어떻게 신청하나요?",
          a:
            `이 사이트의 문의 페이지 양식이나 전화(${c.tel}), 이메일(${c.email})로 신청할 수 있습니다. ` +
            "소멸시효·제척기간 등 기한이 임박한 사안은 전화로 먼저 연락해 주십시오.",
        },
        {
          q: "문의를 접수하면 바로 위임계약이 성립하나요?",
          a:
            "아니요. 문의 접수는 상담 회신을 위한 것으로, 접수 자체가 위임계약의 성립이나 법률자문의 제공을 뜻하지 않습니다.",
        },
        {
          q: "사무소는 어디에 있나요?",
          a: `${c.firm} 사무소는 ${c.address}에 있습니다. 전화 ${c.tel}, 팩스 ${c.fax}입니다.`,
        },
        {
          q: "기업법 노트는 어떤 글인가요?",
          a:
            "유연 변호사가 특허·영업비밀·직무발명·자본시장·가상자산 등 기업법과 지식재산을 사건과 조문으로 풀어 쓴 칼럼입니다. " +
            "일반적 정보·교육 목적의 글이며 개별 사안에 대한 법률자문이 아닙니다.",
        },
      ],
    },
  ];
}
