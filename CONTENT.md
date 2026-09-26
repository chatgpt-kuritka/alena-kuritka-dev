# How to edit site content

**Edit only `content.md`** (project root). It holds everything public: name,
contact, EN/CS texts, SEO texts, About prose, portfolio order, featured
projects, project titles/categories and image references.

1. Put image files anywhere under `public/images/` (e.g.
   `public/images/portfolio/<project>/`). In `content.md` each project has a
   `folder` (path under `public/`) and lists its images by file name.
2. Build (`bun run build`) or just run the dev server. Everything else is
   regenerated automatically: website data, `public/llms.txt`, `public/ai/*.md`,
   `public/sitemap.xml`, `public/robots.txt`, JSON-LD.
3. If something is wrong (duplicate/missing slug, missing EN/CS text, a
   referenced image that does not exist, bad email/URL), the build stops and
   tells you exactly what to fix.

**Only images referenced by `content.md` are published.** Any other file in
`public/images/` (drafts, spare portraits, `_misc/…`) is kept in the repository
but is never deployed — this is not an error. File or folder names (including a
leading `_`) have no special meaning.

Static deployment: `bun run build` then
`bun scripts/export-static.mjs dist/client <cname>` (keeps only referenced
images, adds CNAME, `.nojekyll`, `404.html`).

Manual check: `bun run content`.

Generated files — never edit them: `src/generated/*`, `public/llms.txt`,
`public/ai/**`, `public/sitemap.xml`, `public/robots.txt`.

Lovable compatibility (implementation detail, not a content source): the Lovable
workspace stores image binaries as `src/assets/**.asset.json` CDN pointers; the
`/images/*` fallback route redirects to them only when the binary is absent.
Production URLs use `site.production_url`.
