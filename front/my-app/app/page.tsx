import type { Metadata } from "next";
import AboutSection from "./components/about-section";
import FaqSection from "./components/faq-section";
import Hero from "./components/hero";
import HomepageMotion from "./components/homepage-motion";
import InfoSection from "./components/info-section";
import LatestNewsSection from "./components/latest-news-section";
import ProjectsSection from "./components/projects-section";
import ReferencesSection from "./components/references-section";
import {
  aboutContent,
  faqContent,
  heroContent,
  infoSections,
  projectsContent,
  referencesContent,
  statsContent,
} from "./content/home";
import { getHomePage } from "../sanity/lib/home";
import { getAktualnosti } from "../sanity/lib/aktualnosti";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();
  const { title, description, image } = page?.seo ?? {};

  return {
    ...(title && { title }),
    ...(description && { description }),
    ...(image && { openGraph: { images: [image] } }),
  };
}

export default async function Page() {
  const [page, aktualnosti] = await Promise.all([getHomePage(), getAktualnosti()]);
  const references = page?.references ?? referencesContent;

  return (
    <>
      <main>
        <HomepageMotion />
        <Hero {...(page?.hero ?? heroContent)} />
        <ProjectsSection {...(page?.projects ?? projectsContent)} />
        <AboutSection
          {...(page?.about ?? aboutContent)}
          stats={page?.stats ?? statsContent}
        />
        <ReferencesSection {...references} />
        <LatestNewsSection
          content={page?.newsSection}
          items={
            page?.newsSection?.articles?.length
              ? page.newsSection.articles
              : aktualnosti.slice(0, 3)
          }
        />
        {infoSections.map((section, index) =>
          section.id === "novosti" ||
          (section.id === "arhiva" && references) ? null : (
            <InfoSection
              key={section.id}
              muted={index % 2 === 1}
              {...section}
            />
          ),
        )}
        <FaqSection {...(page?.faq ?? faqContent)} />
      </main>
    </>
  );
}
