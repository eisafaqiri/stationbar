"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <Link
        className="wordmark"
        href="/"
        aria-label="Staionbar Startseite"
        onClick={() => setOpen(false)}
      >
        <Image
          src="/images/staionbar-logo.png"
          alt="Staionbar - Shisha & Lounge"
          width={246}
          height={82}
          preload
          className="brand-logo"
        />
      </Link>
      <nav
        aria-label="Hauptnavigation"
        className={open ? "nav open" : "nav"}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        {[
          ["/", "Home"],
          ["/menu", "Menü"],
          ["/kontakt", "Kontakt"],
        ].map(([href, label]) => (
          <Link
            onClick={() => setOpen(false)}
            aria-current={path === href ? "page" : undefined}
            key={href}
            href={href}
          >
            {label}
          </Link>
        ))}
      </nav>
      <a className="header-cta" href="tel:+41762355000">
        Tisch anfragen <ArrowUpRight size={16} />
      </a>
      <button
        className="nav-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Menü schliessen" : "Menü öffnen"}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div>
        <Link href="/" className="footer-logo">
          <Image
            src="/images/staionbar-logo.png"
            alt="Staionbar - Shisha & Lounge"
            width={306}
            height={102}
            className="brand-logo"
          />
        </Link>
        <p>Good company. Great nights.</p>
      </div>
      <div className="footer-address">
        Bahnhofplatz 1<br />
        5610 Wohlen, Switzerland
      </div>
      <div>
        <a href="tel:+41762355000">
          076 235 50 00 <ArrowUpRight size={12} aria-hidden="true" />
        </a>
        <a href="mailto:stationbar4@gmail.com">
          stationbar4@gmail.com <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© 2026 STAIONBAR</span>
        <span>COME AS YOU ARE. STAY A LITTLE LONGER.</span>
        <Link href="/kontakt">
          Kontakt <ArrowUpRight size={13} />
        </Link>
      </div>
    </footer>
  );
}
