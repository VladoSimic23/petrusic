import type { Metadata } from "next";
import Link from "next/link";
import SaleProjectCard from "../components/sale-project-card";
import SalePageIntro from "../components/sale-page-intro";
import { getProjectsForSale } from "../../sanity/lib/projects";

export const metadata: Metadata = {
  title: "Stanovi u prodaji | Petrušić gradnja",
  description:
    "Pregledajte aktualne stambene projekte Petrušić gradnje i pronađite više informacija o svakoj zgradi.",
};

export default async function ProjectsForSalePage() {
  const projects = await getProjectsForSale();

  return (
    <main className="sale-page">
        <SalePageIntro />

        {projects.length ? (
          <ul className="sale-project-grid">
            {projects.map((project, index) => (
              <SaleProjectCard
                key={project._id}
                project={project}
                index={index}
                priority={index === 0}
              />
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
  );
}
