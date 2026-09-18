import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import portraitAsset from "@/assets/me/me.png.asset.json";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import { ProjectGrid } from "@/components/project-grid";
import { featuredProjects, getProject } from "@/lib/portfolio";

const hero = getProject("hyacinth")?.images.find((image) => image.src.includes("ara3")) ?? featuredProjects[0]?.cover;
export const Route = createFileRoute("/")({ head: () => ({ meta: [
  { title: "Alena Kuritka — Graphic Designer & Illustrator" }, { name: "description", content: "Portfolio of Alena Kuritka, a graphic designer, illustrator and producer working across culture, publishing and commercial projects." },
  { property: "og:title", content: "Alena Kuritka — Graphic Designer & Illustrator" }, { property: "og:description", content: "Selected graphic design, illustration and visual work by Alena Kuritka." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: HomePage });

function HomePage() { return <main id="top">
  <section className="hero shell"><div className="hero-copy"><p className="eyebrow">Graphic Designer & Illustrator</p><h1>Alena<br />Kuritka</h1><a className="text-link" href="#portfolio">View portfolio <ArrowDownRight /></a></div>{hero ? <figure className="hero-art"><img src={hero.src} width={hero.width} height={hero.height} alt="Hyacinth macaw artwork by Alena Kuritka" fetchPriority="high" sizes="(max-width: 760px) 100vw, 60vw" /></figure> : null}</section>
  <section className="section shell" id="portfolio"><div className="section-heading"><p className="eyebrow">Selected work</p><h2>Portfolio</h2><Button asChild variant="link"><Link to="/portfolio">View all projects <ArrowRight /></Link></Button></div><ProjectGrid items={featuredProjects} featured /><div className="section-end"><Button asChild variant="outline"><Link to="/portfolio">View all projects <ArrowRight /></Link></Button></div></section>
  <section className="section about" id="about"><div className="shell about-grid"><figure className="portrait"><img src={portraitAsset.url} width="713" height="1093" alt="Alena Kuritka" loading="lazy" /></figure><div className="about-copy"><p className="eyebrow">About</p><h2>Ideas, images<br />and production.</h2><div className="body-copy"><p>I studied Graphic Design at a secondary Graphic Art school and later continued my studies at the Faculty of Arts at Masaryk University.</p><p>Today I work as a graphic designer, illustrator and producer, bringing visual ideas from their first sketch through to finished form. My experience spans companies, galleries, museums, publishing houses and other cultural and commercial clients.</p><p>Selected collaborations and projects include Ogilvy, Eternia Graphic Studio, Gallery of Chrism, Alchymist Café and Scarabeus Gallery.</p></div></div></div></section>
  <section className="section contact shell" id="contact"><div className="contact-intro"><p className="eyebrow">Contact</p><h2>Let’s make<br />something together.</h2><div className="contact-links"><a href="mailto:alenakuritka@gmail.com">alenakuritka@gmail.com</a><a href="tel:+420721011680">+420 721 011 680</a></div></div><ContactForm /></section>
</main>; }
