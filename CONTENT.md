# Content layer

`content/` holds a Markdown + YAML-frontmatter mirror of the site's facts:

- `content/site.md` — name, role, contact
- `content/about.md` — bio (EN/CS) and collaborations
- `content/portfolio.md` — project order and featured list
- `content/projects/<slug>.md` — titles/categories (EN/CS), cover, image asset paths

Public AI/discovery files (production URLs, https://alena.kuritka.com):
`public/llms.txt`, `public/ai/*.md`, `public/sitemap.xml`, `public/robots.txt`.

**Status:** parallel canonical-content candidate. The React app still reads
`src/lib/i18n.tsx` and `src/lib/portfolio.ts`. Any content change must update
both places. A later migration can make Markdown the real source of truth.

Images are referenced by their existing `.asset.json` pointers; never duplicate binaries.
llms.txt is an informal convention, not an official crawler directive.
