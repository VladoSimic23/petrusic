"use client";

import Image from "next/image";
import Link from "next/link";
import type { BuildingSummary } from "../../sanity/lib/buildings";
import { useLanguage } from "./language-provider";

export default function BuildingCard({
  building,
  index,
  priority = false,
}: {
  building: BuildingSummary;
  index: number;
  priority?: boolean;
}) {
  const { hotspot } = building.image;
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const title = isEnglish ? building.english?.title || building.title : building.title;
  const location = isEnglish
    ? building.english?.location || building.location
    : building.location;
  const description = isEnglish
    ? building.english?.description || building.description
    : building.description;
  const href = `/izgradeni-objekti/${building.slug}`;

  return (
    <li className="sale-project-card building-card">
      <Link
        className="sale-project-card__image"
        href={href}
        aria-label={`${isEnglish ? "View building" : "Pogledaj objekt"} ${title}`}
      >
        <Image
          src={building.image.src}
          alt={
            isEnglish
              ? building.image.altEn || building.image.alt || title
              : building.image.alt || title
          }
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
        {building.completionYear ? (
          <span className="building-card__year">{building.completionYear}</span>
        ) : null}
        {building.allSold ? (
          <span className="sale-project-card__availability building-card__sold">
            {isEnglish ? "All apartments sold" : "Svi stanovi prodani"}
          </span>
        ) : null}
      </Link>
      <div className="sale-project-card__body">
        <div>
          <p className="sale-project-card__location">{location}</p>
          <h2>{title}</h2>
          {description ? (
            <p className="building-card__text">{description}</p>
          ) : null}
        </div>
        <dl>
          {building.apartmentCount ? (
            <div>
              <dt>{isEnglish ? "Apartments" : "Stanova"}</dt>
              <dd>{building.apartmentCount}</dd>
            </div>
          ) : null}
          {building.completionYear ? (
            <div>
              <dt>{isEnglish ? "Completed" : "Završeno"}</dt>
              <dd>{building.completionYear}</dd>
            </div>
          ) : null}
        </dl>
        <Link className="sale-project-card__link" href={href}>
          {isEnglish ? "View building" : "Pogledaj objekt"}{" "}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </li>
  );
}
