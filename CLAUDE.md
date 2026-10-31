# Yoga-Sutra

One-page online edition of the Yoga-Sûtra: four chapters as expandable sections; each verse shows the
English translation, the Sanskrit and a word-by-word glossary. Content comes from Contentful.

Stack: Next.js 16 (App Router), React 19, TypeScript 5 (strict), Yarn 4. Components use CSS Modules and tokens;
Tailwind 3 is still installed but no component uses it.

## Commands

```bash
yarn install         # Yarn 4 only; do not use npm (no package-lock.json)
yarn dev             # http://localhost:3000; needs .env.local (copy .env.example)
yarn build
yarn typecheck
yarn lint            # ESLint: next + jsx-a11y recommended
yarn format          # Prettier write; format:check to verify
yarn test            # Vitest + Testing Library (components)
yarn test:e2e        # Playwright + axe at 375px and 1280px; builds the app, port 3217
```

## Layout

- `app/` App Router: `layout.tsx` (html, metadata), `page.tsx` (server component, fetches content at build time)
- `lib/contentful.ts` Contentful client, content-model types, `getChapters()`
- `components/` UI components: `verse` (the verse pattern), `container`, `accordion` and `chapterList` (client)
- `styles/tokens.css` design tokens; `styles/globals.css` base styles
- `styles/globals.css` global styles
- `data.json` sample data from before Contentful; not imported anywhere
- `test/` Vitest setup and fixtures; `e2e/` Playwright specs
- `docs/` project rules and references, indexed in [docs/README.md](docs/README.md)
- `.claude/agents/` `a11y-reviewer` and `code-reviewer` (report only)
- `.claude/hooks/` Prettier after edits, typecheck at Stop

## Docs

Start at [docs/README.md](docs/README.md). The rules live there, not here.
