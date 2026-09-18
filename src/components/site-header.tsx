import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" hash="top" className="brand" aria-label="Alena Kuritka — back to top">
          <span className="monogram" aria-hidden="true">AK</span>
          <span className="brand-name">Alena Kuritka</span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link to="/" hash="portfolio">Portfolio</Link>
          <Link to="/" hash="about">About</Link>
          <Link to="/" hash="contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
