import { cacheLife, cacheTag } from "next/cache";
import type { PortableTextBlock } from "@portabletext/types";
import { defineQuery } from "next-sanity";
import { client } from "./client";

export type AktualnostImage = {
  src: string;
  alt?: string;
  altEn?: string;
  hotspot?: { x: number; y: number };
};

export type AktualnostBodyImage = AktualnostImage & {
  _key: string;
  _type: "image";
  caption?: string;
  captionEn?: string;
};

export type AktualnostSummary = {
  _id: string;
  title: string;
  titleEn?: string;
  slug: string;
  publishedAt: string;
  category?: string;
  categoryEn?: string;
  excerpt?: string;
  excerptEn?: string;
  readingTime?: string;
  readingTimeEn?: string;
  image?: AktualnostImage;
};

export type Aktualnost = AktualnostSummary & {
  body: (PortableTextBlock | AktualnostBodyImage)[];
  bodyEn: (PortableTextBlock | AktualnostBodyImage)[];
};

type QueryImage = {
  src: string | null;
  alt?: string | null;
  altEn?: string | null;
  hotspot?: { x: number | null; y: number | null } | null;
} | null;

type QuerySummary = {
  _id: string | null;
  title: string | null;
  titleEn: string | null;
  slug: string | null;
  publishedAt: string | null;
  category: string | null;
  categoryEn: string | null;
  excerpt: string | null;
  excerptEn: string | null;
  readingTime: string | null;
  readingTimeEn: string | null;
  image: QueryImage;
};

type QueryBodyImage = {
  _key: string | null;
  _type: "image";
  src: string | null;
  alt?: string | null;
  altEn?: string | null;
  caption?: string | null;
  captionEn?: string | null;
  hotspot?: { x: number | null; y: number | null } | null;
};

function isQueryBodyImage(
  block: PortableTextBlock | QueryBodyImage,
): block is QueryBodyImage {
  return (
    "_type" in block &&
    block._type === "image" &&
    "src" in block &&
    (typeof block.src === "string" || block.src === null)
  );
}

const SUMMARY_PROJECTION = `{
  _id,
  title,
  titleEn,
  "slug": slug.current,
  publishedAt,
  category,
  categoryEn,
  excerpt,
  excerptEn,
  readingTime,
  readingTimeEn,
  "image": mainImage{
    "src": asset->url,
    alt,
    altEn,
    "hotspot": hotspot{x, y}
  }
}`;

const AKTUALNOSTI_QUERY = defineQuery(
  `*[_type == "aktualnost" && defined(slug.current)] | order(publishedAt desc) ${SUMMARY_PROJECTION}`,
);

const AKTUALNOST_BY_SLUG_QUERY = defineQuery(`*[
  _type == "aktualnost" && slug.current == $slug
][0]{
  _id,
  title,
  titleEn,
  "slug": slug.current,
  publishedAt,
  category,
  categoryEn,
  excerpt,
  excerptEn,
  readingTime,
  readingTimeEn,
  "image": mainImage{
    "src": asset->url,
    alt,
    altEn,
    "hotspot": hotspot{x, y}
  },
  body[]{
    ...,
    _type == "image" => {
      _key,
      _type,
      "src": asset->url,
      alt,
      altEn,
      caption,
      captionEn,
      "hotspot": hotspot{x, y}
    }
  },
  bodyEn[]{
    ...,
    _type == "image" => {
      _key,
      _type,
      "src": asset->url,
      alt,
      caption,
      "hotspot": hotspot{x, y}
    }
  }
}`);

function mapImage(image: QueryImage): AktualnostImage | undefined {
  if (!image?.src) return undefined;
  return {
    src: image.src,
    alt: image.alt ?? undefined,
    altEn: image.altEn ?? undefined,
    hotspot:
      image.hotspot?.x != null && image.hotspot.y != null
        ? { x: image.hotspot.x, y: image.hotspot.y }
        : undefined,
  };
}

function mapSummary(item: QuerySummary): AktualnostSummary | null {
  if (!item._id || !item.title || !item.slug || !item.publishedAt) return null;
  return {
    _id: item._id,
    title: item.title,
    titleEn: item.titleEn ?? undefined,
    slug: item.slug,
    publishedAt: item.publishedAt,
    category: item.category ?? undefined,
    categoryEn: item.categoryEn ?? undefined,
    excerpt: item.excerpt ?? undefined,
    excerptEn: item.excerptEn ?? undefined,
    readingTime: item.readingTime ?? undefined,
    readingTimeEn: item.readingTimeEn ?? undefined,
    image: mapImage(item.image),
  };
}

export async function getAktualnosti(): Promise<AktualnostSummary[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity", "aktualnosti");

  const items = await client.fetch<QuerySummary[]>(AKTUALNOSTI_QUERY);
  return (items ?? []).flatMap((item) => {
    const mapped = mapSummary(item);
    return mapped ? [mapped] : [];
  });
}

export async function getAktualnostBySlug(
  slug: string,
): Promise<Aktualnost | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity", "aktualnosti", `aktualnost-${slug}`);

  const item = await client.fetch<
    | (QuerySummary & {
        body:
          | (PortableTextBlock | QueryBodyImage)[]
          | null;
        bodyEn:
          | (PortableTextBlock | QueryBodyImage)[]
          | null;
      })
    | null
  >(AKTUALNOST_BY_SLUG_QUERY, { slug });
  if (!item) return null;

  const summary = mapSummary(item);
  if (!summary) return null;

  const mapBody = (blocks: (PortableTextBlock | QueryBodyImage)[] | null) => {
    const body: Aktualnost["body"] = [];
    for (const block of blocks ?? []) {
      if (isQueryBodyImage(block)) {
        const image = mapImage(block);
        if (image && block._key) {
          body.push({
            ...image,
            _key: block._key,
            _type: "image",
            caption: block.caption ?? undefined,
            captionEn: block.captionEn ?? undefined,
          });
        }
      } else {
        body.push(block);
      }
    }
    return body;
  };

  return {
    ...summary,
    body: mapBody(item.body),
    bodyEn: mapBody(item.bodyEn),
  };
}
