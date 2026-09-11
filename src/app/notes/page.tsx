import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import NoteCard from "@/components/NoteCard";
import Disclaimer from "@/components/Disclaimer";
import { getNotes, SERIES_LABEL, type SeriesKey } from "@/lib/notes";
import JsonLd from "@/components/JsonLd";
import { pageMeta, graph, webPageLd, breadcrumbLd, blogLd } from "@/lib/seo";

const DESC =
  "유연 변호사가 쓰는 기업법·지식재산 칼럼. 특허·영업비밀·직무발명·자본시장·가상자산을 사건과 조문으로 풀어 씁니다.";

/** ?series= 필터 화면도 canonical 은 /notes/ 하나로 모은다(중복 색인 방지). */
export const metadata: Metadata = pageMeta({ title: "기업법 노트", description: DESC, path: "/notes" });

const ORDER: SeriesKey[] = ["corporate", "essay", "ipfinance"];

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ series?: string }>;
}) {
  const { series } = await searchParams;
  const all = await getNotes();

  const active = ORDER.includes(series as SeriesKey) ? (series as SeriesKey) : null;
  const notes = active ? all.filter((n) => n.seriesKey === active) : all;

  const counts = ORDER.map((k) => ({
    key: k,
    label: SERIES_LABEL[k],
    n: all.filter((x) => x.seriesKey === k).length,
  }));

  return (
    <>
      <JsonLd
        data={graph(
          webPageLd({ type: "CollectionPage", name: "기업법 노트", path: "/notes", description: DESC }),
          blogLd(all),
          breadcrumbLd([{ name: "기업법 노트", path: "/notes" }])
        )}
      />
      <PageHero
        eyebrow="Notes"
        title="기업법 노트"
        desc="사건과 조문으로 풀어 쓴 기업법·지식재산 칼럼입니다. 일반적 정보·교육 목적의 글이며 개별 사안에 대한 법률자문이 아닙니다."
      />

      <section className="section">
        <div className="container-narrow">
          <nav
            aria-label="시리즈"
            style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}
          >
            <Link href="/notes" className={`chip${active ? "" : " chip-accent"}`}>
              전체 · {all.length}
            </Link>
            {counts.map((c) => (
              <Link
                key={c.key}
                href={`/notes?series=${c.key}`}
                className={`chip${active === c.key ? " chip-accent" : ""}`}
              >
                {c.label} · {c.n}
              </Link>
            ))}
          </nav>

          <div className="rows" style={{ borderTop: "2px solid var(--fg)" }}>
            {notes.map((n) => (
              <NoteCard note={n} key={n.slug} />
            ))}
          </div>

          <div style={{ marginTop: 40 }}>
            <Disclaimer />
          </div>
        </div>
      </section>
    </>
  );
}
