# M&T Collection

An affiliate product discovery platform. Users browse curated fashion
picks and get redirected to the actual retailer (Flipkart, Myntra,
etc.) to buy — this is not a checkout/cart/payment system.

## Architecture

```
mt-collection/
├── src/            Next.js frontend (App Router, TypeScript, Tailwind, Framer Motion)
├── public/         Static assets (logo, real product photos)
└── server/         Node.js + Express + MongoDB backend + admin API
    ├── src/
    ├── seed/       Idempotent seed script (real products/categories, optional admin user)
    └── README covers backend-specific detail inline below
```

The frontend can run two ways:

- **Local-data mode** (no backend needed): leave `NEXT_PUBLIC_API_URL`
  unset. Pages read directly from `src/data/products` and
  `src/data/categories` — this is how Stage 1/2 worked and still
  works today, useful for pure frontend work.
- **API mode** (production): set `NEXT_PUBLIC_API_URL` to the running
  backend's URL. Every page switches to fetching from MongoDB via the
  REST API instead, with the exact same UI.

The admin panel (`/admin`) **always** requires the backend — there is
no local-data admin mode, since there's nothing to administer without
a database.

## Prerequisites

- Node.js 18.18+
- A MongoDB instance (local `mongod`, or a free MongoDB Atlas cluster)
- npm

## 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/mt-collection
FRONTEND_URL=http://localhost:3000
JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))">
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=<choose a strong password, 8+ chars>
```

Leave the `FLIPKART_*` / `MYNTRA_*` affiliate API variables blank
unless you have real affiliate API credentials for those platforms —
see "Affiliate metadata import" below.

Seed the database (safe to re-run — it upserts by slug, never
duplicates or wipes data):

```bash
npm run seed
```

This inserts the real "Fashion" category and all 11 real migrated
products, and creates the admin user from `ADMIN_EMAIL`/`ADMIN_PASSWORD`
if one doesn't already exist.

Start the backend:

```bash
npm run dev       # tsx watch, for development
# or
npm run build && npm start   # compiled, for production
```

Verify it's up: `curl http://localhost:4000/api/health`

## 2. Frontend setup

```bash
# from the project root
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_GA_ID=            # optional, leave blank if you don't have one
NEXT_PUBLIC_SHOW_DEMO_DATA=false
```

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 3. Admin login

Visit `http://localhost:3000/admin/login` and sign in with the
`ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `server/.env` (before
running seed). From there:

- **Dashboard** — product/category counts
- **Products** — search, publish/unpublish, feature, trend, edit,
  delete, or add a new product (with an optional "Import from
  affiliate URL" helper — see below)
- **Categories** — same CRUD pattern

## Affiliate metadata import

`server/src/services/affiliate/` implements the provider architecture
(detect platform → attempt official API → fall back to manual entry)
but the actual Flipkart/Myntra API calls are **not implemented** — I
had no affiliate API credentials to build or verify an integration
against. Right now, pasting a URL in the admin "Import from affiliate
URL" box will correctly detect the platform and pre-fill the
affiliate URL, but will always report "no credentials configured" and
require manual entry of the rest. This is expected, not a bug.

To finish it once you have real credentials:

1. Set `FLIPKART_AFFILIATE_ID` / `FLIPKART_AFFILIATE_TOKEN` (or the
   Myntra equivalents) in `server/.env`.
2. Implement the actual fetch call in
   `server/src/services/affiliate/flipkart.ts` (or `myntra.ts`)
   against that platform's affiliate API docs.
3. Nothing else needs to change — `isConfigured()` already gates on
   those env vars, and the admin UI already handles both the
   automated and manual-fallback paths.

## Environment variables reference

### Frontend (`.env.local`)

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | Blank = local-data mode. Set for API/production mode. |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics 4 ID. Site works fine without it. |
| `NEXT_PUBLIC_SHOW_DEMO_DATA` | No | Local-mode only. `false` before any real delivery. |

### Backend (`server/.env`)

| Variable | Required | Notes |
|---|---|---|
| `PORT` | No | Defaults to 4000. |
| `NODE_ENV` | No | `development` or `production`. |
| `MONGODB_URI` | **Yes** | |
| `FRONTEND_URL` | **Yes** | Exact frontend origin — CORS is locked to this, never `*`. |
| `JWT_SECRET` | **Yes** | Generate a real random value, never commit it. |
| `JWT_EXPIRES_IN` | No | Defaults to `7d`. |
| `COOKIE_NAME` | No | Defaults to `mt_admin_token`. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Only for `npm run seed` | Bootstraps the first admin user. |
| `SHOW_DEMO_DATA` | No | Hard-disabled when `NODE_ENV=production` regardless of this value. |
| `FLIPKART_*` / `MYNTRA_*` | No | Affiliate API credentials — see above. |

Never put backend secrets in a `NEXT_PUBLIC_*` variable — anything
with that prefix is shipped to the browser.

## Deployment notes

- **Frontend**: deployable to any Next.js host (e.g. Vercel). Set
  `NEXT_PUBLIC_API_URL` to your deployed backend's URL.
- **Backend**: deployable to any Node host. Set `FRONTEND_URL` to your
  deployed frontend's exact URL (CORS depends on this), and set
  `NODE_ENV=production`.
- **Database**: use a hosted MongoDB (e.g. Atlas) in production — put
  its connection string in `MONGODB_URI`.
- Run `npm run seed` once against the production database after first
  deploying the backend (it's idempotent, so this is safe).

## Known limitations (honest, as of this build)

- **Nothing in this repository has been run.** It was built and
  reviewed in a sandboxed environment with no network access to `npm`
  — every file was hand-written and logically reviewed (import
  resolution checked programmatically, and the backend was
  additionally type-checked with `tsc`), but `npm install`,
  `npm run dev`, `npm run build`, and `npm run lint` have never
  actually executed. Run them yourself and report any errors.
- Flipkart/Myntra affiliate API integration is architecture-only (see
  above) — manual product entry is fully functional in the meantime.
- The sitemap fetches a single page (up to 48 products) from the API;
  once the real catalog grows past that, `src/app/sitemap.ts` needs a
  loop over `pagination.totalPages`.
- Admin UI is functional but intentionally not visually elaborate —
  the spec explicitly deprioritized admin design polish in favor of
  working functionality.
