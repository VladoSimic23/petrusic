import { defineQuery } from "next-sanity";

export const HOME_PAGE_QUERY = defineQuery(`*[_id == "homePage"][0]{
  "seo": seo{
    title,
    description,
    "image": image.asset->url
  },
  "hero": sections[_type == "hero"][0]{
    eyebrow,
    title,
    highlightedTitle,
    description,
    primaryCta{label, href},
    "backgroundImage": backgroundImage{
      "src": asset->url,
      "alt": alt,
      "hotspot": hotspot{x, y}
    },
    stat{value, label},
    footerNote,
    scrollLink{label, href},
    "english": english{
      eyebrow, title, highlightedTitle, description,
      primaryCta{label, href},
      stat{value, label},
      footerNote,
      scrollLink{label, href}
    }
  },
  "stats": sections[_type == "stats"][0]{
    "items": items[]{
      _key,
      value,
      suffix,
      label,
      labelEn
    }
  },
  "featuredProjects": sections[_type == "featuredProjects"][0]{
    eyebrow,
    title,
    cardCtaLabel,
    viewAllLink{label, href},
    "projects": projects[]->{
      _id,
      title,
      "slug": slug.current,
      location,
      completion,
      description,
      "english": english{title, location, completion},
      "image": image{
        "src": asset->url,
        "alt": alt,
        "englishAlt": englishAlt,
        "hotspot": hotspot{x, y}
      }
    },
    "english": english{
      eyebrow,
      title,
      cardCtaLabel,
      viewAllLink{label, href}
    }
  },
  "completedProjects": sections[_type == "completedProjects"][0]{
    eyebrow,
    title,
    viewAllLink{label, href},
    "projects": projects[@->_type == "completedBuilding"]->{
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
      "image": image{
        "src": asset->url,
        "alt": alt,
        altEn,
        "hotspot": hotspot{x, y}
      }
    }
  },
  "newsSection": newsSection{
    eyebrow,
    eyebrowEn,
    title,
    titleEn,
    description,
    descriptionEn,
    viewAllLabel,
    viewAllLabelEn,
    "articles": articles[]->{
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
    }
  },
  "about": sections[_type == "about"][0]{
    eyebrow,
    title,
    description,
    "image": image{
      "src": asset->url,
      "alt": alt,
      "englishAlt": englishAlt,
      "caption": caption,
      "englishCaption": englishCaption,
      "hotspot": hotspot{x, y}
    },
    cta{label, href},
    "english": english{
      eyebrow,
      title,
      description,
      cta{label, href}
    }
  },
  "standardKvaliteta": sections[_type == "standardKvaliteta"][0]{
    eyebrow,
    eyebrowEn,
    title,
    titleEn,
    description,
    descriptionEn,
    "standards": standards[]->{
      _id,
      number,
      title,
      titleEn,
      description,
      descriptionEn,
      order
    }
  },
  "faq": sections[_type == "faq"][0]{
    eyebrow,
    eyebrowEn,
    title,
    titleEn,
    description,
    descriptionEn,
    "items": items[]{_key, question, answer, questionEn, answerEn},
    cta{text, textEn, link{label, href}, linkLabelEn}
  },
  "contact": sections[_type == "contact"][0]{
    eyebrow,
    eyebrowEn,
    title,
    titleEn,
    description,
    descriptionEn,
    email,
    phone,
    whatsapp,
    viber,
    address,
    addressEn,
    officeHours,
    officeHoursEn,
    mapUrl,
    responseNote,
    responseNoteEn
  }
}`);

const PROJECT_CARD_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  location,
  completion,
  description,
  "english": english{title, location, completion},
  "image": image{
    "src": asset->url,
    alt,
    englishAlt,
    "hotspot": hotspot{x, y}
  }
}`;

export const PROJECTS_FOR_SALE_QUERY = defineQuery(
  `*[_type == "project" && defined(slug.current)] | order(_createdAt desc) ${PROJECT_CARD_PROJECTION}`,
);

export const PROJECT_BY_SLUG_QUERY = defineQuery(`*[
  _type == "project" && slug.current == $slug
][0]{
  _id,
  title,
  "slug": slug.current,
  location,
  completion,
  description,
  "english": english{
    title,
    location,
    completion,
    description,
    body[]{
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
  },
  "image": image{
    "src": asset->url,
    alt,
    englishAlt,
    "hotspot": hotspot{x, y}
  },
  "gallery": gallery[]{
    _key,
    "src": asset->url,
    alt,
    caption,
    englishAlt,
    englishCaption,
    "hotspot": hotspot{x, y}
  },
  "apartmentCharacteristics": apartmentCharacteristics[]{
    _key,
    apartmentType,
    apartmentTypeEn,
    bedrooms,
    bathroomsAndWc,
    bathroomsAndWcEn,
    rooms,
    roomsEn,
    totalArea,
    location,
    locationEn,
    "image": image{
      "src": asset->url,
      alt,
      altEn
    }
  },
  body[]{
    ...,
    _type == "image" => {
      _key,
      _type,
      "src": asset->url,
      alt,
      caption,
      "hotspot": hotspot{x, y}
    }
  },
  "seo": seo{
    title,
    description,
    "image": image.asset->url
  }
}`);