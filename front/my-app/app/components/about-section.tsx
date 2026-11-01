import Link from "next/link";
import CountUp from "./count-up";
import AboutParallaxBackground from "./about-parallax-background";
import type { StatsContent } from "./stats-section";

export type AboutContent = {
  eyebrow?: string;
  title: string;
  description: string;
  image?: {
    src: string;
    alt?: string;
    caption?: string;
    hotspot?: { x: number; y: number };
  };
  cta: { label: string; href: string };
};

export default function AboutSection({
  eyebrow,
  title,
  description,
  image,
  cta,
  stats,
}: AboutContent & { stats?: StatsContent }) {
  const items = stats?.items ?? [];

  return (
    <section
      className={`about-section content-section${image ? " about-section--has-image" : ""}`}
      id="o-nama"
      aria-labelledby="about-title"
    >
      {image ? (
        <AboutParallaxBackground {...image} />
      ) : null}
      <div className="about-section__inner">
        <div className="about-section__heading">
          {eyebrow ? <p className="eyebrow eyebrow--dark">{eyebrow}</p> : null}
          <h2 id="about-title">{title}</h2>
        </div>
        <div className="about-section__content">
          <p>{description}</p>
          <Link className="about-section__link" href={cta.href}>
            {cta.label} <span aria-hidden="true">→</span>
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
              <span className="stats-section__label">{item.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
