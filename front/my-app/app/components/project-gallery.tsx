"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type TouchEvent,
} from "react";
import type { ProjectImage } from "../../sanity/lib/projects";
import { useLanguage } from "./language-provider";

type GalleryImage = ProjectImage & { _key: string };

const SHAPES = ["wide", "tall", "wide", "wide", "tall"] as const;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function focalPoint(image: GalleryImage): CSSProperties | undefined {
  return image.hotspot
    ? { objectPosition: `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%` }
    : undefined;
}

export default function ProjectGallery({
  images,
  title,
  englishTitle,
}: {
  images: GalleryImage[];
  title: string;
  englishTitle?: string;
}) {
  const railRef = useRef<HTMLUListElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef({ active: false, moved: false, startX: 0, startLeft: 0 });
  const swipeRef = useRef<number | null>(null);

  const [railIndex, setRailIndex] = useState(0);
  const [scrollable, setScrollable] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const displayTitle = isEnglish ? englishTitle || title : title;

  const count = images.length;
  const isOpen = lightboxIndex !== null;
  const activeImage = lightboxIndex !== null ? images[lightboxIndex] : undefined;

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = rail.scrollWidth - rail.clientWidth;
      const progress = max > 0 ? Math.min(1, Math.max(0, rail.scrollLeft / max)) : 0;
      const visible = rail.scrollWidth > 0 ? Math.min(1, rail.clientWidth / rail.scrollWidth) : 1;

      const thumb = thumbRef.current;
      if (thumb) {
        thumb.style.width = `${visible * 100}%`;
        thumb.style.transform = `translateX(${progress * (1 / visible - 1) * 100}%)`;
      }

      setScrollable(max > 8);
      setRailIndex(Math.round(progress * (count - 1)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(rail);
    rail.addEventListener("scroll", schedule, { passive: true });

    return () => {
      observer.disconnect();
      rail.removeEventListener("scroll", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [count]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") {
        setLightboxIndex((index) => (index === null ? index : (index + 1) % count));
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((index) =>
          index === null ? index : (index - 1 + count) % count,
        );
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [count, isOpen]);

  if (!count) return null;

  // Povlačenje mišem; dodir i trackpad već rade nativno.
  const onPointerDown = (event: PointerEvent<HTMLUListElement>) => {
    const rail = railRef.current;
    if (!rail || event.pointerType !== "mouse" || event.button !== 0) return;

    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startLeft: rail.scrollLeft,
    };

    const onMove = (moveEvent: globalThis.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag.active) return;
      const delta = moveEvent.clientX - drag.startX;
      if (!drag.moved && Math.abs(delta) > 6) {
        drag.moved = true;
        rail.dataset.dragging = "true";
      }
      if (drag.moved) rail.scrollLeft = drag.startLeft - delta;
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      delete rail.dataset.dragging;
      dragRef.current.active = false;
      // Klik se šalje odmah nakon pointerup pa ga tek tada smijemo ponovno omogućiti.
      setTimeout(() => {
        dragRef.current.moved = false;
      }, 0);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const step = (direction: 1 | -1) =>
    setLightboxIndex((index) =>
      index === null ? index : (index + direction + count) % count,
    );

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    swipeRef.current = event.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = swipeRef.current;
    const end = event.changedTouches[0]?.clientX;
    swipeRef.current = null;
    if (start == null || end == null || count < 2) return;
    if (Math.abs(end - start) > 50) step(end < start ? 1 : -1);
  };

  return (
    <section
      className="project-gallery"
      id="galerija"
      aria-label={isEnglish ? "Photo gallery" : "Galerija fotografija"}
    >
      <div className="section-heading project-detail__wrap project-gallery__head">
        <div>
          <p className="eyebrow eyebrow--dark">{isEnglish ? "Gallery" : "Galerija"}</p>
          <h2>{isEnglish ? "Take a closer look" : "Pogledajte izbliza"}</h2>
        </div>
        {scrollable ? (
          <div className="project-gallery__controls">
            <span className="project-gallery__position">
              <strong>{pad(railIndex + 1)}</strong> / {pad(count)}
            </span>
          </div>
        ) : null}
      </div>

      <ul
        ref={railRef}
        className="project-gallery__rail"
        role="list"
        aria-label={isEnglish ? "Project photos" : "Fotografije projekta"}
        onPointerDown={onPointerDown}
      >
        {images.map((image, index) => (
          <li
            className="project-gallery__item"
            data-shape={SHAPES[index % SHAPES.length]}
            key={image._key}
          >
            <button
              type="button"
              className="project-gallery__card"
              onClick={() => {
                if (!dragRef.current.moved) setLightboxIndex(index);
              }}
              aria-label={
                isEnglish
                  ? `Open photo ${index + 1} of ${count}`
                  : `Otvori fotografiju ${index + 1} od ${count}`
              }
            >
              <Image
                src={image.src}
                alt={
                  isEnglish
                    ? image.englishAlt || title
                    : image.alt || title
                }
                fill
                sizes="(max-width: 680px) 84vw, 740px"
                draggable={false}
                style={focalPoint(image)}
              />
              <span className="project-gallery__index" aria-hidden="true">
                {pad(index + 1)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {scrollable ? (
        <div className="project-gallery__progress" aria-hidden="true">
          <span ref={thumbRef} />
        </div>
      ) : null}

      {activeImage && lightboxIndex !== null ? (
        <div
          className="project-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${displayTitle} — ${isEnglish ? "photo gallery" : "galerija slika"}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) setLightboxIndex(null);
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            ref={closeRef}
            type="button"
            className="project-lightbox__close"
            onClick={() => setLightboxIndex(null)}
            aria-label={isEnglish ? "Close gallery" : "Zatvori galeriju"}
          >
            <span aria-hidden="true">×</span>
          </button>
          <div className="project-lightbox__image" key={activeImage._key}>
            <Image
              src={activeImage.src}
              alt={
                isEnglish
                  ? activeImage.englishAlt || title
                  : activeImage.alt || title
              }
              fill
              sizes="(max-width: 760px) 100vw, 1200px"
            />
          </div>
          <span
            className="project-gallery__counter project-lightbox__counter"
            aria-label={
              isEnglish
                ? `Photo ${lightboxIndex + 1} of ${count}`
                : `Fotografija ${lightboxIndex + 1} od ${count}`
            }
          >
            {lightboxIndex + 1}/{count}
          </span>
          {(isEnglish
            ? activeImage.englishCaption || activeImage.caption
            : activeImage.caption) ? (
            <p className="project-lightbox__caption">
              {isEnglish
                ? activeImage.englishCaption || activeImage.caption
                : activeImage.caption}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
