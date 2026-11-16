"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "./language-provider";

export type CallToAction = {
  label: string;
  href: string;
};

export type HeroContent = {
  eyebrow?: string;
  title: string;
  highlightedTitle?: string;
  description?: string;
  primaryCta?: CallToAction;
  backgroundImage: {
    src: string;
    alt?: string;
    hotspot?: { x: number; y: number };
  };
  stat?: {
    value?: string;
    label?: string;
  };
  footerNote?: string;
  scrollLink?: CallToAction;
  english?: Partial<Omit<HeroContent, "backgroundImage" | "english">>;
};

export default function Hero({
  eyebrow,
  title,
  highlightedTitle,
  description,
  primaryCta,
  backgroundImage,
  stat,
  footerNote,
  english,
}: HeroContent) {
  const { language } = useLanguage();
  const translated = language === "en" ? english : undefined;
  eyebrow = translated?.eyebrow || eyebrow;
  title = translated?.title || title;
  highlightedTitle = translated?.highlightedTitle || highlightedTitle;
  description = translated?.description || description;
  primaryCta = translated?.primaryCta || primaryCta;
  stat = translated?.stat || stat;
  footerNote = translated?.footerNote || footerNote;
  const hasFooter = stat?.value || footerNote;

  return (
    <section className="hero" id="naslovna" aria-labelledby="hero-title">
      <Image
        src={backgroundImage.src}
        alt={backgroundImage.alt ?? ""}
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="hero__image"
        style={
          backgroundImage.hotspot
            ? {
                objectPosition: `${backgroundImage.hotspot.x * 100}% ${backgroundImage.hotspot.y * 100}%`,
              }
            : undefined
        }
      />
      <div className="hero__overlay" aria-hidden="true" />

      <div className="hero__content">
        {eyebrow && (
          <p className="eyebrow">
            <span className="eyebrow__line" />
            {eyebrow}
          </p>
        )}
        <h1
          id="hero-title"
          style={{
            fontFamily: "Georgia, Times New Roman, serif",
            fontStyle: "italic",
          }}
        >
          {title}
          {highlightedTitle && (
            <>
              <br />
              <span>{highlightedTitle}</span>
            </>
          )}
        </h1>
        {description && <p className="hero__description">{description}</p>}
        {primaryCta && (
          <Link className="button button--primary" href={primaryCta.href}>
            {primaryCta.label}
            <span aria-hidden="true">↗</span>
          </Link>
        )}
      </div>

      {hasFooter && (
        <div className="hero__footer">
          {stat?.value && (
            <div className="hero__stat">
              <span className="hero__stat-number">{stat.value}</span>
              {stat.label && (
                <span className="hero__stat-label">{stat.label}</span>
              )}
            </div>
          )}
          {footerNote && (
            <span className="hero__footer-note">{footerNote}</span>
          )}
          {/* <div className="hero__scroll-cue" aria-hidden="true">
            <span className="hero__scroll-cue-icon">↓</span>
            <span className="hero__scroll-cue-line" />
          </div> */}
        </div>
      )}
    </section>
  );
}
