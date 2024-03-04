# 🥁 Kotekan

> Back to basics.

A minimal React framework based on the [Bun](https://bun.sh/) runtime, with built-in support for [React Server Components (RSC)](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components), [react-strict-dom](https://github.com/facebook/react-strict-dom), and [StyleX](https://stylexjs.com/).

> [!CAUTION]
> Kotekan is in super early development. I appreciate if you try it out and provide feedback. But please, don't use it in production (yet).

## Features
- [x] CSR
- [x] SSR
- [x] Streaming
- [x] Server components
- [ ] Client components
- [ ] Server actions
- [x] MDX
- [x] StyleX
- [ ] Tailwind CSS (waiting for v4)
- [ ] HMR/Fast Refresh

## Supported React rendering strategies:
- [x] CSR
- [x] SSR
- [ ] RSC 👷
- [ ] SSG

## Major dependencies:
- [Bun](https://bun.sh/)
- [TypeScript](https://www.typescriptlang.org/)
- [Biome](https://biomejs.dev/)
- [React](https://react.dev/)
- [StyleX](https://stylexjs.com/)

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

