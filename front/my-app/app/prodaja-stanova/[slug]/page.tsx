import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import ProjectGallery from "../../components/project-gallery";
import SiteHeader from "../../components/site-header";
import type { ProjectBodyImage } from "../../../sanity/lib/projects";
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
            <div className="project-detail__loading" aria-label="Učitavanje projekta" />
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
  const project = await getProjectBySlug(slug);
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

  return (
    <main className="project-detail">
      <div className="project-detail__topbar">
        <Link href="/prodaja-stanova">
          <span aria-hidden="true">←</span> Svi projekti
        </Link>
        <span>Stanovi u prodaji</span>
      </div>

      <section className="project-detail__hero">
        <div className="project-detail__hero-image">
          <ProjectGallery images={gallery} title={project.title} />
          <div className="project-detail__hero-overlay">
            <p className="eyebrow">Petrušić gradnja</p>
            <h1>{project.title}</h1>
            <p className="project-detail__lead">
              Promišljena arhitektura, kvalitetna izvedba i prostor oblikovan za
              svakodnevni život.
            </p>
          </div>
        </div>
        {project.completion ? (
          <div className="project-detail__hero-footer">
            <div className="project-detail__facts">
              <div>
                <span>Planirani završetak</span>
                <strong>{project.completion}</strong>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {project.body.length ? (
        <section
          className="project-detail__story"
          id="opis-projekta"
          aria-label="O projektu"
        >
          <div className="project-detail__story-label">
            <p className="eyebrow eyebrow--dark">Pažnja u svakom detalju</p>
            <h2>Prostor za vaš novi početak</h2>
          </div>
          <div className="project-body">
            <PortableText
              value={project.body}
              components={portableComponents}
            />
          </div>
        </section>
      ) : null}

      <section className="project-detail__contact">
        <p className="eyebrow">Sljedeći korak</p>
        <h2>Pronašli ste svoj novi dom?</h2>
        <p>
          Naš tim rado će vam odgovoriti na pitanja i dogovoriti razgledavanje.
        </p>
        <Link className="button button--primary" href="/#kontakt">
          Zatražite informacije <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
