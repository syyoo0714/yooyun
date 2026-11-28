import type { Review } from "@/data/reviews";

/** 로톡 의뢰인 후기 한 건. 제목·본문은 원문 그대로, 아래 줄에 분야·상담 형태·시기·가린 아이디. */
export default function ReviewCard({ review: r }: { review: Review }) {
  return (
    <figure className="card review">
      <blockquote>
        <h3>{r.title}</h3>
        {r.body.map((b, i) => (
          <p key={i}>{b}</p>
        ))}
      </blockquote>
      <figcaption className="review-meta">
        {r.field} 분야 · 로톡 {r.kind} · {r.month} · 의뢰인 {r.user}
      </figcaption>
    </figure>
  );
}
