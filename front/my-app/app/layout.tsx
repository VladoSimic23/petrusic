import type { Metadata } from "next";
import "./globals.css";
import ContactSection from "./components/contact-section";
import SiteHeader from "./components/site-header";
import SiteFooter from "./components/site-footer";
import { contactContent } from "./content/home";
import { getHomePage } from "../sanity/lib/home";

export const metadata: Metadata = {
  title: "Petrušić gradnja | Izgradnja i prodaja stambenih zgrada",
  description:
    "Petrušić gradnja spaja 30 godina iskustva s kvalitetnom izgradnjom stambenih zgrada. Otkrijte aktualne projekte i stanove u prodaji.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const homePage = await getHomePage();

  return (
    <html lang="hr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <ContactSection {...(homePage?.contact ?? contactContent)} />
        <SiteFooter />
      </body>
    </html>
  );
}
