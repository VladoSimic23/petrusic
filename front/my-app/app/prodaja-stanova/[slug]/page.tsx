import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProjectGallery from "../../components/project-gallery";
import {
  ProjectBodyContent,
  ProjectHeroImage,
  ProjectText,
} from "../../components/project-localization";
import SaleProjectCard from "../../components/sale-project-card";
import { messagingNumber, phoneHref } from "../../components/contact-utils";
import { getHomePage } from "../../../sanity/lib/home";
import {
  getProjectBySlug,
  getProjectsForSale,
} from "../../../sanity/lib/projects";
import FirstPersonApartmentWalkthrough from "@/app/components/FirstPersonApartmentWalkthrough";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjectsForSale();
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Projekt nije pronađen | Petrušić gradnja" };

  return {
    title: project.seo?.title || `${project.title} | Stanovi u prodaji`,
    description:
      project.seo?.description ||
      `${project.title}, ${project.location}. Pregledajte detalje projekta, galeriju fotografija i informacije o lokaciji.`,
    ...(project.seo?.image || project.image.src
      ? {
          openGraph: {
            images: [project.seo?.image || project.image.src],
          },
        }
      : {}),
  };
}

export default function ProjectDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="project-detail">
          <div
            className="project-detail__loading"
            aria-label="Učitavanje projekta"
          />
        </main>
      }
    >
      <ProjectDetailContent params={params} />
    </Suspense>
  );
}

async function ProjectDetailContent({ params }: PageProps) {
  const { slug } = await params;
  const [project, allProjects, home] = await Promise.all([
    getProjectBySlug(slug),
    getProjectsForSale(),
    getHomePage(),
  ]);
  if (!project) notFound();

  const gallery = [
    { ...project.image, _key: `${project._id}-main-image` },
    ...project.gallery
      .filter((image) => image.src !== project.image.src)
      .map((image, index) => ({
        ...image,
        _key: image._key || `${project._id}-gallery-${index}`,
      })),
  ];
  const otherProjects = allProjects
    .filter((item) => item.slug !== project.slug)
    .slice(0, 2);
  const contact = home?.contact;

  return (
    <main className="project-detail">
      <section className="project-detail__hero" aria-labelledby="project-title">
        <div className="project-detail__hero-media">
          <ProjectHeroImage
            src={project.image.src}
            croatianAlt={project.image.alt}
            englishAlt={project.image.englishAlt}
            fallbackAlt={project.title}
            hotspot={project.image.hotspot}
          />
        </div>
        <div className="project-detail__wrap project-detail__hero-inner">
          <Link className="project-detail__back" href="/prodaja-stanova">
            <span aria-hidden="true">←</span>{" "}
            <ProjectText croatian="Svi projekti" english="All projects" />
          </Link>
          <div className="project-detail__hero-copy">
            <p className="eyebrow">
              <ProjectText
                croatian="Petrušić gradnja · Stanovi u prodaji"
                english="Petrušić gradnja · Apartments for sale"
              />
            </p>
            <ProjectText
              element="h1"
              id="project-title"
              croatian={project.title}
              english={project.english?.title || project.title}
            />
            <ProjectText
              element="p"
              className="project-detail__lead"
              croatian={
                project.description ||
                "Promišljena arhitektura, kvalitetna izvedba i prostor oblikovan za svakodnevni život."
              }
              english={
                project.english?.description ||
                project.description ||
                "Promišljena arhitektura, kvalitetna izvedba i prostor oblikovan za svakodnevni život."
              }
            />
            <div className="project-detail__actions">
              <Link className="button button--primary" href="/#kontakt">
                <ProjectText
                  croatian="Zatražite informacije"
                  english="Request information"
                />{" "}
                <span aria-hidden="true">↗</span>
              </Link>
              {gallery.length > 1 ? (
                <a className="project-detail__ghost" href="#galerija">
                  <ProjectText
                    croatian="Pogledaj galeriju"
                    english="View gallery"
                  />{" "}
                  <span aria-hidden="true">↓</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="about-page">
        <section className="about-stats">
          <ul>
            <li>
              <strong style={{ fontSize: "24px", paddingBottom: "8px" }}>
                <ProjectText croatian="Lokacija" english="Location" />
              </strong>
              <span style={{ fontSize: "16px" }}>{project.location}</span>
            </li>
            <li>
              <strong style={{ fontSize: "24px", paddingBottom: "8px" }}>
                <ProjectText croatian="Fotografije" english="Photos" />
              </strong>
              <span style={{ fontSize: "16px" }}>{gallery.length}</span>
            </li>
            <li>
              <strong style={{ fontSize: "24px", paddingBottom: "8px" }}>
                <ProjectText croatian="Status" english="Status" />
              </strong>
              <span style={{ fontSize: "16px" }}>
                <ProjectText
                  croatian="Aktualno u ponudi"
                  english="Currently available"
                />
              </span>
            </li>
          </ul>
        </section>
      </div>

      {/* <div className="project-detail__wrap">
        <dl className="project-detail__facts">
          <div>
            <dt>Lokacija</dt>
            <dd>{project.location}</dd>
          </div>
          {project.completion ? (
            <div>
              <dt>Planirani završetak</dt>
              <dd>{project.completion}</dd>
            </div>
          ) : null}
          <div>
            <dt>Fotografije</dt>
            <dd>{gallery.length}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>Aktualno u ponudi</dd>
          </div>
        </dl>
      </div> */}

      {gallery.length > 1 ? (
        <ProjectGallery images={gallery} title={project.title} />
      ) : null}
      {/* {project.slug === "stambeno-poslovna-zgrada-centar" ? (
        <FirstPersonApartmentWalkthrough />
      ) : null} */}
      {project.body.length ? (
        <section
          className="project-detail__story project-detail__wrap"
          id="opis-projekta"
          aria-label="About the project"
        >
          {/* <div className="project-detail__story-label">
            <p className="eyebrow eyebrow--dark">Pažnja u svakom detalju</p>
            <h2>Prostor za vaš novi početak</h2>
          </div> */}
          <div className="project-body">
            <ProjectBodyContent
              croatian={project.body}
              english={project.english?.body}
            />
          </div>
        </section>
      ) : null}

      <div className="project-detail__wrap">
        <section
          className="project-detail__contact"
          aria-labelledby="project-contact-title"
        >
          <div className="project-detail__contact-copy">
            <p className="eyebrow">
              <ProjectText croatian="Sljedeći korak" english="Next step" />
            </p>
            <ProjectText
              element="h2"
              id="project-contact-title"
              croatian="Pronašli ste svoj novi dom?"
              english="Have you found your new home?"
            />
            <ProjectText
              element="p"
              croatian="Naš tim rado će vam odgovoriti na pitanja i dogovoriti razgledavanje."
              english="Our team will be happy to answer your questions and arrange a viewing."
            />
          </div>
          <div className="project-detail__contact-actions">
            <Link className="button button--primary" href="/#kontakt">
              <ProjectText
                croatian="Zatražite informacije"
                english="Request information"
              />{" "}
              <span aria-hidden="true">↗</span>
            </Link>
            {contact?.phone ? (
              <a
                className="project-detail__ghost"
                href={phoneHref(contact.phone)}
              >
                {contact.phone}
              </a>
            ) : null}
            {contact?.whatsapp ? (
              <a
                className="project-detail__ghost"
                href={`https://wa.me/${messagingNumber(contact.whatsapp)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>
        </section>
      </div>

      {otherProjects.length ? (
        <section
          className="project-detail__more project-detail__wrap"
          aria-labelledby="more-projects-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow eyebrow--dark">
                <ProjectText croatian="Istražite još" english="Explore more" />
              </p>
              <ProjectText
                element="h2"
                id="more-projects-title"
                croatian="Ostali projekti"
                english="Other projects"
              />
            </div>
            <Link className="project-detail__all" href="/prodaja-stanova">
              <ProjectText croatian="Svi projekti" english="All projects" />{" "}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ul className="sale-project-grid">
            {otherProjects.map((item, index) => (
              <SaleProjectCard key={item._id} project={item} index={index} />
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
