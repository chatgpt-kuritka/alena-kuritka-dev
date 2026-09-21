import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "cs";

type Dict = {
  nav: { portfolio: string; about: string; contact: string };
  hero: { role: string; cta: string };
  home: {
    selected: string;
    portfolio: string;
    viewAll: string;
    aboutEyebrow: string;
    aboutHeading: string[];
    aboutBody: string[];
    contactEyebrow: string;
    contactHeading: string[];
  };
  portfolioPage: { eyebrow: string; title: string; intro: string };
  project: { allProjects: string; previous: string; next: string; back: string; notFound: string; backToPortfolio: string };
  grid: { view: string };
  form: {
    name: string;
    email: string;
    phone: string;
    optional: string;
    message: string;
    send: string;
    sending: string;
    success: string;
    another: string;
    error: string;
  };
  footer: { backToTop: string };
  toggle: { label: string };
};

const en: Dict = {
  nav: { portfolio: "Portfolio", about: "About", contact: "Contact" },
  hero: { role: "Graphic Designer & Illustrator", cta: "View portfolio" },
  home: {
    selected: "Selected work",
    portfolio: "Portfolio",
    viewAll: "View all projects",
    aboutEyebrow: "About",
    aboutHeading: ["Ideas, images", "and production."],
    aboutBody: [
      "I studied Graphic Design at a secondary Graphic Art school and later continued my studies at the Faculty of Arts at Masaryk University.",
      "Today I work as a graphic designer, illustrator and producer, bringing visual ideas from their first sketch through to finished form. My experience spans companies, galleries, museums, publishing houses and other cultural and commercial clients.",
      "Selected collaborations and projects include Ogilvy, Eternia Graphic Studio, Gallery of Chrism, Alchymist Café and Scarabeus Gallery.",
    ],
    contactEyebrow: "Contact",
    contactHeading: ["Let’s make", "something together."],
  },
  portfolioPage: {
    eyebrow: "Selected projects",
    title: "Portfolio",
    intro: "Graphic design, illustration and visual work across cultural and commercial contexts.",
  },
  project: {
    allProjects: "All projects",
    previous: "Previous project",
    next: "Next project",
    back: "Back to portfolio",
    notFound: "Project not found",
    backToPortfolio: "Back to portfolio",
  },
  grid: { view: "View project" },
  form: {
    name: "Name",
    email: "Email",
    phone: "Phone",
    optional: "(optional)",
    message: "Message",
    send: "Send message",
    sending: "Sending…",
    success: "Thank you, your message has been sent.",
    another: "Send another message",
    error: "Message could not be sent.",
  },
  footer: { backToTop: "Back to top ↑" },
  toggle: { label: "Language" },
};

const cs: Dict = {
  nav: { portfolio: "Portfolio", about: "O mně", contact: "Kontakt" },
  hero: { role: "Grafická designérka & ilustrátorka", cta: "Prohlédnout portfolio" },
  home: {
    selected: "Vybraná tvorba",
    portfolio: "Portfolio",
    viewAll: "Zobrazit všechny projekty",
    aboutEyebrow: "O mně",
    aboutHeading: ["Nápady, obrazy", "a realizace."],
    aboutBody: [
      "Vystudovala jsem grafický design na střední grafické škole a ve studiu jsem později pokračovala na Filozofické fakultě Masarykovy univerzity.",
      "Dnes pracuji jako grafická designérka, ilustrátorka a producentka — vizuální nápady vedu od první skici až k hotové podobě. Mám zkušenosti s firmami, galeriemi, muzei, nakladatelstvími i dalšími kulturními a komerčními klienty.",
      "Mezi vybrané spolupráce a projekty patří Ogilvy, Eternia Graphic Studio, Gallery of Chrism, Alchymist Café a Scarabeus Gallery.",
    ],
    contactEyebrow: "Kontakt",
    contactHeading: ["Pojďme vytvořit", "něco společně."],
  },
  portfolioPage: {
    eyebrow: "Vybrané projekty",
    title: "Portfolio",
    intro: "Grafický design, ilustrace a vizuální tvorba pro kulturní i komerční projekty.",
  },
  project: {
    allProjects: "Všechny projekty",
    previous: "Předchozí projekt",
    next: "Další projekt",
    back: "Zpět na portfolio",
    notFound: "Projekt nenalezen",
    backToPortfolio: "Zpět na portfolio",
  },
  grid: { view: "Zobrazit projekt" },
  form: {
    name: "Jméno",
    email: "E-mail",
    phone: "Telefon",
    optional: "(nepovinné)",
    message: "Zpráva",
    send: "Odeslat zprávu",
    sending: "Odesílám…",
    success: "Děkuji, vaše zpráva byla odeslána.",
    another: "Poslat další zprávu",
    error: "Zprávu se nepodařilo odeslat.",
  },
  footer: { backToTop: "Nahoru ↑" },
  toggle: { label: "Jazyk" },
};

export const dictionaries: Record<Lang, Dict> = { en, cs };

const projectTitlesCs: Record<string, { title: string; category: string }> = {
  ara: { title: "Ara arakanga", category: "Firemní identita" },
  bird: { title: "Ptáci", category: "Ilustrace & merchandise" },
  cat: { title: "Kočka", category: "Ilustrace & merchandise" },
  hyacinth: { title: "Ara hyacintový", category: "Vzory & produktový design" },
  illustration: { title: "Ilustrační tvorba", category: "Knižní a editoriální ilustrace" },
  paintings: { title: "Malby", category: "Volná tvorba" },
  pos: { title: "Retail & POS", category: "Komerční design" },
  wolf: { title: "Vlk samotář", category: "Identita & merchandise" },
};

const LanguageContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("lang");
    if (stored === "cs" || stored === "en") setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(next: Lang) {
    setLangState(next);
    window.localStorage.setItem("lang", next);
  }

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useT() {
  const { lang } = useLanguage();
  return dictionaries[lang];
}

export function useProjectLabels() {
  const { lang } = useLanguage();
  return (project: { slug: string; title: string; category: string }) =>
    lang === "cs" && projectTitlesCs[project.slug]
      ? projectTitlesCs[project.slug]!
      : { title: project.title, category: project.category };
}
