// Portfolio data comes from content.md via the generated module — edit content.md, not this file.
import { content } from "@/generated/content";

export type PortfolioImage = { src: string; width: number; height: number; alt: string };
export type PortfolioProject = { slug: string; title: string; category: string; cover: PortfolioImage; images: PortfolioImage[] };

// content.md decides what is public: every listed project/image is shown, nothing else.
export const projects: PortfolioProject[] = content.projects.map((p) => ({
  slug: p.slug,
  title: p.title.en,
  category: p.category.en,
  cover: p.cover,
  images: p.images,
}));

export const featuredProjects = content.featured
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is PortfolioProject => Boolean(project));

export const heroImage = content.hero;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
