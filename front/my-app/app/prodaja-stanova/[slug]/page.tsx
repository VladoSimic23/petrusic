import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import ProjectGallery from "../../components/project-gallery";
import SaleProjectCard from "../../components/sale-project-card";
import SiteHeader from "../../components/site-header";
import { messagingNumber, phoneHref } from "../../components/contact-section";
import type { ProjectBodyImage } from "../../../sanity/lib/projects";
import { getHomePage } from "../../../sanity/lib/home";
import {
  getProjectBySlug,
  getProjectsForSale,
} from "../../../sanity/lib/projects";

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

function isProjectBodyImage(value: unknown): value is ProjectBodyImage {
  return (
    typeof value === "object" &&
    value !== null &&
    "_type" in value &&
    value._type === "image" &&
    "src" in value &&
    typeof value.src === "string"
  );
}

const portableComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }) => {
      const href =
        value && "href" in value && typeof value.href === "string"
          ? value.href
          : undefined;
      if (!href) return <>{children}</>;

      const external = /^https?:\/\//i.test(href);
      return (
        <a href={href} rel={external ? "noopener noreferrer" : undefined}>
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!isProjectBodyImage(value)) return null;
      return (
        <figure className="project-body__image">
          <Image
            src={value.src}
            alt={value.alt || ""}
            width={1400}
            height={900}
            sizes="(max-width: 900px) 100vw, 900px"
          />
          {value.caption ? <figcaption>{value.caption}</figcaption> : null}
        </figure>
      );
    },
  },
};

export default function ProjectDetailPage({ params }: PageProps) {
  return (
    <>
      <SiteHeader />
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
    </>
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
  const { hotspot } = project.image;
  const contact = home?.contact;

  return (
    <main className="project-detail">
      <section className="project-detail__hero" aria-labelledby="project-title">
        <div className="project-detail__hero-media">
          <Image
            src={project.image.src}
            alt={project.image.alt || project.title}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            style={
              hotspot
                ? { objectPosition: `${hotspot.x * 100}% ${hotspot.y * 100}%` }
                : undefined
            }
          />
        </div>
        <div className="project-detail__wrap project-detail__hero-inner">
          <Link className="project-detail__back" href="/prodaja-stanova">
            <span aria-hidden="true">←</span> Svi projekti
          </Link>
          <div className="project-detail__hero-copy">
            <p className="eyebrow">Petrušić gradnja · Stanovi u prodaji</p>
            <h1 id="project-title">{project.title}</h1>
            <p className="project-detail__lead">
              Promišljena arhitektura, kvalitetna izvedba i prostor oblikovan za
              svakodnevni život.
            </p>
            <div className="project-detail__actions">
              <Link className="button button--primary" href="/#kontakt">
                Zatražite informacije <span aria-hidden="true">↗</span>
              </Link>
              {gallery.length > 1 ? (
                <a className="project-detail__ghost" href="#galerija">
                  Pogledaj galeriju <span aria-hidden="true">↓</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="project-detail__wrap">
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
      </div>

      {gallery.length > 1 ? (
        <ProjectGallery images={gallery} title={project.title} />
      ) : null}

      {project.body.length ? (
        <section
          className="project-detail__story project-detail__wrap"
          id="opis-projekta"
          aria-label="O projektu"
        >
          {/* <div className="project-detail__story-label">
            <p className="eyebrow eyebrow--dark">Pažnja u svakom detalju</p>
            <h2>Prostor za vaš novi početak</h2>
          </div> */}
          <div className="project-body">
            <PortableText
              value={project.body}
              components={portableComponents}
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
            <p className="eyebrow">Sljedeći korak</p>
            <h2 id="project-contact-title">Pronašli ste svoj novi dom?</h2>
            <p>
              Naš tim rado će vam odgovoriti na pitanja i dogovoriti
              razgledavanje.
            </p>
          </div>
          <div className="project-detail__contact-actions">
            <Link className="button button--primary" href="/#kontakt">
              Zatražite informacije <span aria-hidden="true">↗</span>
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
              <p className="eyebrow eyebrow--dark">Istražite još</p>
              <h2 id="more-projects-title">Ostali projekti</h2>
            </div>
            <Link className="project-detail__all" href="/prodaja-stanova">
              Svi projekti <span aria-hidden="true">→</span>
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
