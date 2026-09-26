import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { GalleryLightbox } from "@/components/lightbox";
import { getProject, projects } from "@/lib/portfolio";
import { useProjectLabels, useT } from "@/lib/i18n";
import { fill, projectJsonLd } from "@/lib/seo";
import { content } from "@/generated/content";
export const Route = createFileRoute("/portfolio/$slug")({
  loader: ({ params }) => { const project = getProject(params.slug); if (!project) throw notFound(); return project; },
  head: ({ loaderData }) => ({ meta: loaderData ? [
    { title: fill(content.seo.project.title, loaderData) }, { name: "description", content: fill(content.seo.project.description, loaderData) },
    { property: "og:title", content: fill(content.seo.project.title, loaderData) }, { property: "og:description", content: fill(content.seo.project.og_description, loaderData) }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" },
  ] : [{ title: `Project not found — ${content.site.name}` }, { name: "robots", content: "noindex" }], scripts: loaderData ? [projectJsonLd(loaderData)] : [] }),
  component: ProjectPage,
  notFoundComponent: ProjectNotFound,
});

function ProjectNotFound() {
  return <main className="page shell"><header className="page-header"><p className="eyebrow">404</p><h1>Project not found</h1><Link className="text-link" to="/portfolio">Back to portfolio <ArrowRight /></Link></header></main>;
}

function ProjectPage() {
  const project = Route.useLoaderData();
  const t = useT();
  const labelFor = useProjectLabels();
  const label = labelFor(project);
  const index = projects.findIndex((item) => item.slug === project.slug);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  if (!previous || !next) return null;
  const previousLabel = labelFor(previous);
  const nextLabel = labelFor(next);
  return <main className="project-page"><header className="project-header shell"><div><p className="eyebrow">{label.category}</p><h1>{label.title}</h1></div><Link to="/portfolio" className="back-link"><ArrowLeft /> {t.project.allProjects}</Link></header><figure className="project-hero"><img src={project.cover.src} width={project.cover.width} height={project.cover.height} alt={project.cover.alt} fetchPriority="high" sizes="100vw" /></figure><div className="shell gallery-shell"><GalleryLightbox images={project.images} /></div><nav className="project-nav shell" aria-label="Project navigation"><Link to="/portfolio/$slug" params={{ slug: previous.slug }}><ArrowLeft /><span><small>{t.project.previous}</small>{previousLabel.title}</span></Link><Link to="/portfolio">{t.project.back}</Link><Link to="/portfolio/$slug" params={{ slug: next.slug }}><span><small>{t.project.next}</small>{nextLabel.title}</span><ArrowRight /></Link></nav></main>;
}
