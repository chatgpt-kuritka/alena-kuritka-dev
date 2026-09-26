// Portfolio data comes from content.md via the generated module — edit content.md, not this file.
import { content } from "@/generated/content";

export type PortfolioImage = { src: string; width: number; height: number; alt: string };
export type PortfolioProject = { slug: string; title: string; category: string; cover: PortfolioImage; images: PortfolioImage[] };

const allProjects: PortfolioProject[] = content.projects.map((p) => ({
  slug: p.slug,
  title: p.title.en,
  category: p.category.en,
  cover: p.cover,
  images: p.images,
}));

function isVisiblePath(path: string) {
  return path.split("/").every((segment) => !segment.startsWith("_"));
}

function isVisibleAsset(assetUrl: string) {
  const basename = decodeURIComponent(assetUrl.split("/").at(-1) ?? "");
  return !basename.startsWith("_");
}

export const projects = allProjects
  .filter((project) => isVisiblePath(project.slug))
  .map((project) => ({
    ...project,
    images: project.images.filter((image) => isVisibleAsset(image.src)),
  }));

export const featuredProjects = content.featured
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is PortfolioProject => Boolean(project));

export const heroImage = content.hero;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
