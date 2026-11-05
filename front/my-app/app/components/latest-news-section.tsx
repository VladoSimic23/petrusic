"use client";

import Image from "next/image";
import Link from "next/link";
import type { AktualnostSummary } from "../../sanity/lib/aktualnosti";
import { useLanguage } from "./language-provider";

export type NewsSectionContent = {
  eyebrow?: string;
  eyebrowEn?: string;
  title?: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  viewAllLabel?: string;
  viewAllLabelEn?: string;
};

const categoryLabels: Record<string, { hr: string; en: string }> = {
  "napredak-gradnje": { hr: "Napredak gradnje", en: "Construction progress" },
  "standardi-kvaliteta": {
    hr: "Standardi i kvaliteta",
    en: "Quality standards",
  },
  obavijesti: { hr: "Obavijesti", en: "Announcements" },
  savjeti: { hr: "Savjeti za uređenje", en: "Interior tips" },
};

function formatDate(value: string, language: "hr" | "en") {
  return new Intl.DateTimeFormat(language === "en" ? "en-GB" : "hr-HR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function LatestNewsSection({
  content,
  items,
}: {
  content?: NewsSectionContent;
  items: AktualnostSummary[];
}) {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const eyebrow =
    (isEnglish ? content?.eyebrowEn : content?.eyebrow) ||
    (isEnglish ? "Latest news" : content?.eyebrow || "Novosti");
  const title =
    (isEnglish ? content?.titleEn : content?.title) ||
    (isEnglish ? "News and updates" : content?.title || "Aktualnosti");
  const description =
    (isEnglish ? content?.descriptionEn : content?.description) ||
    (isEnglish
      ? "Follow the latest news and updates from our projects."
      : content?.description ||
        "Pratite novosti i događanja iz naših projekata.");
  const viewAllLabel =
    (isEnglish ? content?.viewAllLabelEn : content?.viewAllLabel) ||
    (isEnglish ? "All news" : content?.viewAllLabel || "Sve aktualnosti");

  if (!items.length) return null;

  return (
    <section
      className="latest-news-section content-section"
      id="aktualnosti"
      aria-labelledby="latest-news-title"
    >
      <div className="section-heading latest-news-section__heading">
        <div>
          <p className="eyebrow eyebrow--dark">{eyebrow}</p>
          <h2 id="latest-news-title">{title}</h2>
          {/* <p className="latest-news-section__description">{description}</p> */}
        </div>
      </div>

      <ul className="news-grid">
        {items.slice(0, 3).map((item) => {
          const category = item.category
            ? categoryLabels[item.category]
            : undefined;
          const title = isEnglish ? item.titleEn || item.title : item.title;
          const excerpt = isEnglish
            ? item.excerptEn || item.excerpt
            : item.excerpt;
          const categoryLabel = isEnglish
            ? item.categoryEn || category?.en
            : category?.hr;
          return (
            <li className="news-card" key={item._id}>
              <Link
                className="news-card__image"
                href={`/aktualnosti/${item.slug}`}
                aria-label={`${isEnglish ? "Read article" : "Pročitaj članak"}: ${title}`}
              >
                {item.image ? (
                  <Image
                    src={item.image.src}
                    alt={
                      isEnglish
                        ? item.image.altEn || item.image.alt || title
                        : item.image.alt || title
                    }
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw"
                    style={
                      item.image.hotspot
                        ? {
                            objectPosition: `${item.image.hotspot.x * 100}% ${item.image.hotspot.y * 100}%`,
                          }
                        : undefined
                    }
                  />
                ) : (
                  <span className="news-card__image-placeholder" />
                )}
              </Link>
              <div className="news-card__content">
                <p className="news-card__meta">
                  {categoryLabel}
                  {category ? " · " : ""}
                  <time dateTime={item.publishedAt}>
                    {formatDate(item.publishedAt, language)}
                  </time>
                </p>
                <h3>
                  <Link href={`/aktualnosti/${item.slug}`}>{title}</Link>
                </h3>
                {excerpt ? <p>{excerpt}</p> : null}
                <Link
                  className="sale-project-card__link"
                  href={`/aktualnosti/${item.slug}`}
                >
                  {isEnglish ? "Read more" : "Pročitaj više"}{" "}
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="latest-news-section__footer">
        <Link className="references-section__cta" href="/aktualnosti">
          {viewAllLabel} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
