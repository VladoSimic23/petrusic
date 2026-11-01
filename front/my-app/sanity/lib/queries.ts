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
    scrollLink{label, href}
  },
  "stats": sections[_type == "stats"][0]{
    "items": items[]{
      _key,
      value,
      suffix,
      label
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
      "image": image{
        "src": asset->url,
        "alt": alt,
        "hotspot": hotspot{x, y}
      }
    }
  },
  "completedProjects": sections[_type == "completedProjects"][0]{
    eyebrow,
    title,
    viewAllLink{label, href},
    "projects": projects[@->_type == "completedBuilding"]->{
      _id,
      title,
      "slug": slug.current,
      location,
      completionYear,
      apartmentCount,
      shortDescription,
      "image": image{
        "src": asset->url,
        "alt": alt,
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
      "caption": caption,
      "hotspot": hotspot{x, y}
    },
    cta{label, href}
  },
  "faq": sections[_type == "faq"][0]{
    eyebrow,
    title,
    description,
    "items": items[]{_key, question, answer},
    cta{text, link{label, href}}
  },
  "contact": sections[_type == "contact"][0]{
    eyebrow,
    title,
    description,
    email,
    phone,
    whatsapp,
    viber,
    address,
    officeHours,
    mapUrl,
    responseNote
  }
}`);

const PROJECT_CARD_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  location,
  completion,
  "image": image{
    "src": asset->url,
    alt,
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
  "image": image{
    "src": asset->url,
    alt,
    "hotspot": hotspot{x, y}
  },
  "gallery": gallery[]{
    _key,
    "src": asset->url,
    alt,
    caption,
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
      "hotspot": hotspot{x, y}
    }
  },
  "seo": seo{
    title,
    description,
    "image": image.asset->url
  }
}`);