import Image from "next/image";
import Link from "next/link";
import type { BuildingSummary } from "../../sanity/lib/buildings";

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
  const href = `/izgradeni-objekti/${building.slug}`;

  return (
    <li className="sale-project-card building-card">
      <Link
        className="sale-project-card__image"
        href={href}
        aria-label={`Pogledaj objekt ${building.title}`}
      >
        <Image
          src={building.image.src}
          alt={building.image.alt || building.title}
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
            Svi stanovi prodani
          </span>
        ) : null}
      </Link>
      <div className="sale-project-card__body">
        <div>
          <p className="sale-project-card__location">{building.location}</p>
          <h2>{building.title}</h2>
          {building.description ? (
            <p className="building-card__text">{building.description}</p>
          ) : null}
        </div>
        <dl>
          {building.apartmentCount ? (
            <div>
              <dt>Stanova</dt>
              <dd>{building.apartmentCount}</dd>
            </div>
          ) : null}
          {building.completionYear ? (
            <div>
              <dt>Završeno</dt>
              <dd>{building.completionYear}</dd>
            </div>
          ) : null}
        </dl>
        <Link className="sale-project-card__link" href={href}>
          Pogledaj objekt <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </li>
  );
}
