"use client";

import Link from "next/link";
import { useState } from "react";

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
    setIsProjectsOpen(false);
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          className="brand"
          href="/#naslovna"
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
            <li>
              <Link href="/#naslovna" onClick={closeMenu}>
                Naslovna
              </Link>
            </li>
            <li
              className={`nav-projects${isProjectsOpen ? " is-open" : ""}`}
            >
              <div className="nav-projects__top">
                <Link href="/prodaja-stanova" onClick={closeMenu}>
                  Projekti
                </Link>
                <button
                  className="nav-projects__toggle"
                  type="button"
                  aria-label={
                    isProjectsOpen
                      ? "Zatvori izbornik projekata"
                      : "Otvori izbornik projekata"
                  }
                  aria-expanded={isProjectsOpen}
                  aria-controls="projects-menu"
                  onClick={() => setIsProjectsOpen((isOpen) => !isOpen)}
                >
                  <span className="nav-chevron" aria-hidden="true" />
                </button>
              </div>
              <ul className="dropdown-menu" id="projects-menu">
                <li>
                  <Link href="/#uskoro-u-ponudi" onClick={closeMenu}>
                    Aktualni projekti
                    <span>Stanovi u prodaji</span>
                  </Link>
                </li>
                <li>
                  <Link href="/prodaja-stanova" onClick={closeMenu}>
                    Uskoro u ponudi
                    <span>Nove lokacije</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="/izgradeni-objekti" onClick={closeMenu}>
                Izgrađeni objekti
              </Link>
            </li>
            <li>
              <Link href="/o-nama" onClick={closeMenu}>
                O nama
              </Link>
            </li>
            <li>
              <Link href="/#novosti" onClick={closeMenu}>
                Novosti
              </Link>
            </li>
          </ul>
          <Link className="contact-link" href="/#kontakt" onClick={closeMenu}>
            Kontakt <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
