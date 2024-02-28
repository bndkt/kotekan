# 🥁 Kotekan

> Back to basics.

Supported React rendering strategies:
- [x] CSR
- [x] SSR
- [x] SSG
- [ ] RSC 👷

Major dependencies:
- [Bun](https://bun.sh/)
- [TypeScript](https://www.typescriptlang.org/)
- [Biome](https://biomejs.dev/)
- [React](https://react.dev/)
- [SQLite](https://www.sqlite.org/) (via Bun)

Smaller dependencies:
- [react-error-boundary](https://github.com/bvaughn/react-error-boundary)
- [isbot](https://github.com/omrilotan/isbot)

Goals
- As simple as possible
- As few dependencies as possible

Ideas
- react-strict-dom?


Anti-goals/indicators that things are going into the wrong direction:
- Bundling via esbuild or other tools
- Non-ESM
- Transpiling to JS
- No legacy

