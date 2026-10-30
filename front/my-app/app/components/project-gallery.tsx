"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ProjectImage } from "../../sanity/lib/projects";

type GalleryImage = ProjectImage & { _key: string };

export default function ProjectGallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const activeImage = images[activeIndex];

  useEffect(() => {
    if (!isLightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsLightboxOpen(false);
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index + 1) % images.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) => (index - 1 + images.length) % images.length);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [images.length, isLightboxOpen]);

  if (!activeImage) return null;

  const renderImage = (image: GalleryImage, priority = false) => (
    <Image
      src={image.src}
      alt={image.alt || title}
      fill
      priority={priority}
      sizes="(max-width: 760px) 100vw, 1200px"
      style={
        image.hotspot
          ? {
              objectPosition: `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`,
            }
          : undefined
      }
    />
  );

  return (
    <>
      <div className="project-gallery">
        <button
          type="button"
          className="project-gallery__main"
          onClick={() => setIsLightboxOpen(true)}
          aria-label={`Otvori fotografiju ${activeIndex + 1} od ${images.length}`}
        >
          {renderImage(activeImage, true)}
          <span className="project-gallery__expand" aria-hidden="true">
            ⤢
          </span>
        <span
          className="project-gallery__counter"
          aria-label={`Fotografija ${activeIndex + 1} od ${images.length}`}
        >
          {activeIndex + 1}/{images.length}
          </span>
        </button>

        {images.length > 1 ? (
          <div className="project-gallery__thumbnails" aria-label="Fotografije">
            {images.slice(0, 4).map((image, index) => (
              <button
                type="button"
                className="project-gallery__thumbnail"
                data-active={index === activeIndex}
                key={image._key}
                onClick={() => setActiveIndex(index)}
                aria-label={`Prikaži fotografiju ${index + 1}`}
                aria-pressed={index === activeIndex}
              >
                {renderImage(image)}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {isLightboxOpen ? (
        <div
          className="project-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — galerija slika`}
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsLightboxOpen(false);
          }}
        >
          <button
            type="button"
            className="project-lightbox__close"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Zatvori galeriju"
          >
            <span aria-hidden="true">×</span>
          </button>
          {images.length > 1 ? (
            <button
              type="button"
              className="project-lightbox__arrow project-lightbox__arrow--previous"
              onClick={() =>
                setActiveIndex((index) => (index - 1 + images.length) % images.length)
              }
              aria-label="Prethodna fotografija"
            >
              ←
            </button>
          ) : null}
          <div className="project-lightbox__image">
            {renderImage(activeImage)}
          </div>
          <span
            className="project-gallery__counter project-lightbox__counter"
            aria-label={`Fotografija ${activeIndex + 1} od ${images.length}`}
          >
            {activeIndex + 1}/{images.length}
          </span>
          {images.length > 1 ? (
            <button
              type="button"
              className="project-lightbox__arrow project-lightbox__arrow--next"
              onClick={() => setActiveIndex((index) => (index + 1) % images.length)}
              aria-label="Sljedeća fotografija"
            >
              →
            </button>
          ) : null}
          {activeImage.caption ? (
            <p className="project-lightbox__caption">{activeImage.caption}</p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
