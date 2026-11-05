"use client";

import Link from "next/link";
import CountUp from "./count-up";
import AboutParallaxBackground from "./about-parallax-background";
import type { StatsContent } from "./stats-section";
import { useLanguage } from "./language-provider";

export type AboutContent = {
  eyebrow?: string;
  title: string;
  description: string;
  image?: {
    src: string;
    alt?: string;
    englishAlt?: string;
    caption?: string;
    englishCaption?: string;
    hotspot?: { x: number; y: number };
  };
  cta: { label: string; href: string };
  english?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    cta?: { label?: string; href?: string };
  };
};

export default function AboutSection({
  eyebrow,
  title,
  description,
  image,
  cta,
  english,
  stats,
}: AboutContent & { stats?: StatsContent }) {
  const items = stats?.items ?? [];
  const { language } = useLanguage();
  const translated = language === "en" ? english : undefined;
  const translatedImage = image
    ? {
        ...image,
        alt: language === "en" ? image.englishAlt || image.alt : image.alt,
        caption: language === "en" ? image.englishCaption || image.caption : image.caption,
      }
    : undefined;

  return (
    <section
      className={`about-section content-section${image ? " about-section--has-image" : ""}`}
      id="o-nama"
      aria-labelledby="about-title"
    >
      {translatedImage ? (
        <AboutParallaxBackground {...translatedImage} />
      ) : null}
      <div className="about-section__inner">
        <div className="about-section__heading">
          {translated?.eyebrow || eyebrow ? (
            <p className="eyebrow eyebrow--dark">{translated?.eyebrow || eyebrow}</p>
          ) : null}
          <h2 id="about-title">{translated?.title || title}</h2>
        </div>
        <div className="about-section__content">
          <p>{translated?.description || description}</p>
          <Link
            className="about-section__link"
            href={translated?.cta?.href || cta.href}
          >
            {translated?.cta?.label || cta.label} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
      {items.length ? (
        <ul className="about-section__stats stats-section__list" aria-label="Brojke i statistika">
          {items.map((item) => (
            <li className="stats-section__item" key={item._key}>
              <span className="stats-section__value">
                <CountUp value={item.value} suffix={item.suffix} />
              </span>
              <span className="stats-section__label">
                {language === "en" ? item.labelEn || item.label : item.label}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
