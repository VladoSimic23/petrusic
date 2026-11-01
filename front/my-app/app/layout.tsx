import type { Metadata } from "next";
import "./globals.css";
import SiteFooter from "./components/site-footer";

export const metadata: Metadata = {
  title: "Petrušić gradnja | Izgradnja i prodaja stambenih zgrada",
  description:
    "Petrušić gradnja spaja 30 godina iskustva s kvalitetnom izgradnjom stambenih zgrada. Otkrijte aktualne projekte i stanove u prodaji.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="hr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
