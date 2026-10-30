import { cacheLife, cacheTag } from "next/cache";
import type { HeroContent } from "../../app/components/hero";
import type { StatsContent } from "../../app/components/stats-section";
import type { ProjectsContent } from "../../app/components/projects-section";
import type { ReferencesContent } from "../../app/components/references-section";
import type { FaqContent } from "../../app/components/faq-section";
import type { AboutContent } from "../../app/components/about-section";
import type { ContactContent } from "../../app/components/contact-section";
import { client } from "./client";
import { HOME_PAGE_QUERY } from "./queries";

export type HomePageData = {
  seo: { title?: string; description?: string; image?: string };
  hero?: HeroContent;
  stats?: StatsContent;
  projects?: ProjectsContent;
  references?: ReferencesContent;
  about?: AboutContent;
  faq?: FaqContent;
  contact?: ContactContent;
};

export async function getHomePage(): Promise<HomePageData | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity", "homePage");

  const data = await client.fetch(HOME_PAGE_QUERY);
  if (!data) return null;

  const { hero } = data;
  const image = hero?.backgroundImage;
  const cta = hero?.primaryCta;
  const scroll = hero?.scrollLink;
  const hotspot = image?.hotspot;

  return {
    seo: {
      title: data.seo?.title ?? undefined,
      description: data.seo?.description ?? undefined,
      image: data.seo?.image ?? undefined,
    },
    hero:
      hero?.title && image?.src
        ? {
            eyebrow: hero.eyebrow ?? undefined,
            title: hero.title,
            highlightedTitle: hero.highlightedTitle ?? undefined,
            description: hero.description ?? undefined,
            primaryCta:
              cta?.label && cta.href
                ? { label: cta.label, href: cta.href }
                : undefined,
            backgroundImage: {
              src: image.src,
              alt: image.alt ?? undefined,
              hotspot:
                hotspot?.x != null && hotspot.y != null
                  ? { x: hotspot.x, y: hotspot.y }
                  : undefined,
            },
            stat: {
              value: hero.stat?.value ?? undefined,
              label: hero.stat?.label ?? undefined,
            },
            footerNote: hero.footerNote ?? undefined,
            scrollLink:
              scroll?.label && scroll.href
                ? { label: scroll.label, href: scroll.href }
                : undefined,
          }
        : undefined,
    stats: mapStats(data.stats?.items),
    projects: mapProjects(data.featuredProjects),
    references: mapReferences(data.completedProjects),
    about: mapAbout(data.about),
    faq: mapFaq(data.faq),
    contact: mapContact(data.contact),
  };
}

function mapContact(
  block:
    | {
        eyebrow: string | null;
        title: string | null;
        description: string | null;
        email: string | null;
        phone: string | null;
        whatsapp: string | null;
        viber: string | null;
        address: string | null;
        officeHours: string | null;
        mapUrl: string | null;
        responseNote: string | null;
      }
    | null
    | undefined,
): ContactContent | undefined {
  if (!block?.title || !block.description) return undefined;

  return {
    eyebrow: block.eyebrow ?? undefined,
    title: block.title,
    description: block.description,
    email: block.email ?? undefined,
    phone: block.phone ?? undefined,
    whatsapp: block.whatsapp ?? undefined,
    viber: block.viber ?? undefined,
    address: block.address ?? undefined,
    officeHours: block.officeHours ?? undefined,
    mapUrl: block.mapUrl ?? undefined,
    responseNote: block.responseNote ?? undefined,
  };
}

function mapAbout(
  block:
    | {
        eyebrow: string | null;
        title: string | null;
        description: string | null;
        cta: { label: string | null; href: string | null } | null;
      }
    | null
    | undefined,
): AboutContent | undefined {
  if (!block?.title || !block.description || !block.cta?.label || !block.cta.href) {
    return undefined;
  }

  return {
    eyebrow: block.eyebrow ?? undefined,
    title: block.title,
    description: block.description,
    cta: { label: block.cta.label, href: block.cta.href },
  };
}

function mapFaq(
  block:
    | {
        eyebrow: string | null;
        title: string | null;
        description: string | null;
        items:
          | {
              _key: string;
              question: string | null;
              answer: string | null;
            }[]
          | null;
        cta: {
          text: string | null;
          link: { label: string | null; href: string | null } | null;
        } | null;
      }
    | null
    | undefined,
): FaqContent | undefined {
  if (!block?.title) return undefined;

  const items = (block.items ?? []).flatMap((item) =>
    item.question && item.answer
      ? [{ _key: item._key, question: item.question, answer: item.answer }]
      : [],
  );
  if (!items.length) return undefined;

  const link = block.cta?.link;
  return {
    eyebrow: block.eyebrow ?? undefined,
    title: block.title,
    description: block.description ?? undefined,
    items,
    cta:
      link?.label && link.href
        ? {
            text: block.cta?.text ?? undefined,
            link: { label: link.label, href: link.href },
          }
        : undefined,
  };
}

function mapProjects(
  block:
    | {
        eyebrow: string | null;
        title: string | null;
        cardCtaLabel: string | null;
        viewAllLink: { label: string | null; href: string | null } | null;
        projects:
          | {
              _id: string;
              title: string | null;
              slug: string | null;
              location: string | null;
              completion: string | null;
              image: {
                src: string | null;
                alt: string | null;
                hotspot: { x: number | null; y: number | null } | null;
              } | null;
            }[]
          | null;
      }
    | null
    | undefined,
): ProjectsContent | undefined {
  if (!block?.title) return undefined;

  const projects = (block.projects ?? []).flatMap((p) =>
    p && p.title && p.slug && p.image?.src
      ? [
          {
            _id: p._id,
            title: p.title,
            slug: p.slug,
            location: p.location ?? undefined,
            completion: p.completion ?? undefined,
            image: {
              src: p.image.src,
              alt: p.image.alt ?? undefined,
              hotspot:
                p.image.hotspot?.x != null && p.image.hotspot.y != null
                  ? { x: p.image.hotspot.x, y: p.image.hotspot.y }
                  : undefined,
            },
          },
        ]
      : [],
  );
  const link = block.viewAllLink;
  return {
    eyebrow: block.eyebrow ?? undefined,
    title: block.title,
    cardCtaLabel: block.cardCtaLabel ?? "Pregledaj tlocrte",
    viewAllLink:
      link?.label && link.href ? { label: link.label, href: link.href } : undefined,
    projects,
  };
}

function mapStats(
  items:
    | {
        _key: string;
        value: number | null;
        suffix: string | null;
        label: string | null;
      }[]
    | null
    | undefined,
): StatsContent | undefined {
  const valid = (items ?? []).flatMap((item) =>
    item.value != null && item.label
      ? [
          {
            _key: item._key,
            value: item.value,
            suffix: item.suffix ?? undefined,
            label: item.label,
          },
        ]
      : [],
  );

  return valid.length ? { items: valid } : undefined;
}

const DEFAULT_ARCHIVE_LINK = {
  label: "Pogledaj sve izgrađene objekte",
  href: "/izgradeni-objekti",
};

function mapReferences(
  block:
    | {
        eyebrow: string | null;
        title: string | null;
        viewAllLink: { label: string | null; href: string | null } | null;
        projects:
          | ({
              _id: string;
              title: string | null;
              slug: string | null;
              location: string | null;
              completionYear: number | null;
              apartmentCount: number | null;
              shortDescription: string | null;
              image: {
                src: string | null;
                alt: string | null;
                hotspot: { x: number | null; y: number | null } | null;
              } | null;
            } | null)[]
          | null;
      }
    | null
    | undefined,
): ReferencesContent | undefined {
  if (!block?.title) return undefined;

  const projects = (block.projects ?? []).flatMap((p) =>
    p && p.title && p.slug && p.image?.src
      ? [
          {
            _id: p._id,
            title: p.title,
            slug: p.slug,
            location: p.location ?? undefined,
            completionYear: p.completionYear ?? undefined,
            apartmentCount: p.apartmentCount ?? undefined,
            description: p.shortDescription ?? undefined,
            image: {
              src: p.image.src,
              alt: p.image.alt ?? undefined,
              hotspot:
                p.image.hotspot?.x != null && p.image.hotspot.y != null
                  ? { x: p.image.hotspot.x, y: p.image.hotspot.y }
                  : undefined,
            },
          },
        ]
      : [],
  );
  if (!projects.length) return undefined;

  const link = block.viewAllLink;
  return {
    eyebrow: block.eyebrow ?? undefined,
    title: block.title,
    viewAllLink:
      link?.label && link.href
        ? { label: link.label, href: link.href }
        : DEFAULT_ARCHIVE_LINK,
    projects: projects.slice(0, 3),
  };
}