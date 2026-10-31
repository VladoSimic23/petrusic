import Image from "next/image";
import Link from "next/link";
import type { ProjectSummary } from "../../sanity/lib/projects";

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

  return (
    <li className="sale-project-card">
      <Link
        className="sale-project-card__image"
        href={`/prodaja-stanova/${project.slug}`}
        aria-label={`Pogledaj projekt ${project.title}`}
      >
        <Image
          src={project.image.src}
          alt={project.image.alt || project.title}
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
        <span className="sale-project-card__availability">Projekt u ponudi</span>
      </Link>
      <div className="sale-project-card__body">
        <div>
          <p className="sale-project-card__location">{project.location}</p>
          <h2>{project.title}</h2>
        </div>
        <dl>
          {project.completion ? (
            <div>
              <dt>Završetak</dt>
              <dd>{project.completion}</dd>
            </div>
          ) : null}
        </dl>
        <Link
          className="sale-project-card__link"
          href={`/prodaja-stanova/${project.slug}`}
        >
          Otkrijte projekt <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </li>
  );
}
