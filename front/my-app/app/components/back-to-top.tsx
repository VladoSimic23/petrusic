"use client";

import { useLanguage } from "./language-provider";

export default function BackToTop() {
  const { language } = useLanguage();
  const label = language === "en" ? "Top" : "Na vrh";

  return (
    <button
      className="back-to-top"
      type="button"
      aria-label={label}
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        })
      }
    >
      <span aria-hidden="true">↑</span>
      <span>{label}</span>
    </button>
  );
}
