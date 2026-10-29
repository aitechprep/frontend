# AITechPrep architecture

## Application shape

AITechPrep is a client-side React application with a static, pre-rendered production output. It is a feature-oriented modular monolith, not a set of independently deployed services.

- `src/main.tsx` hydrates a pre-rendered route when the path matches, otherwise starts the client app.
- `src/App.tsx` composes the route table and saved-question state provider.
- `src/layout/SiteLayout.tsx` owns the shared header, footer, and layout.
- `src/features/` owns page behavior and data for home, questions, roadmaps, blog, search, and about.
- `src/shared/` contains reusable interface elements, metadata, structured data, and path helpers.
- `src/state.tsx` synchronizes anonymous saved-question IDs with browser `localStorage`.
- `scripts/prerender.mjs` renders public routes to HTML and creates the sitemap when `VITE_SITE_URL` is configured.

## Request and content flow

Feature-owned TypeScript data is rendered by feature pages. Questions, roadmap topics, and articles remain separate models in `src/types.ts`. Stable slugs define public URLs; shared path helpers keep cross-links consistent. Browser-local saves are deliberately not server-synced.

## Runtime/deployment

- Vite builds static files into `dist/`; the build then pre-renders the public route set.
- `VITE_SITE_URL` must be the exact production HTTPS origin. It provides canonical URLs, absolute social-image URLs, and `sitemap.xml`.
- Deploy `dist/` to a static host. Configure the host to serve `404.html` with an HTTP 404 status for unknown paths; static hosts differ in their 404 conventions.
- The pre-rendered HTML is intended to hydrate on the matching route. Preserve route-specific HTML when configuring redirects or rewrites.

## Growth boundaries

Keep the modular monolith while feature teams and runtime needs remain simple. Add an API/database only for requirements such as user accounts, synchronized progress, or editorial administration. Evaluate SSR or a server-rendered framework if crawlable dynamic content or personalization becomes necessary. Do not introduce microservices without independent scaling or ownership needs.
