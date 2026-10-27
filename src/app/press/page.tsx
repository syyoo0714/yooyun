import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Disclaimer from "@/components/Disclaimer";
import JsonLd from "@/components/JsonLd";
import { pressSorted } from "@/data/press";
import { pageMeta, graph, breadcrumbLd, webPageLd } from "@/lib/seo";

const DESC =
  "유연 변호사·변리사와 법무법인 리브로에 관한 언론 기사와 기고 모음 — 매체, 게재일, 원문 링크.";

export const metadata: Metadata = pageMeta({ title: "언론보도", description: DESC, path: "/press" });

export default function PressPage() {
  const items = pressSorted();

  return (
    <>
      <JsonLd
        data={graph(
          webPageLd({ type: "CollectionPage", name: "언론보도", path: "/press", description: DESC }),
          breadcrumbLd([{ name: "언론보도", path: "/press" }])
        )}
      />
      <PageHero
        eyebrow="Press"
        title="언론보도"
        desc="유연 변호사와 법무법인 리브로에 관한 기사와 기고를 모았습니다. 제목을 누르면 원문으로 이동합니다."
      />

      <section className="section">
        <div className="container-narrow">
          {items.length === 0 ? (
            <p className="muted">게시된 기사가 아직 없습니다.</p>
          ) : (
            <div>
              {items.map((p) => (
                <a
                  key={p.url}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="note-card"
                >
                  <div className="meta">
                    <span className="chip chip-accent">{p.outlet}</span>
                    <span className="chip chip-status">{p.section ?? p.kind}</span>
                    <time className="note-date" dateTime={p.date}>
                      {p.date.replaceAll("-", ".")}
                    </time>
                  </div>
                  <h3>{p.title} ↗</h3>
                  {p.dek && <p className="dek">{p.dek}</p>}
                </a>
              ))}
            </div>
          )}

          <div style={{ marginTop: 40 }}>
            <Disclaimer />
          </div>
        </div>
      </section>
    </>
  );
}
