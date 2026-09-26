import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import { ProjectGrid } from "@/components/project-grid";
import { featuredProjects, heroImage as hero } from "@/lib/portfolio";
import { content } from "@/generated/content";
import { personJsonLd } from "@/lib/seo";
import { useT } from "@/lib/i18n";

const { site, seo } = content;
export const Route = createFileRoute("/")({ head: () => ({ meta: [
  { title: seo.home.title }, { name: "description", content: seo.home.description },
  { property: "og:title", content: seo.home.title }, { property: "og:description", content: seo.home.og_description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
], scripts: [personJsonLd()] }), component: HomePage });

function HomePage() {
  const t = useT();
  return <main id="top">
    <section className="hero shell"><div className="hero-copy"><p className="eyebrow">{t.hero.role}</p><h1>{site.name.split(" ")[0]}<br />{site.name.split(" ").slice(1).join(" ")}</h1><a className="text-link" href="#portfolio">{t.hero.cta} <ArrowDownRight /></a></div>{hero ? <figure className="hero-art"><img src={hero.src} width={hero.width} height={hero.height} alt={hero.alt} fetchPriority="high" sizes="(max-width: 760px) 100vw, 60vw" /></figure> : null}</section>
    <section className="section shell" id="portfolio"><div className="section-heading"><p className="eyebrow">{t.home.selected}</p><h2>{t.home.portfolio}</h2><Button asChild variant="link"><Link to="/portfolio">{t.home.viewAll} <ArrowRight /></Link></Button></div><ProjectGrid items={featuredProjects} featured /><div className="section-end"><Button asChild variant="outline"><Link to="/portfolio">{t.home.viewAll} <ArrowRight /></Link></Button></div></section>
    <section className="section about" id="about"><div className="shell about-grid"><div className="about-copy"><p className="eyebrow">{t.home.aboutEyebrow}</p><h2>{t.home.aboutHeading[0]}<br />{t.home.aboutHeading[1]}</h2><div className="body-copy">{t.home.aboutBody.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div></div></section>
    <section className="section contact shell" id="contact"><div className="contact-intro"><p className="eyebrow">{t.home.contactEyebrow}</p><h2>{t.home.contactHeading[0]}<br />{t.home.contactHeading[1]}</h2><div className="contact-links"><a href={`mailto:${site.email}`}>{site.email}</a><a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a></div></div><ContactForm /></section>
  </main>;
}
