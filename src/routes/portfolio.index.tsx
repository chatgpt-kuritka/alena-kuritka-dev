import { createFileRoute } from "@tanstack/react-router";
import { ProjectGrid } from "@/components/project-grid";
import { projects } from "@/lib/portfolio";
export const Route = createFileRoute("/portfolio/")({ head: () => ({ meta: [
  { title: "Portfolio — Alena Kuritka" }, { name: "description", content: "Explore graphic design, illustration, identity, product and commercial work by Alena Kuritka." },
  { property: "og:title", content: "Portfolio — Alena Kuritka" }, { property: "og:description", content: "Graphic design and illustration projects by Alena Kuritka." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: PortfolioPage });
function PortfolioPage() { return <main className="page shell"><header className="page-header"><p className="eyebrow">Selected projects</p><h1>Portfolio</h1><p>Graphic design, illustration and visual work across cultural and commercial contexts.</p></header><ProjectGrid items={projects} /></main>; }
