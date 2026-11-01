# Tokens

Status: initial set, added with the `Verse` component (2026-11-01). Values carry over the existing look
(white on blue, system font). Revisit after [the point of view](point-of-view.md) is approved.

Source: [`styles/tokens.css`](../styles/tokens.css), imported first in `styles/globals.css`. Components
read tokens with `var(--token)` in their CSS Module; they do not hard-code colours, sizes or spacing.

## Colour

| Token                | Value     | Use                                     |
| -------------------- | --------- | --------------------------------------- |
| `--color-background` | `#1921fe` | Page background                         |
| `--color-text`       | `#ffffff` | All text. On the background: 7.8:1      |
| `--color-rule`       | `#ffffff` | Dividers                                |
| `--color-focus`      | `#ffffff` | Focus outline. On the background: 7.8:1 |

The page uses the same colours in light and dark mode (`color-scheme: dark`).

## Typography

| Token                                                   | Value                     |
| ------------------------------------------------------- | ------------------------- |
| `--font-family-sans`                                    | System font (`system-ui`) |
| `--font-weight-extralight / regular / bold / extrabold` | 200 / 400 / 700 / 800     |
| `--font-size-body / heading`                            | 1rem / 1.25rem            |
| `--line-height-body / heading`                          | 1.5 / 1.4                 |

No web font is loaded: the system font (San Francisco on Apple devices, Segoe UI on Windows, Roboto on
Android) has all four weights. IBM Plex Sans was tried and set aside on 2026-11-01 (Zoha preferred the
system font).

## Space

`--space-1` … `--space-28`, multiples of 0.25rem: 1 = 0.25rem, 2 = 0.5rem, 3 = 0.75rem, 4 = 1rem,
6 = 1.5rem, 8 = 2rem, 10 = 2.5rem, 16 = 4rem, 28 = 7rem.

## Layout

| Token                     | Value | Use                               |
| ------------------------- | ----- | --------------------------------- |
| `--layout-max-width`      | 56rem | Content width                     |
| `--layout-gutter`         | 1rem  | Side padding at every width       |
| `--verse-reference-width` | 4rem  | Verse reference column from 48rem |

**Breakpoint:** `48rem` (768px at default text size). Custom properties do not work inside media queries,
so the value is written in each `@media (min-width: 48rem)` rule. Styles are mobile first: base rules are
for small screens, the media query adds the wide layout.

## Motion

| Token                          | Value                           | Use                                     |
| ------------------------------ | ------------------------------- | --------------------------------------- |
| `--motion-duration-expand`     | 800ms                           | Chapter panel height, open and close    |
| `--motion-duration-expand-max` | 2000ms                          | Longest chapter panel height transition |
| `--motion-duration-fade`       | 650ms                           | Chapter panel content fade              |
| `--motion-easing-soft`         | `cubic-bezier(0.25, 1, 0.5, 1)` | Fast start, long gentle settle          |

Opening a chapter animates only the part that fits on screen, from 0 to the space below its heading, in
`--motion-duration-expand`; the rest appears off screen when the animation ends. A transition to the full
height would spend its gentle settle below the fold, so a long chapter would appear to open at once.

Closing uses `--motion-duration-expand` as the minimum. The accordion multiplies it by a chapter's content
height divided by half the viewport height (`--panel-duration-scale`, never below 1), up to
`--motion-duration-expand-max`, so the part on screen moves at a similar speed whatever the length.

Under `prefers-reduced-motion: reduce` both durations are 0ms.

## Lines

`--border-width-rule` 2px, `--focus-ring-width` 2px, `--focus-ring-offset` 2px.

## Not defined yet

Radius and any second colour.
