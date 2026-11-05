"use client";

import Image from "next/image";
import Link from "next/link";
import CountUp from "./count-up";
import { useLanguage } from "./language-provider";
import type { AboutPageContent } from "../content/about";

const pad = (value: number) => String(value).padStart(2, "0");

const objectPosition = (hotspot?: { x: number; y: number }) =>
  hotspot
    ? { objectPosition: `${hotspot.x * 100}% ${hotspot.y * 100}%` }
    : undefined;

export default function AboutPageContentView({
  about,
}: {
  about: AboutPageContent;
}) {
  const { language } = useLanguage();
  const english = language === "en" ? about.english : undefined;
  const storyParagraphs = english?.storyParagraphs ?? about.storyParagraphs;
  const services = english?.services ?? about.services;
  const reasons = english?.reasons ?? about.reasons;
  const facts = [
    {
      label: language === "en" ? "Legal name" : "Puni naziv",
      value: language === "en" ? about.company.english?.name || about.company.name : about.company.name,
    },
    {
      label: language === "en" ? "Headquarters" : "Sjedište",
      value: language === "en" ? about.company.english?.headquarters || about.company.headquarters : about.company.headquarters,
    },
    {
      label: language === "en" ? "Founded" : "Osnovano",
      value: language === "en" ? about.company.english?.founded || about.company.founded : about.company.founded,
    },
    { label: "JIB", value: about.company.jib },
    { label: language === "en" ? "VAT number" : "PDV broj", value: about.company.vat },
    {
      label: language === "en" ? "Management" : "Uprava",
      value: language === "en" ? about.company.english?.management || about.company.management : about.company.management,
    },
  ].filter((fact) => fact.value);

  return (
    <main className="about-page">
      <section className="about-hero" aria-labelledby="about-heading">
        {about.heroImage ? (
          <Image
            className="about-hero__image"
            src={about.heroImage.src}
            alt={
              language === "en"
                ? about.heroImage.englishAlt || about.heroImage.alt || ""
                : about.heroImage.alt || ""
            }
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
          <p className="eyebrow">{english?.eyebrow || about.eyebrow}</p>
          <h1 id="about-heading">
            {english?.heading || about.heading}
            {(english?.highlightedHeading || about.highlightedHeading) ? (
              <>
                {" "}
                <span>{english?.highlightedHeading || about.highlightedHeading}</span>
              </>
            ) : null}
          </h1>
          <p className="about-hero__lead">{english?.lead || about.lead}</p>
          <div className="about-hero__actions">
            <Link className="button button--primary" href="/#kontakt">
              {language === "en" ? "Contact us" : "Kontaktirajte nas"}{" "}
              <span aria-hidden="true">↗</span>
            </Link>
            <Link className="button button--ghost" href="/prodaja-stanova">
              {language === "en" ? "Apartments for sale" : "Stanovi u prodaji"}
            </Link>
          </div>
        </div>
      </section>

      {about.stats.length ? (
        <section className="about-stats" aria-label={language === "en" ? "Statistics" : "Brojke"}>
          <ul>
            {about.stats.map((stat, index) => (
              <li key={stat._key}>
                <strong>
                  {stat.value >= 1900 && stat.value <= 2100 ? (
                    stat.value
                  ) : (
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  )}
                </strong>
                <span>{english?.stats?.[index]?.label || stat.label}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="about-story" aria-labelledby="about-story-title">
        <div className="about-story__heading">
          <p className="eyebrow">{language === "en" ? "Our story" : "Tko smo"}</p>
          <h2 id="about-story-title">{english?.storyTitle || about.storyTitle}</h2>
        </div>
        <div className="about-story__body">
          {storyParagraphs.map((paragraph, index) => (
            <p key={index} className={index === 0 ? "is-lead" : undefined}>
              {paragraph}
            </p>
          ))}
          {about.storyImage ? (
            <figure className="about-story__figure">
              <Image
                src={about.storyImage.src}
                alt={
                  language === "en"
                    ? about.storyImage.englishAlt || about.storyImage.alt || ""
                    : about.storyImage.alt || ""
                }
                fill
                sizes="(max-width: 900px) 100vw, 720px"
                style={objectPosition(about.storyImage.hotspot)}
              />
            </figure>
          ) : null}
        </div>
      </section>

      <section className="about-values" aria-label={language === "en" ? "Mission and vision" : "Misija i vizija"}>
        <article>
          <span aria-hidden="true">01</span>
          <h2>{language === "en" ? "Our mission" : "Naša misija"}</h2>
          <p>{english?.mission || about.mission}</p>
        </article>
        <article>
          <span aria-hidden="true">02</span>
          <h2>{language === "en" ? "Our vision" : "Naša vizija"}</h2>
          <p>{english?.vision || about.vision}</p>
        </article>
      </section>

      <section className="about-services" aria-labelledby="about-services-title">
        <div className="about-services__head">
          <p className="eyebrow">{language === "en" ? "What we do" : "Djelatnosti"}</p>
          <h2 id="about-services-title">{english?.servicesTitle || about.servicesTitle}</h2>
          <p>{english?.servicesIntro || about.servicesIntro}</p>
        </div>
        <ul>
          {services.map((service, index) => (
            <li key={service.title}>
              <span aria-hidden="true">{pad(index + 1)}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-reasons" aria-labelledby="about-reasons-title">
        <h2 id="about-reasons-title">{english?.reasonsTitle || about.reasonsTitle}</h2>
        <ul>
          {reasons.map((reason) => (
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
            <p className="eyebrow">{language === "en" ? "Company profile" : "ID kartica"}</p>
            <h2 id="about-company-title">
              {language === "en" ? "Company information" : "Podaci o tvrtki"}
            </h2>
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
        <h2>{language === "en" ? "Ready for your new home?" : "Spremni za svoj novi dom?"}</h2>
        <p>
          {language === "en"
            ? "Get in touch and let us find the right solution for you."
            : "Javite nam se i pronađimo rješenje koje odgovara vama."}
        </p>
        <Link className="button button--primary" href="/#kontakt">
          {language === "en" ? "Contact us" : "Kontaktirajte nas"}{" "}
          <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
