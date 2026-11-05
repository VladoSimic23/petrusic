import Link from "next/link";

const currentYear = new Date().getFullYear();

const links = [
  { label: "Naslovna", href: "/#naslovna" },
  { label: "Stanovi u prodaji", href: "/prodaja-stanova" },
  { label: "Izgrađeni objekti", href: "/izgradeni-objekti" },
  { label: "Aktualnosti", href: "/aktualnosti" },
  { label: "O nama", href: "/o-nama" },
  { label: "Kontakt", href: "/#kontakt" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link
            className="brand"
            href="/#naslovna"
            aria-label="Petrušić gradnja — naslovna"
          >
            <span className="brand__mark" aria-hidden="true">
              P
            </span>
            <span className="brand__name">
              <span className="brand__title">PETRUŠIĆ</span>
              <span className="brand__subtitle">GRADNJA</span>
            </span>
          </Link>
          <p>Gradimo povjerenje. Razgovorom započinje svaki dobar projekt.</p>
        </div>

        <nav className="site-footer__column" aria-label="Podnožje stranice">
          <h2 className="site-footer__heading">Navigacija</h2>
          <ul>
            {links.map((link) => (
              <li key={link.href + link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="site-footer__bar">
        <span>© {currentYear} Petrušić gradnja. Sva prava pridržana.</span>
        <Link href="/#naslovna">
          Na vrh <span aria-hidden="true">↑</span>
        </Link>
      </div>
    </footer>
  );
}
