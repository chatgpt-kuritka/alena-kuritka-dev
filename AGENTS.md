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

- Content layer: `content/*.md` and `public/ai/`, `public/llms.txt`, `public/sitemap.xml` mirror `src/lib/i18n.tsx` + `src/lib/portfolio.ts`; keep them in sync on every content change (see CONTENT.md). Why: parallel canonical content before a later Markdown migration.
