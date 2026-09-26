// UI text comes from content.md via the generated module — edit content.md, not this file.
import { content } from "@/generated/content";
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

export const dictionaries: Record<Lang, Dict> = content.ui;

const projectLabels = Object.fromEntries(content.projects.map((p) => [p.slug, p]));

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
    lang === "cs" && projectLabels[project.slug]
      ? { title: projectLabels[project.slug]!.title.cs, category: projectLabels[project.slug]!.category.cs }
      : { title: project.title, category: project.category };
}
