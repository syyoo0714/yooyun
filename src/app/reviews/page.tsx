import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionHead from "@/components/SectionHead";
import JsonLd from "@/components/JsonLd";
import ReviewCard from "@/components/ReviewCard";
import { reviews, REVIEW_TOTAL, REVIEW_ASOF, REVIEW_KEYWORDS, LAWTALK_PROFILE } from "@/data/reviews";
import { pageMeta, graph, breadcrumbLd, webPageLd, IDS } from "@/lib/seo";
import { absUrl } from "@/lib/site";

const DESC = `유연 변호사·변리사(법무법인 리브로)의 로톡 유료 전화상담 의뢰인 후기 ${REVIEW_TOTAL}건 중 공개 후기를 원문 그대로 옮겼습니다. 계약일반·매매, 대여금·채권추심, 지식재산권, 상속 분야.`;

export const metadata: Metadata = pageMeta({ title: "의뢰인 후기", description: DESC, path: "/reviews" });

export default function ReviewsPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageLd({ type: "WebPage", name: "의뢰인 후기", path: "/reviews", description: DESC }),
          ...reviews.map((r, i) => ({
            "@type": "Review",
            "@id": `${absUrl("/reviews")}#review-${i + 1}`,
            itemReviewed: { "@id": IDS.person },
            author: { "@type": "Person", name: `로톡 의뢰인 ${r.user}` },
            datePublished: r.ym,
            name: r.title,
            reviewBody: [r.title, ...r.body].join(" "),
            about: `${r.field} 분야 로톡 ${r.kind}`,
            publisher: { "@type": "Organization", name: "로톡", url: LAWTALK_PROFILE },
            isBasedOn: LAWTALK_PROFILE,
            inLanguage: "ko-KR",
          })),
          breadcrumbLd([{ name: "의뢰인 후기", path: "/reviews" }])
        )}
      />
      <PageHero
        eyebrow="REVIEWS"
        title="의뢰인 후기"
        desc={`로톡 유료 전화상담을 마친 의뢰인이 로톡에 남긴 후기입니다. 로톡 표시 ${REVIEW_TOTAL}건 중 공개된 후기를 원문 그대로 옮겼고, 상담 내용은 싣지 않았습니다.`}
      />

      <section className="section">
        <div className="container-narrow">
          <SectionHead no="01" title="의뢰인이 자주 고른 표현" />
          <ul className="review-keywords">
            {REVIEW_KEYWORDS.map((k) => (
              <li key={k.label}>
                <span>{k.label}</span>
                <b>{k.pct}%</b>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 56 }}>
            <SectionHead no="02" title={`후기 원문 ${reviews.length}건`} />
            <div className="reviews">
              {reviews.map((r, i) => (
                <ReviewCard review={r} key={i} />
              ))}
            </div>
          </div>

          <p className="small muted" style={{ marginTop: 32 }}>
            출처: 로톡 유연 변호사 프로필 「의뢰인후기」({REVIEW_ASOF} 기준). 의뢰인 아이디는 로톡 표시대로 일부를 가렸습니다.{" "}
            <a href={LAWTALK_PROFILE} target="_blank" rel="noreferrer">
              로톡에서 원문 보기
            </a>{" "}
            · <Link href="/contact">상담 문의</Link>
          </p>
        </div>
      </section>
    </>
  );
}
