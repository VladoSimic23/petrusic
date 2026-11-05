import { cacheLife, cacheTag } from "next/cache";
import { defineQuery } from "next-sanity";
import {
  defaultAboutContent,
  type AboutPageContent,
} from "../../app/content/about";
import { client } from "./client";

const ABOUT_PAGE_QUERY = defineQuery(`*[_id == "aboutPage"][0]{
  eyebrow,
  heading,
  highlightedHeading,
  lead,
  "heroImage": heroImage{
    "src": asset->url,
    alt,
    englishAlt,
    "hotspot": hotspot{x, y}
  },
  storyTitle,
  storyParagraphs,
  "storyImage": storyImage{
    "src": asset->url,
    alt,
    englishAlt,
    "hotspot": hotspot{x, y}
  },
  "stats": stats[]{_key, value, suffix, label, labelEn},
  mission,
  vision,
  reasonsTitle,
  "reasons": reasons[]{title, description, titleEn, descriptionEn},
  servicesTitle,
  servicesIntro,
  "services": services[]{title, description, titleEn, descriptionEn},
  companyName,
  companyNameEn,
  headquarters,
  headquartersEn,
  jib,
  vat,
  founded,
  foundedEn,
  management,
  managementEn,
  "english": {
    "eyebrow": eyebrowEn,
    "heading": headingEn,
    "highlightedHeading": highlightedHeadingEn,
    "lead": leadEn,
    "storyTitle": storyTitleEn,
    "storyParagraphs": storyParagraphsEn,
    "stats": stats[]{_key, "label": labelEn},
    "mission": missionEn,
    "vision": visionEn,
    "reasonsTitle": reasonsTitleEn,
    "reasons": reasons[]{"title": titleEn, "description": descriptionEn},
    "servicesTitle": servicesTitleEn,
    "servicesIntro": servicesIntroEn,
    "services": services[]{"title": titleEn, "description": descriptionEn}
  },
  "seo": seo{title, description, "image": image.asset->url}
}`);

type QueryImage = {
  src: string | null;
  alt: string | null;
  englishAlt: string | null;
  hotspot: { x: number | null; y: number | null } | null;
} | null;

function mapImage(image: QueryImage) {
  if (!image?.src) return undefined;
  const { hotspot } = image;
  return {
    src: image.src,
    alt: image.alt ?? undefined,
    englishAlt: image.englishAlt ?? undefined,
    hotspot:
      hotspot?.x != null && hotspot.y != null
        ? { x: hotspot.x, y: hotspot.y }
        : undefined,
  };
}

function textItems(
  items: { title: string | null; description: string | null }[] | null,
) {
  const valid = (items ?? []).flatMap((item) =>
    item.title && item.description
      ? [{ title: item.title, description: item.description }]
      : [],
  );
  return valid.length ? valid : undefined;
}

export async function getAboutPage(): Promise<AboutPageContent> {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity", "aboutPage");

  const data = await client.fetch(ABOUT_PAGE_QUERY);
  const d = defaultAboutContent;
  if (!data) return d;

  const paragraphs = ((data.storyParagraphs ?? []) as (string | null)[]).filter(
    (p): p is string => Boolean(p),
  );
  const stats = (
    (data.stats ?? []) as {
      _key: string | null;
      value: number | null;
      suffix: string | null;
      label: string | null;
    }[]
  ).flatMap((s) =>
    s._key && s.value != null && s.label
      ? [
          {
            _key: s._key,
            value: s.value,
            suffix: s.suffix ?? undefined,
            label: s.label,
          },
        ]
      : [],
  );
  const englishStats = (data.english?.stats ?? []).map(
    (stat: {label: string | null} | null) => ({label: stat?.label ?? undefined}),
  );
  const englishParagraphs = ((data.english?.storyParagraphs ?? []) as (string | null)[])
    .filter((paragraph): paragraph is string => Boolean(paragraph));

  return {
    eyebrow: data.eyebrow || d.eyebrow,
    heading: data.heading || d.heading,
    highlightedHeading: data.highlightedHeading || d.highlightedHeading,
    lead: data.lead || d.lead,
    heroImage: mapImage(data.heroImage),
    storyTitle: data.storyTitle || d.storyTitle,
    storyParagraphs: paragraphs.length ? paragraphs : d.storyParagraphs,
    storyImage: mapImage(data.storyImage),
    stats: stats.length ? stats : d.stats,
    mission: data.mission || d.mission,
    vision: data.vision || d.vision,
    reasonsTitle: data.reasonsTitle || d.reasonsTitle,
    reasons: textItems(data.reasons) ?? d.reasons,
    servicesTitle: data.servicesTitle || d.servicesTitle,
    servicesIntro: data.servicesIntro || d.servicesIntro,
    services: textItems(data.services) ?? d.services,
    company: {
      name: data.companyName || d.company.name,
      headquarters: data.headquarters || d.company.headquarters,
      jib: data.jib || d.company.jib,
      vat: data.vat || d.company.vat,
      founded: data.founded || d.company.founded,
      management: data.management || d.company.management,
      english: {
        name: data.companyNameEn ?? undefined,
        headquarters: data.headquartersEn ?? undefined,
        founded: data.foundedEn ?? undefined,
        management: data.managementEn ?? undefined,
      },
    },
    seo: {
      title: data.seo?.title ?? undefined,
      description: data.seo?.description ?? undefined,
      image: data.seo?.image ?? undefined,
    },
    english: data.english
      ? {
          eyebrow: data.english.eyebrow ?? undefined,
          heading: data.english.heading ?? undefined,
          highlightedHeading: data.english.highlightedHeading ?? undefined,
          lead: data.english.lead ?? undefined,
          storyTitle: data.english.storyTitle ?? undefined,
          storyParagraphs: englishParagraphs.length ? englishParagraphs : undefined,
          stats: englishStats,
          mission: data.english.mission ?? undefined,
          vision: data.english.vision ?? undefined,
          reasonsTitle: data.english.reasonsTitle ?? undefined,
          reasons: textItems(data.english.reasons),
          servicesTitle: data.english.servicesTitle ?? undefined,
          servicesIntro: data.english.servicesIntro ?? undefined,
          services: textItems(data.english.services),
        }
      : undefined,
  };
}
