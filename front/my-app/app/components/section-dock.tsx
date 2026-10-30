"use client";

import { useEffect, useState } from "react";

const items = [
  { id: "projekti", label: "Projekti" },
  { id: "arhiva", label: "Reference" },
  { id: "o-nama", label: "O nama" },
  { id: "novosti", label: "Novosti" },
  { id: "kontakt", label: "Kontakt" },
];

export default function SectionDock() {
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);

      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <nav
      className="section-dock"
      data-visible={visible}
      aria-label="Brza navigacija po sekcijama"
    >
      <ul className="section-dock__list">
        {items.map(({ id, label }) => (
          <li key={id}>
            <a
              className="section-dock__link"
              href={`#${id}`}
              aria-current={active === id ? "true" : undefined}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
