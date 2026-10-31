# Audit: what falls outside a pattern (2026-11-01)

State of `app/`, `components/` and `styles/` on branch `app-router-and-tests`, measured against the agreed
direction: mobile first, tokens as CSS custom properties, CSS Modules, one component per repeated unit,
WCAG 2.2 AA. Nothing here has been changed yet unless marked **fixed**.

## Resolved since (Verse component, 2026-11-01)

The findings below are a snapshot. Building `components/verse` resolved:

- Tokens in `styles/tokens.css`; all components use CSS Modules.
- Reflow at 640–830px and the full-width layout at 1280px (`Container` is now max-width + gutter).
- Font: the system font is kept by choice (IBM Plex Sans was tried and set aside); the font package is
  removed.
- Accordion: CSS Module, no `displayName` child lookup, softer open/close transition on motion tokens
  (auto-animate removed).
- Heading outline (visually hidden `h1`, chapter `h2`, verse `h3`), `<main>`, `lang="sa-Latn"`, glossary
  as `<dl>`, verse reference announced as "Chapter 1, verse 1", visible focus outline, page description.
- `tailwind.config.js` scans `app/`.

Still open: focus jump when one chapter closes above another (section 8), removing Tailwind, content
(section 7).

## Where the project stands

| Decision                       | Status                                                                                                                                                    |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Point of view                  | Not written yet (`docs/point-of-view.md` does not exist). Zoha's input is in the notes.                                                                   |
| Mobile first                   | Not started as a practice. Tailwind breakpoints are min-width, but no layout was designed at 375px first.                                                 |
| Tokens (CSS custom properties) | Not started. Five ad hoc variables in `globals.css`; three are unused.                                                                                    |
| CSS Modules                    | Not started. All styling is Tailwind utility classes.                                                                                                     |
| Components                     | The three 2022 components (`accordion`, `container`, `verseSingle`) plus `chapterList` from the App Router move. No component was built to a pattern yet. |
| Accessibility testing          | In place: jsx-a11y lint, component tests, Playwright + axe at 375px and 1280px.                                                                           |

## Findings

### 1. Styling has no system

- **Three sources of values.** Tailwind scale classes (`gap-4`, `mb-10`, `mt-28`, `text-xl`), arbitrary
  values (`h-[2px]`, `sm:min-w-[480px]`, `sm:min-w-[240px]`), and CSS variables in `styles/globals.css`.
  No value comes from a token.
- **Unused variables.** `--black-color`, `--grey-color`, `--screen-xs`, `--screen-sm` are defined and never
  read. `--screen-*` cannot work anyway: custom properties are not allowed in media queries.
- **Colour.** One colour pair (white on `#1921fe`, 7.8:1). **Fixed** on this branch: text was white only in
  dark mode; light mode showed black on blue at 2.69:1.

### 2. Layout is not mobile first

- `components/container`: `min-w-fit` overrides `max-w-4xl`, so at 1280px an open chapter spans the full
  window with no side margin. Side margin is `mx-3` (12px) on mobile, then `mx-auto` from 640px.
- `components/verseSingle`: fixed minimum widths (`sm:min-w-[480px]`, `sm:min-w-[240px]`) decide the
  desktop columns instead of a grid; spacing jumps at two different breakpoints (`sm:flex-row`,
  `md:gap-10`).
- **Reflow fails between 640px and about 830px** (WCAG 1.4.10, serious). With a chapter open the page
  scrolls sideways: 160px at 640px, 100px at 700px, 24px at 800px, none at 320px or 900px (measured with
  Playwright). 640px is a 1280px window at 200% zoom. Cause: the two fixed minimum widths above plus
  `min-w-fit`. Recorded as an expected-failure e2e test.
- Chapter titles are right-aligned through an empty `<div />` and `justify-between` (now `justify-end`).

### 3. Typography

- `font-family` lists `system-ui` before `"IBM Plex Sans"`, so the system font is used on every platform
  and IBM Plex Sans is downloaded but never shown.
- Only weight 400 of IBM Plex Sans is loaded (`@fontsource/ibm-plex-sans` default), while the components
  use `font-extralight` (200), `font-bold` (700) and `font-extrabold` (800). If Plex were shown, those
  weights would be synthesised by the browser.
- No type scale: sizes are browser defaults plus one `text-xl`.

### 4. Semantics

- Every text element of a verse is an `<h1>` (verse number, English, Sanskrit), and chapter titles are
  `<h1>` too. The page has no title heading. A screen reader's heading list shows about 60 `h1`s.
- Sanskrit has no `lang` attribute (should be `lang="sa-Latn"` for IAST).
- The glossary is an `<ol>` of strings like `atha = now`; term and meaning are not separate.
- The chapter separator is a `<div>` styled as a 2px bar.
- The verse number label is built from a four-item numeral array in the component (`I`–`IV`).
- `<meta name="description">` is the string `yogaSutra`.

### 5. Component structure

- `Accordion` finds its `Header` and `Body` children by `displayName`. This breaks silently if a child is
  wrapped or memoised, and it is a client component only because of `useAutoAnimate`.
- Open/close state lives in `ChapterList` as an index; only one chapter can be open. Whether several can
  be open is a reading-flow decision.
- Prop names differ from the data: `verseEnglish` / `english`, `verseSanskrit` / `sanskrit`,
  `sanskritWords` / glossary.
- Naming is mixed: folder `verseSingle`, component `VerseSingle`, `Container` with a typo'd props type
  (`ContainerPropps`).

### 6. Motion

- `@formkit/auto-animate` animates every chapter open/close. It turns itself off under
  `prefers-reduced-motion: reduce` (checked in its source), so 2.3.3 passes. The motion is generic and not
  defined by any token (duration, easing).

### 7. Content (Contentful)

- 21 verse entries: chapter 1 has 3 verses, chapter 2 has 15 linked (16 exist), chapters 3 and 4 have one
  verse each with only a number.
- Only chapter 1 has Sanskrit and a glossary.
- The romanisation is inconsistent with IAST in places, for example `vrtti` (IAST `vṛtti`), `nirodhah` and
  `nirodhaï` (`nirodhaḥ`), `drastuh` (`draṣṭuḥ`), `tadâ` (`tadā`). To check against the source edition.
- Several glossary strings end with a trailing space.
- The glossary uses base forms (`yoga`, `nirodha`) while the verse has surface forms (`yogaś`,
  `nirodhaḥ`), so a meaning cannot be attached to a word of the verse from the current data. See
  `docs/research/translation-presentation.md` (research branch), section 0.

### 8. Accessibility review

From the `a11y-reviewer` agent (code reading) plus the axe tests. Items already listed above are not
repeated.

- **Serious, 1.3.1 / 2.4.6**: heading outline (section 4).
- **Serious, 1.4.10 / 1.4.4**: reflow at 640–830px (section 2).
- **Moderate, 3.1.2**: no `lang="sa-Latn"` on Sanskrit or glossary terms.
- **Moderate, 1.3.1**: glossary term and meaning not separated (`<dl>` needed).
- **Moderate, 2.4.7 / 1.4.11**: no focus style; the browser default ring can be near invisible on
  `#1921fe` in Safari and Firefox. A white 2px outline is 7.8:1.
- **Moderate, 1.3.1 / 2.4.1**: no `<main>` landmark.
- **Minor, 2.4.3**: opening a chapter below an open one closes the one above, so the focused button jumps
  up and can leave the viewport.
- **Minor**: "I. 1" is read as "I one"; with no chapter number it renders ". 1".
- `tailwind.config.js` does not scan `app/`, so Tailwind classes in `app/` get no CSS.
- **Passes**: contrast (7.8:1), reduced motion, target size (about 44px tall), accordion ARIA, keyboard
  operation, `<html lang="en">`, page title.
- **Still to test by hand**: focus ring in Safari and Firefox; how VoiceOver and NVDA read IAST under
  `lang="sa-Latn"`; 200% and 400% zoom; legibility of the 200 weight on blue.

## Proposed verse pattern

One verse is the unit everything else is built around. The pattern below fixes structure, data and
behaviour; visual layout (A: English first, or B: Sanskrit first) stays a variant decided after
prototyping.

**Data** (`lib/contentful.ts` maps Contentful to this):

```ts
type GlossaryEntry = { term: string; meaning: string }; // parsed from "atha = now"
type Verse = {
  id: string;
  reference: { chapter: number; verse: number }; // shown as "1.1" or "I.1"
  english: string | null;
  sanskrit: string | null; // IAST
  glossary: GlossaryEntry[];
};
```

**Markup** (same DOM order in every layout, so reading order is stable):

```html
<article aria-labelledby="v-1-1">
  <h3 id="v-1-1">I.1</h3>
  <p>Now, the teachings of yoga.</p>
  <p lang="sa-Latn">atha yogānuśāsanam</p>
  <dl>
    <dt lang="sa-Latn">atha</dt>
    <dd>now</dd>
  </dl>
</article>
```

Page outline: `h1` book title, `h2` chapter (button inside), `h3` verse reference.

**Component:** `components/Verse/Verse.tsx` + `Verse.module.css`; props `verse` and `layout`
(`"english-first" | "sanskrit-first"`). Server component (no state), so it adds no client JavaScript.
Missing English, Sanskrit or glossary each have a defined empty state.

**Tests:** unit tests for parsing and empty states; e2e checks that every verse has a heading, Sanskrit
has `lang="sa-Latn"`, and axe passes at 375px and 1280px.

**Order of work:** tokens for colour, type and space first (a minimal set), then `Verse` at 375px, then
the 1280px layout, then the chapter disclosure on the same tokens.
