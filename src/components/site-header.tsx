import { Link } from "@tanstack/react-router";
import { useLanguage, useT } from "@/lib/i18n";

export function SiteHeader() {
  const { lang, setLang } = useLanguage();
  const t = useT();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" hash="top" className="brand" aria-label="Alena Kuritka — back to top">
          <span className="monogram" aria-hidden="true">AK</span>
          <span className="brand-name">Alena Kuritka</span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link to="/" hash="portfolio">{t.nav.portfolio}</Link>
          <Link to="/" hash="about">{t.nav.about}</Link>
          <Link to="/" hash="contact">{t.nav.contact}</Link>
          <span className="lang-switch" role="group" aria-label={t.toggle.label}>
            <button type="button" onClick={() => setLang("en")} aria-pressed={lang === "en"} className={lang === "en" ? "is-active" : ""}>EN</button>
            <span aria-hidden="true">/</span>
            <button type="button" onClick={() => setLang("cs")} aria-pressed={lang === "cs"} className={lang === "cs" ? "is-active" : ""}>CZ</button>
          </span>
        </nav>
      </div>
    </header>
  );
}
