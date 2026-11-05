import type { Metadata } from "next";
import BuildingCard from "../components/building-card";
import CompletedBuildingsIntro from "../components/completed-buildings-intro";
import { getCompletedBuildings } from "../../sanity/lib/buildings";

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

  return (
    <main className="sale-page built-page">
      <CompletedBuildingsIntro
        buildingsCount={buildings.length}
        apartments={apartments}
        latest={latest}
      />
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
    </main>
  );
}
