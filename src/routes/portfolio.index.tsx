import { createFileRoute } from "@tanstack/react-router";
import { ProjectGrid } from "@/components/project-grid";
import { projects } from "@/lib/portfolio";
import { useT } from "@/lib/i18n";
export const Route = createFileRoute("/portfolio/")({ head: () => ({ meta: [
  { title: "Portfolio — Alena Kuritka" }, { name: "description", content: "Explore graphic design, illustration, identity, product and commercial work by Alena Kuritka." },
  { property: "og:title", content: "Portfolio — Alena Kuritka" }, { property: "og:description", content: "Graphic design and illustration projects by Alena Kuritka." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: PortfolioPage });
function PortfolioPage() {
  const t = useT();
  return <main className="page shell"><header className="page-header"><p className="eyebrow">{t.portfolioPage.eyebrow}</p><h1>{t.portfolioPage.title}</h1><p>{t.portfolioPage.intro}</p></header><ProjectGrid items={projects} /></main>;
}
