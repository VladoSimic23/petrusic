"use client";

import Link from "next/link";
import { useLanguage } from "./language-provider";

export default function CompletedBuildingsIntro({
  buildingsCount,
  apartments,
  latest,
}: {
  buildingsCount: number;
  apartments: number;
  latest?: number;
}) {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const stats = [
    {
      value: String(buildingsCount),
      label: isEnglish ? "completed buildings" : "izgrađenih objekata",
    },
    apartments
      ? {
          value: `${apartments}+`,
          label: isEnglish ? "apartments occupied" : "useljenih stanova",
        }
      : null,
    latest
      ? {
          value: String(latest),
          label: isEnglish
            ? "latest completed building"
            : "posljednji završeni objekt",
        }
      : null,
  ].filter((stat) => stat !== null);

  return (
    <>
      <header className="sale-page__intro">
        <Link className="sale-page__back" href="/#arhiva">
          <span aria-hidden="true">←</span> {isEnglish ? "Home" : "Naslovna"}
        </Link>
        <p className="eyebrow eyebrow--dark">
          {isEnglish ? "Our references" : "Naše reference"}
        </p>
        <h1
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            color: "#f6e9cf",
            fontStyle: "normal",
          }}
        >
          {isEnglish ? "Archive" : "Arhiva"}
        </h1>
        <p className="sale-page__lead">
          {isEnglish
            ? "For more than twenty-six years, we have built homes where people live today. Explore the buildings we have completed."
            : "Više od dvadeset i šest godina gradimo domove u kojima ljudi danas žive. Pogledajte objekte koje smo završili i čiji su stanovi prodani."}
        </p>
      </header>

      {stats.length > 1 ? (
        <div
          className="about-page"
          style={{ marginTop: "50px", marginBottom: "50px" }}
        >
          <section
            className="about-stats"
            aria-label={isEnglish ? "Statistics" : "Brojke"}
            style={{ width: "100%" }}
          >
            <ul>
              {stats.map((stat, index) => (
                <li key={`${stat.label}-${index}`}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}
    </>
  );
}
