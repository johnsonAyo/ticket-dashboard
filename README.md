# Support Ticket Dashboard

A support ticket dashboard: a React frontend, a
NestJS REST API, SQLite persistence via Prisma, automated tests, and API
documentation. Built as a full-stack assessment with an emphasis on dependable
core flows, clear boundaries, and an easy reviewer setup.

## Features

- **Ticket list** with title, customer, priority, status, created date, and
  compact summary stats.
- **Create ticket** in a right-side **drawer** with required-field and email
  validation; new tickets start as `open`.
- **Ticket details** page with full information and a status control.
- **Status and priority updates**, plus **ticket deletion**, from the list and detail views, persisted to the database.
- **Filtering** by status and priority.
- **Kanban board** (`dnd-kit`) for drag-and-drop status changes, reusing the
  same status-update API as the accessible controls.
- **Swagger/OpenAPI** docs, structured validation errors, and visible loading /
  empty / error states.
- **Request logging + timing**: a global interceptor logs every request with its
  duration, elevating client errors (`4xx`), server errors (`5xx`), and slow
  requests for quick friction spotting.

## Tech stack

| Area     | Choice                                                                    |
| -------- | ------------------------------------------------------------------------- |
| Monorepo | npm workspaces (`apps/api`, `apps/web`, `packages/shared`)                |
| Frontend | Vite, React, TypeScript, React Router, TanStack Query, RHF, Zod, Tailwind |
| Backend  | NestJS, TypeScript, lightweight DDD, `class-validator`, Swagger           |
| Database | SQLite via Prisma (repository port + Prisma adapter)                      |
| Testing  | Jest + Supertest (API), Playwright (browser flows)                        |

## Project structure

```
ticket-dashboard/
  apps/
    api/            NestJS API
      src/
        common/        exception filter, health check
        config/        env configuration
        prisma/        Prisma module/service
        tickets/       feature: domain, application, infrastructure, presentation
      prisma/          schema, migrations, seed
      test/            API e2e tests
    web/            Vite React app
      src/
        api/           HTTP client + ticket calls
        components/     feedback, layout, form, tickets (incl. Kanban)
        hooks/          TanStack Query hooks
        lib/            routes, query keys, labels, formatting
        pages/          list, create, detail, board, not-found
        tickets/        Zod form schema
      tests/           Playwright specs
  packages/
    shared/         framework-neutral ticket types + constants
  data/             SQLite database (git-ignored)
```

## Prerequisites

- Node.js 20+ and npm 10+.

## Getting started

### Recommended: Run with Docker

A single-container dev setup is provided for a one-command start. This builds the workspaces, sets up and seeds the SQLite database on the mounted `./data` volume, and runs both the API (`:3000`) and web app (`:5173`).

```bash
docker compose up --build
```

Then open http://localhost:5173. The API is at http://localhost:3000/api and
Swagger docs are at http://localhost:3000/api/docs.

### Alternative: Manual setup

If you prefer to run the apps locally without Docker:

```bash
# 1. Install all workspaces (also builds the shared package)
npm install

# 2. Copy the environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 3. Set up the database: generate the client, apply migrations, seed sample data
npm run db:setup

# 4. Run the API (:3000) and web app (:5173) together
npm run dev
```

Then open http://localhost:5173. The API is at http://localhost:3000/api and
Swagger docs are at http://localhost:3000/api/docs.

To run the apps separately: `npm run dev:api` and `npm run dev:web`.

### Environment variables

| Variable            | App | Default                     | Purpose                                     |
| ------------------- | --- | --------------------------- | ------------------------------------------- |
| `PORT`              | api | `3000`                      | API port                                    |
| `DATABASE_URL`      | api | `file:../../../data/app.db` | SQLite path (relative to `apps/api/prisma`) |
| `CORS_ORIGIN`       | api | `http://localhost:5173`     | Allowed browser origin                      |
| `VITE_API_BASE_URL` | web | `http://localhost:3000/api` | API base URL (include `/api`)               |

## Database

- Schema and migrations live in `apps/api/prisma`.
- `npm run db:setup` runs generate + `migrate deploy` + seed.
- `npm run db:seed` re-seeds sample tickets (it resets the tickets table first).
- The SQLite file path is configurable via `DATABASE_URL` for both local use and
  a mounted persistent disk in production (e.g. `file:/var/data/app.db`).

## API

Base path: `/api`.

| Method | Path           | Description                                                     |
| ------ | -------------- | --------------------------------------------------------------- |
| GET    | `/tickets`     | List tickets; optional `?status=&priority=`                     |
| GET    | `/tickets/:id` | Get one ticket (`404` if missing)                               |
| POST   | `/tickets`     | Create a ticket (`201`; status forced `open`)                   |
| PATCH  | `/tickets/:id` | Update ticket status or priority (`400` invalid, `404` missing) |
| DELETE | `/tickets/:id` | Delete a ticket (`404` if missing)                              |
| GET    | `/health`      | Health check                                                    |

Errors use a consistent shape: `{ "statusCode", "error", "message" }`, where
`message` may be an array of validation messages. Statuses are `open`,
`in_progress`, `resolved`; priorities are `low`, `medium`, `high`.

## Observability

- **Logging & timing** — a global NestJS interceptor logs every request as
  `METHOD /path -> status (Nms)`. Client errors (`4xx`) are tagged
  `[client friction]` at `warn`, server errors (`5xx`) at `error`, and requests
  over the slow threshold are tagged `[slow]`. The exception filter additionally
  logs server errors with their stack. This is the instrumentation seam: logs go
  to stdout today.
- **In production** this maps to structured JSON logs shipped to a central
  platform (Datadog / Loki), OpenTelemetry tracing and metrics → Datadog APM or
  Prometheus + Grafana, SLO dashboards, and alert routing to Slack/PagerDuty. See
  [`docs/PRODUCTION_READINESS.md`](docs/PRODUCTION_READINESS.md).

## Testing

```bash
npm test          # API tests (Jest + Supertest) on an isolated SQLite test DB
npm run test:e2e  # Playwright browser flows (starts the API + web automatically)
```

Playwright needs a browser once: `npm run test:e2e:install` (installs Chromium).

A manual QA checklist is in [`docs/MANUAL_QA.md`](docs/MANUAL_QA.md).

## Quality checks

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

## Continuous integration

`.github/workflows/ci.yml` runs on every push and pull request to `main`:

1. **quality** — `format:check`, `lint`, `typecheck`, `build`, and the API tests.
2. **e2e** — seeds an isolated SQLite database and runs the Playwright suite
   (which boots the API and web servers itself).

## Assumptions & trade-offs

- **SQLite via Prisma** keeps reviewer setup trivial and is explicitly accepted
  by the brief. It works with a mounted persistent disk, but is not suited to
  stateless, serverless, or multi-instance deployments — PostgreSQL is the
  production upgrade, and the repository port keeps that swap contained to the
  infrastructure layer.
- **Lightweight DDD**: a single `TicketsService` depends on a `TicketRepository`
  port rather than Prisma directly. No CQRS, events, or generic repositories —
  the ceremony is kept proportional to the problem.
- **Pessimistic status updates**: the UI waits for the API to confirm a change
  before refetching, which is simpler and less error-prone than optimistic
  updates with rollback.
- **Kanban is secondary**: drag-and-drop is an enhancement on top of the
  required accessible status controls and reuses the same mutation path.
- **Shared package** holds only framework-neutral types and constants; backend
  validation uses `class-validator` (for Swagger) and the frontend uses Zod
  locally for forms.
- **No authentication**: out of scope per the brief (see below).

## Future work

- **Two-pane master-detail view.** Detail and create are dedicated routes/pages
  (per the brief). A production support tool (Zendesk, Intercom, Front) would
  more likely use a master-detail layout — the ticket list stays on the left and
  the selected ticket opens in a right-hand pane, keeping list context. It was a
  deliberate choice to ship the simpler dedicated pages here and keep scope tight
  to the requirements; the two-pane layout is the direction I'd take next.
- **Auth and roles.** Out of scope per the brief; agent vs. admin permissions
  would be the first addition for real use.
- **Richer list controls.** Server-side pagination once ticket volume grows, plus
  saved filter views.

## Production readiness

[`docs/PRODUCTION_READINESS.md`](docs/PRODUCTION_READINESS.md) covers the gap
between this build and a production deployment, focused on **hardening the
foundations that already exist** rather than adding new features: managed
PostgreSQL behind the repository port, indexing, structured log shipping,
OpenTelemetry → Datadog / Prometheus + Grafana, Slack/PagerDuty alerting,
secret management, security headers + rate limiting, and stateless horizontal
scaling.
