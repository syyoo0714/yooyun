import type { CaseItem } from "@/data/cases";

/** 사건 목록 — 결과 표기는 em(브론즈)으로 분리해 본문과 구별한다. */
export default function CaseList({ items }: { items: CaseItem[] }) {
  return (
    <ul className="cases">
      {items.map((c, i) => (
        <li key={i}>
          {c.text}
          {c.outcome && <em className="outcome">▸ {c.outcome}</em>}
        </li>
      ))}
    </ul>
  );
}
