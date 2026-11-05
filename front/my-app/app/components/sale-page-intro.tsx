"use client";

import Link from "next/link";
import { useLanguage } from "./language-provider";

export default function SalePageIntro() {
  const { language } = useLanguage();
  const isEnglish = language === "en";

  return (
    <header className="sale-page__intro">
      <Link className="sale-page__back" href="/#projekti">
        <span aria-hidden="true">←</span> {isEnglish ? "Home" : "Naslovna"}
      </Link>
      <p className="eyebrow eyebrow--dark">
        {isEnglish ? "Find your new home" : "Pronađite svoj novi dom"}
      </p>
      <h1>{isEnglish ? "Apartments for Sale" : "Stanovi u prodaji"}</h1>
      <p className="sale-page__lead">
        {isEnglish
          ? "Explore our current projects and find a building that suits your lifestyle."
          : "Upoznajte naše aktualne projekte i pronađite zgradu koja odgovara vašem načinu života."}
      </p>
    </header>
  );
}
