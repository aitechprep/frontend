# Copilot instructions

For all changes in this repository, first follow [`AGENTS.md`](../AGENTS.md) and the detailed [`docs/UI-AND-ARCHITECTURE.md`](../docs/UI-AND-ARCHITECTURE.md). Keep the established AITechPrep visual language, responsive UX, React/TypeScript architecture, typed content models, and accessibility conventions. Reuse existing components and CSS tokens; avoid unrelated redesigns and new dependencies. Preserve saved-question data compatibility.

**Make a security pass part of every coding task:** before declaring work complete, review the changed code and affected call sites for unsafe input/HTML/URL handling, trust-boundary mistakes, storage assumptions, exposed secrets, and data leakage; fix introduced issues or report unresolved risks. When dependency manifests or lockfiles change, run and review `npm audit` (including `npm audit --omit=dev`). Use a dedicated security review for security-focused work or changes that materially affect security-sensitive behavior.

After code changes, run the focused tests plus `npm run lint` and `npm run build`.
