import type { HeroContent } from "../components/hero";
import type { ContactContent } from "../components/contact-section";
import type { ProjectsContent } from "../components/projects-section";
import type { FaqContent } from "../components/faq-section";
import type { AboutContent } from "../components/about-section";
import type { ReferencesContent } from "../components/references-section";
import type { StatsContent } from "../components/stats-section";

export const projectsContent: ProjectsContent = {
  eyebrow: "Pronađite svoj novi dom",
  title: "U prodaji",
  cardCtaLabel: "Pregledaj tlocrte",
  viewAllLink: { label: "Svi projekti", href: "/prodaja-stanova" },
  projects: [
    {
      _id: "demo-1",
      title: "Rezidencija Park",
      slug: "rezidencija-park",
      location: "Zagreb, Trešnjevka",
      completion: "Q4 2026.",
      image: { src: "/images/hero.webp" },
    },
    {
      _id: "demo-2",
      title: "Stambena zgrada Vrt",
      slug: "stambena-zgrada-vrt",
      location: "Zagreb, Jarun",
      completion: "Q2 2027.",
      image: { src: "/images/hero.webp" },
    },
  ],
};

export const contactContent: ContactContent = {
  eyebrow: "Tu smo za vas",
  title: "Razgovarajmo o vašem novom domu",
  description:
    "Naš tim pomoći će vam pronaći odgovore i informacije o projektima koji vas zanimaju.",
  responseNote: "Veselimo se vašem javljanju.",
  english: {
    eyebrow: "We are here for you",
    title: "Let's talk about your new home",
    description:
      "Our team will help you find answers and information about the projects you are interested in.",
    responseNote: "We look forward to hearing from you.",
  },
};

export const statsContent: StatsContent = {
  items: [
    {
      _key: "years",
      value: 30,
      suffix: "+",
      label: "godina iskustva",
      labelEn: "years of experience",
    },
    {
      _key: "buildings",
      value: 50,
      suffix: "+",
      label: "izgrađenih zgrada",
      labelEn: "buildings completed",
    },
    {
      _key: "apartments",
      value: 1000,
      suffix: "+",
      label: "isporučenih stanova",
      labelEn: "apartments delivered",
    },
  ],
};

export const referencesContent: ReferencesContent = {
  eyebrow: "Naše reference",
  title: "Naša ostvarenja",
  viewAllLink: {
    label: "Pogledaj sve izgrađene objekte",
    href: "/izgradeni-objekti",
  },
  projects: [
    {
      _id: "demo-reference-1",
      title: "Zgrada 1",
      slug: "zgrada-1",
      location: "Grude",
      completionYear: 2022,
      apartmentCount: 24,
      description:
        "Moderni stambeni objekt s urednim rasporedom stanova i visokim standardom završetka.",
      image: { src: "/images/hero.webp", alt: "Zgrada 1" },
    },
    {
      _id: "demo-reference-2",
      title: "Zgrada 2",
      slug: "zgrada-2",
      location: "Makarska",
      completionYear: 2021,
      apartmentCount: 18,
      description:
        "Objekt s detaljno promišljenom distribucijom apartmana i kvalitetnim vanjskim rješenjima.",
      image: { src: "/images/hero.webp", alt: "Zgrada 2" },
    },
    {
      _id: "demo-reference-3",
      title: "Zgrada 3",
      slug: "zgrada-3",
      location: "Split",
      completionYear: 2024,
      apartmentCount: 32,
      description:
        "Novi standard gradnje s fokusom na funkcionalnost, svjetlost i kvalitetu življenja.",
      image: { src: "/images/hero.webp", alt: "Zgrada 3" },
    },
  ],
};

export const faqContent: FaqContent = {
  eyebrow: "Imate pitanja?",
  title: "Česta pitanja",
  description:
    "Odgovori na pitanja koja nam kupci najčešće postavljaju prije odluke o kupnji stana.",
  items: [
    {
      _key: "faq-1",
      question: "Kako izgleda proces kupnje stana?",
      answer:
        "Nakon razgledavanja i odabira stana potpisuje se predugovor uz uplatu predujma, a kupoprodajni ugovor slijedi u dogovorenim fazama gradnje. Cijelim procesom vas vodi naš prodajni tim.",
    },
    {
      _key: "faq-2",
      question: "Koji su rokovi završetka gradnje?",
      answer:
        "Rok završetka naveden je na svakom projektu. Napredak radova redovito objavljujemo u rubrici Novosti.",
    },
    {
      _key: "faq-3",
      question: "Mogu li razgledati stan ili gradilište prije kupnje?",
      answer:
        "Naravno. Razgledavanje možete dogovoriti telefonom ili preko kontakt obrasca, a tlocrte svih dostupnih stanova pronaći ćete na stranici projekta.",
    },
    {
      _key: "faq-4",
      question: "Što je uključeno u cijenu stana?",
      answer:
        "Cijena obuhvaća stan u dogovorenom standardu završetka. Parking, garažna mjesta i spremišta nude se zasebno, a točne uvjete dobit ćete u ponudi.",
    },
    {
      _key: "faq-5",
      question: "Nudite li pomoć oko financiranja?",
      answer:
        "Surađujemo s bankama i rado vam pomažemo oko pripreme dokumentacije za stambeni kredit.",
    },
  ],
  cta: {
    text: "Niste pronašli odgovor?",
    link: { label: "Javite nam se", href: "#kontakt" },
  },
};

export const aboutContent: AboutContent = {
  eyebrow: "Petrušić gradnja",
  title: "Gradimo domove za generacije",
  description:
    "S više od 30 godina iskustva stvaramo kvalitetne stambene prostore promišljenog dizajna i trajne vrijednosti. Svakom projektu pristupamo odgovorno, s pažnjom prema detaljima i ljudima koji će u njemu živjeti.",
  cta: { label: "Više o nama", href: "/o-nama" },
};

export const heroContent: HeroContent = {
  eyebrow: "Izgradnja i prodaja stambenih zgrada",
  title: "Dom koji traje.",
  highlightedTitle: "Vrijednost koja raste.",
  description:
    "Promišljena gradnja, kvalitetne lokacije i prostor za život po vašoj mjeri.",
  primaryCta: { label: "Istražite projekte", href: "#projekti" },
  backgroundImage: { src: "/images/hero.webp", alt: "" },
  stat: { value: "30", label: "godina iskustva" },
  footerNote: "Gradimo promišljeno. Živimo kvalitetnije.",
  scrollLink: { label: "Otkrijte više", href: "#projekti" },
};

export const infoSections = [
  {
    id: "arhiva",
    eyebrow: "Naše reference",
    title: "Izgrađeni objekti",
    description:
      "Trideset godina iskustva i desetci izgrađenih zgrada temelj su povjerenja koje gradimo sa svakim novim projektom.",
  },
  {
    id: "novosti",
    eyebrow: "Budite u tijeku",
    title: "Novosti",
    description:
      "Pratite novosti o našim projektima i važne trenutke tijekom izgradnje.",
  },
];
