"use client";

export default function PrintButton({ label = "인쇄 · PDF 저장" }: { label?: string }) {
  return (
    <button type="button" className="btn btn-ghost no-print" onClick={() => window.print()}>
      {label}
    </button>
  );
}
