import { cacheLife, cacheTag } from "next/cache";
import type { PortableTextBlock } from "@portabletext/types";
import { defineQuery } from "next-sanity";
import { client } from "./client";

export type BuildingImage = {
  src: string;
  alt?: string;
  altEn?: string;
  caption?: string;
  captionEn?: string;
  hotspot?: { x: number; y: number };
};

export type BuildingSummary = {
  _id: string;
  title: string;
  slug: string;
  location: string;
  completionYear?: number;
  apartmentCount?: number;
  description?: string;
  allSold: boolean;
  image: BuildingImage;
  english?: {
    title?: string;
    location?: string;
    description?: string;
  };
};

export type BuildingBodyImage = BuildingImage & {
  _key: string;
  _type: "image";
};

export type BuildingDetail = BuildingSummary & {
  startYear?: number;
  floors?: string;
  floorsEn?: string;
  totalArea?: number;
  parkingSpaces?: number;
  highlights: string[];
  highlightsEn: string[];
  gallery: (BuildingImage & { _key: string })[];
  body: (PortableTextBlock | BuildingBodyImage)[];
  bodyEn: (PortableTextBlock | BuildingBodyImage)[];
  seo?: { title?: string; description?: string; image?: string };
};

type QueryImage = {
  src: string | null;
  alt?: string | null;
  altEn?: string | null;
  caption?: string | null;
  captionEn?: string | null;
  hotspot?: { x: number | null; y: number | null } | null;
} | null;

type SummaryQuery = {
  _id: string | null;
  title: string | null;
  titleEn: string | null;
  slug: string | null;
  location: string | null;
  locationEn: string | null;
  completionYear: number | null;
  apartmentCount: number | null;
  shortDescription: string | null;
  shortDescriptionEn: string | null;
  allSold: boolean | null;
  image: QueryImage;
};

type DetailQuery = SummaryQuery & {
  startYear: number | null;
  floors: string | null;
  floorsEn: string | null;
  totalArea: number | null;
  parkingSpaces: number | null;
  highlights: (string | null)[] | null;
  highlightsEn: (string | null)[] | null;
  gallery: ((QueryImage & { _key: string | null }) | null)[] | null;
  body:
    | (PortableTextBlock | (NonNullable<QueryImage> & { _key: string | null; _type: "image" }))[]
    | null;
  bodyEn:
    | (PortableTextBlock | (NonNullable<QueryImage> & { _key: string | null; _type: "image" }))[]
    | null;
  seo: {
    title: string | null;
    description: string | null;
    image: string | null;
  } | null;
};

const SUMMARY_PROJECTION = `{
  _id,
  title,
  titleEn,
  "slug": slug.current,
  location,
  locationEn,
  completionYear,
  apartmentCount,
  shortDescription,
  shortDescriptionEn,
  allSold,
  "image": image{
    "src": asset->url,
    alt,
    altEn,
    "hotspot": hotspot{x, y}
  }
}`;

const BUILDINGS_QUERY = defineQuery(
  `*[_type == "completedBuilding" && defined(slug.current)] | order(completionYear desc, title asc) ${SUMMARY_PROJECTION}`,
);

const BUILDING_BY_SLUG_QUERY = defineQuery(`*[
  _type == "completedBuilding" && slug.current == $slug
][0]{
  _id,
  title,
  titleEn,
  "slug": slug.current,
  location,
  locationEn,
  completionYear,
  apartmentCount,
  shortDescription,
  shortDescriptionEn,
  allSold,
  startYear,
  floors,
  floorsEn,
  totalArea,
  parkingSpaces,
  highlights,
  highlightsEn,
  "image": image{
    "src": asset->url,
    alt,
    altEn,
    "hotspot": hotspot{x, y}
  },
  "gallery": gallery[]{
    _key,
    "src": asset->url,
    alt,
    caption,
    altEn,
    captionEn,
    "hotspot": hotspot{x, y}
  },
  body[]{
    ...,
    _type == "image" => {
      _key,
      _type,
      "src": asset->url,
      alt,
      caption,
      altEn,
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
      altEn,
      captionEn,
      "hotspot": hotspot{x, y}
    }
  },
  "seo": seo{
    title,
    description,
    "image": image.asset->url
  }
}`);

function mapImage(value: QueryImage | undefined): BuildingImage | null {
  if (!value?.src) return null;
  const { hotspot } = value;
  return {
    src: value.src,
    alt: value.alt ?? undefined,
    altEn: value.altEn ?? undefined,
    caption: value.caption ?? undefined,
    captionEn: value.captionEn ?? undefined,
    hotspot:
      hotspot?.x != null && hotspot.y != null
        ? { x: hotspot.x, y: hotspot.y }
        : undefined,
  };
}

function mapSummary(item: SummaryQuery | null): BuildingSummary | null {
  const image = mapImage(item?.image);
  if (!item?._id || !item.title || !item.slug || !item.location || !image) {
    return null;
  }

  return {
    _id: item._id,
    title: item.title,
    english: {
      title: item.titleEn ?? undefined,
      location: item.locationEn ?? undefined,
      description: item.shortDescriptionEn ?? undefined,
    },
    slug: item.slug,
    location: item.location,
    completionYear: item.completionYear ?? undefined,
    apartmentCount: item.apartmentCount ?? undefined,
    description: item.shortDescription ?? undefined,
    allSold: item.allSold ?? true,
    image,
  };
}

export async function getCompletedBuildings(): Promise<BuildingSummary[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity", "completedBuildings");

  const data = await client.fetch<SummaryQuery[]>(BUILDINGS_QUERY);
  return (data ?? []).flatMap((item) => {
    const mapped = mapSummary(item);
    return mapped ? [mapped] : [];
  });
}

export async function getCompletedBuildingBySlug(
  slug: string,
): Promise<BuildingDetail | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity", "completedBuildings", `completedBuilding-${slug}`);

  const data = await client.fetch<DetailQuery | null>(BUILDING_BY_SLUG_QUERY, {
    slug,
  });
  const summary = mapSummary(data);
  if (!data || !summary) return null;

  const gallery = (data.gallery ?? []).flatMap((item) => {
    const mapped = mapImage(item);
    return item?._key && mapped ? [{ _key: item._key, ...mapped }] : [];
  });

  const body: BuildingDetail["body"] = [];
  const bodyEn: BuildingDetail["bodyEn"] = [];
  for (const block of data.body ?? []) {
    if ("src" in block && block._type === "image") {
      const mapped = mapImage(block);
      if (block._key && mapped) {
        body.push({ _key: block._key, _type: "image", ...mapped });
      }
    } else {
      body.push(block as PortableTextBlock);
    }
  }
  for (const block of data.bodyEn ?? []) {
    if ("src" in block && block._type === "image") {
      const mapped = mapImage(block);
      if (block._key && mapped) {
        bodyEn.push({ _key: block._key, _type: "image", ...mapped });
      }
    } else {
      bodyEn.push(block as PortableTextBlock);
    }
  }

  return {
    ...summary,
    startYear: data.startYear ?? undefined,
    floors: data.floors ?? undefined,
    floorsEn: data.floorsEn ?? undefined,
    totalArea: data.totalArea ?? undefined,
    parkingSpaces: data.parkingSpaces ?? undefined,
    highlights: (data.highlights ?? []).filter((h): h is string => Boolean(h)),
    highlightsEn: (data.highlightsEn ?? []).filter((h): h is string => Boolean(h)),
    gallery,
    body,
    bodyEn,
    seo: data.seo
      ? {
          title: data.seo.title ?? undefined,
          description: data.seo.description ?? undefined,
          image: data.seo.image ?? undefined,
        }
      : undefined,
  };
}
