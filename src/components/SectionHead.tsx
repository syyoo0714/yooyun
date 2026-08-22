import Link from "next/link";

/** 신문 조판식 섹션 헤드 — 번호(folio) + 제목 + 더보기 */
export default function SectionHead({
  no,
  title,
  more,
  moreLabel = "전체 보기",
}: {
  no?: string;
  title: string;
  more?: string;
  moreLabel?: string;
}) {
  return (
    <div className="section-head">
      <div>
        {no && <span className="folio">{no}</span>}
        <h2>{title}</h2>
      </div>
      {more && (
        <Link href={more} className="more">
          {moreLabel} →
        </Link>
      )}
    </div>
  );
}
