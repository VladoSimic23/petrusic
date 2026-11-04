import type { Metadata } from "next";
import Link from "next/link";
import BuildingCard from "../components/building-card";
import { getCompletedBuildings } from "../../sanity/lib/buildings";
import CountUp from "../components/count-up";
import style from "styled-jsx/style";

export const metadata: Metadata = {
  title: "Izgrađeni objekti | Petrušić gradnja",
  description:
    "Pregledajte završene stambene objekte Petrušić gradnje: više od 26 godina iskustva, desetci izgrađenih zgrada i stotine useljenih domova.",
  alternates: { canonical: "/izgradeni-objekti" },
};

export default async function CompletedBuildingsPage() {
  const buildings = await getCompletedBuildings();
  const apartments = buildings.reduce(
    (sum, building) => sum + (building.apartmentCount ?? 0),
    0,
  );
  const years = buildings
    .map((building) => building.completionYear)
    .filter((year): year is number => year != null);
  const latest = years.length ? Math.max(...years) : undefined;

  const stats = [
    { value: String(buildings.length), label: "izgrađenih objekata" },
    apartments ? { value: `${apartments}+`, label: "useljenih stanova" } : null,
    latest
      ? { value: String(latest), label: "posljednji završeni objekt" }
      : null,
  ].filter((stat) => stat !== null);

  return (
    <main className="sale-page built-page">
      <header className="sale-page__intro">
        <Link className="sale-page__back" href="/#arhiva">
          <span aria-hidden="true">←</span> Naslovna
        </Link>
        <p className="eyebrow eyebrow--dark">Naše reference</p>
        <h1
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            color: "#f6e9cf",
            //fontSize: "40px",
            fontStyle: "normal",
          }}
        >
          Izgrađeni objekti
        </h1>
        <p className="sale-page__lead">
          Više od dvadeset i šest godina gradimo domove u kojima ljudi danas
          žive. Pogledajte objekte koje smo završili i čiji su stanovi prodani.
        </p>
      </header>

      {/* {buildings.length ? ( */}
      {/* <> */}
      {stats.length > 1 ? (
        <div
          className="about-page"
          style={{ marginTop: "50px", marginBottom: "50px" }}
        >
          <section
            className="about-stats"
            aria-label="Brojke"
            style={{ width: "100%" }}
          >
            <ul>
              {stats.map((stat, index) => (
                <li key={index || stat.label || index}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}
      <ul className="sale-project-grid">
        {buildings.map((building, index) => (
          <BuildingCard
            key={building._id}
            building={building}
            index={index}
            priority={index < 2}
          />
        ))}
      </ul>
      {/* </> */}
      {/* ) : (
        <div className="sale-page__empty">
          <span aria-hidden="true">01</span>
          <h2>Objekti uskoro stižu</h2>
          <p>Uskoro ćemo ovdje prikazati naše završene projekte.</p>
          <Link className="button button--primary" href="/prodaja-stanova">
            Stanovi u prodaji <span aria-hidden="true">↗</span>
          </Link>
        </div>
      )} */}
    </main>
  );
}
