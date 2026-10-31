# Design-system rules

Status: first rules, from building `Verse` (2026-11-01). Extended as components move off Tailwind;
revisit after [the point of view](point-of-view.md) is approved.

## Components

- One folder per component: `components/<name>/index.tsx`, `<Name>.module.css`, `<name>.test.tsx`.
- Styling in the CSS Module, values from [tokens](tokens.md). No Tailwind classes in new or rebuilt
  components (Tailwind remains only in `accordion` and `chapterList` until they are rebuilt).
- Mobile first: base styles for 375px, `@media (min-width: 48rem)` for the wide layout. No fixed minimum
  widths; grid columns use `minmax(0, …)` so text wraps instead of overflowing.
- Props take the data types from `lib/contentful.ts` (for example `verse: Verse`), not one prop per field.
- Server components by default. Add `"use client"` only for state or browser APIs.
- DOM order is reading order. A layout variant that changes which text leads changes the DOM order, not
  only the CSS order.

## Markup

- Page outline: one `h1` (book title), `h2` per chapter, `h3` per verse.
- Sanskrit in IAST: `lang="sa-Latn"`, on the verse and on each glossary term.
- Glossary: `<dl>` with `<dt>` term and `<dd>` meaning; the "=" between them is `aria-hidden`.
- A verse reference is shown as "I.1" and announced as "Chapter 1, verse 1".
- Missing content has a stated empty state; never render empty elements.

## Tests per component

- Unit (Vitest + Testing Library): structure by role, `lang`, empty states, variants.
- End to end (Playwright + axe): the component on the page at 375px and 1280px, with no axe violations
  and no horizontal scroll (also at 640px, which is 1280px at 200% zoom).
