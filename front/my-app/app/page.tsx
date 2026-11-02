import type { Metadata } from "next";
import AboutSection from "./components/about-section";
import FaqSection from "./components/faq-section";
import Hero from "./components/hero";
import HomepageMotion from "./components/homepage-motion";
import InfoSection from "./components/info-section";
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
  const page = await getHomePage();
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
