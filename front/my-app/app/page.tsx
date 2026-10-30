import type { Metadata } from "next";
import AboutSection from "./components/about-section";
import ContactSection from "./components/contact-section";
import FaqSection from "./components/faq-section";
import Hero from "./components/hero";
import InfoSection from "./components/info-section";
import ProjectsSection from "./components/projects-section";
import ReferencesSection from "./components/references-section";
import SectionDock from "./components/section-dock";
import SiteHeader from "./components/site-header";
import StatsSection from "./components/stats-section";
import {
  aboutContent,
  contactContent,
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
      <SiteHeader />
      <main>
        <Hero {...(page?.hero ?? heroContent)} />
        <StatsSection {...(page?.stats ?? statsContent)} />
        <AboutSection {...(page?.about ?? aboutContent)} />
        <ProjectsSection {...(page?.projects ?? projectsContent)} />
        <ReferencesSection {...references} />
        {infoSections.map((section, index) =>
          section.id === "novosti" || (section.id === "arhiva" && references) ? null : (
            <InfoSection
              key={section.id}
              muted={index % 2 === 1}
              {...section}
            />
          ),
        )}
        <FaqSection {...(page?.faq ?? faqContent)} />
        <ContactSection {...(page?.contact ?? contactContent)} />
      </main>
      {/* <SectionDock /> */}
    </>
  );
}
