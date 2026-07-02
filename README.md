# Auction Prototype

A React + Vite prototype of an airline upgrade auction experience.

It includes:
- Admin dashboard for auction operations
- Flight list and flight-level bid management
- Global auction rules configuration
- Email template previews (invite, reminder, confirmation)
- Passenger-side bidding flow mockup
- Auto-discovered Entities page (every seeded DB table is rendered)

The codebase is a pnpm monorepo split into seven packages:
- **`@auction/core`** — shared types, color tokens, and pure domain helpers
- **`@auction/api-contracts`** — pure type surface for the admin and passenger APIs (`/admin` and `/passenger` subpath exports) plus Zod schemas at `/schemas` (no runtime code besides the schemas themselves)
- **`@auction/backend`** — in-memory mock backend (services, DB emulator, seed data) — implements the contracts
- **`@auction/server`** — NestJS HTTP server exposing the backend under `/api/*`
- **`@auction/web-shared`** — UI primitives, theme, locale, layout helpers, query hooks and fetch client shared between the two apps
- **`@auction/web-admin`** — Vite + React SPA for airline operators (flight list, bid moderation, rules, email previews, entities inspector)
- **`@auction/web-passenger`** — Vite + React SPA for the passenger bidding flow

The apps talk to the server over HTTP (via a Vite dev proxy in development,
`VITE_API_TARGET` in production). Data storage is still fully mocked in-memory
inside `@auction/backend`; the contract surface stays the same when the mock is
replaced with a real store.

## Tech Stack

- pnpm workspaces monorepo (`packages/*`)
- React 19 + Vite 8 (web)
- NestJS 11 + Express (HTTP server)
- TypeScript 6 (strict, `verbatimModuleSyntax`, `noUncheckedIndexedAccess`)
- Tailwind CSS 4 + shadcn/ui
- TanStack Query 5
- Biome 2
- Vitest 4
- simple-git-hooks + gitleaks checks

## Getting Started

### 0. Ensure pnpm version (recommended in Codespaces)

This project is pinned to `pnpm@11.4.0` via `packageManager` in `package.json`.

```bash
corepack enable
corepack prepare pnpm@11.4.0 --activate
pnpm -v
```

### 1. Install dependencies

```bash
pnpm install
```

### 2. Run the API server and the web apps

Three concurrent processes in dev — API, admin app, passenger app:

```bash
pnpm dev:api          # NestJS on http://localhost:3000 (/api/* routes)
pnpm dev              # web-admin on http://localhost:5173  (proxies /api -> :3000)
pnpm dev:passenger    # web-passenger on http://localhost:5174 (proxies /api -> :3000)
```

Each command runs in its own terminal.

## Available Scripts

Root scripts orchestrate the whole workspace:

```bash
pnpm dev              # start web-admin dev server (Vite)
pnpm dev:passenger    # start web-passenger dev server (Vite)
pnpm dev:api          # start API dev server (NestJS, tsx watch)
pnpm build            # production build of both web apps
pnpm preview          # preview production web-admin build locally
pnpm format           # format code with Biome
pnpm lint             # lint with warnings treated as errors
pnpm typecheck        # tsc -b (composite project references, all packages)
pnpm typecheck:tests  # flat tsc --noEmit including test files
pnpm test             # vitest run
```

Project check scripts in repo root:

```bash
bash check.sh       # format + lint + typecheck + tests
bash health.sh      # gitleaks + outdated deps + audit + Trivy image scan
bash all-checks.sh  # runs both scripts
bash compose/scan.sh # build + Trivy-scan the server image (--all also scans base images)
```

`health.sh` runs a Trivy scan of the production server image and **fails if
`trivy` is not installed**. Install it once (not into the repo):

```bash
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh \
  | sudo sh -s -- -b /usr/local/bin
```

Because the pre-commit hook runs `all-checks.sh`, each commit builds the Docker
image and scans it. Use `SKIP_SIMPLE_GIT_HOOKS=1 git commit …` to bypass in a
pinch.

## Project Structure

```text
.
├── packages/
│   ├── core/                          # @auction/core — shared types + pure domain helpers
│   │   └── src/
│   │       ├── types.ts               # cross-package type definitions
│   │       ├── colorTokens.ts         # ColorTokenId union
│   │       ├── domain/weighted.ts     # bid weighted-score formula
│   │       └── index.ts               # public surface
│   │
│   ├── api-contracts/                 # @auction/api-contracts — pure HTTP API surface
│   │   └── src/
│   │       ├── services/<name>.ts     # one file per resource service type
│   │       ├── schemas/               # Zod runtime schemas (subpath export)
│   │       ├── admin.ts               # AdminBackendClient + admin-only types
│   │       ├── passenger.ts           # PassengerBackendClient + passenger types
│   │       └── index.ts               # barrel
│   │
│   ├── backend/                       # @auction/backend — in-memory mock backend
│   │   ├── src/
│   │   │   ├── index.ts               # exports adminBackend, passengerBackend,
│   │   │   │                          #   createBackend, createServiceClient
│   │   │   ├── data/<entity>.ts       # per-entity seed data (one file per table)
│   │   │   └── backend/
│   │   │       ├── contracts.ts       # combined BackendClient (re-exports api-contracts)
│   │   │       ├── client.ts          # composition root: adminBackend + passengerBackend
│   │   │       ├── serviceClient.ts   # builds db and both clients
│   │   │       ├── admin/             # admin client composition
│   │   │       ├── passenger/         # passenger client composition
│   │   │       ├── db/                # generic DB emulator + contracts
│   │   │       └── services/<entity>/ # per-entity service.ts + utils.ts
│   │   └── tests/                     # backend service + DB emulator suites
│   │
│   ├── server/                        # @auction/server — NestJS HTTP server
│   │   ├── src/
│   │   │   ├── main.ts                # bootstrap, listens on :3000
│   │   │   ├── app.module.ts          # root Nest module
│   │   │   ├── backend/instance.ts    # singleton createBackend() instance
│   │   │   ├── pipes/zodValidation.ts # request body validation via Zod
│   │   │   ├── admin/                 # AdminController — /api/admin/*
│   │   │   └── passenger/             # PassengerController — /api/passenger/*
│   │   └── tsconfig.json              # decorator-enabled TS config
│   │
│   ├── web-shared/                    # @auction/web-shared — shared UI + low-level client
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.ts               # public surface
│   │       ├── index.css              # global styles (imported by each app)
│   │       ├── theme.ts               # semantic design tokens
│   │       ├── i18n.ts                # SHARED_I18N slice (flightTime + seatMap)
│   │       ├── locale.tsx             # LocaleProvider + shared useLocale hook
│   │       ├── api/client.ts          # neutral getJson/postJson/putJson/idsQuery
│   │       ├── primitives/            # Pill, MetricCard, BarChart, SeatMap, ...
│   │       ├── components/ui/         # shadcn/ui components
│   │       ├── domain/                # color token resolver, channel icon map
│   │       ├── format/                # display formatters
│   │       └── lib/                   # framework-agnostic utilities
│   │
│   ├── web-admin/                     # @auction/web-admin — operator SPA
│   │   ├── index.html
│   │   ├── vite.config.ts             # proxies /api -> :3000 in dev
│   │   ├── vercel.json                # per-app Vercel build config
│   │   ├── components.json            # shadcn config
│   │   ├── public/                    # static assets (favicons)
│   │   └── src/
│   │       ├── main.tsx               # React entry point
│   │       ├── App.tsx                # routing + admin shell
│   │       ├── i18n.ts                # ADMIN_I18N dictionary
│   │       ├── locale.ts              # admin useLocale wrapper
│   │       ├── api/backend.ts         # adminBackend fetch client (/api/admin/*)
│   │       ├── queries/               # admin-only TanStack Query hooks + keys
│   │       ├── pages/                 # FlightList, FlightDetail, GlobalRules,
│   │       │                          #   EmailPreview, EntitiesPage, AdminShell
│   │       └── tests/                 # smoke tests
│   │
│   └── web-passenger/                 # @auction/web-passenger — passenger SPA (public)
│       ├── index.html
│       ├── vite.config.ts
│       ├── vercel.json
│       ├── public/
│       └── src/
│           ├── main.tsx
│           ├── App.tsx                # single-page shell
│           ├── i18n.ts                # PASSENGER_I18N dictionary
│           ├── locale.ts              # passenger useLocale wrapper
│           ├── api/backend.ts         # passengerBackend fetch client (/api/passenger/*)
│           ├── queries/               # passenger-only hooks + keys
│           └── pages/PassengerBidUI.tsx
│
├── package.json                       # root — shared devDeps + orchestrating scripts
├── pnpm-workspace.yaml                # packages, allowBuilds, overrides
├── tsconfig.base.json                 # shared strict TS options
├── tsconfig.json                      # root project references (composite build)
├── tsconfig.check.json                # flat typecheck including tests
├── vitest.config.ts                   # runs packages/*/tests + packages/*/src
├── biome.json                         # Biome config (format + lint)
├── check.sh                           # quality checks
├── health.sh                          # security/dependency checks
└── all-checks.sh                      # runs both
```

## Architecture Notes

### Package Boundaries
- `@auction/core` is the shared vocabulary (types, color token union, pure helpers)
  and depends on no other workspace package
- `@auction/api-contracts` defines the HTTP-facing surface as pure TypeScript
  types: two subpath exports (`/admin`, `/passenger`) so each frontend imports
  only the contract it needs, plus a `/schemas` subpath with Zod schemas.
  Depends only on `@auction/core`.
- `@auction/backend` owns all data and business logic — services, DB emulator,
  seed data, admin/passenger clients — and satisfies the contracts. Depends on
  `@auction/core` + `@auction/api-contracts`
- `@auction/server` is a thin NestJS transport that wraps a singleton
  `createBackend()` from `@auction/backend` behind REST controllers
- `@auction/web-shared` holds only genuinely shared code: UI primitives, theme,
  the locale mechanism, shared i18n slice, and a **neutral** low-level HTTP
  client (`api/client.ts` — `getJson`/`postJson`/`putJson`/`idsQuery`). It knows
  nothing about admin or passenger endpoints.
- `@auction/web-admin` and `@auction/web-passenger` each own their own fetch
  client (`api/backend.ts`), query hooks, i18n dictionary and pages. They never
  import `@auction/backend`; they talk to the server over HTTP. This keeps a
  real network boundary between UI and data.

### Web bundle isolation (public passenger app)
The passenger app is intended to be publicly deployed, so **nothing about the
admin surface may appear in its bundle** — no admin routes, HTTP methods,
contract shapes, or admin i18n. This is enforced structurally, not by
convention:
- admin-only fetch client, query hooks, query keys and i18n live in
  `packages/web-admin`; passenger equivalents live in `packages/web-passenger`.
  Neither app can import the other's runtime code.
- `web-shared` contains no endpoint strings — only the neutral request helpers
  and truly shared UI. The `SeatMap` primitive is presentational (data passed
  in as a prop), so it carries no query/endpoint dependency.
- the seat-map capability, used only by admin, lives entirely on the `/admin`
  surface; the passenger API and bundle contain no seat-map code.
- verification: building `@auction/web-passenger` and grepping the bundle for
  `/admin/`, `flights/query`, `globalRules`, `Auction Admin`, etc. yields zero
  matches.
- Cross-package imports resolve source-first via pnpm workspace symlinks and
  each package's `main`/`types` field pointing at `./src/index.ts`. TypeScript
  is configured with composite project references (`tsc -b`) so cross-package
  types are checked in dependency order; build artifacts emit to gitignored
  `packages/*/dist/`.

### HTTP Layer
- `@auction/server` mounts `AdminController` under `/api/admin` and
  `PassengerController` under `/api/passenger`, delegating each route to the
  matching method on the shared `createBackend()` instance
- Vite's dev server proxies `/api` to `http://localhost:3000`, so each web app
  uses relative URLs in both dev and production
- each app's `api/backend.ts` exports a fetch client (`adminBackend` /
  `passengerBackend`) built on the neutral `web-shared` request helpers; query
  hooks call these clients and stay agnostic to transport details
- Request bodies for mutation endpoints are validated at runtime with Zod
  schemas from `@auction/api-contracts/schemas`, applied via a small
  `ZodValidationPipe` in `packages/server/src/pipes/`. Invalid payloads get
  a `400 Bad Request` with a JSON error tree (missing fields, wrong types,
  disallowed enum values). Currently guarded: `POST /admin/flights/query`
  and `PUT /admin/rules`.

### Modular Features (web)
- Each major admin panel lives in `packages/web-admin/src/pages/`; the single
  passenger page lives in `packages/web-passenger/src/pages/`
- Reusable atoms live in `packages/web-shared/src/primitives/` (`Pill`,
  `MetricCard`, `BarChart`, ...)
- UI components follow the shadcn/ui pattern — installed under
  `packages/web-shared/src/components/ui/` and styled via Tailwind CSS 4
  utility classes with semantic CSS custom property tokens
- `packages/web-shared/src/domain/` contains UI-side helpers: `color.ts` (token resolver)
  and `channel.ts` (icon map). The `weighted.ts` bid-score formula lives in
  `@auction/core` since it is shared with the backend.
- Color tokens are declared as a union in `@auction/core/src/colorTokens.ts`
  and satisfied by the web `theme.ts` object at compile time

### Design Tokens
The color palette is owned by CSS custom properties on `:root` in
`packages/web-shared/src/index.css` (single source of truth, shadcn-compatible).
The design tokens are exposed to Tailwind 4 via `@theme inline` so components
can use utility classes like `bg-surface-card`, `text-text-muted`, and
`border-border-default` directly.
`packages/web-shared/src/theme.ts` is a thin TypeScript bridge that maps semantic
names to `var(--token)` strings, retained for dynamic inline styles that
still require runtime color values (e.g. conditional Pill colors from entity
data). It uses `satisfies Record<ColorTokenId, string>` to stay in sync with
the `ColorTokenId` union in `@auction/core`.

### Data & Mappings
- Seed data lives in `packages/backend/src/data/<entity>.ts` — one file per table
  (countries, cities, airports, passengers, flights, bids)
- Domain dictionary entries (e.g. country/city/airport `name`, tier/state/status `name`)
  carry `LocalizedString` shapes resolved with active `locale` from `useLocale()`
- Enum dictionaries (tiers, bid states, flight statuses, flight hauls) are served
  through their own backend services and consumed in pages via TanStack Query hooks
  (`useTiersById`, `useBidStatesById`, `useFlightStatusesById`, `useFlightHaulsById`)
  with `staleTime: Infinity`
- `packages/web-shared/src/i18n.ts` only holds the text slice actually shared by
  both apps (`flightTime` for the flight-time formatters, `seatMap` for the
  shared SeatMap primitive);
  no per-entity data

### Backend Layering
- The backend is split into two client surfaces, composed in
  `packages/backend/src/backend/client.ts`:
  - `adminBackend` (`packages/backend/src/backend/admin/`) — full authority:
    flight operations, bid moderation (`approve`/`reject`/`autoSelect`),
    `rules.update`, raw entity tables, and ownership of all reference data
  - `passengerBackend` (`packages/backend/src/backend/passenger/`) — a
    read-mostly facade for the passenger app. It owns passenger-specific
    services (`passengerConfig`) and, like a BFF in a real system,
    **delegates shared reads to the admin client**. It exposes only a
    narrowed, safe subset: `flights.findDetailById` (no listing/query),
    `rules.get` (no update), `passengers.getCurrent`, and re-exported
    context-free lookups (`tiers`, `flightHauls`, `airports`, `cities`,
    `countries`)
- The combined `BackendClient` contract in
  `packages/backend/src/backend/contracts.ts` (admin ∪ passenger) is used by
  `createServiceClient()` so backend tests can exercise every capability
  through a single entry point
- Each entity is a folder under
  `packages/backend/src/backend/services/<entity>/` containing:
  - `contracts.ts` — service interface and entity-specific query/filter types
  - `service.ts` — exports `<entity>Seed` and `create<Entity>Service(db)`
  - `utils.ts` — pure helpers (filter mapping, joins) shared with tests/other services
- `packages/backend/src/backend/serviceClient.ts` merges all `*Seed` objects
  into a single DB, builds the admin client, and builds the passenger client
  on top of it (`createBackend()`)
- Generic DB emulator is in `packages/backend/src/backend/db/emulator.ts`;
  metadata access (`tableNames`) is split into the `DbSchema` facet
- DB operations are declarative (`filters` + `patch`, no function arguments)
- Services own cross-entity joins so callers issue one request: e.g.
  `bids.list` joins `passengers`, and `flights.findDetailById` joins route
  airports + cities + countries via `airports/utils.ts`

### Adding a New Entity (DB-backed)
1. Add the type to `packages/core/src/types.ts` and seed data to
   `packages/backend/src/data/<name>.ts`.
2. Define the service contract in
   `packages/api-contracts/src/services/<name>.ts` (interface only). Include
   it in `admin.ts` or `passenger.ts` (or both) as a field of the client type.
3. Create `packages/backend/src/backend/services/<name>/service.ts`
   (and `utils.ts` if needed), importing the service type from
   `@auction/api-contracts/admin` (or `/passenger`) and exporting
   `<name>Seed` + a `create<Name>Service(db)` factory.
4. Merge `<name>Seed` into the `createDbEmulator` call in
   `packages/backend/src/backend/serviceClient.ts`.
5. Register the service on the relevant client in
   `packages/backend/src/backend/admin/client.ts` (and, if the passenger app
   needs it, in `packages/backend/src/backend/passenger/client.ts`). Keep
   `BackendClient` in `packages/backend/src/backend/contracts.ts` in sync
   for tests.
6. Expose the endpoints in `packages/server/src/admin/admin.controller.ts`
   (and `passenger/passenger.controller.ts` if applicable) and mirror the
   shape in the owning app's `api/backend.ts` (`packages/web-admin` or
   `packages/web-passenger`).
7. Add a query key and a `use<Name>` hook under that app's `src/queries/`
   importing its `adminBackend`/`passengerBackend` from `../api/backend`.

### Adding a Config/State-only Service (no DB table)
For services that hold mutable config or non-relational state (like `rules`,
`passengerConfig`, `seatMap`), skip steps 1 and 3 above — create a `seed.ts`
(or inline defaults in `service.ts`) instead of a file under
`packages/backend/src/data/`, and pass no `db` argument to the factory.
4. Spread the seed and register the service in
   `packages/backend/src/backend/serviceClient.ts`.
5. The entities inspector (admin-only) renders every seeded table automatically;
   its localized table title comes from the backend `entityTitles` map. Section
   chrome (headers, empty state) lives under the `entities` key in
   `packages/web-admin/src/i18n.ts`.
6. The new table appears automatically on the admin `/entities` page.

### Text & Localization
- Locale **state** (current locale + setter) is owned by
  `packages/web-shared/src/locale.tsx` (`LocaleProvider`, `useLocale`). The
  shared `useLocale` also returns the shared text slice (flightTime + seatMap)
  used by shared components.
- Each app owns its **own dictionary** to avoid shipping the other app's text:
  `packages/web-admin/src/i18n.ts` (`ADMIN_I18N`) and
  `packages/web-passenger/src/i18n.ts` (`PASSENGER_I18N`). Each app's
  `src/locale.ts` wraps the shared `useLocale` and indexes its own dictionary,
  so app pages import `useLocale` from `../locale` and get app-scoped `txt`
  while sharing one locale state. (This split is why the passenger bundle no
  longer contains admin strings.)
- All three dictionaries carry the same locales (`ru`, `en`, `uz`)
- Domain dictionary entries (e.g. airport `name`/`city`/`country`) carry
  `LocalizedString` and are rendered via `value[locale]`
- Adding a new locale means extending each `*_I18N` dictionary and the shared
  `SHARED_I18N`; the switcher in each app's header updates text reactively

## Deployment

The two web apps (`@auction/web-admin` and `@auction/web-passenger`) are static
bundles; the server (`@auction/server`)
is a long-lived Node process. They deploy separately.

### Web on Vercel
Each web app has its own root-level `vercel.json` inside its package
directory. Create **two Vercel projects**, both connected to the same GitHub
repo:

| Project name | Root Directory | Framework preset |
| --- | --- | --- |
| `auction-admin` | `packages/web-admin` | Vite |
| `auction-passenger` | `packages/web-passenger` | Vite |

For each project, set `VITE_API_TARGET` in Env Vars to the deployed API origin
(e.g. `https://auction-proto-api.fly.dev`). The web fetch client uses that as
the base URL for `/api/*` calls; if unset, requests fall back to relative
`/api` (which only works through the local Vite dev proxy).

Each `vercel.json` uses `cd ../.. && pnpm install` + a workspace-filtered
build so pnpm resolves the workspace correctly from the app's Root Directory.

To avoid rebuilding on every push to any file, set an **Ignored Build Step**
per project (Settings → Git). For the admin project:

```bash
git diff HEAD^ HEAD --quiet -- packages/web-admin packages/web-shared \
  packages/core packages/api-contracts pnpm-lock.yaml
```

Vercel skips the build when the command exits 0 (no changes in the listed
paths). Mirror the same command for the passenger project, swapping
`packages/web-admin` for `packages/web-passenger`.

### Server on Fly.io
The repo ships a root-level `Dockerfile` (multi-stage, node:22-alpine, non-root
`app` user, stripped of `npm`/`yarn`) and a `fly.toml` with scale-to-zero:

```bash
fly launch --no-deploy   # first time: reads fly.toml, provisions the app
fly deploy                # builds Dockerfile, deploys to primary_region (fra)
```

Fly config:
- `internal_port = 3000`, `force_https = true`
- `auto_stop_machines = "stop"`, `min_machines_running = 0` — scales to zero
  when idle; TCP wakeup takes ~1–3s
- 256 MB, shared-cpu-1x — smallest tier, enough for the mocked backend

After deploy, put the app URL in Vercel's `VITE_API_TARGET`.

## AI-Assisted shadcn Workflow

This repository includes project-level shadcn skills for agent-driven development.

Installed artifacts:
- `.agents/skills/shadcn`
- `skills-lock.json`

Install command used:

```bash
pnpm dlx skills add shadcn/ui
```

Recommended next steps:
1. Initialize shadcn for this app (`pnpm dlx shadcn@latest init`) so `components.json` is created.
2. Add required components with `pnpm dlx shadcn@latest add <component>`.
3. Keep generated UI primitives in `packages/web-shared/src/components/ui` and compose
   app-specific components separately.
