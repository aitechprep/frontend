# Code style

- Use TypeScript with explicit domain types from `src/types.ts`; do not introduce `any` or unchecked input casts.
- Keep page behavior and domain data in their owning `src/features/<feature>/` module. Keep `src/App.tsx` limited to route composition.
- Use shared UI primitives and route helpers before adding duplicate components or hand-built URLs.
- Keep React components focused, use stable keys, and make effects synchronize with external systems rather than derive ordinary state.
- Keep content as structured data; do not embed large content objects in page markup.
- Use semantic HTML, accessible names, visible focus, and explicit empty/error states.
- Reuse CSS tokens and breakpoints in `src/index.css`; prefer readable `rem` sizes and mobile reflow to shrinking text.
- Avoid unsafe HTML injection. Validate protocols before rendering content-provided external URLs.
- Run `npm run lint`, `npm test`, and `npm run build` before handoff.

See also [`UI-AND-ARCHITECTURE.md`](UI-AND-ARCHITECTURE.md) for detailed design and accessibility conventions.
