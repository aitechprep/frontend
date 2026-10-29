# AITechPrep contributor guidance

Before changing the product, read [`docs/UI-AND-ARCHITECTURE.md`](docs/UI-AND-ARCHITECTURE.md). It documents the current visual system, UX patterns, application structure, content contracts, and validation commands. Treat the existing implementation as the source of truth; extend its patterns rather than introducing a competing design or architecture.

## Required practices

- Keep changes focused. Do not redesign unrelated pages or add libraries, backend services, authentication, or new product scope without an explicit request.
- Use React, TypeScript, React Router, and the existing plain-CSS design system. Reuse existing page components, patterns, tokens, and helpers.
- Keep question, roadmap, and article data typed in `src/content.ts` and models in `src/types.ts`. Preserve stable slugs, relationships, and the current MVP content limits unless asked to change them.
- Make navigation, search, filters, saved states, and other controls genuinely functional. Include accessible labels, keyboard behavior, useful empty/error states, and mobile layouts.
- Keep the AITechPrep wordmark consistent: **AI** blue and **TechPrep** dark navy/black. Avoid reintroducing ModelPrep in user-visible UI.
- Preserve `modelprep:savedQuestions:v1` unless a deliberate migration is implemented; users may already have bookmarks under this key.
- Add or update focused tests for behavior or content changes. Run `npm test`, `npm run lint`, and `npm run build` for code changes, and report any check that could not be run.
- **Include a security pass in every coding task before calling it complete.** Review the changed code and its affected call sites for trust boundaries, unsafe HTML/DOM use, URL handling, input validation, storage assumptions, exposed secrets, and unintended data disclosure. Fix any issue introduced by the change; report unresolved risks explicitly.
- When dependencies or lockfiles change, run `npm audit` (use `npm audit --omit=dev` as a production-focused check too), review the advisories, and do not dismiss findings without recording why they are not applicable or how they were addressed.
- For security-focused requests or changes that materially affect security-sensitive behavior, perform a dedicated security review rather than relying only on the routine change-level pass.
- Do not claim that news, citations, sources, trademark status, or external facts are verified unless they have been checked. News content must be dated and linked to its sources.
