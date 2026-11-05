"use client";

import Image from "next/image";
import Link from "next/link";
import type { ProjectSummary } from "../../sanity/lib/projects";
import { useLanguage } from "./language-provider";

export default function SaleProjectCard({
  project,
  index,
  priority = false,
}: {
  project: ProjectSummary;
  index: number;
  priority?: boolean;
}) {
  const { hotspot } = project.image;
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const title = isEnglish ? project.english?.title || project.title : project.title;
  const location = isEnglish
    ? project.english?.location || project.location
    : project.location;
  const completion = isEnglish
    ? project.english?.completion || project.completion
    : project.completion;

  return (
    <li className="sale-project-card">
      <Link
        className="sale-project-card__image"
        href={`/prodaja-stanova/${project.slug}`}
        aria-label={`${isEnglish ? "View project" : "Pogledaj projekt"} ${title}`}
      >
        <Image
          src={project.image.src}
          alt={isEnglish ? project.image.englishAlt || title : project.image.alt || title}
          fill
          loading={priority ? "eager" : undefined}
          sizes="(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 680px"
          style={
            hotspot
              ? { objectPosition: `${hotspot.x * 100}% ${hotspot.y * 100}%` }
              : undefined
          }
        />
        <span className="sale-project-card__index">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="sale-project-card__availability">
          {isEnglish ? "Project available" : "Projekt u ponudi"}
        </span>
      </Link>
      <div className="sale-project-card__body">
        <div>
          <p className="sale-project-card__location">{location}</p>
          <h2>{title}</h2>
        </div>
        <dl>
          {completion ? (
            <div>
              <dt>{isEnglish ? "Completion" : "Završetak"}</dt>
              <dd>{completion}</dd>
            </div>
          ) : null}
        </dl>
        <Link
          className="sale-project-card__link"
          href={`/prodaja-stanova/${project.slug}`}
        >
          {isEnglish ? "Discover project" : "Otkrijte projekt"}{" "}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </li>
  );
}
