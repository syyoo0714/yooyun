"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header no-print">
      <div className="container bar">
        <Link href="/" className="brand" aria-label="유연 변호사 홈">
          <span className="brand-mark">유</span>
          <span>
            <span className="brand-name">유 연</span>
            <span className="brand-sub">Attorney &amp; Patent Attorney</span>
          </span>
        </Link>

        <nav className="nav-desktop" aria-label="주요 메뉴">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span style={open ? { transform: "translateY(6.5px) rotate(45deg)" } : undefined} />
          <span style={open ? { opacity: 0 } : undefined} />
          <span style={open ? { transform: "translateY(-6.5px) rotate(-45deg)" } : undefined} />
        </button>
      </div>

      {open && (
        <nav className="nav-sheet" aria-label="모바일 메뉴">
          <div className="container" style={{ paddingBlock: 8 }}>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
