"use client";

import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type {
  Aktualnost,
  AktualnostSummary,
} from "../../sanity/lib/aktualnosti";
import { portableComponents } from "./project-body";
import { useLanguage } from "./language-provider";

const categoryLabels: Record<string, { hr: string; en: string }> = {
  "napredak-gradnje": { hr: "Napredak gradnje", en: "Construction progress" },
  "standardi-kvaliteta": { hr: "Standardi i kvaliteta", en: "Quality standards" },
  obavijesti: { hr: "Obavijesti i milestones", en: "Announcements and milestones" },
  savjeti: { hr: "Savjeti za uređenje", en: "Interior tips" },
};

function formatDate(value: string, language: "hr" | "en") {
  return new Intl.DateTimeFormat(language === "en" ? "en-GB" : "hr-HR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function categoryLabel(category: string | undefined, language: "hr" | "en") {
  if (!category) return undefined;
  return categoryLabels[category]?.[language] || category;
}

export function AktualnostiList({ items }: { items: AktualnostSummary[] }) {
  const { language } = useLanguage();
  const isEnglish = language === "en";

  return (
    <main className="sale-page news-page">
      <header className="sale-page__intro">
        <Link className="sale-page__back" href="/">
          <span aria-hidden="true">←</span> {isEnglish ? "Home" : "Naslovna"}
        </Link>
        <p className="eyebrow eyebrow--dark">Petrušić gradnja</p>
        <h1>{isEnglish ? "News and updates" : "Aktualnosti i novosti"}</h1>
        <p className="sale-page__lead">
          {isEnglish
            ? "Follow construction progress, project news and company updates."
            : "Pratite novosti, napredak gradnje i događanja iz naših projekata."}
        </p>
      </header>

      {items.length ? (
        <ul className="news-grid">
          {items.map((item, index) => {
            const title = isEnglish ? item.titleEn || item.title : item.title;
            const category = isEnglish
              ? item.categoryEn || categoryLabel(item.category, language)
              : categoryLabel(item.category, language);
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
                      priority={index < 2}
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
                    {category}
                    {category ? " · " : ""}
                    <time dateTime={item.publishedAt}>
                      {formatDate(item.publishedAt, language)}
                    </time>
                    {isEnglish && item.readingTimeEn
                      ? ` · ${item.readingTimeEn}`
                      : !isEnglish && item.readingTime
                        ? ` · ${item.readingTime}`
                        : ""}
                  </p>
                  <h2>
                    <Link href={`/aktualnosti/${item.slug}`}>{title}</Link>
                  </h2>
                  {(isEnglish ? item.excerptEn || item.excerpt : item.excerpt) ? (
                    <p>{isEnglish ? item.excerptEn || item.excerpt : item.excerpt}</p>
                  ) : null}
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
      ) : (
        <p className="news-empty">
          {isEnglish ? "There are no published news articles yet." : "Trenutno nema objavljenih aktualnosti."}
        </p>
      )}
    </main>
  );
}

export function AktualnostArticleView({ item }: { item: Aktualnost }) {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const title = isEnglish ? item.titleEn || item.title : item.title;
  const category = isEnglish
    ? item.categoryEn || categoryLabel(item.category, language)
    : categoryLabel(item.category, language);
  const body = isEnglish && item.bodyEn.length ? item.bodyEn : item.body;

  return (
    <main className="news-article">
      <Link className="sale-page__back" href="/aktualnosti">
        <span aria-hidden="true">←</span>{" "}
        {isEnglish ? "All news" : "Sve aktualnosti"}
      </Link>
      <article>
        <header className="news-article__header">
          <p className="news-card__meta">
            {category}
            {category ? " · " : ""}
            <time dateTime={item.publishedAt}>
              {formatDate(item.publishedAt, language)}
            </time>
            {isEnglish && item.readingTimeEn
              ? ` · ${item.readingTimeEn}`
              : !isEnglish && item.readingTime
                ? ` · ${item.readingTime}`
                : ""}
          </p>
          <h1>{title}</h1>
          {(isEnglish ? item.excerptEn || item.excerpt : item.excerpt) ? (
            <p className="news-article__excerpt">
              {isEnglish ? item.excerptEn || item.excerpt : item.excerpt}
            </p>
          ) : null}
        </header>
        {item.image ? (
          <figure className="news-article__cover">
            <Image
              src={item.image.src}
              alt={
                isEnglish
                  ? item.image.altEn || item.image.alt || title
                  : item.image.alt || title
              }
              width={1600}
              height={1000}
              priority
              sizes="(max-width: 900px) 100vw, 1100px"
              style={
                item.image.hotspot
                  ? {
                      objectPosition: `${item.image.hotspot.x * 100}% ${item.image.hotspot.y * 100}%`,
                    }
                  : undefined
              }
            />
          </figure>
        ) : null}
        <div className="project-body news-article__body">
          <PortableText value={body} components={portableComponents} />
        </div>
      </article>
    </main>
  );
}
