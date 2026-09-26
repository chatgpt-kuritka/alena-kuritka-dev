# How to edit site content

**Edit only `content.md`** (project root). It holds everything: name, contact,
EN/CS texts, SEO texts, About prose, portfolio order, featured projects,
project titles/categories and image references.

1. Edit `content.md` (and add images under `src/assets/portfolio/<project>/` as
   `.asset.json` pointers if needed; reference them by file name in `content.md`).
2. Build (`bun run build`) or just run the dev server. Everything else is
   regenerated automatically: website data, `public/llms.txt`, `public/ai/*.md`,
   `public/sitemap.xml`, `public/robots.txt`, JSON-LD.
3. If something is wrong (duplicate/missing slug, missing EN/CS text, missing
   image, bad email/URL), the build stops and tells you exactly what to fix.

Manual check: `bun run content`.

Generated files (start with "GENERATED … DO NOT EDIT") — never edit them:
`src/generated/content.ts`, `public/llms.txt`, `public/ai/**`, `public/sitemap.xml`, `public/robots.txt`.

Image files starting with `_` are never shown. Production URLs use `site.production_url`.
