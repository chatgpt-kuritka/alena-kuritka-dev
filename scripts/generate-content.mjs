// Reads content.md (the single source of truth), validates it, and writes every
// derived artifact: src/generated/content.ts, public/llms.txt, public/ai/**,
// public/sitemap.xml, public/robots.txt. Runs automatically on dev/build (see
// vite.config.ts) or manually: `bun scripts/generate-content.mjs`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const HEADER = "GENERATED from content.md by scripts/generate-content.mjs — DO NOT EDIT";

function fail(errors) {
  throw new Error(`content.md is invalid:\n  - ${errors.join("\n  - ")}`);
}

export function loadContent(root) {
  const raw = fs.readFileSync(path.join(root, "content.md"), "utf8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) fail(["missing YAML frontmatter between --- lines"]);
  const data = parse(m[1]);
  const body = m[2];
  const errors = [];
  const req = (v, where) => { if (typeof v !== "string" || !v.trim()) errors.push(`missing text: ${where}`); };
  const langs = data?.site?.languages ?? [];

  // About prose: "## About (en)" sections
  const about = {};
  for (const lang of langs) {
    const sec = body.match(new RegExp(`^## About \\(${lang}\\)\\s*$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "m"));
    const paras = sec ? sec[1].split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean) : [];
    if (!paras.length) errors.push(`missing prose section "## About (${lang})"`);
    about[lang] = paras;
  }

  const s = data?.site ?? {};
  ["name", "monogram", "email", "phone", "production_url", "default_language"].forEach((k) => req(s[k], `site.${k}`));
  if (s.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.email)) errors.push("site.email is malformed");
  if (s.phone && !/^\+?[\d ]+$/.test(s.phone)) errors.push("site.phone is malformed");
  if (s.production_url && !/^https:\/\/[^/]+$/.test(s.production_url)) errors.push("site.production_url must be https://host without trailing slash");
  if (!langs.includes(s.default_language)) errors.push("site.default_language must be one of site.languages");
  for (const lang of langs) {
    req(s.role?.[lang], `site.role.${lang}`);
    if (!data.ui?.[lang]) errors.push(`missing ui.${lang}`);
  }
  // every ui language must have the same keys as the default language
  const keys = (o, p = "") => Object.entries(o ?? {}).flatMap(([k, v]) => (v && typeof v === "object" && !Array.isArray(v) ? keys(v, `${p}${k}.`) : [`${p}${k}`]));
  const baseKeys = keys(data.ui?.[s.default_language]);
  for (const lang of langs) {
    const lk = new Set(keys(data.ui?.[lang]));
    baseKeys.filter((k) => !lk.has(k)).forEach((k) => errors.push(`missing ui.${lang}.${k}`));
  }
  for (const page of ["home", "portfolio", "project"]) ["title", "description", "og_description"].forEach((k) => req(data.seo?.[page]?.[k], `seo.${page}.${k}`));

  const seen = new Set();
  const projects = (data.projects ?? []).map((p, i) => {
    const where = `projects[${i}]${p?.slug ? ` (${p.slug})` : ""}`;
    if (!p?.slug || !/^[a-z0-9-]+$/.test(p.slug)) errors.push(`${where}: missing or invalid slug`);
    else if (seen.has(p.slug)) errors.push(`${where}: duplicate slug`);
    seen.add(p?.slug);
    for (const lang of langs) { req(p?.title?.[lang], `${where}.title.${lang}`); req(p?.category?.[lang], `${where}.category.${lang}`); }
    const pointer = (file) => {
      const rel = `${p.folder}/${file}.asset.json`;
      const abs = path.join(root, rel);
      if (!fs.existsSync(abs)) { errors.push(`${where}: image not found: ${rel}`); return null; }
      return JSON.parse(fs.readFileSync(abs, "utf8")).url;
    };
    if (!Array.isArray(p?.images) || !p.images.length) errors.push(`${where}: no images`);
    const images = (p?.images ?? []).map((img, n) => {
      if (!(img.width > 0 && img.height > 0)) errors.push(`${where}: image ${img.file} needs width/height`);
      return { file: img.file, src: pointer(img.file), width: img.width, height: img.height, alt: `${p.title?.en} \u2014 artwork ${n + 1}` };
    });
    const cover = images.find((img) => img.file === p?.cover);
    if (!cover) errors.push(`${where}: cover "${p?.cover}" must be one of its images`);
    return { ...p, images, cover: cover ? { ...cover, alt: `${p.title?.en} project cover` } : null };
  });
  if (!projects.length) errors.push("no projects");
  for (const slug of data.featured ?? []) if (!seen.has(slug)) errors.push(`featured: unknown slug "${slug}"`);
  const heroProject = projects.find((p) => p.slug === data.hero_image?.project);
  const heroImg = heroProject?.images.find((img) => img.file === data.hero_image?.file);
  if (!heroImg) errors.push("hero_image must reference an existing project image");
  req(data.hero_image?.alt, "hero_image.alt");

  if (errors.length) fail(errors);
  return { ...data, about, projects, hero: { ...heroImg, alt: data.hero_image.alt } };
}

function writeIfChanged(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === text) return;
  fs.writeFileSync(file, text);
}

export function generate(root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")) {
  const c = loadContent(root);
  const url = c.site.production_url;
  const strip = ({ file, ...img }) => img;
  const runtime = {
    site: c.site,
    seo: c.seo,
    featured: c.featured,
    hero: strip(c.hero),
    ui: Object.fromEntries(c.site.languages.map((l) => [l, { ...c.ui[l], hero: { ...c.ui[l].hero, role: c.site.role[l] }, home: { ...c.ui[l].home, aboutBody: c.about[l] } }])),
    projects: c.projects.map((p) => ({ slug: p.slug, title: p.title, category: p.category, cover: strip(p.cover), images: p.images.map(strip) })),
  };
  writeIfChanged(path.join(root, "src/generated/content.ts"), `// ${HEADER}\n/* eslint-disable */\nexport const content = ${JSON.stringify(runtime, null, 2)};\n`);

  const pub = (rel, text) => writeIfChanged(path.join(root, "public", rel), text);
  const md = `<!-- ${HEADER} -->\n`;
  const en = c.ui.en;
  const projUrl = (p) => `${url}/portfolio/${p.slug}`;
  const aiUrl = (p) => `${url}/ai/projects/${p.slug}.md`;
  const feat = new Set(c.featured);

  pub("llms.txt", `# ${c.site.name}

> Portfolio of ${c.site.name}, ${c.site.role.en.toLowerCase()}; bilingual site (English default, Czech).

${en.portfolioPage.intro} Contact: ${c.site.email}, ${c.site.phone}.

## Pages

- [Home](${url}/): Hero, selected work, about, contact
- [Portfolio](${url}/portfolio): All projects

## Projects

${c.projects.map((p) => `- [${p.title.en}](${projUrl(p)}): ${p.category.en}`).join("\n")}

## AI-readable Markdown

- [Overview](${url}/ai/overview.md): About and contact
- [Portfolio index](${url}/ai/portfolio.md): Project list

## Optional

${c.projects.map((p) => `- [${p.title.en} (Markdown)](${aiUrl(p)})`).join("\n")}
`);

  pub("ai/overview.md", `${md}# ${c.site.name} — ${c.site.role.en}

Website: ${url} (English default, Czech available via on-page switch)

## About

${c.about.en.join("\n\n")}

## O mně (česky)

${c.about.cs.join("\n\n")}

## Contact

- Email: ${c.site.email}
- Phone: ${c.site.phone}
- Contact form: ${url}/#contact

See also the [portfolio index](${url}/ai/portfolio.md).
`);

  pub("ai/portfolio.md", `${md}# Portfolio — ${c.site.name}

${en.portfolioPage.intro}

Full grid: ${url}/portfolio

${c.projects.map((p) => `- [${p.title.en}](${projUrl(p)}) — ${p.category.en}${feat.has(p.slug) ? " (featured)" : ""}. Markdown: ${aiUrl(p)}`).join("\n")}
`);

  const aiDir = path.join(root, "public/ai/projects");
  if (fs.existsSync(aiDir)) for (const f of fs.readdirSync(aiDir)) if (!c.projects.some((p) => `${p.slug}.md` === f)) fs.rmSync(path.join(aiDir, f));
  for (const p of c.projects) {
    pub(`ai/projects/${p.slug}.md`, `${md}# ${p.title.en} (${p.title.cs})

- Category: ${p.category.en} / ${p.category.cs}
- Page: ${projUrl(p)}
- Images: ${p.images.length}
- Designer: ${c.site.name}

Back to [portfolio index](${url}/ai/portfolio.md).
`);
  }

  const locs = ["/", "/portfolio", ...c.projects.map((p) => `/portfolio/${p.slug}`)];
  pub("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<!-- ${HEADER} -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locs.map((l) => `  <url><loc>${url}${l}</loc></url>`).join("\n")}\n</urlset>\n`);
  pub("robots.txt", `# ${HEADER}\n${["Googlebot", "Bingbot", "Twitterbot", "facebookexternalhit", "*"].map((a) => `User-agent: ${a}\nAllow: /\n`).join("\n")}\nSitemap: ${url}/sitemap.xml\n`);
  return c;
}

export const prerenderPaths = (root) => ["/", "/portfolio", ...loadContent(root).projects.map((p) => `/portfolio/${p.slug}`)];

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const c = generate();
  console.log(`content.md OK — ${c.projects.length} projects; generated src/generated/content.ts and public AI/discovery files.`);
}
