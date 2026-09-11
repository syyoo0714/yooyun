import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionHead from "@/components/SectionHead";
import Disclaimer from "@/components/Disclaimer";
import JsonLd from "@/components/JsonLd";
import { getCaseSections } from "@/lib/content";
import { buildFaq } from "@/data/faq";
import { pageMeta, graph, faqLd, breadcrumbLd, webPageLd } from "@/lib/seo";

const DESC =
  "유연 변호사·변리사(법무법인 리브로)에 대해 자주 묻는 질문 — 이력과 자격, 업무분야(특허침해소송·영업비밀·전직금지·디자인·상표·직무발명·약국), 상담 방법과 사무소 위치.";

export const metadata: Metadata = pageMeta({ title: "자주 묻는 질문", description: DESC, path: "/faq" });

export default async function FaqPage() {
  const groups = buildFaq(await getCaseSections());
  const all = groups.flatMap((g) => g.items);

  return (
    <>
      <JsonLd
        data={graph(
          webPageLd({ type: "WebPage", name: "자주 묻는 질문", path: "/faq", description: DESC }),
          faqLd(all),
          breadcrumbLd([{ name: "자주 묻는 질문", path: "/faq" }])
        )}
      />
      <PageHero
        eyebrow="FAQ"
        title="자주 묻는 질문"
        desc="유연 변호사의 이력과 업무분야, 상담 절차에 대해 자주 받는 질문을 모았습니다."
      />

      <section className="section">
        <div className="container-narrow">
          {groups.map((g, gi) => (
            <div key={g.key} id={g.key} style={{ marginBottom: 56 }}>
              <SectionHead no={String(gi + 1).padStart(2, "0")} title={g.title} />
              <div className="faq">
                {g.items.map((f) => (
                  <details key={f.q} open={gi === 0}>
                    <summary>
                      <h3>{f.q}</h3>
                    </summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <p className="small muted" style={{ marginBottom: 24 }}>
            더 자세한 내용은 <Link href="/profile">프로필</Link> · <Link href="/practice">업무분야</Link> ·{" "}
            <Link href="/cases">수행사건</Link> 페이지에 있습니다.
          </p>
          <Disclaimer withCases />
        </div>
      </section>
    </>
  );
}
