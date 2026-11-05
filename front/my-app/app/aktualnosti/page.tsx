import type { Metadata } from "next";
import { AktualnostiList } from "../components/aktualnosti-content";
import { getAktualnosti } from "../../sanity/lib/aktualnosti";

export const metadata: Metadata = {
  title: "Aktualnosti i novosti | Petrušić gradnja",
  description: "Novosti, obavijesti i aktualnosti iz Petrušić gradnje.",
};

export default async function AktualnostiPage() {
  const items = await getAktualnosti();
  return <AktualnostiList items={items} />;
}