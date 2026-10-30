import Image from "next/image";

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
  scrollLink,
}: HeroContent) {
  const hasFooter = stat?.value || footerNote || scrollLink;

  return (
    <section className="hero" id="naslovna" aria-labelledby="hero-title">
      <Image
        src={backgroundImage.src}
        alt={backgroundImage.alt ?? ""}
        fill
        priority
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
        <h1 id="hero-title">
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
          <a className="button button--primary" href={primaryCta.href}>
            {primaryCta.label}
            <span aria-hidden="true">↗</span>
          </a>
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
          {footerNote && <span className="hero__footer-note">{footerNote}</span>}
          {scrollLink && (
            <a className="hero__scroll" href={scrollLink.href}>
              {scrollLink.label} <span aria-hidden="true">↓</span>
            </a>
          )}
        </div>
      )}
    </section>
  );
}
