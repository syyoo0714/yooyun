import Link from "next/link";
import { profile } from "@/data/profile";
import { NAV, AD_NOTICE } from "@/lib/site";

export default function Footer() {
  const c = profile.contact;
  return (
    <footer className="site-footer no-print">
      <div className="container">
        <div className="top">
          <div>
            <p className="fname">유 연</p>
            <p className="small" style={{ marginTop: 6 }}>
              {profile.title} · {profile.affiliation}
            </p>
            <p className="small" style={{ marginTop: 14, maxWidth: "36ch" }}>
              {profile.tagline}
            </p>
          </div>

          <div>
            <h4>Contact</h4>
            <ul>
              <li>{c.address}</li>
              <li className="mono">TEL {c.tel} · FAX {c.fax}</li>
              <li>
                <a href={`mailto:${c.email}`}>{c.email}</a>
              </li>
              <li className="mono">사업자등록번호 {c.bizNo}</li>
            </ul>
          </div>

          <div>
            <h4>Menu</h4>
            <ul>
              {NAV.filter((n) => n.href !== "/").map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
              <li>
                <a href={c.site} target="_blank" rel="noreferrer">
                  법무법인 리브로 ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="bottom">
          <span>© {new Date().getFullYear()} 법무법인 리브로. All rights reserved.</span>
          <span>{AD_NOTICE}</span>
        </div>
      </div>
    </footer>
  );
}
