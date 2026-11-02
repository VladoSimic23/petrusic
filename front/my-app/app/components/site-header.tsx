"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  exact?: boolean;
};

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Naslovna",
    exact: true,
    icon: (
      <svg {...iconProps}>
        <path d="M3.5 11 12 4l8.5 7" />
        <path d="M5.5 9.5V20h13V9.5" />
        <path d="M10 20v-5.5h4V20" />
      </svg>
    ),
  },
  {
    href: "/prodaja-stanova",
    label: "Prodaja stanova",
    icon: (
      <svg {...iconProps}>
        <circle cx="8" cy="15" r="4" />
        <path d="m11 12 8.5-8.5" />
        <path d="m16.5 6.5 2.5 2.5" />
        <path d="m14 9 2 2" />
      </svg>
    ),
  },
  {
    href: "/izgradeni-objekti",
    label: "Izgrađeni objekti",
    icon: (
      <svg {...iconProps}>
        <path d="M4 20V8l6-3v15" />
        <path d="M10 20V10l10 3v7" />
        <path d="M2.5 20h19" />
        <path d="M7 10v.01M7 13v.01M7 16v.01M14 14v.01M17 15v.01M14 17v.01M17 17.5v.01" />
      </svg>
    ),
  },
  {
    href: "/o-nama",
    label: "O nama",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3 5 6v5.5c0 4.2 2.9 7.8 7 9.5 4.1-1.7 7-5.3 7-9.5V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (item: NavItem) =>
    item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <header className="site-header">
      <span className="site-header__ornament" aria-hidden="true" />
      <div className="site-header__inner">
        <Link
          className="brand"
          href="/"
          aria-label="Petrušić gradnja — naslovna"
          onClick={closeMenu}
        >
          <span className="brand__mark" aria-hidden="true">
            P
          </span>
          <span className="brand__name">
            <span className="brand__title">PETRUŠIĆ</span>
            <span className="brand__subtitle">GRADNJA</span>
          </span>
        </Link>

        <button
          className={`menu-toggle${isMenuOpen ? " is-active" : ""}`}
          type="button"
          aria-label={isMenuOpen ? "Zatvori navigaciju" : "Otvori navigaciju"}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <span />
          <span />
        </button>

        <nav
          className={`primary-nav${isMenuOpen ? " is-open" : ""}`}
          id="primary-navigation"
          aria-label="Glavna navigacija"
        >
          <ul className="primary-nav__list">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);

              return (
                <li key={item.href}>
                  <Link
                    className="nav-link"
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMenu}
                  >
                    <span className="nav-link__icon">{item.icon}</span>
                    <span className="nav-link__label">{item.label}</span>
                    <span className="nav-link__arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link className="contact-link" href="/#kontakt" onClick={closeMenu}>
            <svg {...iconProps} width={16} height={16}>
              <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
              <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
            </svg>
            Kontakt
          </Link>
        </nav>
      </div>
    </header>
  );
}
