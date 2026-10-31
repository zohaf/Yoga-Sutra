# Tokens

Status: initial set, added with the `Verse` component (2026-11-01). Values carry over the existing look
(white on blue, IBM Plex Sans). Revisit after [the point of view](point-of-view.md) is approved.

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

| Token                                  | Value                      |
| -------------------------------------- | -------------------------- |
| `--font-family-sans`                   | IBM Plex Sans, then system |
| `--font-weight-light / regular / bold` | 300 / 400 / 700            |
| `--font-size-body / heading`           | 1rem / 1.25rem             |
| `--line-height-body / heading`         | 1.5 / 1.4                  |

Only weights 300, 400 and 700 are loaded (`app/layout.tsx`). Use no other weight.

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

## Lines

`--border-width-rule` 2px, `--focus-ring-width` 2px, `--focus-ring-offset` 2px.

## Not defined yet

Motion (duration, easing), radius, and any second colour.
