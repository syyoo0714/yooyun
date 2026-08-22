import Link from "next/link";
import type { NoteMeta } from "@/lib/notes";

export default function NoteCard({ note }: { note: NoteMeta }) {
  return (
    <Link href={`/notes/${encodeURIComponent(note.slug)}`} className="note-card">
      <div className="meta">
        <span className="chip chip-accent">{note.seriesLabel}</span>
        <span className="note-date">{note.publishedAt}</span>
      </div>
      <h3>{note.title}</h3>
      {note.dek && <p className="dek">{note.dek}</p>}
    </Link>
  );
}
