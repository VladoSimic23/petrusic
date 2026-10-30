import Link from "next/link";

export type AboutContent = {
  eyebrow?: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
};

export default function AboutSection({
  eyebrow,
  title,
  description,
  cta,
}: AboutContent) {
  return (
    <section
      className="about-section content-section"
      id="o-nama"
      aria-labelledby="about-title"
    >
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
    </section>
  );
}
