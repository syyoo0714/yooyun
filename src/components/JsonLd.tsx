/**
 * schema.org 구조화 데이터. Next 16 권장 방식대로 네이티브 <script> 로 싣는다.
 * `<` 를 이스케이프해 문자열 안의 태그가 스크립트를 닫지 못하게 한다.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
