import { DISCLAIMER, AD_NOTICE, CASE_NOTICE } from "@/lib/site";

/**
 * 면책 고지. 서두·말미 문언이 어긋나지 않도록 반드시 이 컴포넌트만 쓴다(가드 G5).
 * withCases=true 이면 수행사건 표기 원칙을 함께 노출한다.
 */
export default function Disclaimer({ withCases = false }: { withCases?: boolean }) {
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
