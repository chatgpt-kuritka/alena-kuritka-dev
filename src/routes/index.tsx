import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import { ProjectGrid } from "@/components/project-grid";
import { featuredProjects, getProject } from "@/lib/portfolio";
import { useT } from "@/lib/i18n";

const hero = getProject("hyacinth")?.images.find((image) => image.src.includes("ara3")) ?? featuredProjects[0]?.cover;
export const Route = createFileRoute("/")({ head: () => ({ meta: [
  { title: "Alena Kuritka — Graphic Designer & Illustrator" }, { name: "description", content: "Portfolio of Alena Kuritka, a graphic designer, illustrator and producer working across culture, publishing and commercial projects." },
  { property: "og:title", content: "Alena Kuritka — Graphic Designer & Illustrator" }, { property: "og:description", content: "Selected graphic design, illustration and visual work by Alena Kuritka." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: HomePage });

function HomePage() {
  const t = useT();
  return <main id="top">
    <section className="hero shell"><div className="hero-copy"><p className="eyebrow">{t.hero.role}</p><h1>Alena<br />Kuritka</h1><a className="text-link" href="#portfolio">{t.hero.cta} <ArrowDownRight /></a></div>{hero ? <figure className="hero-art"><img src={hero.src} width={hero.width} height={hero.height} alt="Hyacinth macaw artwork by Alena Kuritka" fetchPriority="high" sizes="(max-width: 760px) 100vw, 60vw" /></figure> : null}</section>
    <section className="section shell" id="portfolio"><div className="section-heading"><p className="eyebrow">{t.home.selected}</p><h2>{t.home.portfolio}</h2><Button asChild variant="link"><Link to="/portfolio">{t.home.viewAll} <ArrowRight /></Link></Button></div><ProjectGrid items={featuredProjects} featured /><div className="section-end"><Button asChild variant="outline"><Link to="/portfolio">{t.home.viewAll} <ArrowRight /></Link></Button></div></section>
    <section className="section about" id="about"><div className="shell about-grid"><div className="about-copy"><p className="eyebrow">{t.home.aboutEyebrow}</p><h2>{t.home.aboutHeading[0]}<br />{t.home.aboutHeading[1]}</h2><div className="body-copy">{t.home.aboutBody.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div></div></section>
    <section className="section contact shell" id="contact"><div className="contact-intro"><p className="eyebrow">{t.home.contactEyebrow}</p><h2>{t.home.contactHeading[0]}<br />{t.home.contactHeading[1]}</h2><div className="contact-links"><a href="mailto:alenakuritka@gmail.com">alenakuritka@gmail.com</a><a href="tel:+420721011680">+420 721 011 680</a></div></div><ContactForm /></section>
  </main>;
}
