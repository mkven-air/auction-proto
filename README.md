# Auction Prototype

A React + Vite prototype of an airline upgrade auction experience.

It includes:
- Admin dashboard for auction operations
- Flight list and flight-level bid management
- Global auction rules configuration
- Email template previews (invite, reminder, confirmation)
- Passenger-side bidding flow mockup
- Auto-discovered Entities page (every seeded DB table is rendered)

This is a front-end prototype with an in-memory mock backend service layer.
There is no real network/API integration yet.

## Mock Backend Latency

The in-memory mock backend can simulate network latency to better exercise loading states.

Default behavior:
- Enabled in development
- Random delay between `120ms` and `800ms`
- Disabled in test mode (`vitest`)

Environment variables:
- `VITE_MOCK_LATENCY_ENABLED` (`true`/`false`)
- `VITE_MOCK_LATENCY_MIN_MS` (number)
- `VITE_MOCK_LATENCY_MAX_MS` (number)

## Mock Backend Failures

The mock backend can also emulate server errors to test error states and retries.

Default behavior:
- Enabled in development
- Global random failure rate is `0` (off unless configured)
- Disabled in test mode (`vitest`)

Environment variables:
- `VITE_MOCK_FAILURE_ENABLED` (`true`/`false`)
- `VITE_MOCK_FAILURE_RATE` (number between `0` and `1`)

## Tech Stack

- React 19
- Vite 8
- TypeScript 6
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

### 2. Run development server

```bash
pnpm dev
```

Default local URL:

```text
http://localhost:5173/
```

## Available Scripts

```bash
pnpm dev      # start local dev server
pnpm build    # production build
pnpm preview  # preview production build locally
pnpm format   # format code with Biome
pnpm lint     # lint with warnings treated as errors
pnpm typecheck
pnpm typecheck:tests
pnpm test
```

Project check scripts in repo root:

```bash
bash check.sh      # format + lint + typecheck + tests
bash health.sh     # gitleaks + outdated deps + security audit
bash all-checks.sh # runs both scripts
```

## Project Structure

```text
.
├── src/
│   ├── App.tsx                        # main app orchestration
│   ├── main.tsx                       # React entry point
│   ├── index.css                      # global styles
│   ├── theme.ts                       # palette + semantic design tokens
│   ├── types.ts                       # type definitions
│   ├── i18n.ts                        # locale dictionary (ru) + TXT export
│   ├── pages/                         # top-level page components
│   │   ├── AdminShell.tsx             # shell header + tab layout
│   │   ├── FlightList.tsx             # flight table view
│   │   ├── FlightDetail.tsx           # flight detail panel
│   │   ├── GlobalRules.tsx            # rules configuration
│   │   ├── EmailPreview.tsx           # email template previews
│   │   ├── PassengerBidUI.tsx         # passenger bid mockup
│   │   └── EntitiesPage.tsx           # auto-discovered DB tables view
│   ├── primitives/                    # reusable UI primitives (Pill, MetricCard, ...)
│   ├── components/                    # app-specific composed components
│   ├── domain/                        # enum metadata (tier/state/status colors, ...)
│   ├── data/<entity>.ts               # per-entity seed data (one file per table)
│   ├── format/                        # display formatters (flight time, bid distribution)
│   ├── lib/                           # small framework-agnostic utilities
│   ├── queries/                       # TanStack Query hooks and keys
│   └── backend/                       # in-memory backend service + db emulator
│       ├── contracts.ts               # aggregate BackendClient contract
│       ├── serviceClient.ts           # builds db, services, latency wrapper
│       ├── latency.ts                 # latency + failure injection
│       ├── db/                        # generic DB emulator + contracts
│       └── services/<entity>/         # per-entity contracts.ts, service.ts, utils.ts
│           ├── airports/
│           ├── bids/
│           ├── cities/
│           ├── countries/
│           ├── flights/
│           └── passengers/
├── tests/                             # vitest suites (db emulator + per-service)
├── index.html                         # app shell
├── vite.config.ts                     # Vite config
├── tsconfig.json                      # strict TS config
├── tsconfig.check.json                # typecheck config including tests
├── biome.json                         # Biome config (format + lint)
├── check.sh                           # quality checks
├── health.sh                          # security/dependency checks
└── package.json                       # scripts and dependencies
```

## Architecture Notes

### Modular Features
The codebase is organized under `src/` with thin layered folders:
- Each major UI panel lives in `src/pages/` as a self-contained module
- Reusable atoms live in `src/primitives/` (`Pill`, `MetricCard`, `BarChart`, ...)
- Enum metadata (color/bg tokens for tier, bid state, flight status, ...) lives in `src/domain/`
- Per-entity seed data is split into `src/data/<entity>.ts`
- Type definitions are centralized in `src/types.ts`

### Design Tokens
The color palette is owned by CSS custom properties on `:root` in `src/index.css`
(single source of truth, shadcn-compatible). `src/theme.ts` is a thin TypeScript
bridge that maps semantic names to `var(--token)` strings so inline styles can
still reference them while the codebase migrates toward Tailwind/shadcn classes.

### Data & Mappings
- Seed data lives in `src/data/<entity>.ts` — one file per table (countries, cities, airports, passengers, flights, bids)
- Domain dictionary entries (e.g. country/city/airport `name`) carry `LocalizedString`
  shapes resolved via `value[CURRENT_LOCALE]`
- Enum-label maps (tier multipliers, bid states, flight statuses, hauls) live in
  `src/i18n.ts` since they are pure UI text, not data rows
- Color/bg token maps for those enums live in `src/domain/` (label-free)

### Backend Layering
- The aggregate `BackendClient` contract lives in `src/backend/contracts.ts`
- Each entity is a folder under `src/backend/services/<entity>/` containing:
  - `contracts.ts` — service interface and entity-specific query/filter types
  - `service.ts` — exports `<entity>Seed` and `create<Entity>Service(db)`
  - `utils.ts` — pure helpers (filter mapping, joins) shared with tests/other services
- `src/backend/serviceClient.ts` merges all `*Seed` objects into a single DB and
  composes services + the generic `entities` service, then wraps everything with
  latency/failure injection
- Generic DB emulator is in `src/backend/db/emulator.ts`; metadata access
  (`tableNames`) is split into the `DbSchema` facet
- DB operations are declarative (`filters` + `patch`, no function arguments)
- Services own cross-entity joins so callers issue one request: e.g.
  `bids.list` joins `passengers`, and `flights.findDetailById` joins route
  airports + cities + countries via `airports/utils.ts`

### Adding a New Entity
1. Add the type to `src/types.ts` and seed data to `src/data/<name>.ts`.
2. Create `src/backend/services/<name>/{contracts,service}.ts` (and `utils.ts` if needed),
   exporting `<name>Seed` and a `create<Name>Service` factory.
3. Add the service to the `BackendClient` type in `src/backend/contracts.ts`.
4. Spread the seed and register the service in `src/backend/serviceClient.ts`.
5. Add a localized title under `entities.tableTitles` in `src/i18n.ts`.
6. The new table appears automatically on the `/entities` page.

### Text & Localization Prep
- User-facing shared labels are centralized in `src/i18n.ts` under a locale
  dictionary (`ru`)
- Domain dictionary entries (e.g. airport `name`/`city`/`country`) carry
  `LocalizedString` shapes resolved via `value[CURRENT_LOCALE]`
- Components consume `TXT` instead of hardcoded strings where extraction is
  complete
- Adding a new locale can be done by extending `I18N` and switching `CURRENT_LOCALE`

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
3. Keep generated UI primitives in `src/components/ui` and compose app-specific components separately.