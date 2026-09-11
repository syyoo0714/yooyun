import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Disclaimer from "@/components/Disclaimer";
import CaseList from "@/components/CaseList";
import { getPracticeAreas, getCaseSections } from "@/lib/content";
import JsonLd from "@/components/JsonLd";
import { pageMeta, graph, webPageLd, breadcrumbLd, serviceLd } from "@/lib/seo";

const DESC =
  "유연 변호사·변리사 업무분야 — 특허 분쟁, 특허 자문·회피설계, 영업비밀·산업기술보호·전직금지, 디자인·상표·저작권, 직무발명·기술거래·IP 실사, 기업법무·규제·가상자산.";

export const metadata: Metadata = pageMeta({ title: "업무분야", description: DESC, path: "/practice" });

export default async function PracticePage() {
  const [areas, sections] = await Promise.all([getPracticeAreas(), getCaseSections()]);
  const byNo = new Map(sections.map((s) => [s.no, s]));

  return (
    <>
      <JsonLd
        data={graph(
          webPageLd({
            type: "CollectionPage",
            name: "업무분야",
            path: "/practice",
            description: DESC,
            extra: { hasPart: areas.map((a) => ({ "@id": serviceLd(a)["@id"] })) },
          }),
          ...areas.map(serviceLd),
          breadcrumbLd([{ name: "업무분야", path: "/practice" }])
        )}
      />
      <PageHero
        eyebrow="Practice Areas"
        title="업무분야"
        desc="도면·명세서·소스코드를 직접 해독해야 결론이 갈리는 분쟁을 다룹니다. 각 분야 아래에 실제 수행사건을 함께 두었습니다."
      />

      {areas.map((a) => (
        <section className="section" id={a.key} key={a.key}>
          <div className="container">
            <div className="section-head">
              <div>
                <span className="folio">{a.no}</span>
                <h2>{a.title}</h2>
              </div>
              <Link href="/cases" className="more">
                수행사건 전체 →
              </Link>
            </div>

            <div className="grid-2">
              <div>
                <p className="lede">{a.summary}</p>
                <p style={{ marginTop: 16 }}>{a.detail}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
                  {a.tags.map((t) => (
                    <span className="chip chip-accent" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                {a.cvSections.map((no) => {
                  const s = byNo.get(no);
                  if (!s) return null;
                  const shown = s.items.slice(0, 6);
                  const rest = s.items.length - shown.length;
                  return (
                    <div key={no} style={{ marginBottom: 28 }}>
                      <h4 style={{ marginBottom: 8 }}>
                        <span className="folio">{s.no}</span> {s.title}
                      </h4>
                      <CaseList items={shown} />
                      {rest > 0 && (
                        <p className="small muted" style={{ marginTop: 10 }}>
                          외 {rest}건 —{" "}
                          <Link href="/cases" style={{ color: "var(--meta)" }}>
                            수행사건에서 보기
                          </Link>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="section-tight">
        <div className="container">
          <p className="small muted" style={{ marginBottom: 16 }}>
            분야별로 자주 받는 질문은 <Link href="/faq#practice">자주 묻는 질문</Link>에 정리해 두었습니다.
          </p>
          <Disclaimer withCases />
        </div>
      </section>
    </>
  );
}
