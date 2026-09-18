# Alena Kuritka portfolio

## Build
- Import the current `public/images/portfolio/` and `public/images/me/me.png` files from GitHub `main` into the project.
- Create one central portfolio manifest that recursively excludes every path segment whose basename begins with `_`; all portfolio views will consume only this filtered data.
- Build the English one-page homepage with sticky navigation, editorial artwork-led hero, six selected projects, About, working Contact form, and simple footer.
- Build `/portfolio` and project detail pages with readable titles, preserved image proportions, responsive masonry galleries, lightbox navigation, and previous/back/next links.
- Add responsive styling, subtle motion, image lazy-loading and sizing hints, accessible touch and keyboard states, and smooth anchor scrolling.
- Replace the placeholder favicon with an AK monogram and add unique SEO metadata for the homepage, portfolio index, and project pages.

## Contact delivery
- Store validated submissions securely in Lovable Cloud with honeypot and rate limiting.
- Wire notification email delivery to `alenakuritka@gmail.com`; if no verified sending domain is available, keep submissions safely stored and report the one remaining domain-verification step without exposing any key.

## Validation
- Verify that no underscore-prefixed directory or file appears in generated portfolio data or rendered pages.
- Check desktop and mobile layouts, navigation, lightbox, form states, metadata, and the latest build diagnostics.

## Technical details
- TanStack Start routes with lightweight React components and CSS; no heavy gallery library.
- Portfolio data is generated from imported image paths at build time, with URL-safe project slugs and central display-name metadata.
- Contact writes use validated server-side logic and database policies; notification credentials remain server-only.
