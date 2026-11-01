"use client";

import Link from "next/link";
import { useId, useState } from "react";

export type FaqContent = {
  eyebrow?: string;
  title: string;
  description?: string;
  items: { _key: string; question: string; answer: string }[];
  cta?: { text?: string; link: { label: string; href: string } };
};

export default function FaqSection({
  eyebrow,
  title,
  description,
  items,
  cta,
}: FaqContent) {
  const [openKey, setOpenKey] = useState<string | null>(items[0]?._key ?? null);
  const baseId = useId();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section
      className="faq-section content-section"
      id="faq"
      aria-labelledby="faq-title"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="faq-section__layout">
        <div className="faq-section__intro">
          <div className="faq-section__heading">
            {eyebrow ? <p className="eyebrow eyebrow--dark">{eyebrow}</p> : null}
            <h2 id="faq-title">{title}</h2>
          </div>
          {description || cta ? (
            <div className="faq-section__summary">
              {description ? (
                <p className="faq-section__description">{description}</p>
              ) : null}

              {cta ? (
                <div className="faq-section__cta">
                  {cta.text ? <p>{cta.text}</p> : null}
                  <Link className="faq-section__cta-link" href={cta.link.href}>
                    {cta.link.label} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <ul className="faq-list">
          {items.map((item, index) => {
            const isOpen = item._key === openKey;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;

            return (
              <li className="faq-item" data-open={isOpen} key={item._key}>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    className="faq-item__trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenKey(isOpen ? null : item._key)}
                  >
                    <span className="faq-item__number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="faq-item__question">{item.question}</span>
                    <span className="faq-item__icon" aria-hidden="true" />
                  </button>
                </h3>
                <div
                  className="faq-item__panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                >
                  <div className="faq-item__panel-inner">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
