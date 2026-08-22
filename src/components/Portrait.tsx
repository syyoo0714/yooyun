/**
 * 초상 사진. 파생본은 scripts/build-portrait.mjs 가 만든다.
 *   4:5  portrait-{720,1080}.{webp,jpg}
 *   1:1  portrait-sq-{480,960}.{webp,jpg}
 *
 * next/image 를 쓰지 않는 이유 — next.config 에서 images.unoptimized 이므로
 * 최적화 이득이 없고, <picture> 로 webp/jpg 폴백을 직접 주는 편이 명확하다.
 */
export default function Portrait({
  shape = "portrait",
  priority = false,
  caption,
}: {
  shape?: "portrait" | "square";
  priority?: boolean;
  caption?: string;
}) {
  const sq = shape === "square";
  const base = sq ? "/portrait-sq" : "/portrait";
  const small = sq ? 480 : 720;
  const large = sq ? 960 : 1080;

  return (
    <figure className={`portrait${sq ? " portrait-sq" : ""}`}>
      <picture>
        <source
          type="image/webp"
          srcSet={`${base}-${small}.webp ${small}w, ${base}-${large}.webp ${large}w`}
          sizes="(min-width: 920px) 380px, 100vw"
        />
        <img
          src={`${base}-${large}.jpg`}
          srcSet={`${base}-${small}.jpg ${small}w, ${base}-${large}.jpg ${large}w`}
          sizes="(min-width: 920px) 380px, 100vw"
          alt="유연 변호사 · 변리사"
          width={sq ? 960 : 864}
          height={sq ? 960 : 1080}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
        />
      </picture>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
