import { DISCLAIMER, AD_NOTICE, CASE_NOTICE, DIAG_SHORT, DIAG_INDEX, DIAG_FULL } from "@/lib/site";

/**
 * 면책 고지. 서두·말미 문언이 어긋나지 않도록 반드시 이 컴포넌트만 쓴다(가드 G5).
 * withCases=true 이면 수행사건 표기 원칙을 함께 노출한다.
 * diag = 진단 페이지 전용 고지(short = 시작 버튼 아래, index = 지수 아래, full = 결과 맨 아래).
 */
export default function Disclaimer({
  withCases = false,
  diag,
}: {
  withCases?: boolean;
  diag?: "short" | "index" | "full";
}) {
  if (diag === "short" || diag === "index")
    return (
      <p className="disclaimer" style={{ fontSize: 13, lineHeight: 1.7 }}>
        {diag === "short" ? DIAG_SHORT : DIAG_INDEX}
      </p>
    );
  if (diag === "full")
    return (
      <div className="disclaimer">
        <p>
          <strong>※ 고지</strong>
        </p>
        {DIAG_FULL.map((t, i) => (
          <p key={i} style={{ marginTop: 6 }}>
            ({i + 1}) {t}
          </p>
        ))}
        <p style={{ marginTop: 8 }}>{AD_NOTICE}</p>
      </div>
    );
  return (
    <div className="disclaimer">
      <p>
        <strong>※ 고지</strong> {DISCLAIMER}
      </p>
      {withCases && <p style={{ marginTop: 8 }}>{CASE_NOTICE}</p>}
      <p style={{ marginTop: 8 }}>{AD_NOTICE}</p>
    </div>
  );
}
