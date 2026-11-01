import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { getFooterContact } from "../../sanity/lib/footer";
import { messagingNumber, phoneHref } from "./contact-section";

const links = [
  { label: "Naslovna", href: "/#naslovna" },
  { label: "Stanovi u prodaji", href: "/prodaja-stanova" },
  { label: "Izgrađeni objekti", href: "/izgradeni-objekti" },
  { label: "O nama", href: "/o-nama" },
  { label: "Kontakt", href: "/#kontakt" },
];

export default async function SiteFooter() {
  "use cache";
  cacheLife("days");
  cacheTag("sanity", "homePage");

  const contact = await getFooterContact();
  const year = new Date().getFullYear();

  const details = [
    contact?.email
      ? { label: "E-mail", value: contact.email, href: `mailto:${contact.email}` }
      : null,
    contact?.phone
      ? { label: "Telefon", value: contact.phone, href: phoneHref(contact.phone) }
      : null,
    contact?.whatsapp
      ? {
          label: "WhatsApp",
          value: contact.whatsapp,
          href: `https://wa.me/${messagingNumber(contact.whatsapp)}`,
        }
      : null,
    contact?.address ? { label: "Adresa", value: contact.address } : null,
    contact?.officeHours
      ? { label: "Radno vrijeme", value: contact.officeHours }
      : null,
  ].filter((detail) => detail !== null);

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

        {details.length ? (
          <div className="site-footer__column">
            <h2 className="site-footer__heading">Kontakt</h2>
            <ul>
              {details.map((detail) => (
                <li key={detail.label}>
                  <span>{detail.label}</span>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      target={detail.href.startsWith("https://") ? "_blank" : undefined}
                      rel={
                        detail.href.startsWith("https://")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <strong>{detail.value}</strong>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="site-footer__bar">
        <span>© {year} Petrušić gradnja. Sva prava pridržana.</span>
        <Link href="/#naslovna">
          Na vrh <span aria-hidden="true">↑</span>
        </Link>
      </div>
    </footer>
  );
}
