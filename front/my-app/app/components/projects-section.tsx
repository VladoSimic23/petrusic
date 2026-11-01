"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type TouchEvent,
} from "react";

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

const STORY_DURATION_MS = 7000;
const SWIPE_THRESHOLD = 45;

const pad = (value: number) => String(value).padStart(2, "0");

export default function ProjectsSection({
  eyebrow,
  title,
  cardCtaLabel,
  viewAllLink,
  projects,
}: ProjectsContent) {
  const count = projects.length;
  const [activeProject, setActiveProject] = useState(0);
  const [autoplayAllowed, setAutoplayAllowed] = useState(false);
  const [autoplayOn, setAutoplayOn] = useState(true);
  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);

  const project = projects[activeProject] ?? projects[0];
  const hasMany = count > 1;
  const autoplayActive = hasMany && autoplayAllowed && autoplayOn;
  const playing = autoplayActive && inView && !hovered;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAutoplayAllowed(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !hasMany) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [hasMany]);

  // Keep the active tab visible inside the horizontally scrolling mobile rail.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || rail.scrollWidth <= rail.clientWidth) return;

    const option = rail.children[activeProject] as HTMLElement | undefined;
    if (!option) return;

    rail.scrollTo({
      left: option.offsetLeft - (rail.clientWidth - option.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [activeProject]);

  const step = useCallback(
    (direction: 1 | -1) =>
      setActiveProject((current) => (current + direction + count) % count),
    [count],
  );

  const selectProject = (index: number) => {
    setActiveProject(index);
    setAutoplayOn(false);
  };

  const onTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || !hasMany) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;

    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      suppressClick.current = true;
      setAutoplayOn(false);
      step(dx < 0 ? 1 : -1);
    }
  };

  const onImageClick = (event: MouseEvent) => {
    if (suppressClick.current) {
      event.preventDefault();
      suppressClick.current = false;
    }
  };

  if (!project) return null;

  const { hotspot } = project.image;

  return (
    <section
      ref={sectionRef}
      className="projects-section content-section"
      id="projekti"
      aria-labelledby="projects-title"
      data-playing={playing ? "true" : "false"}
      data-autoplay={autoplayActive ? "on" : "off"}
      style={{ "--story-duration": `${STORY_DURATION_MS}ms` } as CSSProperties}
    >
      <div className="section-heading projects-section__heading">
        <div>
          {eyebrow ? <p className="eyebrow eyebrow--dark">{eyebrow}</p> : null}
          <h2 id="projects-title">{title}</h2>
        </div>
        {hasMany ? (
          <span
            className="projects-showcase__count"
            aria-live={autoplayActive ? "off" : "polite"}
          >
            <span>{pad(activeProject + 1)}</span>
            <span aria-hidden="true">/</span>
            {pad(count)}
          </span>
        ) : null}
      </div>

      <div
        className="projects-showcase"
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setHovered(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") setHovered(false);
        }}
      >
        <div
          className="projects-showcase__image"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Link
            className="projects-showcase__image-link"
            href={`/prodaja-stanova/${project.slug}`}
            aria-label={`Pogledaj projekt ${project.title}`}
            onClick={onImageClick}
            draggable={false}
          >
            <span className="projects-showcase__frame" key={project._id}>
              <Image
                src={project.image.src}
                alt={project.image.alt || project.title}
                fill
                priority={activeProject === 0}
                sizes="(max-width: 900px) 100vw, 65vw"
                style={
                  hotspot
                    ? {
                        objectPosition: `${hotspot.x * 100}% ${hotspot.y * 100}%`,
                      }
                    : undefined
                }
              />
            </span>
            <span className="projects-showcase__image-label">
              Aktualno u ponudi <span aria-hidden="true">↗</span>
            </span>
          </Link>

          {hasMany ? (
            <div className="projects-showcase__stories">
              <div className="projects-showcase__story-track" aria-hidden="true">
                {projects.map((item, index) => (
                  <span
                    className="projects-showcase__story"
                    key={item._id}
                    data-state={
                      index === activeProject
                        ? "active"
                        : index < activeProject
                          ? "done"
                          : "idle"
                    }
                  >
                    <span
                      className="projects-showcase__story-fill"
                      onAnimationEnd={
                        index === activeProject ? () => step(1) : undefined
                      }
                    />
                  </span>
                ))}
              </div>

              {autoplayAllowed ? (
                <button
                  type="button"
                  className="projects-showcase__story-toggle"
                  aria-label={
                    autoplayOn
                      ? "Pauziraj automatsku izmjenu projekata"
                      : "Pokreni automatsku izmjenu projekata"
                  }
                  aria-pressed={!autoplayOn}
                  onClick={() => setAutoplayOn((value) => !value)}
                >
                  <span
                    className="projects-showcase__story-icon"
                    data-icon={autoplayOn ? "pause" : "play"}
                    aria-hidden="true"
                  />
                </button>
              ) : null}
            </div>
          ) : null}

          {hasMany && seen ? (
            <span className="projects-showcase__swipe-hint" aria-hidden="true">
              <span>‹</span> Povuci <span>›</span>
            </span>
          ) : null}
        </div>

        <div className="projects-showcase__details" key={project._id}>
          <p className="eyebrow eyebrow--dark">Projekt {pad(activeProject + 1)}</p>
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

      {hasMany ? (
        <div
          ref={railRef}
          className="projects-showcase__selector"
          role="group"
          aria-label="Odaberi projekt"
        >
          {projects.map((item, index) => {
            const isActive = index === activeProject;
            const thumbHotspot = item.image.hotspot;

            return (
              <button
                className="projects-showcase__option"
                type="button"
                key={item._id}
                aria-pressed={isActive}
                onClick={() => selectProject(index)}
              >
                <span className="projects-showcase__option-thumb">
                  <Image
                    src={item.image.src}
                    alt=""
                    fill
                    sizes="96px"
                    style={
                      thumbHotspot
                        ? {
                            objectPosition: `${thumbHotspot.x * 100}% ${thumbHotspot.y * 100}%`,
                          }
                        : undefined
                    }
                  />
                  <span className="projects-showcase__option-number">
                    {pad(index + 1)}
                  </span>
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
            );
          })}
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
