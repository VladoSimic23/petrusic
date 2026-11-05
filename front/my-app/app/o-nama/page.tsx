import type { Metadata } from "next";
import AboutPageContentView from "../components/about-page-content";
import { getAboutPage } from "../../sanity/lib/about";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, heading, lead } = await getAboutPage();

  return {
    title: seo.title ?? "O nama | Petrušić gradnja",
    description: seo.description ?? lead ?? heading,
    alternates: { canonical: "/o-nama" },
    ...(seo.image && { openGraph: { images: [seo.image] } }),
  };
}

export default async function AboutPage() {
  const about = await getAboutPage();
  const { company } = about;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    legalName: company.name,
    foundingDate: "2000-01-05",
    address: {
      "@type": "PostalAddress",
      streetAddress: company.headquarters,
      addressCountry: "BA",
    },
    vatID: company.vat,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <AboutPageContentView about={about} />
    </>
  );
}
