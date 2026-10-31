export type AboutPageContent = {
  eyebrow: string;
  heading: string;
  highlightedHeading?: string;
  lead: string;
  // Studio › Uvod › „Naslovna slika”
  heroImage?: {
    src: string;
    alt?: string;
    hotspot?: { x: number; y: number };
  };
  storyTitle: string;
  storyParagraphs: string[];
  // Studio › Priča i brojke › „Slika uz priču”
  storyImage?: {
    src: string;
    alt?: string;
    hotspot?: { x: number; y: number };
  };
  stats: { _key: string; value: number; suffix?: string; label: string }[];
  mission: string;
  vision: string;
  reasonsTitle: string;
  reasons: { title: string; description: string }[];
  servicesTitle: string;
  servicesIntro: string;
  services: { title: string; description: string }[];
  company: {
    name: string;
    headquarters: string;
    jib: string;
    vat: string;
    founded: string;
    management: string;
  };
  seo: { title?: string; description?: string; image?: string };
};

// Used for every field the CMS document leaves empty.
export const defaultAboutContent: AboutPageContent = {
  // Studio › Uvod › „Mala oznaka iznad naslova”
  eyebrow: "O nama",
  // Studio › Uvod › „Glavni naslov”
  heading: "Više od četvrt stoljeća gradimo",
  // Studio › Uvod › „Istaknuti dio naslova (zlatna boja)”
  highlightedHeading: "Vaše snove i poslovne uspjehe",
  // Studio › Uvod › „Uvodni tekst”
  lead: "Obiteljsko poduzeće s jasnom vizijom: vrhunska kvaliteta, pouzdanost i inovativna rješenja u graditeljstvu i inženjeringu.",
  // Studio › Priča i brojke › „Naslov priče”
  storyTitle: "Naša priča",
  // Studio › Priča i brojke › „Odlomci priče” (svaka stavka = jedan odlomak)
  storyParagraphs: [
    "Tvrtka PETRUŠIĆ d.o.o. Grude osnovana je 5. siječnja 2000. godine kao obiteljsko poduzeće s jasnom vizijom: ponuditi tržištu vrhunsku kvalitetu, pouzdanost i inovativna rješenja u području graditeljstva i inženjeringa.",
    "Danas, nakon više od 26 godina uspješnog poslovanja, ponosni smo što iza sebe imamo desetke uspješno realiziranih projekata, izgrađenih stambenih i poslovnih objekata te mrežu zadovoljnih klijenata i poslovnih partnera diljem regije. Naš tim, predvođen osnivačem Vinkom Petrušićem i upravom poduzeća, spaja višedesetljetno iskustvo na terenu sa suvremenim građevinskim standardima.",
  ],
  // Studio › Priča i brojke › „Brojke” (value = Vrijednost, suffix = Nastavak, label = Opis)
  stats: [
    { _key: "years", value: 26, suffix: "+", label: "godina iskustva" },
    {
      _key: "projects",
      value: 30,
      suffix: "+",
      label: "realiziranih objekata",
    },
    { _key: "since", value: 2000, label: "godina osnivanja" },
  ],
  // Studio › Misija i vrijednosti › „Misija”
  mission:
    "Pružiti klijentima kompletnu i profesionalnu uslugu u svim fazama gradnje — od prvog nacrta i inženjerskog savjetovanja, pa sve do predaje ključeva u ruke. Vodimo se načelima sigurnosti, energetske učinkovitosti i beskompromisne kvalitete materijala.",
  // Studio › Misija i vrijednosti › „Vizija”
  vision:
    "Ostati prepoznatljiv lider na regionalnom tržištu nekretnina i graditeljstva te kroz partnerske odnose i investicije u moderne stambeno-poslovne komplekse nastaviti urbanistički razvoj naših zajednica.",
  // Studio › Misija i vrijednosti › „Naslov sekcije „Zašto mi””
  reasonsTitle: "Zašto odabrati PETRUŠIĆ d.o.o.?",
  // Studio › Misija i vrijednosti › „Razlozi za odabir” (title = Naslov, description = Opis)
  reasons: [
    {
      title: "Tradicija i stabilnost",
      description:
        "Preko 26 godina kontinuiteta na tržištu bez blokada, uz visoku bonitetnu ocjenu, jamstvo su da smo partner na kojeg se možete osloniti.",
    },
    {
      title: "Kvaliteta bez kompromisa",
      description:
        "Suradnja s vodećim projektantskim kućama i upotreba isključivo atestiranih, vrhunskih materijala jamče dugovječnost svakog objekta.",
    },
    {
      title: "Pristup klijentu",
      description:
        "Svakom projektu pristupamo individualno, prilagođavajući se željama, potrebama i proračunu investitora ili kupca nekretnine.",
    },
  ],
  // Studio › Djelatnosti › „Naslov sekcije djelatnosti”
  servicesTitle: "Što radimo",
  // Studio › Djelatnosti › „Uvod u djelatnosti”
  servicesIntro:
    "Specijalizirani smo za širok spektar usluga u građevinskom sektoru, primjenjujući sustav „ključ u ruke” koji investitorima i kupcima jamči miran i siguran proces gradnje.",
  // Studio › Djelatnosti › „Djelatnosti” (title = Naslov, description = Opis)
  services: [
    {
      title: "Graditeljstvo i visokogradnja",
      description:
        "Izgradnja modernih stambenih zgrada, obiteljskih kuća te kompleksnih poslovno-industrijskih objekata.",
    },
    {
      title: "Inženjering i stručni nadzor",
      description:
        "Kompletno tehničko savjetovanje, vođenje projekata i profesionalni nadzor nad izvođenjem radova.",
    },
    {
      title: "Investicije i stanogradnja",
      description:
        "Razvoj vlastitih stambenih projekata na atraktivnim lokacijama, rađenih prema najvišim europskim standardima življenja.",
    },
    {
      title: "Rekonstrukcije i adaptacije",
      description:
        "Sanacije, rekonstrukcije i modernizacije postojećih objekata uz očuvanje njihove statičke i estetske vrijednosti.",
    },
  ],
  // Studio › Podaci o tvrtki
  company: {
    // „Puni naziv” (companyName)
    name: "PETRUŠIĆ d.o.o. za graditeljstvo i usluge GRUDE",
    // „Sjedište” (headquarters)
    headquarters: "Ante Starčevića 8, 88340 Grude, BiH",
    // „Identifikacijski broj (JIB)” (jib)
    jib: "4272051860009",
    // „PDV broj” (vat)
    vat: "272051860009",
    // „Datum osnivanja” (founded)
    founded: "5. siječnja 2000.",
    // „Uprava” (management)
    management: "Vinko Petrušić, Boris Petrušić",
  },
  // Studio › SEO (SEO naslov, SEO opis, Slika za dijeljenje); nema zadane vrijednosti
  seo: {},
};
