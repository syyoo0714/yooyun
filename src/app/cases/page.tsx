import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CaseList from "@/components/CaseList";
import Disclaimer from "@/components/Disclaimer";
import { getCaseSections } from "@/lib/content";
import { publishedCases } from "@/data/cases";

export const metadata: Metadata = {
  title: "수행사건",
  description:
    "특허 분쟁, 특허 자문, 영업비밀·산업기술보호, 전직금지, 디자인·상표·저작권, 직무발명·기술거래, 기업법무, 개인정보·오픈소스, 가상자산, 약국·의료, 형사·행정 수행사건.",
};

export default async function CasesPage() {
  const sections = await getCaseSections();
  const total = sections.reduce((n, s) => n + s.items.length, 0);

  return (
    <>
      <PageHero
        eyebrow="Representative Matters"
        title={`수행사건 ${total}건`}
        desc="의뢰인 보호를 위해 당사자명과 사건번호는 모두 제거하고 기술·분야 수준으로만 적었습니다. 기재된 결과는 해당 사건의 사실관계에 따른 것으로 다른 사건의 결과를 보장하지 않습니다."
      />

      <section className="section">
        <div className="container">
          <nav
            aria-label="사건 분류"
            style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}
          >
            {sections.map((s) => (
              <a href={`#s${s.no}`} key={s.no} className="chip">
                {s.no} {s.title} · {s.items.length}
              </a>
            ))}
          </nav>

          {sections.map((s) => (
            <div key={s.no} id={`s${s.no}`} style={{ marginBottom: 56 }}>
              <div className="section-head">
                <div>
                  <span className="folio">{s.no}</span>
                  <h2>{s.title}</h2>
                </div>
                <span className="more mono">{s.items.length}건</span>
              </div>
              <CaseList items={s.items} />
            </div>
          ))}

          <div className="section-head">
            <div>
              <span className="folio">부록</span>
              <h2>법무법인 리브로 홈페이지 기게시 성공사례</h2>
            </div>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: 110 }}>게시번호</th>
                  <th>사건</th>
                </tr>
              </thead>
              <tbody>
                {publishedCases.map((c, i) => (
                  <tr key={i}>
                    <td className="y">{c.no}</td>
                    <td>{c.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 40 }}>
            <Disclaimer withCases />
          </div>
        </div>
      </section>
    </>
  );
}
