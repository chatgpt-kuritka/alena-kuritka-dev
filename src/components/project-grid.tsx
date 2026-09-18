import { Link } from "@tanstack/react-router";
import type { PortfolioProject } from "@/lib/portfolio";

export function ProjectGrid({ items, featured = false }: { items: PortfolioProject[]; featured?: boolean }) {
  return (
    <div className={featured ? "project-grid project-grid-featured" : "project-grid"}>
      {items.map((project, index) => (
        <Link
          key={project.slug}
          to="/portfolio/$slug"
          params={{ slug: project.slug }}
          className="project-tile reveal"
          style={{ animationDelay: `${Math.min(index, 5) * 70}ms` }}
        >
          <div className="project-image-wrap">
            <img
              src={project.cover.src}
              alt={project.cover.alt}
              width={project.cover.width}
              height={project.cover.height}
              loading={index < 2 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              sizes={featured ? "(max-width: 700px) 100vw, 50vw" : "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"}
            />
            <div className="project-overlay"><span>View project</span></div>
          </div>
          <div className="project-caption">
            <h3>{project.title}</h3>
            <p>{project.category}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
