"use client";

import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { ComponentProps, CSSProperties } from "react";
import Image from "next/image";
import { useLanguage } from "./language-provider";
import { portableComponents } from "./project-body";
import type { ProjectBodyImage } from "../../sanity/lib/projects";

type TextElement = "span" | "p" | "h1" | "h2" | "dt" | "dd";

export function ProjectText({
  croatian,
  english,
  element: Element = "span",
  typewriter = false,
  ...props
}: {
  croatian: string;
  english: string;
  element?: TextElement;
  typewriter?: boolean;
} & Pick<ComponentProps<"span">, "className" | "id">) {
  const { language } = useLanguage();
  const text = language === "en" && english ? english : croatian;

  return (
    <Element
      {...props}
      className={
        typewriter
          ? [props.className, "project-detail__typing"].filter(Boolean).join(" ")
          : props.className
      }
      aria-label={typewriter ? text : undefined}
    >
      {typewriter ? (
        <span className="project-detail__typing-text" aria-hidden="true" key={text}>
          {Array.from(text).map((character, index) => (
            <span
              key={`${index}-${character}`}
              style={{ animationDelay: `${index * 45}ms` }}
            >
              {character}
            </span>
          ))}
        </span>
      ) : (
        text
      )}
    </Element>
  );
}

export function ProjectBodyContent({
  croatian,
  english,
}: {
  croatian: (PortableTextBlock | ProjectBodyImage)[];
  english?: (PortableTextBlock | ProjectBodyImage)[];
}) {
  const { language } = useLanguage();
  const value = language === "en" && english?.length ? english : croatian;
  return <PortableText value={value} components={portableComponents} />;
}

export function ProjectHeroImage({
  src,
  croatianAlt,
  englishAlt,
  fallbackAlt,
  hotspot,
}: {
  src: string;
  croatianAlt?: string;
  englishAlt?: string;
  fallbackAlt: string;
  hotspot?: { x: number; y: number };
}) {
  const { language } = useLanguage();
  return (
    <Image
      src={src}
      alt={
        language === "en"
          ? englishAlt || croatianAlt || fallbackAlt
          : croatianAlt || fallbackAlt
      }
      fill
      loading="eager"
      fetchPriority="high"
      sizes="100vw"
      style={
        hotspot
          ? {
              objectPosition: `${hotspot.x * 100}% ${hotspot.y * 100}%`,
            } satisfies CSSProperties
          : undefined
      }
    />
  );
}
