# AITechPrep UI and architecture guide

This guide captures the current product patterns so future changes feel like part of the same learning platform. Update it when an intentional design-system or architectural decision changes.

## Product and experience

AITechPrep is a visual-first technical interview learning site. Its promise is to help learners understand concepts, form clear interview answers, and follow a useful learning path—not to maximize the number of questions.

The current MVP contains six technical tracks, 12 interview questions (two per track), one seven-stage AI Engineer Foundations roadmap, Blog & News, cross-content search, and browser-local saved questions. Do not add more tracks, questions, roadmaps, accounts, or services unless the task explicitly changes this scope.

Core experience principles:

- Explain the answer directly, then offer a progressive path into the fundamentals, visuals, practical examples, technical detail, trade-offs, takeaways, and follow-ups.
- Prefer plain, accurate language and meaningful examples over jargon, filler, or inflated claims.
- Keep discovery pages scannable; put detailed teaching content on dedicated pages.
- Communicate learning order as guidance, not a mandatory sequence.
- Provide clear status, empty, not-found, and failure feedback; never make a failed action look successful.

## Visual system

The canonical styles live in `src/index.css`. Reuse these values and existing component classes before introducing new ones.

### Brand

- Product name: **AITechPrep**.
- Wordmark: `AI` in the primary blue; `TechPrep` in dark navy/black. Keep this consistent in both header and footer.
- The compact descriptor is “AI & TECH INTERVIEW PREP”.
- Do not reintroduce “ModelPrep” in visible product copy.

### Tokens and typography

Current CSS custom properties in `:root`:

| Purpose | Token | Value |
|---|---|---|
| Main text | `--navy` | `#202c42` |
| Muted text | `--muted` | `#64748b` |
| Faint text | `--faint` | `#8895aa` |
| Primary action/accent | `--blue` | `#4668ed` |
| Hover/active blue | `--blue-dark` | `#3658d7` |
| Soft blue surface | `--blue-soft` | `#f3f5ff` |
| Borders | `--line` | `#e2e8f2` |
| Neutral surface | `--surface` | `#f8faff` |
| Positive accent | `--green` | `#10a88c` |
| Warm accent | `--amber` | `#db8d35` |

- Body text uses DM Sans with system fallbacks; headings use Manrope with DM Sans/system fallbacks.
- Long-form reading copy should default to at least 16px (`1rem`) with a line-height around 1.7–1.8 and a comfortable line length (about 65–75 characters). Supporting explanatory text should generally remain at least 14px; reserve 12px for compact labels, not paragraphs or controls.
- Prefer `rem`-based sizes for reading content so browser and user font preferences can scale it. Avoid shrinking text on mobile to fit; reflow or scroll diagrams/tables instead.
- Keep long reading text a dark, readable color with sufficient contrast on its background; do not use faint metadata colors for body copy.
- Keep the mostly white/light-neutral canvas, dark navy text, restrained blue accents, thin cool borders, and soft shadows.
- Use typography, spacing, and contrast to establish hierarchy; avoid introducing a second palette or decorative style without a product-level reason.
- Keep controls and cards consistent with existing rounded corners, border treatment, hover affordances, and visible keyboard focus.

### Layout and responsive behavior

- Shared desktop content width is approximately 1120px (`.page-width`); the header is approximately 1160px.
- Main responsive breakpoints are 900px, 700px, and 380px in `src/index.css`.
- At tablet widths, reduce spacing and columns without losing content.
- At mobile widths, navigation becomes a menu; multi-column sections stack or simplify; question and roadmap sidebars become accessible mobile alternatives; article cards use a compact horizontal layout.
- Preserve the 320px minimum viewport support, prevent horizontal page overflow, and honor `prefers-reduced-motion`.
- When changing layouts, inspect the actual route at desktop and narrow mobile widths. Do not rely on desktop appearance alone.

## UX and accessibility conventions

- Use the shared `Layout`, sticky header/navigation, footer, page-width container, breadcrumbs, `PageIntro`, and `PageMeta` patterns where applicable.
- Every route should have a useful document title and description through `PageMeta`; keep links and metadata descriptive.
- Use semantic headings in order, landmarks, real links for navigation, buttons for actions, and explicit accessible names for icon-only controls.
- Keep keyboard focus visible, support keyboard interaction, include a skip-to-content link, and preserve reduced-motion support.
- Ensure diagrams and visual explanations have meaningful text alternatives or an adjacent explanation. Do not make color the only way to distinguish information.
- Search/filter controls must be labeled and produce useful results or an explicit empty state. Save controls must expose their state and storage failures.
- Maintain both desktop navigation and the mobile menu behavior, including closing after navigation and escape handling.

## Application architecture

### Runtime and routing

- Stack: React, TypeScript, Vite, React Router, Lucide React, and plain CSS; tests use Vitest and React Testing Library.
- `src/main.tsx` mounts the app under `BrowserRouter` and `StrictMode`. Keep the router at this entry point.
- `src/App.tsx` is the route composition root: it maps URL patterns to feature pages and wraps the app with shared state. Keep feature behavior out of this file.
- `src/layout/SiteLayout.tsx` owns the shared header, footer, and shell.
- `src/shared/components.tsx` owns reusable UI primitives; `src/shared/paths.ts` owns consistent internal route construction.
- `src/features/` groups page components and typed content by product capability: `home`, `questions`, `roadmaps`, `blog`, `search`, and `about`. Keep feature-specific pages and data within their owning module; share only cross-feature UI and route helpers.
- Route URL construction helpers (`questionPath`, `topicPath`) live in `src/shared/paths.ts`. Reuse them rather than hand-building inconsistent links.
- Follow the current route families: `/`, `/questions`, `/questions/:categorySlug`, `/questions/:categorySlug/:questionSlug`, `/saved`, `/roadmaps`, `/roadmaps/:roadmapSlug`, `/roadmaps/:roadmapSlug/:topicSlug`, `/blog`, `/blog/:articleSlug`, `/search`, and `/about`.
- Use the existing not-found page for unknown slugs/routes. Avoid duplicate routing systems or full-page reload navigation.
- Production builds use `scripts/prerender.mjs` to emit route-specific HTML for every public content route. Keep its route list derived from the typed feature datasets and continue hydrating that HTML from `src/main.tsx`.
- `VITE_SITE_URL` must be set to the HTTPS origin of the purchased production domain before deployment; it drives absolute canonical URLs and the generated sitemap. Browser-local saves and on-site search are noindex and excluded from the sitemap.
- `public/llms.txt` is a small, human-readable content map for AI crawlers; keep it factual and aligned with routes and current editorial policy. It is an informal convention, not a ranking control.
- `PageMeta` owns page titles, descriptions, canonical and social metadata. Use JSON-LD only when it accurately reflects visible page content: `FAQPage` for the displayed question/answers, `Article`/`NewsArticle` for editorial pages, and shared breadcrumb data.

### Content and state

- `src/types.ts` contains the explicit `Category`, `InterviewQuestion`, `RoadmapTopic`, and `Article` models plus their supporting types. Keep content strongly typed; avoid `any` and unvalidated casts.
- Feature-owned content is defined in `src/features/questions/data.ts`, `src/features/roadmaps/data.ts`, and `src/features/blog/data.ts`. `src/content.ts` is a compatibility barrel for validation/tests and shared consumers; new feature code should import from its owning module.
- Maintain stable IDs and slugs and validate every cross-reference between questions, roadmap topics, and articles.
- Question detail content has a different purpose and shape than roadmap topic content. Do not collapse these into one generic model.
- Article `contentType` distinguishes evergreen technical blogs from industry news. News needs accurate published/updated dates, source references, and a visible News tag; carefully distinguish announced eligibility from confirmed outcomes.
- `src/state.tsx` provides the saved-question context, `src/saves.ts` exposes its hook/context, and `src/App.tsx` places the provider around app content. Keep storage logic out of page components.
- Preserve the existing localStorage key `modelprep:savedQuestions:v1`; changing the brand must not silently erase existing bookmarks. If a key migration is explicitly needed, read and migrate old values safely.
- Search is cross-content: questions, roadmap topics, and articles. Keep newly added searchable content represented in the corresponding data model and search logic.

### Styling and component approach

- `src/index.css` is the shared design system and responsive stylesheet. Add styles beside the relevant component section and within the existing breakpoints.
- Reuse existing primitives and visual patterns (buttons, icon tiles, badges, cards, breadcrumbs, empty states, diagrams, note cards, and related-content lists).
- Keep repeated component structure consistent across routes. If a reusable pattern gains multiple call sites, extract it using the project’s existing React/TypeScript style.
- Avoid CSS frameworks, inline one-off design systems, unnecessary component libraries, and premature abstraction.
- Keep React components focused, props typed, list keys stable, and data transformations understandable.

## Tests and change checklist

- `src/App.test.tsx` covers user journeys and route interactions.
- `src/content.validation.test.ts` checks content counts, stable relationships, answer lengths, visuals, roadmap stages, and article metadata/source references.
- Add a targeted test for new user-visible behavior and update content invariants when product scope or editorial rules change.
- Run from the `Website` directory:

```powershell
npm test
npm run lint
npm run build
```

- For visual or routing changes, also run the development server and verify the affected route in a browser. Check a narrow viewport when layout changes.
- **Security is part of every coding task:** before completion, inspect the changed code and affected call sites for untrusted input/content, HTML/DOM injection, unsafe URL schemes, missing validation, storage trust assumptions, accidental secret exposure, and unintended data disclosure. Fix issues caused by the change and state any remaining risks.
- If `package.json` or a lockfile changes, run `npm audit` and `npm audit --omit=dev`; review the findings and record the disposition of advisories rather than silently ignoring them.
- For explicit security requests or changes that materially affect security-sensitive behavior, conduct a dedicated security review in addition to this routine change-level check.
- Keep the README, tests, and this guide in sync when a change intentionally alters product scope or conventions.
- Do not edit the original design/editorial prompt files as a side effect of implementation work.
