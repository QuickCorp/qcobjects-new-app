# QCObjects New App

Front-end PWA built with the QCObjects framework. TypeScript source in `src/ts/` compiles to `build/js/`, then final publish output is `public/`.

## Commands

| Action | Command |
|--------|---------|
| Install | `npm install` |
| Dev server (watch) | `npm run start:dev` |
| Dev server | `npm run serve` |
| Full build | `npm run build` (alias publish:web) |
| Lint | `npm run lint` (ESLint, max 4 warnings) |
| Test (lint + jasmine) | `npm run test` |
| Single test runner | `npm run test:jasmine` |
| Type-check (noEmit) | `npx tsc --project tsconfig.jasmine.json` |
| Coverage | `npm run coverage` (nyc + jasmine) |
| Generate types | `npm run build:ts-types` (tsconfig.d.json) |

## Test

Jasmine specs live in `spec/**/*[sS]pec.ts`. Run via:
```
npm run test:jasmine
```
Or full suite (lint + jasmine): `npm run test`.

Helpers go in `spec/helpers/**/*.helper.ts`. Enable verbose logging in tests with `logger.debugEnabled=true`.

## Build pipeline

`npm run publish:web` runs sequentially:
1. `build:static` — copy `src/` → `build/`
2. `build:ts` — coverage + tsc (`src/ts/` → `build/js/`)
3. `publish:static` — copy `build/` → `public/` + minify CSS
4. `publish:esbuild` — esbuild bundle from `build/js/` → `public/js/`
5. `generate-sw` — service worker

## Config

- `config.json` has highest priority, otherwise `config.yaml`/`config.yml`. YAML overrides JSON if both exist.
- Env vars loaded from `.env`, referenced in config via `$ENV(VARNAME)`.
- Settings also set at runtime in `src/ts/config.ts` via `CONFIG.set()`.

## Git workflow

Topic branches from `development`, PR into `development`, release PR to `main`. See `.opencode/instructions/git-workflow.md` (no rebase, SemVer tags).

## Project structure

```
src/ts/          → TypeScript source (entry: init.ts)
src/             → frontend assets (HTML, CSS, images, templates)
backend/         → backend app.js
build/           → tsc output (compiled JS)
public/          → final deployable output (Netlify, docker, etc.)
spec/            → Jasmine tests
```

## Deployment

- **Netlify**: `npm run build:netlify` (publishes `public/`). See `netlify.toml`.
- **Docker**: `docker build -t qcobjects/qcobjects-newapp .` (serves on ports 8080/8443).
- **Docker compose**: `docker-compose up`.

## Dependencies

Requires Node >=22, npm >=10. Three key peer/dev deps (`qcobjects`, `qcobjects-cli`, `qcobjects-sdk`) are local file references — verify they exist at expected sibling paths before `npm install`.
