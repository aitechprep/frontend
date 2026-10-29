# AITechPrep

A responsive technical-interview learning site built with React, TypeScript, Vite, and React Router.

## Run locally

```powershell
cd "D:\Personal\Interview Prepration Site\Website"
npm install
npm run dev
```

Open the local URL printed by Vite. Production output is created in `dist\`.

## Quality checks

```powershell
npm test
npm run lint
npm run build
```

## Search and AI discovery

- Production builds pre-render the home page and every question, category, roadmap, topic, and article route so crawlers and link previews receive page-specific HTML.
- Route pages include canonical, Open Graph, and Twitter metadata plus JSON-LD for the site, breadcrumbs, interview Q&A, and articles.
- `robots.txt` excludes browser-local saves and search results; `llms.txt` provides a concise public content map. The build generates `sitemap.xml` when `VITE_SITE_URL` is set.
- Before deploying, copy `.env.example` to `.env.production` and replace the example with the exact HTTPS origin of the purchased domain. Without this setting, route HTML is still pre-rendered, but the canonical URLs and sitemap are omitted.
- Keep article claims attributable and up to date; structured data must match content visible on the page. SEO, AEO, and generative-engine inclusion are not guaranteed by markup.

## Starter library

- Six technical tracks and exactly two interview questions in each.
- A single AI Engineer Foundations roadmap, with linked topic pages.
- Three original, evergreen technical explainers and a sourced Microsoft workforce news article.
- Saved questions are stored in the current browser under `modelprep:savedQuestions:v1`. This existing key is intentionally retained to preserve bookmarks across the rename; saves are not synced across devices.

Question, roadmap, and article content lives in its owning feature module under `src\features\`; `src\content.ts` re-exports it for shared validation. Shared content shapes live in `src\types.ts`. Interview answers and roadmap topic pages use separate content models.
