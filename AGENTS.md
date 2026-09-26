<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Single source of truth: root `content.md` (YAML frontmatter + prose) → `scripts/generate-content.mjs` (run by vite.config.ts) generates `src/generated/content.ts`, `public/llms.txt`, `public/ai/**`, `public/sitemap.xml`, `public/robots.txt`; never hand-edit generated files or hardcode site text/facts in components. Why: no duplicated content.
