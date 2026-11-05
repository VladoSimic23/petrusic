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
            english: hero.english
              ? {
                  eyebrow: hero.english.eyebrow ?? undefined,
                  title: hero.english.title ?? undefined,
                  highlightedTitle: hero.english.highlightedTitle ?? undefined,
                  description: hero.english.description ?? undefined,
                  primaryCta:
                    hero.english.primaryCta?.label && hero.english.primaryCta.href
                      ? { label: hero.english.primaryCta.label, href: hero.english.primaryCta.href }
                      : undefined,
                  stat: hero.english.stat
                    ? {
                        value: hero.english.stat.value ?? undefined,
                        label: hero.english.stat.label ?? undefined,
                      }
                    : undefined,
                  footerNote: hero.english.footerNote ?? undefined,
                  scrollLink:
                    hero.english.scrollLink?.label && hero.english.scrollLink.href
                      ? { label: hero.english.scrollLink.label, href: hero.english.scrollLink.href }
                      : undefined,
                }
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
        eyebrowEn: string | null;
        title: string | null;
        titleEn: string | null;
        description: string | null;
        descriptionEn: string | null;
        email: string | null;
        phone: string | null;
        whatsapp: string | null;
        viber: string | null;
        address: string | null;
        addressEn: string | null;
        officeHours: string | null;
        officeHoursEn: string | null;
        mapUrl: string | null;
        responseNote: string | null;
        responseNoteEn: string | null;
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
    english: {
      eyebrow: block.eyebrowEn ?? undefined,
      title: block.titleEn ?? undefined,
      description: block.descriptionEn ?? undefined,
      address: block.addressEn ?? undefined,
      officeHours: block.officeHoursEn ?? undefined,
      responseNote: block.responseNoteEn ?? undefined,
    },
  };
}

function mapAbout(
  block:
    | {
        eyebrow: string | null;
        title: string | null;
        description: string | null;
        image: {
          src: string | null;
          alt: string | null;
          englishAlt: string | null;
          caption: string | null;
          englishCaption: string | null;
          hotspot: { x: number | null; y: number | null } | null;
        } | null;
        cta: { label: string | null; href: string | null } | null;
        english: {
          eyebrow: string | null;
          title: string | null;
          description: string | null;
          cta: { label: string | null; href: string | null } | null;
        } | null;
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
    image: block.image?.src
      ? {
          src: block.image.src,
          alt: block.image.alt ?? undefined,
          englishAlt: block.image.englishAlt ?? undefined,
          caption: block.image.caption ?? undefined,
          englishCaption: block.image.englishCaption ?? undefined,
          hotspot:
            block.image.hotspot?.x != null && block.image.hotspot.y != null
              ? { x: block.image.hotspot.x, y: block.image.hotspot.y }
              : undefined,
        }
      : undefined,
    cta: { label: block.cta.label, href: block.cta.href },
    english: block.english
      ? {
          eyebrow: block.english.eyebrow ?? undefined,
          title: block.english.title ?? undefined,
          description: block.english.description ?? undefined,
          cta:
            block.english.cta?.label && block.english.cta.href
              ? { label: block.english.cta.label, href: block.english.cta.href }
              : undefined,
        }
      : undefined,
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
              questionEn: string | null;
              answerEn: string | null;
            }[]
          | null;
        cta: {
          text: string | null;
          textEn: string | null;
          link: { label: string | null; href: string | null } | null;
          linkLabelEn: string | null;
        } | null;
        eyebrowEn: string | null;
        titleEn: string | null;
        descriptionEn: string | null;
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
  const englishItems = (block.items ?? []).map((item) => ({
    _key: item._key,
    question: item.questionEn ?? undefined,
    answer: item.answerEn ?? undefined,
  }));
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
    english: {
      eyebrow: block.eyebrowEn ?? undefined,
      title: block.titleEn ?? undefined,
      description: block.descriptionEn ?? undefined,
      items: englishItems,
      cta: {
        text: block.cta?.textEn ?? undefined,
        linkLabel: block.cta?.linkLabelEn ?? undefined,
      },
    },
  };
}

function mapProjects(
  block:
    | {
        eyebrow: string | null;
        title: string | null;
        cardCtaLabel: string | null;
        viewAllLink: { label: string | null; href: string | null } | null;
        english: {
          eyebrow: string | null;
          title: string | null;
          cardCtaLabel: string | null;
          viewAllLink: { label: string | null; href: string | null } | null;
        } | null;
        projects:
          | {
              _id: string;
              title: string | null;
              titleEn: string | null;
              slug: string | null;
              location: string | null;
              locationEn: string | null;
              completion: string | null;
              english: {
                title: string | null;
                location: string | null;
                completion: string | null;
              } | null;
              image: {
                src: string | null;
                alt: string | null;
                englishAlt: string | null;
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
            english: p.english
              ? {
                  title: p.english.title ?? undefined,
                  location: p.english.location ?? undefined,
                  completion: p.english.completion ?? undefined,
                }
              : undefined,
            image: {
              src: p.image.src,
              alt: p.image.alt ?? undefined,
              englishAlt: p.image.englishAlt ?? undefined,
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
    english: block.english
      ? {
          eyebrow: block.english.eyebrow ?? undefined,
          title: block.english.title ?? undefined,
          cardCtaLabel: block.english.cardCtaLabel ?? undefined,
          viewAllLink:
            block.english.viewAllLink?.label && block.english.viewAllLink.href
              ? {
                  label: block.english.viewAllLink.label,
                  href: block.english.viewAllLink.href,
                }
              : undefined,
        }
      : undefined,
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
        labelEn: string | null;
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
            labelEn: item.labelEn ?? undefined,
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
              titleEn: string | null;
              slug: string | null;
              location: string | null;
              locationEn: string | null;
              completionYear: number | null;
              apartmentCount: number | null;
              shortDescription: string | null;
              shortDescriptionEn: string | null;
              image: {
                src: string | null;
                alt: string | null;
                altEn: string | null;
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
            english: {
              title: p.titleEn ?? undefined,
              location: p.locationEn ?? undefined,
              description: p.shortDescriptionEn ?? undefined,
            },
            completionYear: p.completionYear ?? undefined,
            apartmentCount: p.apartmentCount ?? undefined,
            description: p.shortDescription ?? undefined,
            image: {
              src: p.image.src,
              alt: p.image.alt ?? undefined,
              altEn: p.image.altEn ?? undefined,
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