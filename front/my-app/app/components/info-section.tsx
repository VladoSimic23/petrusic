type InfoSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  muted?: boolean;
};

export default function InfoSection({
  id,
  eyebrow,
  title,
  description,
  muted,
}: InfoSectionProps) {
  return (
    <section
      className={`content-section info-section${muted ? " info-section--muted" : ""}`}
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <div className="info-section__inner">
        <p className="eyebrow eyebrow--dark">{eyebrow}</p>
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{description}</p>
      </div>
    </section>
  );
}
