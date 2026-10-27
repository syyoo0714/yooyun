import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { pageMeta, graph, breadcrumbLd, webPageLd } from "@/lib/seo";

/**
 * 개인정보처리방침 — 개인정보 보호법 제30조 제1항 각 호 기재사항 기준.
 * 구글 OAuth 앱(YYOO_ADs) 브랜드 인증에 이 주소(/privacy)를 등록한다.
 * 수집 항목·장치가 바뀌면(예: 광고 태그 추가) 이 문서와 시행일을 함께 고친다.
 */
const DESC = "유연 변호사 · 법무법인 리브로 웹사이트(seoyeonpapa.com)의 개인정보처리방침.";
const EFFECTIVE = "2026년 10월 27일";

export const metadata: Metadata = pageMeta({ title: "개인정보처리방침", description: DESC, path: "/privacy" });

const SECTIONS: { h: string; body: (string | string[])[] }[] = [
  {
    h: "1. 처리 목적",
    body: [
      "법무법인 리브로(이하 ‘법인’)는 이 웹사이트(https://seoyeonpapa.com, 이하 ‘사이트’)에서 다음 목적에 한하여 개인정보를 처리합니다.",
      ["상담 문의 접수 및 회신", "법인 내부 업무용 도구의 Google 서비스 연동(아래 7항)"],
    ],
  },
  {
    h: "2. 처리 항목",
    body: [
      ["상담 문의(필수): 성함, 연락처(전화번호 또는 이메일), 문의 내용", "상담 문의(선택): 문의 분야", "관리자 로그인: 관리자 계정 이메일과 로그인 유지 쿠키(법인 구성원만 해당)"],
      "사이트는 방문자 행태 분석용 쿠키나 광고 추적 도구를 쓰지 않습니다.",
    ],
  },
  {
    h: "3. 처리 및 보유 기간",
    body: [
      "상담 문의 정보는 회신 목적을 달성하면 지체 없이 파기합니다. 상담이 사건 수임으로 이어진 경우에는 그 사건 자료로 옮겨 관계 법령이 정한 기간 동안 보존합니다.",
    ],
  },
  {
    h: "4. 파기 절차 및 방법",
    body: [
      "보유 기간이 지나거나 목적을 달성한 개인정보는 데이터베이스에서 복구할 수 없는 방법으로 삭제합니다. 종이 문서로 출력한 경우에는 분쇄하거나 소각합니다.",
    ],
  },
  {
    h: "5. 제3자 제공",
    body: ["법인은 정보주체의 동의가 있거나 법령에 근거가 있는 경우를 제외하고 개인정보를 제3자에게 제공하지 않습니다."],
  },
  {
    h: "6. 처리 위탁 및 국외 이전",
    body: [
      "법인은 사이트 운영을 위하여 다음과 같이 개인정보 처리를 위탁하며, 해당 업체의 서버가 국외에 있어 개인정보가 국외로 이전될 수 있습니다.",
      [
        "Vercel Inc.(미국) — 사이트 호스팅 및 전송. 이전 항목: 2항의 상담 문의 정보. 이전 시기·방법: 문의 제출 시 네트워크로 전송.",
        "Supabase Inc.(미국) — 상담 문의 데이터베이스 저장. 이전 항목: 2항의 상담 문의 정보. 이전 시기·방법: 문의 제출 시 네트워크로 전송.",
      ],
      "보유 기간은 3항과 같습니다. 국외 이전을 원하지 않으시면 사이트 문의 양식 대신 아래 전화나 이메일로 문의하실 수 있습니다.",
    ],
  },
  {
    h: "7. Google 서비스 연동 시 받는 정보",
    body: [
      "법인은 내부 업무용 도구(앱 이름 YYOO_ADs)로 법인이 소유한 Google Ads 계정에 접속하여 광고 키워드 검색량·입찰가 등 계정 데이터를 조회합니다. 이 과정에서 Google 계정 인증 정보(액세스 토큰)와 Google Ads 계정 데이터를 받습니다.",
      ["받은 정보는 법인 광고 운영 판단에만 쓰고 제3자에게 제공하거나 판매하지 않습니다.", "인증 토큰은 법인 내부 컴퓨터에만 보관하며, 연동이 필요 없어지면 Google 계정 설정에서 접근 권한을 철회하고 토큰을 삭제합니다.", "이 도구는 법인 외부 이용자의 Google 계정 정보를 수집하지 않습니다."],
      "YYOO_ADs’ use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.",
    ],
  },
  {
    h: "8. 정보주체의 권리와 행사 방법",
    body: [
      "정보주체는 법인에 대하여 언제든지 자신의 개인정보 열람, 정정·삭제, 처리정지를 요구하거나 동의를 철회할 수 있습니다. 아래 연락처로 서면, 전화 또는 이메일로 요청하시면 지체 없이 조치합니다. 법정대리인이나 위임을 받은 사람을 통해서도 요청할 수 있습니다.",
    ],
  },
  {
    h: "9. 자동 수집 장치(쿠키)",
    body: [
      "사이트는 관리자 로그인 상태를 유지하기 위한 쿠키만 사용하며, 일반 방문자에게는 쿠키를 설정하지 않습니다. 브라우저 설정에서 쿠키 저장을 거부할 수 있습니다.",
    ],
  },
  {
    h: "10. 안전성 확보 조치",
    body: ["상담 문의 데이터베이스는 관리자만 조회할 수 있도록 접근 권한을 제한하고, 전송 구간은 암호화(HTTPS)합니다."],
  },
  {
    h: "11. 개인정보 보호책임자",
    body: [
      ["성명·직위: 유연 대표변호사", "소속: 법무법인 리브로, 서울 서초구 반포대로34길 14, 202호(서초동, 정명빌딩)", "전화: 02-532-9824", "이메일: lebro@lawlebro.com"],
      "개인정보 침해에 관한 상담은 개인정보침해신고센터(국번 없이 118), 개인정보분쟁조정위원회(1833-6972)에도 하실 수 있습니다.",
    ],
  },
  {
    h: "12. 시행일",
    body: [`이 개인정보처리방침은 ${EFFECTIVE}부터 적용합니다.`],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageLd({ type: "WebPage", name: "개인정보처리방침", path: "/privacy", description: DESC }),
          breadcrumbLd([{ name: "개인정보처리방침", path: "/privacy" }])
        )}
      />
      <PageHero eyebrow="Privacy" title="개인정보처리방침" desc={`시행일 ${EFFECTIVE}`} />

      <section className="section">
        <div className="container-narrow prose">
          {SECTIONS.map((s) => (
            <div key={s.h} style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: "var(--text-lg)", marginBottom: 10 }}>{s.h}</h2>
              {s.body.map((b, i) =>
                Array.isArray(b) ? (
                  <ul key={i} style={{ paddingLeft: 20, marginBottom: 10 }}>
                    {b.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={i} style={{ marginBottom: 10 }}>
                    {b}
                  </p>
                )
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
