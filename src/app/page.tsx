import type { Metadata } from "next";
import Link from "next/link";
import SectionHead from "@/components/SectionHead";
import NoteCard from "@/components/NoteCard";
import Portrait from "@/components/Portrait";
import Disclaimer from "@/components/Disclaimer";
import JsonLd from "@/components/JsonLd";
import { getProfile, getPracticeAreas, getCaseSections } from "@/lib/content";
import { getNotes } from "@/lib/notes";
import { casesWithOutcome, totalCases } from "@/data/cases";
import { patentPractice } from "@/data/career";
import { buildFaq } from "@/data/faq";
import { pageMeta, graph, webPageLd, IDS } from "@/lib/seo";
import { absUrl } from "@/lib/site";

const DESC =
  "유연 변호사·변리사(법무법인 리브로 대표변호사). 서울대 전기공학부, 변리사 7년, 성균관대 법학전문대학원 수석 졸업. 특허침해소송·영업비밀·전직금지·디자인·상표 등 지식재산 및 기술분쟁을 다룹니다.";

export const metadata: Metadata = pageMeta({ description: DESC, path: "/", type: "profile" });

export default async function HomePage() {
  const [profile, areas, notes, sections] = await Promise.all([
    getProfile(),
    getPracticeAreas(),
    getNotes(),
    getCaseSections(),
  ]);

  const highlights = casesWithOutcome.slice(0, 8);
  const recent = notes.slice(0, 6);
  const faqTop = buildFaq(sections)[0].items.slice(0, 4);

  return (
    <>
      <JsonLd
        data={graph(
          webPageLd({
            name: "유연 변호사 · 변리사 | 법무법인 리브로",
            path: "/",
            description: DESC,
            extra: {
              mainEntity: { "@id": IDS.person },
              primaryImageOfPage: { "@type": "ImageObject", url: absUrl("/portrait-sq-960.jpg") },
            },
          })
        )}
      />
      {/* ── 마스트헤드 ───────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero-rule">
            <span>{profile.affiliationEn}</span>
            <span>지식재산 · 기술분쟁</span>
          </div>

          <div className="hero-inner">
            <div>
              <span className="eyebrow">유연 변호사 · 변리사 — {profile.affiliation}</span>
              <h1>{profile.tagline}</h1>
              <p className="drop">{profile.lede}</p>

              <div className="hero-cta">
                <Link href="/contact" className="btn btn-primary">
                  상담 문의
                </Link>
                <Link href="/cv" className="btn btn-ghost">
                  CV 전문 보기
                </Link>
              </div>
            </div>

            <Portrait priority caption="유 연 · 변호사 · 변리사" />
          </div>
        </div>
      </section>

      {/* ── 01 이력 요약 ─────────────────────────────── */}
      <section className="section-tight">
        <div className="container">
          <div className="stats">
            {profile.stats.map((s) => (
              <div className="stat" key={s.k}>
                <div className="v">{s.v}</div>
                <div className="k">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 소개 ──────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHead no="01" title="소개" more="/profile" moreLabel="프로필 전체" />
          <div className="grid-2">
            <div>
              <p className="lede">{profile.creed}</p>
            </div>
            <div>
              {profile.intro.map((p, i) => (
                <p key={i} style={{ marginTop: i ? "1em" : 0 }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 업무분야 ──────────────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHead no="02" title="업무분야" more="/practice" moreLabel="분야별 상세" />
          <div className="grid-3">
            {areas.map((a) => (
              <Link href={`/practice#${a.key}`} key={a.key} className="card">
                <span className="folio">{a.no}</span>
                <h3>{a.title}</h3>
                <p>{a.summary}</p>
                <div className="items">
                  {a.tags.slice(0, 4).map((t) => (
                    <span className="chip" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 변리사 재직기 ─────────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHead no="03" title="특허 · 기술 실무 이력" />
          <div className="grid-2">
            <div>
              <p className="lede">
                변호사가 되기 전 7년은 특허를 쓰는 자리에 있었습니다. 그때 읽던 도면과
                청구항을 지금은 분쟁에서 다시 읽습니다.
              </p>
            </div>
            <ul className="cases">
              {patentPractice.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 05 대표 수행사건 ─────────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHead
            no="04"
            title="대표 수행사건"
            more="/cases"
            moreLabel={`수행사건 ${totalCases}건 전체`}
          />
          <ul className="cases">
            {highlights.map((c, i) => (
              <li key={i}>
                {c.text}
                <em className="outcome">▸ {c.outcome}</em>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 24 }}>
            <Disclaimer withCases />
          </div>
        </div>
      </section>

      {/* ── 06 기업법 노트 ───────────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHead
            no="05"
            title="기업법 노트"
            more="/notes"
            moreLabel={`${notes.length}편 전체`}
          />
          <div className="grid-2" style={{ gap: 0, columnGap: 48 }}>
            <div>
              {recent.slice(0, 3).map((n) => (
                <NoteCard note={n} key={n.slug} />
              ))}
            </div>
            <div>
              {recent.slice(3).map((n) => (
                <NoteCard note={n} key={n.slug} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 07 자주 묻는 질문 (AEO) ──────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <SectionHead no="06" title="자주 묻는 질문" more="/faq" moreLabel="질문 전체" />
          <div className="faq">
            {faqTop.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>
                  <h3>{f.q}</h3>
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 08 문의 ──────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHead no="07" title="문의" />
          <div className="grid-2">
            <div>
              <p className="lede">
                기술이 걸린 분쟁은 사실관계를 정리하는 데서 절반이 결정됩니다. 어떤 자료가
                남아 있는지부터 함께 보겠습니다.
              </p>
              <div className="hero-cta">
                <Link href="/contact" className="btn btn-accent">
                  상담 문의하기
                </Link>
              </div>
            </div>
            <dl className="rows" style={{ borderTop: "1px solid var(--border-soft)" }}>
              <div className="row">
                <dt className="period">사무소</dt>
                <dd className="body">
                  <strong>{profile.contact.firm}</strong>
                  <span>{profile.contact.address}</span>
                </dd>
              </div>
              <div className="row">
                <dt className="period">전화</dt>
                <dd className="body">
                  <strong className="mono">{profile.contact.tel}</strong>
                  <span className="mono">FAX {profile.contact.fax}</span>
                </dd>
              </div>
              <div className="row">
                <dt className="period">이메일</dt>
                <dd className="body">
                  <a href={`mailto:${profile.contact.email}`}>
                    <strong>{profile.contact.email}</strong>
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
