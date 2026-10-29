# Testing and verification

## Automated checks

From the `Website` directory:

```powershell
npm test
npm run lint
npm run build
```

Tests use Vitest, React Testing Library, and jsdom. `src/App.test.tsx` covers user journeys, routes, saves, search, metadata, and structured data. `src/content.validation.test.ts` checks content constraints and cross-references.

The production build type-checks, creates Vite assets, and runs `scripts/prerender.mjs`. Set `VITE_SITE_URL` to the real HTTPS production origin when verifying absolute canonical URLs and generated `sitemap.xml`; never substitute a sample origin in a deployment.

## Manual checks

- Open question, article, roadmap, home, and not-found routes in the actual deployed host.
- Check direct navigation/refresh on nested routes and confirm unknown routes return HTTP 404, not just a branded page.
- Verify mobile navigation, keyboard focus, reading layouts at 320px and desktop layouts at a wide viewport.
- Inspect page titles/descriptions, canonical URL, social preview image, sitemap, robots rules, and the host's fallback behavior.
- Review analytics/privacy and cookie-consent behavior in the supported regions before launch.
