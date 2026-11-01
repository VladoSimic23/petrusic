"use client";

import { useEffect } from "react";

const revealSelectors = [
  "#naslovna .hero__content",
  "#naslovna .hero__footer",
  "#o-nama .about-section__inner",
  "#o-nama .about-section__stats",
  "#projekti .projects-section__heading",
  "#projekti .projects-showcase",
  "#projekti .projects-showcase__selector",
  "#projekti .projects-section__footer",
  "#arhiva .section-heading",
  "#arhiva .reference-step",
  "#arhiva .references-section__footer",
  ".info-section .info-section__inner",
  "#faq .faq-section__intro",
  "#faq .faq-item",
  "#kontakt .contact-section__frame",
  "#kontakt .contact-section__channel",
  "#kontakt .contact-section__details",
  "#kontakt .contact-section__map",
].join(",");

export default function HomepageMotion() {
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (
      !desktop.matches ||
      reducedMotion.matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(`main ${revealSelectors}`),
    );
    const sectionIndexes = new Map<Element, number>();

    targets.forEach((target) => {
      const section = target.closest("main > section");
      const index = section ? (sectionIndexes.get(section) ?? 0) : 0;
      if (section) sectionIndexes.set(section, index + 1);
      target.style.setProperty("--motion-delay", `${Math.min(index, 4) * 90}ms`);
      target.classList.add("motion-reveal");
    });

    document.documentElement.classList.add("homepage-motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("motion-revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("homepage-motion-ready");
      targets.forEach((target) => {
        target.classList.remove("motion-reveal", "motion-revealed");
        target.style.removeProperty("--motion-delay");
      });
    };
  }, []);

  return null;
}
