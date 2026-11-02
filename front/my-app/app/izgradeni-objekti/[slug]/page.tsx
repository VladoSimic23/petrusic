import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import BuildingCard from "../../components/building-card";
import ProjectGallery from "../../components/project-gallery";
import { portableComponents } from "../../components/project-body";
import { messagingNumber, phoneHref } from "../../components/contact-section";
import {
  getCompletedBuildingBySlug,
  getCompletedBuildings,
} from "../../../sanity/lib/buildings";
import { getFooterContact } from "../../../sanity/lib/footer";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const buildings = await getCompletedBuildings();
  return buildings.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const building = await getCompletedBuildingBySlug(slug);
  if (!building) return { title: "Objekt nije pronađen | Petrušić gradnja" };

  const image = building.seo?.image || building.image.src;
  return {
    title: building.seo?.title || `${building.title} | Izgrađeni objekti`,
    description:
      building.seo?.description ||
      building.description ||
      `${building.title}, ${building.location}. Pogledajte detalje završenog objekta Petrušić gradnje.`,
    alternates: { canonical: `/izgradeni-objekti/${building.slug}` },
    openGraph: { images: [image] },
  };
}

export default function CompletedBuildingPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="project-detail">
          <div
            className="project-detail__loading"
            aria-label="Učitavanje objekta"
          />
        </main>
      }
    >
      <BuildingContent params={params} />
    </Suspense>
  );
}

async function BuildingContent({ params }: PageProps) {
  const { slug } = await params;
  const [building, all, contact] = await Promise.all([
    getCompletedBuildingBySlug(slug),
    getCompletedBuildings(),
    getFooterContact(),
  ]);
  if (!building) notFound();

  const gallery = [
    { ...building.image, _key: `${building._id}-main-image` },
    ...building.gallery
      .filter((image) => image.src !== building.image.src)
      .map((image, index) => ({
        ...image,
        _key: image._key || `${building._id}-gallery-${index}`,
      })),
  ];
  const others = all.filter((item) => item.slug !== building.slug).slice(0, 2);
  const { hotspot } = building.image;

  const facts = [
    { label: "Lokacija", value: building.location },
    building.completionYear
      ? { label: "Završeno", value: String(building.completionYear) }
      : null,
    building.startYear
      ? { label: "Početak gradnje", value: String(building.startYear) }
      : null,
    building.apartmentCount
      ? { label: "Stanova", value: String(building.apartmentCount) }
      : null,
    building.floors ? { label: "Etaže", value: building.floors } : null,
    building.totalArea
      ? {
          label: "Ukupna površina",
          value: `${building.totalArea.toLocaleString("hr-HR")} m²`,
        }
      : null,
    building.parkingSpaces
      ? { label: "Parkirna mjesta", value: String(building.parkingSpaces) }
      : null,
    building.allSold ? { label: "Status", value: "Svi stanovi prodani" } : null,
  ].filter((fact) => fact !== null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: building.title,
    description: building.description,
    image: building.image.src,
    address: building.location,
  };

  return (
    <main className="project-detail built-detail">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="project-detail__hero" aria-labelledby="building-title">
        <div className="project-detail__hero-media">
          <Image
            src={building.image.src}
            alt={building.image.alt || building.title}
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
          <Link className="project-detail__back" href="/izgradeni-objekti">
            <span aria-hidden="true">←</span> Svi objekti
          </Link>
          <div className="project-detail__hero-copy">
            <p className="eyebrow">
              Petrušić gradnja · Izgrađeni objekti
              {building.completionYear ? ` · ${building.completionYear}` : ""}
            </p>
            <h1 id="building-title">{building.title}</h1>
            {building.description ? (
              <p className="project-detail__lead">{building.description}</p>
            ) : null}
            <div className="project-detail__actions">
              {building.allSold ? (
                <span className="built-detail__badge">Svi stanovi prodani</span>
              ) : null}
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
        <dl className="project-detail__facts built-detail__facts">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {building.highlights.length ? (
        <div className="project-detail__wrap">
          <ul className="built-detail__highlights" aria-label="Karakteristike">
            {building.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {gallery.length > 1 ? (
        <ProjectGallery images={gallery} title={building.title} />
      ) : null}

      {building.body.length ? (
        <section
          className="project-detail__story project-detail__wrap"
          aria-label="O objektu"
        >
          <div className="project-body">
            <PortableText
              value={building.body}
              components={portableComponents}
            />
          </div>
        </section>
      ) : null}

      <div className="project-detail__wrap">
        <section
          className="project-detail__contact"
          aria-labelledby="building-contact-title"
        >
          <div className="project-detail__contact-copy">
            <p className="eyebrow">Tražite svoj novi dom?</p>
            <h2 id="building-contact-title">Pogledajte aktualne projekte</h2>
            <p>
              Ovakvu kvalitetu gradimo i danas. Pogledajte stanove koji su
              trenutno u ponudi ili nam se javite za više informacija.
            </p>
          </div>
          <div className="project-detail__contact-actions">
            <Link className="button button--primary" href="/prodaja-stanova">
              Stanovi u prodaji <span aria-hidden="true">↗</span>
            </Link>
            {contact.phone ? (
              <a
                className="project-detail__ghost"
                href={phoneHref(contact.phone)}
              >
                {contact.phone}
              </a>
            ) : null}
            {contact.whatsapp ? (
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

      {others.length ? (
        <section
          className="project-detail__more project-detail__wrap"
          aria-labelledby="more-buildings-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow eyebrow--dark">Istražite još</p>
              <h2 id="more-buildings-title">Ostali izgrađeni objekti</h2>
            </div>
            <Link className="project-detail__all" href="/izgradeni-objekti">
              Svi objekti <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ul className="sale-project-grid">
            {others.map((item, index) => (
              <BuildingCard key={item._id} building={item} index={index} />
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
