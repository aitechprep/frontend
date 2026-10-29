# Security notes

## Current application boundaries

- This is a static client application with no application backend, authentication, payment processing, or server-side personal-data store.
- Saved question IDs are stored in browser `localStorage`; treat this value as untrusted and non-sensitive. Keep the existing key until an explicit, safe migration is designed.
- Article source URLs are checked to permit only `http:` or `https:` before rendering as external links. External tabs use `noopener noreferrer`.
- Do not render untrusted content as HTML or expose credentials in client-side environment variables. Any `VITE_*` value is public after bundling.
- The site currently includes a Microsoft Clarity tracking snippet in `index.html`. Maintain a truthful privacy disclosure, review applicable consent requirements, and re-check the configured tracking behavior before public launch.

## Contributor security checklist

For each change, inspect untrusted content and URLs, DOM/HTML rendering, validation boundaries, browser-storage assumptions, secrets, and unintended data exposure. Review hosting security headers and deployment configuration separately; static front-end review cannot establish those controls.

If dependency manifests or lockfiles change, run `npm audit` and `npm audit --omit=dev`. For a requested security review or materially security-sensitive change, follow the repository's dedicated review procedure rather than relying only on this checklist.
