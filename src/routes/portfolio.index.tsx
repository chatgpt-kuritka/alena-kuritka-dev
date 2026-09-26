import { createFileRoute } from "@tanstack/react-router";
import { ProjectGrid } from "@/components/project-grid";
import { projects } from "@/lib/portfolio";
import { useT } from "@/lib/i18n";
import { content } from "@/generated/content";
const { seo } = content;
export const Route = createFileRoute("/portfolio/")({ head: () => ({ meta: [
  { title: seo.portfolio.title }, { name: "description", content: seo.portfolio.description },
  { property: "og:title", content: seo.portfolio.title }, { property: "og:description", content: seo.portfolio.og_description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: PortfolioPage });
function PortfolioPage() {
  const t = useT();
  return <main className="page shell"><header className="page-header"><p className="eyebrow">{t.portfolioPage.eyebrow}</p><h1>{t.portfolioPage.title}</h1><p>{t.portfolioPage.intro}</p></header><ProjectGrid items={projects} /></main>;
}
