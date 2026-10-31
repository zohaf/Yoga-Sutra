# Yoga-Sutra

One-page online edition of the Yoga-Sûtra: four chapters as expandable sections; each verse shows the
English translation, the Sanskrit and a word-by-word glossary. Content comes from Contentful.

Stack: Next.js 16 (pages router), React 19, TypeScript 5 (strict), Yarn 4. Tailwind 3 is still in use and
is removed when the design system (CSS custom properties + CSS Modules) is built.

## Commands

```bash
yarn install         # Yarn 4 only; do not use npm (no package-lock.json)
yarn dev             # http://localhost:3000; needs .env.local (copy .env.example)
yarn build
yarn typecheck
yarn lint            # ESLint: next + jsx-a11y recommended
yarn format          # Prettier write; format:check to verify
```

## Layout

- `pages/` Next.js pages; `pages/index.tsx` fetches content in `getStaticProps`
- `lib/contentful.ts` Contentful client, content-model types, `getChapters()`
- `components/` UI components (`accordion`, `container`, `verseSingle`)
- `styles/globals.css` global styles
- `data.json` sample data from before Contentful; not imported anywhere
- `docs/` project rules and references, indexed in [docs/README.md](docs/README.md)
- `.claude/agents/` `a11y-reviewer` and `code-reviewer` (report only)
- `.claude/hooks/` Prettier after edits, typecheck at Stop

## Docs

Start at [docs/README.md](docs/README.md). The rules live there, not here.
