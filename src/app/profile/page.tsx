import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHead from "@/components/SectionHead";
import Portrait from "@/components/Portrait";
import Disclaimer from "@/components/Disclaimer";
import { getProfile, getEducation, getCredentials, getCareer } from "@/lib/content";
import { patentPractice } from "@/data/career";
import { expertiseTags, profile as base } from "@/data/profile";
import { writings } from "@/data/cases";

export const metadata: Metadata = {
  title: "프로필",
  description:
    "유연 변호사·변리사 학력·자격·경력. 서울대 전기공학부, 특허법인 신성 변리사 7년, 성균관대 법학전문대학원 수석 졸업, 바른·세종을 거쳐 법무법인 리브로 대표변호사.",
};

function Timeline({ items }: { items: { period: string; title: string; note?: string }[] }) {
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

export default async function ProfilePage() {
  const [profile, education, credentials, career] = await Promise.all([
    getProfile(),
    getEducation(),
    getCredentials(),
    getCareer(),
  ]);

  return (
    <>
      <PageHero eyebrow="Profile" title="유 연 — 변호사 · 변리사" desc={profile.creed} />

      <section className="section">
        <div className="container">
          <div className="profile-intro">
            <div>
              <Portrait priority caption={`${profile.affiliation} · ${profile.title}`} />
            </div>
            <div>
              <SectionHead title="소개" />
              {profile.intro.map((p, i) => (
                <p key={i} style={{ marginTop: i ? "1em" : 0 }}>
                  {p}
                </p>
              ))}

              <div style={{ height: 40 }} />
              <SectionHead title="전문분야" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {expertiseTags.map((t) => (
                  <span className="chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead no="01" title="학력" />
          <Timeline items={education} />

          <div style={{ height: 48 }} />
          <SectionHead no="02" title="자격" />
          <Timeline items={credentials} />

          <div style={{ height: 48 }} />
          <SectionHead no="03" title="경력" />
          <Timeline items={career} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead no="04" title="특허 · 기술 실무 이력 (변리사 재직기)" />
          <ul className="cases">
            {patentPractice.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead no="05" title="저술 · 연재 · 강연" />
          {writings.map((g) => (
            <div key={g.group} style={{ marginBottom: 32 }}>
              <h3 style={{ marginBottom: 12 }}>{g.group}</h3>
              <ul className="cases">
                {g.items.map((it, i) => (
                  <li key={i}>{it.text}</li>
                ))}
              </ul>
            </div>
          ))}

          <div style={{ height: 24 }} />
          <SectionHead no="06" title="대외활동 · 소속 · 언어" />
          <ul className="cases">
            {base.publicRoles.map((t) => (
              <li key={t}>{t}</li>
            ))}
            {base.memberships.map((t) => (
              <li key={t}>{t}</li>
            ))}
            <li>{base.languages.join(" · ")}</li>
          </ul>

          <div style={{ marginTop: 32 }}>
            <Disclaimer />
          </div>
        </div>
      </section>
    </>
  );
}
