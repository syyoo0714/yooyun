import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHead from "@/components/SectionHead";
import InquiryForm from "@/components/InquiryForm";
import Disclaimer from "@/components/Disclaimer";
import { getProfile } from "@/lib/content";

export const metadata: Metadata = {
  title: "문의",
  description:
    "법무법인 리브로 · 유연 변호사 상담 문의. 서울 서초구 반포대로34길 14, 202호 · 02-532-9824 · lebro@lawlebro.com",
};

export default async function ContactPage() {
  const profile = await getProfile();
  const c = profile.contact;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="문의"
        desc="기술이 걸린 분쟁은 사실관계를 정리하는 데서 절반이 결정됩니다. 어떤 자료가 남아 있는지부터 함께 보겠습니다."
      />

      <section className="section">
        <div className="container">
          <div className="grid-2">
            <div>
              <SectionHead title="상담 문의" />
              <InquiryForm />
            </div>

            <div>
              <SectionHead title="사무소" />
              <dl className="rows" style={{ borderTop: "1px solid var(--border-soft)" }}>
                <div className="row">
                  <dt className="period">사무소</dt>
                  <dd className="body">
                    <strong>{c.firm}</strong>
                    <span>{c.address}</span>
                  </dd>
                </div>
                <div className="row">
                  <dt className="period">전화 · 팩스</dt>
                  <dd className="body">
                    <strong className="mono">{c.tel}</strong>
                    <span className="mono">FAX {c.fax}</span>
                  </dd>
                </div>
                <div className="row">
                  <dt className="period">이메일</dt>
                  <dd className="body">
                    <a href={`mailto:${c.email}`}>
                      <strong>{c.email}</strong>
                    </a>
                  </dd>
                </div>
                <div className="row">
                  <dt className="period">사업자등록번호</dt>
                  <dd className="body">
                    <strong className="mono">{c.bizNo}</strong>
                  </dd>
                </div>
                <div className="row">
                  <dt className="period">웹</dt>
                  <dd className="body">
                    <a href={c.site} target="_blank" rel="noreferrer">
                      <strong>lawlebro.com ↗</strong>
                    </a>
                    <a href={c.blog} target="_blank" rel="noreferrer">
                      <span>네이버 블로그 ↗</span>
                    </a>
                  </dd>
                </div>
              </dl>

              <div style={{ marginTop: 28 }}>
                <div className="disclaimer">
                  <p>
                    <strong>※ 접수 안내</strong> 문의 접수는 상담 회신을 위한 것으로, 접수
                    자체가 위임계약의 성립이나 법률자문의 제공을 뜻하지 않습니다. 소멸시효·제척
                    기간 등 기한이 임박한 사안은 전화로 먼저 연락해 주십시오.
                  </p>
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <Disclaimer />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
