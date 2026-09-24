# STS App

Frontend for the STS (Scholastic Testing System) platform. Built with React 19, TypeScript, Vite, and TanStack Query, structured around feature modules with typed data-access layers.

## Tech stack

| Area           | Choice                                                        |
| -------------- | ------------------------------------------------------------- |
| UI             | React 19, React Compiler                                      |
| Language       | TypeScript (strict, `tsc -b`)                                 |
| Build          | Vite 7 + Tailwind CSS v4                                      |
| Data fetching  | TanStack Query v5 + Axios                                     |
| Forms          | Formik + Zod validation                                       |
| Routing        | React Router v7                                               |
| i18n           | i18next (en / ar)                                             |
| Styling        | Tailwind v4, CVA, tailwind-merge, shadcn-style components     |
| Tests          | Vitest + Testing Library                                      |
| E2E            | Playwright                                                    |
| Error tracking | Sentry (`@sentry/react`, no-op without `VITE_APP_SENTRY_DSN`) |
| PWA / perf     | vite-plugin-pwa (workbox), gzip/brotli compression            |

## Getting started

```bash
npm install
cp .env.example .env   # then edit values if needed
npm run dev
```

Environment variables are validated at startup by a Zod schema in `src/config/env.ts` — invalid or missing values fail fast with a readable error. Available variables:

| Variable                  | Default                 | Description                              |
| ------------------------- | ----------------------- | ---------------------------------------- |
| `VITE_APP_API_URL`        | `http://localhost:3000` | API base URL                             |
| `VITE_APP_PER_PAGE`       | `10`                    | Default pagination size                  |
| `VITE_APP_DEBOUNCE_DELAY` | `300`                   | Search/filter debounce (ms)              |
| `VITE_APP_API_TIMEOUT`    | `15000`                 | Axios request timeout (ms)               |
| `VITE_APP_SENTRY_DSN`     | _(empty)_               | When set, initializes Sentry             |
| `VITE_APP_SOURCE_MAP`     | _(empty)_               | Build-time: emit source maps when `true` |

## Scripts

| Command                                 | Description                                         |
| --------------------------------------- | --------------------------------------------------- |
| `npm run dev`                           | Vite dev server                                     |
| `npm run build`                         | Typecheck + production build                        |
| `npm run preview`                       | Preview the production build                        |
| `npm run typecheck`                     | TypeScript project references check                 |
| `npm run lint`                          | ESLint                                              |
| `npm run format` / `format:check`       | Prettier                                            |
| `npm run check:i18n`                    | Verifies locale files are in sync                   |
| `npm test` / `test:watch`               | Vitest unit/component tests                         |
| `npm run test:e2e`                      | Playwright E2E tests                                |
| `npm run storybook` / `build-storybook` | Component library                                   |
| `npm run validate`                      | Full gate: lint + typecheck + format + i18n + tests |

A Husky `pre-commit` hook runs `lint-staged` (Prettier + ESLint on staged files) followed by `typecheck`, `check:i18n`, and the unit tests. A `commit-msg` hook enforces conventional commits via commitlint.

## Continuous integration

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push to `main`/`dev` and on pull requests: `npm ci` → `npm run validate` → `npm run build` → `npm run test:e2e` (Chromium auto-installed). Playwright artifacts are uploaded on failure.

## Production build extras

- A **CSP meta tag** (self-hosted scripts/styles, API origin `connect-src`) and a **preconnect hint** to the API origin are injected into the built HTML by a Vite plugin; they reflect `VITE_APP_API_URL` at build time.
- **Source maps** can be emitted with `VITE_APP_SOURCE_MAP=true`.
- Assets are emitted with `.gz` and `.br` variants for the web server to serve.
- A **PWA service worker** (precaches the app shell, registerType `autoUpdate`) is registered from `src/main.tsx`.

## Project structure

```
src/
├── app/                 # App-level wiring: router, navigation
├── components/          # App layout & shared route-level components
├── config/              # Validated environment config
├── constants/           # Shared domain constants (statuses, roles, ...)
├── contexts/            # Auth / theme / language providers
├── features/            # One folder per domain feature (see below)
├── hooks/               # App-level hooks (interceptors, localStorage, ...)
├── i18n/                # Locale resources (en / ar)
├── lib/                 # HTTP client & TanStack Query infrastructure
├── shared/              # Framework-agnostic reusable pieces
│   ├── components/      #   UI primitives + rich custom components
│   ├── dtos/            #   Shared DTOs
│   ├── hooks/           #   Reusable hooks
│   ├── stores/          #   External-store state (table density)
│   ├── types/           #   Global type augmentation
│   └── utils/           #   Pure helpers
├── test/                # Global test setup
├── types/               # Ambient declarations
└── utils/               # App-level utilities
```

### Feature-module convention

Each feature in `src/features/*` is self-contained and follows the same layout:

```
features/tests/
├── api/                 # Axios calls + TanStack Query options/hooks
├── components/          # Feature-specific components
├── dtos/                # Request/response DTOs (instantiated to normalize)
├── hooks/               # Feature hooks (table state, etc.)
├── pages/               # Route components
├── schemas/             # Zod validation schemas
├── tests.api-keys.ts    # Centralized query-key tree
├── tests.paths.ts       # Route paths
└── tests.router.tsx     # Lazy-loaded routes (with clientLoaders)
```

### Data-access patterns

- **Query keys** are centralized per feature (`tests.api-keys.ts`) so list/`byId`/infinite queries stay consistent and invalidations are trivial.
- **API modules** export a plain async function (`getTests`), the option builders (`getTestsQueryOptions`), and typed hooks (`useTests`) using `QueryConfig`/`InfiniteQueryConfig` from `src/lib/react-query.ts`.
- **DTOs** are classes that normalize server payloads in their constructor; pages build them from query params so the shape reaching the API layer is always well-defined.
- **Authentication** — the Axios instance in `src/lib/api.ts` sets the bearer token from `localStorage` at module init (so a stored session survives a cold start) and via `setAuthToken` on login/logout. Note: because the header is read once at module initialization, a token written to storage _after_ the module loads without a `setAuthToken` call will not be picked up — always go through the auth providers.

### Shared table

`src/shared/components/custom/table` is a fully typed, configurable data-table: sorting, selection, column hiding/ordering/pinning, density presets, a filter board, infinite-scroll or paginated footers, and TSV/CSV export. It is generic over `TableRowRecord` and drives most list pages.

## Testing

- **Vitest** runs unit and component tests (`src/**/*.{test,spec}.{ts,tsx}`) in a jsdom environment. The suite (100+ files) runs fast via the `vmThreads` pool.
- **Storybook** documents the shared components (`src/shared/components/**/*.stories.tsx`) with `addon-a11y` (axe checks per story), built-in viewport presets, and interaction tests via `storybook/test`.
- **Playwright** covers the auth, home, and 404 flows in `e2e/`. Browsers aren't bundled with npm — install once with `npx playwright install chromium`.

```bash
npm run validate   # full local gate
npm run test:e2e   # requires the dev server (the Playwright config starts it automatically)
```
