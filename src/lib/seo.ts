// JSON-LD and meta helpers built from content.md data (via the generated module).
import { content } from "@/generated/content";

const { site } = content;

export function fill(template: string, p: { title: string; category: string }) {
  return template.replaceAll("{title}", p.title).replaceAll("{category_lower}", p.category.toLowerCase()).replaceAll("{category}", p.category);
}

const ld = (data: object) => ({ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", ...data }) });

const person = { "@type": "Person", name: site.name, jobTitle: site.role.en, email: `mailto:${site.email}`, telephone: site.phone.replace(/\s/g, ""), url: site.production_url };

export const personJsonLd = () => ld(person);

export const projectJsonLd = (p: { slug: string; title: string; category: string }) =>
  ld({ "@type": "CreativeWork", name: p.title, genre: p.category, url: `${site.production_url}/portfolio/${p.slug}`, creator: person });
