# 🥁 Kotekan

> Back to basics.

## Supported React rendering strategies:
- [x] CSR
- [x] SSR
- [x] SSG
- [ ] RSC 👷

## Major dependencies:
- [Bun](https://bun.sh/)
- [TypeScript](https://www.typescriptlang.org/)
- [Biome](https://biomejs.dev/)
- [React](https://react.dev/)
- [StyleX](https://stylexjs.com/)
- [SQLite](https://www.sqlite.org/) (via Bun)

## Smaller dependencies:
- [react-error-boundary](https://github.com/bvaughn/react-error-boundary)
- [isbot](https://github.com/omrilotan/isbot)

## Goals
- As simple as possible
- As few dependencies as possible

## Ideas
- [x] react-strict-dom

## Major missing pieces
- [ ] [Bundle splitting](https://github.com/bndkt/kotekan/issues/7)
- [ ] [Generate CSS file for StyleX](https://github.com/bndkt/kotekan/issues/2) (currently working via debug-mode)
- [ ] [RSC](https://github.com/bndkt/kotekan/issues/9)
- [ ] [Fast Refresh/HMR](https://github.com/bndkt/kotekan/issues/4)
- [ ] [Remove last Babel transpilations](https://github.com/bndkt/kotekan/issues/10)

Anti-goals/indicators that things are going into the wrong direction:
- Bundling via esbuild or other tools
- Non-ESM
- Transpiling to JS
- No legacy

