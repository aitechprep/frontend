# AITechPrep design system

The canonical token values, typography scale, layouts, breakpoints, and interface patterns live in [`UI-AND-ARCHITECTURE.md`](UI-AND-ARCHITECTURE.md) and `src/index.css`. This short guide identifies the source of truth rather than duplicating CSS values.

## Brand and UI

- Brand wordmark: blue **AI** and dark **TechPrep**.
- Visual direction: calm, light reading surfaces; navy text; restrained blue emphasis; thin cool borders; consistent rounded cards and controls.
- Fonts: DM Sans for body text and Manrope for headings, with system fallbacks.
- Reuse the shared `PageIntro`, breadcrumbs, buttons, cards, badges, callouts, diagrams, and empty states.

## Accessibility and responsive layout

- Long-form copy is at least 16px with comfortable line spacing; supporting explanations are generally at least 14px.
- Preserve visible keyboard focus, semantic controls, descriptive links, reduced-motion support, readable contrast, and text alternatives for visuals.
- Breakpoints are 900px, 700px, and 380px. Support 320px-wide screens without page-level horizontal overflow.

Make intentional changes in `src/index.css`, then update `UI-AND-ARCHITECTURE.md` and verify desktop plus narrow mobile routes.
