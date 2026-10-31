import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CountUp from "../components/count-up";
import SiteHeader from "../components/site-header";
import { getAboutPage } from "../../sanity/lib/about";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, heading, lead } = await getAboutPage();

  return {
    title: seo.title ?? "O nama | Petrušić gradnja",
    description: seo.description ?? lead ?? heading,
    alternates: { canonical: "/o-nama" },
    ...(seo.image && { openGraph: { images: [seo.image] } }),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

const objectPosition = (hotspot?: { x: number; y: number }) =>
  hotspot
    ? { objectPosition: `${hotspot.x * 100}% ${hotspot.y * 100}%` }
    : undefined;

export default async function AboutPage() {
  const about = await getAboutPage();
  const { company } = about;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    legalName: company.name,
    foundingDate: "2000-01-05",
    address: {
      "@type": "PostalAddress",
      streetAddress: company.headquarters,
      addressCountry: "BA",
    },
    vatID: company.vat,
  };

  const facts = [
    { label: "Puni naziv", value: company.name },
    { label: "Sjedište", value: company.headquarters },
    { label: "Osnovano", value: company.founded },
    { label: "JIB", value: company.jib },
    { label: "PDV broj", value: company.vat },
    { label: "Uprava", value: company.management },
  ].filter((fact) => fact.value);

  return (
    <>
      <SiteHeader />
      <main className="about-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <section className="about-hero" aria-labelledby="about-heading">
          {about.heroImage ? (
            <Image
              className="about-hero__image"
              src={about.heroImage.src}
              alt={about.heroImage.alt ?? ""}
              fill
              priority
              sizes="100vw"
              style={objectPosition(about.heroImage.hotspot)}
            />
          ) : null}
          <span className="about-hero__year" aria-hidden="true">
            2000
          </span>
          <div className="about-hero__inner">
            <p className="eyebrow">{about.eyebrow}</p>
            <h1 id="about-heading">
              {about.heading}
              {about.highlightedHeading ? (
                <>
                  {" "}
                  <span>{about.highlightedHeading}</span>
                </>
              ) : null}
            </h1>
            <p className="about-hero__lead">{about.lead}</p>
            <div className="about-hero__actions">
              <Link className="button button--primary" href="/#kontakt">
                Kontaktirajte nas <span aria-hidden="true">↗</span>
              </Link>
              <Link className="button button--ghost" href="/prodaja-stanova">
                Stanovi u prodaji
              </Link>
            </div>
          </div>
        </section>

        {about.stats.length ? (
          <section className="about-stats" aria-label="Brojke">
            <ul>
              {about.stats.map((stat) => (
                <li key={stat._key}>
                  <strong>
                    {stat.value >= 1900 && stat.value <= 2100 ? (
                      stat.value
                    ) : (
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    )}
                  </strong>
                  <span>{stat.label}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="about-story" aria-labelledby="about-story-title">
          <div className="about-story__heading">
            <p className="eyebrow">Tko smo</p>
            <h2 id="about-story-title">{about.storyTitle}</h2>
          </div>
          <div className="about-story__body">
            {about.storyParagraphs.map((paragraph, index) => (
              <p key={index} className={index === 0 ? "is-lead" : undefined}>
                {paragraph}
              </p>
            ))}
            {about.storyImage ? (
              <figure className="about-story__figure">
                <Image
                  src={about.storyImage.src}
                  alt={about.storyImage.alt ?? ""}
                  fill
                  sizes="(max-width: 900px) 100vw, 720px"
                  style={objectPosition(about.storyImage.hotspot)}
                />
              </figure>
            ) : null}
          </div>
        </section>

        <section className="about-values" aria-label="Misija i vizija">
          <article>
            <span aria-hidden="true">01</span>
            <h2>Naša misija</h2>
            <p>{about.mission}</p>
          </article>
          <article>
            <span aria-hidden="true">02</span>
            <h2>Naša vizija</h2>
            <p>{about.vision}</p>
          </article>
        </section>

        <section className="about-services" aria-labelledby="about-services-title">
          <div className="about-services__head">
            <p className="eyebrow">Djelatnosti</p>
            <h2 id="about-services-title">{about.servicesTitle}</h2>
            <p>{about.servicesIntro}</p>
          </div>
          <ul>
            {about.services.map((service, index) => (
              <li key={service.title}>
                <span aria-hidden="true">{pad(index + 1)}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="about-reasons" aria-labelledby="about-reasons-title">
          <h2 id="about-reasons-title">{about.reasonsTitle}</h2>
          <ul>
            {about.reasons.map((reason) => (
              <li key={reason.title}>
                <h3>{reason.title}</h3>
                <p>{reason.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="about-company" aria-labelledby="about-company-title">
          <div className="about-company__card">
            <div className="about-company__head">
              <p className="eyebrow">ID kartica</p>
              <h2 id="about-company-title">Podaci o tvrtki</h2>
            </div>
            <dl>
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="about-cta">
          <h2>Spremni za svoj novi dom?</h2>
          <p>Javite nam se i pronađimo rješenje koje odgovara vama.</p>
          <Link className="button button--primary" href="/#kontakt">
            Kontaktirajte nas <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>
    </>
  );
}
