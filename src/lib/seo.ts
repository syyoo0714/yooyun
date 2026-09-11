import type { Metadata } from "next";
import { SITE, absUrl, notePath } from "@/lib/site";
import { profile, expertiseTags } from "@/data/profile";
import { education, credentials } from "@/data/career";
import type { PracticeArea } from "@/data/practice";
import type { NoteMeta } from "@/lib/notes";
import type { FaqItem } from "@/data/faq";

/**
 * 검색엔진(SEO) · 답변엔진(AEO) · 생성형 AI(GEO) 공통 계층.
 *
 *   pageMeta()  — 페이지별 canonical · OG · Twitter 를 한 번에 만든다.
 *   xxxLd()     — schema.org JSON-LD 노드. @id 로 서로 참조해 하나의 지식그래프가 되게 한다.
 *
 * ⚠️ 구조화 데이터도 광고다. 화면에 없는 사실을 넣지 않는다(G1).
 *    값은 전부 CV 정본에서 온 data/*.ts 를 그대로 쓴다. 평점·수상·"최고" 류 속성은 넣지 않는다(G6).
 */

export const IDS = {
  person: `${SITE.url}/#person`,
  firm: `${SITE.url}/#firm`,
  website: `${SITE.url}/#website`,
} as const;

const OG_IMAGE = {
  url: "/portrait-sq-960.jpg",
  width: 960,
  height: 960,
  alt: "유연 변호사 · 변리사 (법무법인 리브로)",
};

export function pageMeta({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  tags,
}: {
  title?: string;
  description: string;
  path: string;
  type?: "website" | "profile" | "article";
  publishedTime?: string;
  tags?: string[];
}): Metadata {
  const url = absUrl(path);
  const ogTitle = title ? `${title} | 유연 변호사` : "유연 변호사 · 변리사 | 법무법인 리브로";
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: SITE.name,
      locale: "ko_KR",
      type,
      images: [OG_IMAGE],
      ...(type === "article"
        ? { publishedTime, authors: [absUrl("/profile")], tags }
        : {}),
    },
    twitter: { card: "summary", title: ogTitle, description, images: [OG_IMAGE.url] },
  };
}

/* ---------- 엔티티 (사이트 전역) ---------- */

const eduOrg = (title: string) => ({
  "@type": title.includes("법학전문대학원") ? "EducationalOrganization" : "CollegeOrUniversity",
  name: title,
});

export function personLd() {
  const c = profile.contact;
  return {
    "@type": "Person",
    "@id": IDS.person,
    name: "유연",
    alternateName: ["YOO YEON", "유연 변호사", "유연 변리사"],
    jobTitle: ["대표변호사", "변리사"],
    description: `${profile.lede} ${profile.intro[1]}`,
    image: absUrl("/portrait-sq-960.jpg"),
    url: absUrl("/profile"),
    mainEntityOfPage: absUrl("/profile"),
    worksFor: { "@id": IDS.firm },
    alumniOf: education.filter((e) => !e.title.includes("고등학교")).map((e) => eduOrg(e.title)),
    hasCredential: credentials.map((cr) => ({
      "@type": "EducationalOccupationalCredential",
      name: cr.title,
      credentialCategory: "license",
      dateCreated: cr.period,
    })),
    hasOccupation: [
      { "@type": "Occupation", name: "변호사", occupationLocation: { "@type": "Country", name: "대한민국" } },
      { "@type": "Occupation", name: "변리사", occupationLocation: { "@type": "Country", name: "대한민국" } },
    ],
    memberOf: profile.memberships.map((m) => ({
      "@type": "Organization",
      name: m.replace(/\s*회원$/, ""),
    })),
    knowsAbout: expertiseTags.map((t) => t.replace(/\s·\s/g, "·")),
    knowsLanguage: ["ko", "en"],
    email: c.email,
    telephone: "+82-2-532-9824",
    sameAs: [c.blog],
  };
}

export function firmLd() {
  const c = profile.contact;
  return {
    "@type": "LegalService",
    "@id": IDS.firm,
    name: c.firm,
    alternateName: profile.affiliationEn,
    url: c.site,
    telephone: "+82-2-532-9824",
    faxNumber: "+82-2-532-9825",
    email: c.email,
    taxID: c.bizNo,
    foundingDate: "2025-07",
    image: absUrl("/portrait-sq-960.jpg"),
    address: {
      "@type": "PostalAddress",
      streetAddress: "반포대로34길 14, 202호(서초동, 정명빌딩)",
      addressLocality: "서초구",
      addressRegion: "서울특별시",
      addressCountry: "KR",
    },
    areaServed: { "@type": "Country", name: "대한민국" },
    founder: { "@id": IDS.person },
    employee: { "@id": IDS.person },
  };
}

export function websiteLd() {
  return {
    "@type": "WebSite",
    "@id": IDS.website,
    name: SITE.name,
    url: absUrl("/"),
    inLanguage: "ko-KR",
    about: { "@id": IDS.person },
    publisher: { "@id": IDS.person },
  };
}

/** layout 에 한 번 싣는 전역 그래프 */
export function siteGraph() {
  return { "@context": "https://schema.org", "@graph": [websiteLd(), personLd(), firmLd()] };
}

/* ---------- 페이지 단위 ---------- */

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  const items = [{ name: "홈", path: "/" }, ...trail];
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  };
}

export function webPageLd({
  type = "WebPage",
  name,
  path,
  description,
  extra,
}: {
  type?: string;
  name: string;
  path: string;
  description: string;
  extra?: Record<string, unknown>;
}) {
  return {
    "@type": type,
    "@id": `${absUrl(path)}#webpage`,
    url: absUrl(path),
    name,
    description,
    inLanguage: "ko-KR",
    isPartOf: { "@id": IDS.website },
    about: { "@id": IDS.person },
    ...extra,
  };
}

export function serviceLd(a: PracticeArea) {
  return {
    "@type": "Service",
    "@id": `${absUrl("/practice")}#${a.key}`,
    name: a.title,
    serviceType: a.tags,
    description: `${a.summary} ${a.detail}`,
    provider: { "@id": IDS.person },
    brand: { "@id": IDS.firm },
    areaServed: { "@type": "Country", name: "대한민국" },
    url: absUrl(`/practice#${a.key}`),
  };
}

export function faqLd(items: FaqItem[]) {
  return {
    "@type": "FAQPage",
    "@id": `${absUrl("/faq")}#faq`,
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function blogPostingLd(n: NoteMeta, wordCount?: number) {
  const url = absUrl(notePath(n.slug));
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: n.title,
    description: n.dek || n.summary[0],
    abstract: n.summary.join(" "),
    datePublished: n.publishedAt,
    dateModified: n.publishedAt,
    inLanguage: "ko-KR",
    keywords: n.tags.join(", "),
    articleSection: n.seriesLabel,
    ...(wordCount ? { wordCount } : {}),
    image: absUrl("/portrait-sq-960.jpg"),
    author: { "@id": IDS.person },
    publisher: { "@id": IDS.firm },
    isPartOf: { "@id": `${absUrl("/notes")}#blog` },
  };
}

export function blogLd(notes: NoteMeta[]) {
  return {
    "@type": "Blog",
    "@id": `${absUrl("/notes")}#blog`,
    name: "기업법 노트",
    url: absUrl("/notes"),
    inLanguage: "ko-KR",
    author: { "@id": IDS.person },
    publisher: { "@id": IDS.firm },
    blogPost: notes.map((n) => ({
      "@type": "BlogPosting",
      headline: n.title,
      url: absUrl(notePath(n.slug)),
      datePublished: n.publishedAt,
    })),
  };
}

/** 페이지에서 여러 노드를 한 스크립트로 묶는다 */
export const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });
