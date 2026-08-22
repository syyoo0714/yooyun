import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import NoteCard from "@/components/NoteCard";
import Disclaimer from "@/components/Disclaimer";
import { getNote, getNotes, getRelatedNotes, toBlocks } from "@/lib/notes";

type Params = { params: Promise<{ slug: string }> };

/** 로컬 폴백 목록으로 정적 경로를 미리 만든다(DB가 붙으면 그쪽이 우선). */
export async function generateStaticParams() {
  const notes = await getNotes();
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNote(slug);
  if (!note) return { title: "찾을 수 없는 글" };
  return {
    title: note.title,
    description: note.dek || note.summary[0],
    openGraph: { title: note.title, description: note.dek, type: "article" },
  };
}

export default async function NotePage({ params }: Params) {
  const { slug } = await params;
  const note = await getNote(slug);
  if (!note) notFound();

  const blocks = toBlocks(note.body);
  const related = await getRelatedNotes(note);

  return (
    <>
      <PageHero eyebrow={note.seriesLabel} title={note.title} desc={note.dek} />

      <article className="section">
        <div className="container-narrow">
          <p className="note-date" style={{ marginBottom: 24 }}>
            {note.publishedAt}
          </p>

          {note.summary.length > 0 && (
            <div className="summary-box">
              <div className="t">3줄 요약</div>
              <ol>
                {note.summary.map((s, i) => (
                  <li key={i}>
                    <span className="n">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="prose">
            {blocks.map((b, i) => {
              if (b.kind === "rule") return <div className="rule" key={i} />;
              if (b.kind === "part")
                return (
                  <h2 className="part" key={i}>
                    {b.text}
                  </h2>
                );
              if (b.kind === "star")
                return (
                  <strong className="star" key={i}>
                    {b.text}
                  </strong>
                );
              return <p key={i}>{b.text}</p>;
            })}
          </div>

          {note.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 40 }}>
              {note.tags.map((t) => (
                <span className="chip" key={t}>
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div style={{ marginTop: 32 }}>
            <Disclaimer />
          </div>

          {related.length > 0 && (
            <div style={{ marginTop: 56 }}>
              <div className="section-head">
                <div>
                  <span className="folio">같은 시리즈</span>
                  <h2>{note.seriesLabel}</h2>
                </div>
                <Link href="/notes" className="more">
                  전체 목록 →
                </Link>
              </div>
              {related.map((n) => (
                <NoteCard note={n} key={n.slug} />
              ))}
            </div>
          )}
        </div>
      </article>
    </>
  );
}
