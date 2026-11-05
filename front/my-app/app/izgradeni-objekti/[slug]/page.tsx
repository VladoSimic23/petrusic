import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import BuildingCard from "../../components/building-card";
import ProjectGallery from "../../components/project-gallery";
import { messagingNumber, phoneHref } from "../../components/contact-utils";
import {
  getCompletedBuildingBySlug,
  getCompletedBuildings,
} from "../../../sanity/lib/buildings";
import { getFooterContact } from "../../../sanity/lib/footer";
import {
  ProjectBodyContent,
  ProjectHeroImage,
  ProjectText,
} from "../../components/project-localization";

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
    {
      label: "Lokacija",
      labelEn: "Location",
      value: building.location,
      valueEn: building.english?.location || building.location,
    },
    building.completionYear
      ? { label: "Završeno", labelEn: "Completed", value: String(building.completionYear) }
      : null,
    building.startYear
      ? { label: "Početak gradnje", labelEn: "Construction started", value: String(building.startYear) }
      : null,
    building.apartmentCount
      ? { label: "Stanova", labelEn: "Apartments", value: String(building.apartmentCount) }
      : null,
    building.floors
      ? {
          label: "Etaže",
          labelEn: "Floors",
          value: building.floors,
          valueEn: building.floorsEn || building.floors,
        }
      : null,
    building.totalArea
      ? {
          label: "Ukupna površina",
          labelEn: "Total area",
          value: `${building.totalArea.toLocaleString("hr-HR")} m²`,
          valueEn: `${building.totalArea.toLocaleString("en-US")} m²`,
        }
      : null,
    building.parkingSpaces
      ? {
          label: "Parkirna mjesta",
          labelEn: "Parking spaces",
          value: String(building.parkingSpaces),
        }
      : null,
    building.allSold
      ? {
          label: "Status",
          labelEn: "Status",
          value: "Svi stanovi prodani",
          valueEn: "All apartments sold",
        }
      : null,
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
      <section
        className="project-detail__hero"
        aria-labelledby="building-title"
      >
        <div className="project-detail__hero-media">
          <ProjectHeroImage
            src={building.image.src}
            croatianAlt={building.image.alt}
            englishAlt={building.image.altEn}
            fallbackAlt={building.title}
            hotspot={hotspot}
          />
        </div>
        <div className="project-detail__wrap project-detail__hero-inner">
          <Link className="project-detail__back" href="/izgradeni-objekti">
            <span aria-hidden="true">←</span>{" "}
            <ProjectText croatian="Svi objekti" english="All buildings" />
          </Link>
          <div className="project-detail__hero-copy">
            <p className="eyebrow">
              <ProjectText
                croatian="Petrušić gradnja · Izgrađeni objekti"
                english="Petrušić gradnja · Completed buildings"
              />
              {building.completionYear ? ` · ${building.completionYear}` : ""}
            </p>
            <ProjectText
              element="h1"
              id="building-title"
              croatian={building.title}
              english={building.english?.title || building.title}
            />
            {building.description ? (
              <ProjectText
                element="p"
                className="project-detail__lead"
                croatian={building.description}
                english={building.english?.description || building.description}
              />
            ) : null}
            <div className="project-detail__actions">
              {building.allSold ? (
                <span className="built-detail__badge">
                  <ProjectText
                    croatian="Svi stanovi prodani"
                    english="All apartments sold"
                  />
                </span>
              ) : null}
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

      <div className="project-detail__wrap">
        <dl className="project-detail__facts built-detail__facts">
          {facts.map((fact) => (
            <div key={fact.label}>
              <ProjectText
                element="dt"
                croatian={fact.label}
                english={fact.labelEn || fact.label}
              />
              <ProjectText
                element="dd"
                croatian={fact.value}
                english={("valueEn" in fact ? fact.valueEn : undefined) || fact.value}
              />
            </div>
          ))}
        </dl>
      </div>

      {building.highlights.length ? (
        <div className="project-detail__wrap">
          <ul
            className="built-detail__highlights"
            aria-label="Building highlights"
          >
            {building.highlights.map((highlight, index) => (
              <li key={highlight}>
                <ProjectText
                  croatian={highlight}
                  english={building.highlightsEn[index] || highlight}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {gallery.length > 1 ? (
        <ProjectGallery
          images={gallery}
          title={building.title}
          englishTitle={building.english?.title}
        />
      ) : null}

      {building.body.length ? (
        <section
          className="project-detail__story project-detail__wrap"
          aria-label="About this building"
        >
          <div className="project-body">
            <ProjectBodyContent
              croatian={building.body}
              english={building.bodyEn}
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
            <p className="eyebrow">
              <ProjectText
                croatian="Tražite svoj novi dom?"
                english="Looking for your new home?"
              />
            </p>
            <ProjectText
              element="h2"
              id="building-contact-title"
              croatian="Pogledajte aktualne projekte"
              english="Explore our current projects"
            />
            <ProjectText
              element="p"
              croatian="Ovakvu kvalitetu gradimo i danas. Pogledajte stanove koji su trenutno u ponudi ili nam se javite za više informacija."
              english="We continue to build to the same high standards. Explore apartments currently available or contact us for more information."
            />
          </div>
          <div className="project-detail__contact-actions">
            <Link className="button button--primary" href="/prodaja-stanova">
              <ProjectText
                croatian="Stanovi u prodaji"
                english="Apartments for sale"
              />{" "}
              <span aria-hidden="true">↗</span>
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
              <p className="eyebrow eyebrow--dark">
                <ProjectText croatian="Istražite još" english="Explore more" />
              </p>
              <ProjectText
                element="h2"
                id="more-buildings-title"
                croatian="Ostali izgrađeni objekti"
                english="Other completed buildings"
              />
            </div>
            <Link className="project-detail__all" href="/izgradeni-objekti">
              <ProjectText croatian="Svi objekti" english="All buildings" />{" "}
              <span aria-hidden="true">→</span>
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
