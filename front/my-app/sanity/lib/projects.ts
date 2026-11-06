import { cacheLife, cacheTag } from "next/cache";
import type { PortableTextBlock } from "@portabletext/types";
import { client } from "./client";
import {
  PROJECTS_FOR_SALE_QUERY,
  PROJECT_BY_SLUG_QUERY,
} from "./queries";

export type ProjectImage = {
  src: string;
  alt?: string;
  englishAlt?: string;
  caption?: string;
  englishCaption?: string;
  hotspot?: { x: number; y: number };
};

export type ProjectSummary = {
  _id: string;
  title: string;
  slug: string;
  location: string;
  completion?: string;
  description?: string;
  image: ProjectImage;
  english?: {
    title?: string;
    location?: string;
    completion?: string;
  };
};

export type ProjectBodyImage = {
  _key: string;
  _type: "image";
  src: string;
  alt?: string;
  caption?: string;
  hotspot?: { x: number; y: number };
};

export type ApartmentCharacteristic = {
  _key: string;
  apartmentType?: string;
  apartmentTypeEn?: string;
  bedrooms?: number;
  bathroomsAndWc?: string;
  bathroomsAndWcEn?: string;
  rooms?: string;
  roomsEn?: string;
  totalArea?: number;
  location?: string;
  locationEn?: string;
  image?: { src: string; alt?: string; altEn?: string };
};

export type ProjectDetail = ProjectSummary & {
  gallery: (ProjectImage & { _key: string })[];
  body: (PortableTextBlock | ProjectBodyImage)[];
  apartmentCharacteristics: ApartmentCharacteristic[];
  seo?: { title?: string; description?: string; image?: string };
  english?: ProjectSummary["english"] & {
    description?: string;
    body: (PortableTextBlock | ProjectBodyImage)[];
  };
};

type QueryImage = {
  src: string | null;
  alt?: string | null;
  englishAlt?: string | null;
  caption?: string | null;
  englishCaption?: string | null;
  hotspot?: { x: number | null; y: number | null } | null;
};

type ProjectListQueryItem = {
  _id: string | null;
  title: string | null;
  slug: string | null;
  location: string | null;
  completion: string | null;
  description: string | null;
  english: {
    title: string | null;
    location: string | null;
    completion: string | null;
  } | null;
  image: QueryImage | null;
};

type ProjectDetailQuery = ProjectListQueryItem & {
  apartmentCharacteristics:
    | ({
        _key: string | null;
        apartmentType: string | null;
        apartmentTypeEn: string | null;
        bedrooms: number | null;
        bathroomsAndWc: string | null;
        bathroomsAndWcEn: string | null;
        rooms: string | null;
        roomsEn: string | null;
        totalArea: number | null;
        location: string | null;
        locationEn: string | null;
        image: { src: string | null; alt: string | null; altEn: string | null } | null;
      } | null)[]
    | null;
  english: (NonNullable<ProjectListQueryItem["english"]> & {
    description: string | null;
    body:
      | (
          | PortableTextBlock
          | (QueryImage & { _key: string | null; _type: "image" })
        )[]
      | null;
  }) | null;
  gallery:
    | (QueryImage & { _key: string | null })[]
    | null;
  body:
    | (
        | PortableTextBlock
        | (QueryImage & { _key: string | null; _type: "image" })
      )[]
    | null;
  seo:
    | { title: string | null; description: string | null; image: string | null }
    | null;
};

export async function getProjectsForSale(): Promise<ProjectSummary[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity", "projects");

  const data = await client.fetch<ProjectListQueryItem[]>(
    PROJECTS_FOR_SALE_QUERY,
  );
  return (data ?? []).flatMap((project) => {
    if (!project?._id || !project.title || !project.slug || !project.location || !project.image?.src) {
      return [];
    }

    return [
      {
        _id: project._id,
        title: project.title,
        slug: project.slug,
        location: project.location,
        completion: project.completion ?? undefined,
        description: project.description ?? undefined,
        image: {
          src: project.image.src,
          alt: project.image.alt ?? undefined,
          englishAlt: project.image.englishAlt ?? undefined,
          hotspot:
            project.image.hotspot?.x != null && project.image.hotspot.y != null
              ? { x: project.image.hotspot.x, y: project.image.hotspot.y }
              : undefined,
        },
        english: project.english
          ? {
              title: project.english.title ?? undefined,
              location: project.english.location ?? undefined,
              completion: project.english.completion ?? undefined,
            }
          : undefined,
      },
    ];
  });
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectDetail | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity", "projects", `project-${slug}`);

  const project = await client.fetch<ProjectDetailQuery | null>(
    PROJECT_BY_SLUG_QUERY,
    { slug },
  );
  if (
    !project?._id ||
    !project.title ||
    !project.slug ||
    !project.location ||
    !project.image?.src
  ) {
    return null;
  }

  const image = (value: {
    src: string | null;
    alt?: string | null;
    englishAlt?: string | null;
    caption?: string | null;
    englishCaption?: string | null;
    hotspot?: { x: number | null; y: number | null } | null;
  } | null) =>
    value?.src
      ? {
          src: value.src,
          alt: value.alt ?? undefined,
          englishAlt: value.englishAlt ?? undefined,
          caption: value.caption ?? undefined,
          englishCaption: value.englishCaption ?? undefined,
          hotspot:
            value.hotspot?.x != null && value.hotspot.y != null
              ? { x: value.hotspot.x, y: value.hotspot.y }
              : undefined,
        }
      : null;

  const gallery = (project.gallery ?? []).flatMap((item) => {
    const mapped = image(item);
    return item?._key && mapped ? [{ _key: item._key, ...mapped }] : [];
  });
  const apartmentCharacteristics = (project.apartmentCharacteristics ?? []).flatMap(
    (item) =>
      item?._key
        ? [
            {
              _key: item._key,
              apartmentType: item.apartmentType ?? undefined,
              apartmentTypeEn: item.apartmentTypeEn ?? undefined,
              bedrooms: item.bedrooms ?? undefined,
              bathroomsAndWc: item.bathroomsAndWc ?? undefined,
              bathroomsAndWcEn: item.bathroomsAndWcEn ?? undefined,
              rooms: item.rooms ?? undefined,
              roomsEn: item.roomsEn ?? undefined,
              totalArea: item.totalArea ?? undefined,
              location: item.location ?? undefined,
              locationEn: item.locationEn ?? undefined,
              image: item.image?.src
                ? {
                    src: item.image.src,
                    alt: item.image.alt ?? undefined,
                    altEn: item.image.altEn ?? undefined,
                  }
                : undefined,
            },
          ]
        : [],
  );
  const body: ProjectDetail["body"] = [];
  const englishBody: NonNullable<ProjectDetail["english"]>["body"] = [];
  for (const block of project.body ?? []) {
    if ("src" in block && block._type === "image") {
      const mapped = image(block);
      if (block._key && mapped) {
        body.push({
          _key: block._key,
          _type: "image",
          src: mapped.src,
          alt: mapped.alt,
          caption: mapped.caption,
          hotspot: mapped.hotspot,
        });
      }
    } else {
      body.push(block);
    }
  }
  for (const block of project.english?.body ?? []) {
    if ("src" in block && block._type === "image") {
      const mapped = image(block);
      if (block._key && mapped) {
        englishBody.push({
          _key: block._key,
          _type: "image",
          src: mapped.src,
          alt: mapped.alt,
          caption: mapped.caption,
          hotspot: mapped.hotspot,
        });
      }
    } else {
      englishBody.push(block);
    }
  }
  return {
    _id: project._id,
    title: project.title,
    slug: project.slug,
    location: project.location,
    completion: project.completion ?? undefined,
    description: project.description ?? undefined,
    image: image(project.image)!,
    gallery,
    body,
    apartmentCharacteristics,
    english: project.english
      ? {
          title: project.english.title ?? undefined,
          location: project.english.location ?? undefined,
          completion: project.english.completion ?? undefined,
          description: project.english.description ?? undefined,
          body: englishBody,
        }
      : undefined,
    seo: project.seo
      ? {
          title: project.seo.title ?? undefined,
          description: project.seo.description ?? undefined,
          image: project.seo.image ?? undefined,
        }
      : undefined,
  };
}
