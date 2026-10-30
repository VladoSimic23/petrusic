"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type ProjectCard = {
  _id: string;
  title: string;
  slug: string;
  location?: string;
  completion?: string;
  image: {
    src: string;
    alt?: string;
    hotspot?: { x: number; y: number };
  };
};

export type ProjectsContent = {
  eyebrow?: string;
  title: string;
  cardCtaLabel: string;
  viewAllLink?: { label: string; href: string };
  projects: ProjectCard[];
};

export default function ProjectsSection({
  eyebrow,
  title,
  cardCtaLabel,
  viewAllLink,
  projects,
}: ProjectsContent) {
  const [activeProject, setActiveProject] = useState(0);
  const project = projects[activeProject] ?? projects[0];

  if (!project) return null;

  const { hotspot } = project.image;

  return (
    <section
      className="projects-section content-section"
      id="projekti"
      aria-labelledby="projects-title"
    >
      <div className="section-heading projects-section__heading">
        <div>
          {eyebrow ? <p className="eyebrow eyebrow--dark">{eyebrow}</p> : null}
          <h2 id="projects-title">{title}</h2>
        </div>
        {projects.length > 1 ? (
          <span className="projects-showcase__count" aria-live="polite">
            <span>{String(activeProject + 1).padStart(2, "0")}</span>
            <span aria-hidden="true">/</span>
            {String(projects.length).padStart(2, "0")}
          </span>
        ) : null}
      </div>

      <div className="projects-showcase">
        <Link
          className="projects-showcase__image"
          href={`/prodaja-stanova/${project.slug}`}
          aria-label={`Pogledaj projekt ${project.title}`}
        >
          <Image
            src={project.image.src}
            alt={project.image.alt || project.title}
            fill
            priority={activeProject === 0}
            sizes="(max-width: 900px) 100vw, 65vw"
            style={
              hotspot
                ? { objectPosition: `${hotspot.x * 100}% ${hotspot.y * 100}%` }
                : undefined
            }
          />
          <span className="projects-showcase__image-label">
            Aktualno u ponudi <span aria-hidden="true">↗</span>
          </span>
        </Link>

        <div className="projects-showcase__details">
          <p className="eyebrow eyebrow--dark">
            Projekt {String(activeProject + 1).padStart(2, "0")}
          </p>
          <h3>{project.title}</h3>
          <p className="projects-showcase__description">
            Upoznajte projekt, pogledajte galeriju fotografija i saznajte više o
            mogućnostima koje nudi.
          </p>

          <dl className="projects-showcase__meta">
            {project.location ? (
              <div>
                <dt>Lokacija</dt>
                <dd>{project.location}</dd>
              </div>
            ) : null}
            {project.completion ? (
              <div>
                <dt>Planirani završetak</dt>
                <dd>{project.completion}</dd>
              </div>
            ) : null}
          </dl>

          <Link
            className="projects-showcase__cta"
            href={`/prodaja-stanova/${project.slug}`}
          >
            {cardCtaLabel} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      {projects.length > 1 ? (
        <div className="projects-showcase__selector" aria-label="Odaberi projekt">
          {projects.map((item, index) => (
            <button
              className="projects-showcase__option"
              type="button"
              key={item._id}
              aria-pressed={index === activeProject}
              onClick={() => setActiveProject(index)}
            >
              <span className="projects-showcase__option-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="projects-showcase__option-copy">
                <span>{item.title}</span>
                {item.location ? <small>{item.location}</small> : null}
              </span>
              <span
                className="projects-showcase__option-arrow"
                aria-hidden="true"
              >
                ↗
              </span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="projects-section__footer">
        <Link
          className="projects-section__view-all"
          href={viewAllLink?.href ?? "/prodaja-stanova"}
        >
          {viewAllLink?.label ?? "Svi dostupni projekti"}{" "}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
