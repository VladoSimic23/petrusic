import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../components/site-header";
import { getProjectsForSale } from "../../sanity/lib/projects";

export const metadata: Metadata = {
  title: "Stanovi u prodaji | Petrušić gradnja",
  description:
    "Pregledajte aktualne stambene projekte Petrušić gradnje i pronađite više informacija o svakoj zgradi.",
};

export default async function ProjectsForSalePage() {
  const projects = await getProjectsForSale();

  return (
    <>
      <SiteHeader />
      <main className="sale-page">
        <header className="sale-page__intro">
          <Link className="sale-page__back" href="/#projekti">
            <span aria-hidden="true">←</span> Naslovna
          </Link>
          <p className="eyebrow eyebrow--dark">Pronađite svoj novi dom</p>
          <h1>Stanovi u prodaji</h1>
          <p className="sale-page__lead">
            Upoznajte naše aktualne projekte i pronađite zgradu koja odgovara
            vašem načinu života.
          </p>
        </header>

        {projects.length ? (
          <ul className="sale-project-grid">
            {projects.map((project, index) => (
              <li className="sale-project-card" key={project._id}>
                <Link
                  className="sale-project-card__image"
                  href={`/prodaja-stanova/${project.slug}`}
                  aria-label={`Pogledaj projekt ${project.title}`}
                >
                  <Image
                    src={project.image.src}
                    alt={project.image.alt || project.title}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 680px"
                    style={
                      project.image.hotspot
                        ? {
                            objectPosition: `${project.image.hotspot.x * 100}% ${project.image.hotspot.y * 100}%`,
                          }
                        : undefined
                    }
                  />
                  <span className="sale-project-card__index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="sale-project-card__availability">
                    Projekt u ponudi
                  </span>
                </Link>
                <div className="sale-project-card__body">
                  <div>
                    <p className="sale-project-card__location">
                      {project.location}
                    </p>
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
            ))}
          </ul>
        ) : (
          <div className="sale-page__empty">
            <span aria-hidden="true">01</span>
            <h2>Trenutno nema projekata u prodaji</h2>
            <p>
              Novi projekti uskoro dolaze. Slobodno nam se javite za više
              informacija.
            </p>
            <Link className="button button--primary" href="/#kontakt">
              Kontaktirajte nas <span aria-hidden="true">↗</span>
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
