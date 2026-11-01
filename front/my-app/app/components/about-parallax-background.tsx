"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type AboutParallaxBackgroundProps = {
  src: string;
  alt?: string;
  caption?: string;
  hotspot?: { x: number; y: number };
};

export default function AboutParallaxBackground({
  src,
  alt,
  caption,
  hotspot,
}: AboutParallaxBackgroundProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!section || !image || reduceMotion.matches) return;

    let frame = 0;
    const updatePosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = section.getBoundingClientRect();
        const sectionCenter = bounds.top + bounds.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const offset = Math.max(
          -450,
          Math.min(450, (viewportCenter - sectionCenter) * 0.72),
        );
        image.style.setProperty("--about-parallax-offset", `${offset}px`);
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  return (
    <>
      <div
        className="about-section__bg"
        ref={sectionRef}
        aria-hidden={alt ? undefined : true}
      >
        <div className="about-section__bg-image" ref={imageRef}>
          <Image
            src={src}
            alt={alt ?? ""}
            fill
            sizes="100vw"
            style={
              hotspot
                ? { objectPosition: `${hotspot.x * 100}% ${hotspot.y * 100}%` }
                : undefined
            }
          />
        </div>
      </div>
      {caption ? <p className="about-section__caption">{caption}</p> : null}
    </>
  );
}
