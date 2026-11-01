"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

export type ReferenceCard = {
  _id: string;
  title: string;
  slug: string;
  location?: string;
  completionYear?: number;
  apartmentCount?: number;
  description?: string;
  image: {
    src: string;
    alt?: string;
    hotspot?: { x: number; y: number };
  };
};

export type ReferencesContent = {
  eyebrow?: string;
  title: string;
  viewAllLink: { label: string; href: string };
  projects: ReferenceCard[];
};

export default function ReferencesSection({
  eyebrow,
  title,
  viewAllLink,
  projects,
}: ReferencesContent) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const stageRef = useRef<HTMLUListElement>(null);
  const count = projects.length;

  useEffect(() => {
    if (!activeId) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!stageRef.current?.contains(event.target as Node)) setActiveId(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveId(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeId]);

  return (
    <section
      className="references-section content-section"
      id="arhiva"
      aria-labelledby="references-title"
    >
      <div className="section-heading">
        <div>
          {eyebrow ? <p className="eyebrow eyebrow--dark">{eyebrow}</p> : null}
          <h2 id="references-title">{title}</h2>
        </div>
      </div>

      <ul
        ref={stageRef}
        className="reference-stage"
        data-active={activeId ? "true" : "false"}
        style={{ "--n": count } as CSSProperties}
      >
        {projects.map((project, index) => {
          const { hotspot } = project.image;
          const isActive = project._id === activeId;
          const isLast = index === count - 1;
          const x = count > 1 ? (index * 50) / (count - 1) : 20;
          const origin =
            count === 1
              ? "center"
              : index === 0
                ? "left center"
                : isLast
                  ? "right center"
                  : "center";

          return (
            <li
              className="reference-step"
              data-active={isActive}
              data-last={isLast}
              key={project._id}
              style={
                {
                  "--i": index,
                  "--x": `${x}%`,
                  "--y": `${index * 120}px`,
                  "--origin": origin,
                } as CSSProperties
              }
            >
              <button
                type="button"
                className="reference-step__toggle"
                aria-pressed={isActive}
                aria-label={`${project.title}${project.location ? `, ${project.location}` : ""}`}
                onClick={() => setActiveId(isActive ? null : project._id)}
              >
                <Image
                  className="reference-step__image"
                  src={project.image.src}
                  alt={project.image.alt ?? ""}
                  fill
                  sizes="(max-width: 900px) 100vw, 56vw"
                  style={
                    hotspot
                      ? { objectPosition: `${hotspot.x * 100}% ${hotspot.y * 100}%` }
                      : undefined
                  }
                />
                <span className="reference-step__shade" aria-hidden="true" />
              </button>

              <div className="reference-step__content">
                {project.completionYear ? (
                  <span className="reference-step__year">
                    {project.completionYear}
                  </span>
                ) : null}
                {project.location ? (
                  <span className="reference-step__location">
                    {project.location}
                  </span>
                ) : null}
                <h3 className="reference-step__title">{project.title}</h3>

                <div className="reference-step__details">
                  {project.description ? (
                    <p className="reference-step__description">
                      {project.description}
                    </p>
                  ) : null}
                  <div className="reference-step__meta">
                    {project.apartmentCount ? (
                      <span>
                        {project.apartmentCount}{" "}
                        {apartmentWord(project.apartmentCount)}
                      </span>
                    ) : (
                      <span />
                    )}
                    <Link
                      className="reference-step__link"
                      href={`/izgradeni-objekti/${project.slug}`}
                      tabIndex={0}
                    >
                      Pogledaj zgradu <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="references-section__footer">
        <Link className="references-section__cta" href={viewAllLink.href}>
          {viewAllLink.label} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

function apartmentWord(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "stan";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "stana";
  return "stanova";
}
