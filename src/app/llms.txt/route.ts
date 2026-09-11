import { absUrl, notePath, DISCLAIMER, CASE_NOTICE } from "@/lib/site";
import { getProfile, getEducation, getCredentials, getCareer, getPracticeAreas, getCaseSections } from "@/lib/content";
import { getNotes, SERIES_LABEL, type SeriesKey } from "@/lib/notes";
import { patentPractice } from "@/data/career";
import { expertiseTags } from "@/data/profile";
import { writings } from "@/data/cases";
import { buildFaq } from "@/data/faq";

/**
 * /llms.txt — 생성형 AI(ChatGPT · Claude · Perplexity 등)가 이 사이트를 한 번에 읽도록 만든 요약본(GEO).
 * 형식 = llmstxt.org 제안(H1 · 인용구 요약 · H2 섹션 · 링크 목록).
 * 내용은 화면과 같은 데이터 계층에서 나온다. 여기서만 쓰는 사실을 만들지 않는다(G1).
 */
export const dynamic = "force-static";

export async function GET() {
  const [profile, education, credentials, career, areas, sections, notes] = await Promise.all([
    getProfile(),
    getEducation(),
    getCredentials(),
    getCareer(),
    getPracticeAreas(),
    getCaseSections(),
    getNotes(),
  ]);
  const c = profile.contact;
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const faq = buildFaq(sections);
  const line = (t: { period: string; title: string; note?: string }) =>
    `- ${t.period} ${t.title}${t.note ? ` (${t.note})` : ""}`;

  const out: string[] = [
    "# 유연 변호사 · 변리사 (법무법인 리브로)",
    "",
    `> 유연(YOO YEON)은 법무법인 리브로 대표변호사이자 변리사입니다. ${profile.tagline}. ${profile.lede}`,
    "",
    "이 문서는 유연 변호사 공식 프로필 사이트의 요약본입니다. 인용할 때는 아래 각 항목의 원문 페이지 URL을 출처로 밝혀 주십시오.",
    "",
    "## 핵심 사실",
    "",
    `- 이름: 유연 (YOO YEON)`,
    `- 직함: ${profile.affiliation} ${profile.title}`,
    `- 자격: ${credentials.map((x) => x.title).join(", ")}`,
    `- 소속 단체: ${profile.memberships.join(", ")}`,
    `- 사무소: ${c.firm}, ${c.address}`,
    `- 연락처: 전화 ${c.tel} · 팩스 ${c.fax} · 이메일 ${c.email}`,
    `- 법무법인 리브로 홈페이지: ${c.site}`,
    `- 네이버 블로그: ${c.blog}`,
    `- 프로필 원문: ${absUrl("/profile")}`,
    "",
    "### 학력",
    ...education.map(line),
    "",
    "### 자격",
    ...credentials.map(line),
    "",
    "### 경력",
    ...career.map(line),
    "",
    "### 변리사 재직기 특허 · 기술 실무",
    ...patentPractice.map((t) => `- ${t}`),
    "",
    "## 업무분야",
    "",
    `전문분야: ${expertiseTags.join(", ")}`,
    "",
    ...areas.flatMap((a) => [
      `### ${a.title}`,
      `- 원문: ${absUrl(`/practice#${a.key}`)}`,
      `- 요약: ${a.summary}`,
      `- 설명: ${a.detail}`,
      `- 세부: ${a.tags.join(", ")}`,
      "",
    ]),
    "## 수행사건",
    "",
    `- 원문: ${absUrl("/cases")}`,
    `- 총 ${total}건, ${sections.length}개 분야: ${sections.map((s) => `${s.title} ${s.items.length}건`).join(" / ")}`,
    `- 표기 원칙: ${CASE_NOTICE}`,
    "",
    "## 저술 · 연재 · 강연",
    "",
    ...writings.flatMap((g) => g.items.map((it) => `- [${g.group}] ${it.text}`)),
    "",
    "## 자주 묻는 질문",
    "",
    `원문: ${absUrl("/faq")}`,
    "",
    ...faq.flatMap((g) => g.items.flatMap((f) => [`### ${f.q}`, f.a, ""])),
    "## 주요 페이지",
    "",
    `- [홈](${absUrl("/")}): 이력 요약 · 업무분야 · 대표 수행사건 · 최근 칼럼`,
    `- [프로필](${absUrl("/profile")}): 소개 · 학력 · 자격 · 경력 · 저술 · 대외활동`,
    `- [업무분야](${absUrl("/practice")}): 6개 분야와 분야별 수행사건`,
    `- [수행사건](${absUrl("/cases")}): ${total}건 전체(익명화)`,
    `- [CV](${absUrl("/cv")}): 경력기술서 전문`,
    `- [자주 묻는 질문](${absUrl("/faq")})`,
    `- [기업법 노트](${absUrl("/notes")}): 칼럼 ${notes.length}편`,
    `- [문의](${absUrl("/contact")}): 상담 문의 · 사무소 정보`,
    "",
    `## 기업법 노트 (${notes.length}편)`,
    "",
    ...(["corporate", "essay", "ipfinance"] as SeriesKey[]).flatMap((k) => {
      const list = notes.filter((n) => n.seriesKey === k);
      if (!list.length) return [];
      return [
        `### ${SERIES_LABEL[k]}`,
        ...list.map((n) => `- [${n.title}](${absUrl(notePath(n.slug))}) (${n.publishedAt}): ${n.dek || n.summary[0] || ""}`),
        "",
      ];
    }),
    "## 고지",
    "",
    DISCLAIMER,
    "",
  ];

  return new Response(out.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
