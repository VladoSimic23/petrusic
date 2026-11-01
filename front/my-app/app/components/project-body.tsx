import Image from "next/image";
import type { PortableTextComponents } from "@portabletext/react";

type BodyImage = {
  _type: "image";
  src: string;
  alt?: string;
  caption?: string;
};

function isBodyImage(value: unknown): value is BodyImage {
  return (
    typeof value === "object" &&
    value !== null &&
    "_type" in value &&
    value._type === "image" &&
    "src" in value &&
    typeof value.src === "string"
  );
}

export const portableComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }) => {
      const href =
        value && "href" in value && typeof value.href === "string"
          ? value.href
          : undefined;
      if (!href) return <>{children}</>;

      const external = /^https?:\/\//i.test(href);
      return (
        <a href={href} rel={external ? "noopener noreferrer" : undefined}>
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!isBodyImage(value)) return null;
      return (
        <figure className="project-body__image">
          <Image
            src={value.src}
            alt={value.alt || ""}
            width={1400}
            height={900}
            sizes="(max-width: 900px) 100vw, 900px"
          />
          {value.caption ? <figcaption>{value.caption}</figcaption> : null}
        </figure>
      );
    },
  },
};
