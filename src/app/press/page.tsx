import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Disclaimer from "@/components/Disclaimer";
import JsonLd from "@/components/JsonLd";
import { pressSorted } from "@/data/press";
import { absUrl } from "@/lib/site";
import { pageMeta, graph, breadcrumbLd, webPageLd, pressLd } from "@/lib/seo";

const KINDS = ["기고", "인터뷰", "보도"] as const;

const DESC =
  "유연 변호사·변리사와 법무법인 리브로에 관한 언론 기사와 기고 모음 — 매체, 게재일, 원문 링크.";

export const metadata: Metadata = pageMeta({ title: "언론보도", description: DESC, path: "/press" });

export default function PressPage() {
  const items = pressSorted();

  return (
    <>
      <JsonLd
        data={graph(
          webPageLd({ type: "CollectionPage", name: "언론보도", path: "/press", description: DESC, extra: { mainEntity: { "@id": `${absUrl("/press")}#press` } } }),
          breadcrumbLd([{ name: "언론보도", path: "/press" }]),
          pressLd(items)
        )}
      />
      <PageHero
        eyebrow="Press"
        title="언론보도"
        desc="유연 변호사와 법무법인 리브로에 관한 기사와 기고를 모았습니다. 제목을 누르면 원문으로 이동합니다."
      />

      <section className="section">
        <div className="container-narrow">
          <nav
            aria-label="분류"
            style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}
          >
            <span className="chip chip-accent">전체 · {items.length}</span>
            {KINDS.map((k) => {
              const n = items.filter((p) => p.kind === k).length;
              return n ? (
                <span key={k} className="chip">
                  {k} · {n}
                </span>
              ) : null;
            })}
          </nav>

          <div className="rows" style={{ borderTop: "2px solid var(--fg)" }}>
            {items.length === 0 ? (
              <p className="muted" style={{ paddingBlock: 24 }}>게시된 기사가 아직 없습니다.</p>
            ) : (
              items.map((p) => (
                <a
                  key={p.url}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="note-card"
                >
                  <div className="meta">
                    <span className="chip chip-accent">
                      {p.outlet}
                      {p.section ? ` · ${p.section}` : ""}
                    </span>
                    <time className="note-date" dateTime={p.date}>
                      {p.date}
                    </time>
                  </div>
                  <h3>{p.title} ↗</h3>
                  {p.dek && <p className="dek">{p.dek}</p>}
                </a>
              ))
            )}
          </div>

          <div style={{ marginTop: 40 }}>
            <Disclaimer />
          </div>
        </div>
      </section>
    </>
  );
}
