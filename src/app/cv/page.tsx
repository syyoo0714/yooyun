import type { Metadata } from "next";
import PrintButton from "@/components/PrintButton";
import CaseList from "@/components/CaseList";
import Disclaimer from "@/components/Disclaimer";
import { getProfile, getEducation, getCredentials, getCareer, getCaseSections } from "@/lib/content";
import { patentPractice } from "@/data/career";
import { expertiseTags, profile as base } from "@/data/profile";
import { writings, publishedCases } from "@/data/cases";

export const metadata: Metadata = {
  title: "CV · 경력기술서",
  description:
    "유연 변호사·변리사 경력기술서 — 학력·자격·경력, 특허 실무 이력, 수행사건 146건, 저술·연재·강연, 대외활동.",
};

/**
 * CV 전문. 원본 260813_유연_CV_경력기술서.html 의 섹션 순서를 그대로 따른다.
 * A4 인쇄 규칙은 globals.css @media print 참조.
 */
function Rows({ items }: { items: { period: string; title: string; note?: string }[] }) {
  return (
    <div className="rows">
      {items.map((it, i) => (
        <div className="row" key={i}>
          <div className="period">{it.period}</div>
          <div className="body">
            <strong>{it.title}</strong>
            {it.note && <span>{it.note}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Block({ no, title, children }: { no: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div className="section-head">
        <div>
          <span className="folio">{no}</span>
          <h2>{title}</h2>
        </div>
      </div>
      {children}
    </div>
  );
}

export default async function CvPage() {
  const [profile, education, credentials, career, sections] = await Promise.all([
    getProfile(),
    getEducation(),
    getCredentials(),
    getCareer(),
    getCaseSections(),
  ]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">
            {profile.affiliation} · {profile.affiliationEn}
          </span>
          <h1>유 연 — 변호사 · 변리사</h1>
          <p>{profile.lede}</p>
          <p className="mono" style={{ marginTop: 16, fontSize: 12 }}>
            {profile.contact.address} · TEL {profile.contact.tel} · {profile.contact.email}
          </p>
          <div style={{ marginTop: 24 }}>
            <PrintButton label="A4로 인쇄 · PDF 저장" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stats" style={{ marginBottom: 48 }}>
            {profile.stats.map((s) => (
              <div className="stat" key={s.k}>
                <div className="v">{s.v}</div>
                <div className="k">{s.k}</div>
              </div>
            ))}
          </div>

          <Block no="01" title="학력 · 자격 · 경력">
            <h4 style={{ margin: "0 0 8px" }}>학력</h4>
            <Rows items={education} />
            <h4 style={{ margin: "28px 0 8px" }}>자격</h4>
            <Rows items={credentials} />
            <h4 style={{ margin: "28px 0 8px" }}>경력</h4>
            <Rows items={career} />
          </Block>

          <Block no="02" title="전문분야">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {expertiseTags.map((t) => (
                <span className="chip" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <p className="lede">{profile.creed}</p>
          </Block>

          <Block no="03" title="특허 · 기술 실무 이력 (변리사 재직기)">
            <ul className="cases">
              {patentPractice.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Block>

          {sections.map((s) => (
            <Block no={s.no} title={s.title} key={s.no}>
              <CaseList items={s.items} />
            </Block>
          ))}

          <Block no="15" title="저술 · 연재 · 강연">
            {writings.map((g) => (
              <div key={g.group} style={{ marginBottom: 24 }}>
                <h4 style={{ marginBottom: 8 }}>{g.group}</h4>
                <ul className="cases">
                  {g.items.map((it, i) => (
                    <li key={i}>{it.text}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Block>

          <Block no="16" title="대외활동 · 소속 · 언어">
            <ul className="cases">
              {base.publicRoles.map((t) => (
                <li key={t}>{t}</li>
              ))}
              {base.memberships.map((t) => (
                <li key={t}>{t}</li>
              ))}
              <li>{base.languages.join(" · ")}</li>
            </ul>
          </Block>

          <Block no="17" title="부록 — 홈페이지 기게시 성공사례">
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: 110 }}>게시번호</th>
                    <th>사건</th>
                  </tr>
                </thead>
                <tbody>
                  {publishedCases.map((c, i) => (
                    <tr key={i}>
                      <td className="y">{c.no}</td>
                      <td>{c.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Block>

          <Disclaimer withCases />
        </div>
      </section>
    </>
  );
}
