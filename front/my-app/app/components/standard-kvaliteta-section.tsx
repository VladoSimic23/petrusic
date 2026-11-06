"use client";

import { useLanguage } from "./language-provider";

export type StandardItem = {
  _id: string;
  number: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
};

export type StandardKvalitetaContent = {
  eyebrow?: string;
  eyebrowEn?: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  standards: StandardItem[];
};

export default function StandardKvalitetaSection({
  content,
}: {
  content?: StandardKvalitetaContent;
}) {
  const { language } = useLanguage();
  if (!content?.standards.length) return null;

  const isEnglish = language === "en";

  return (
    <section
      className="standards-section content-section"
      id="standardi"
      aria-labelledby="standards-title"
    >
      <div className="section-heading standards-section__heading">
        <div>
          <p className="eyebrow eyebrow--dark">
            {(isEnglish ? content.eyebrowEn : content.eyebrow) ||
              (isEnglish ? "Built to last" : "Naši standardi")}
          </p>
          <h2 id="standards-title">
            {(isEnglish ? content.titleEn : content.title) || content.title}
          </h2>
          {(isEnglish ? content.descriptionEn : content.description) ? (
            <p className="standards-section__description">
              {isEnglish ? content.descriptionEn : content.description}
            </p>
          ) : null}
        </div>
        {/* <span className="standards-section__index" aria-hidden="true">
          {String(content.standards.length).padStart(2, "0")}
          <span> / {isEnglish ? "our commitments" : "naših standarda"}</span>
        </span> */}
      </div>

      <ul className="standards-grid">
        {content.standards.map((standard, index) => (
          <li className="standards-card" key={standard._id}>
            <div className="standards-card__topline">
              <span className="standards-card__number">
                {standard.number || String(index + 1).padStart(2, "0")}
              </span>
              <span className="standards-card__line" aria-hidden="true" />
              <span className="standards-card__index">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="standards-card__title">
              {isEnglish ? standard.titleEn || standard.title : standard.title}
            </h3>
            <p>
              {isEnglish
                ? standard.descriptionEn || standard.description
                : standard.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
