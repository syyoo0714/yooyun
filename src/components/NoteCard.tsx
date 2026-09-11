import Link from "next/link";
import type { NoteMeta } from "@/lib/notes";
import { notePath } from "@/lib/site";

export default function NoteCard({ note }: { note: NoteMeta }) {
  return (
    <Link href={notePath(note.slug)} className="note-card">
      <div className="meta">
        <span className="chip chip-accent">{note.seriesLabel}</span>
        <time className="note-date" dateTime={note.publishedAt}>
          {note.publishedAt}
        </time>
      </div>
      <h3>{note.title}</h3>
      {note.dek && <p className="dek">{note.dek}</p>}
    </Link>
  );
}
