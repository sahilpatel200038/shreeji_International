# Shreeji International Courier & Tracking Platform

Monorepo containing the Shreeji International marketing site and its International Courier
Tracking System: a Laravel + MySQL API, a public tracking UI, and an admin panel for shipment
management.

```text
project-root/
├── apps/
│   ├── frontend/   React 19 + Vite + TypeScript + Tailwind (marketing site, tracking UI, admin panel)
│   └── backend/    Laravel 13 + MySQL (tracking API)
├── package.json    Root workspace scripts (one-command dev/build/test/lint)
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- PHP 8.3+ and Composer (on PATH)
- MySQL 8 server running locally

## Setup

```bash
npm install                     # installs root + frontend deps (npm workspaces)
npm run backend:install         # composer install for the Laravel API
```

Copy environment files:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

Edit `apps/backend/.env` with your local MySQL credentials, then:

```bash
cd apps/backend && php artisan key:generate && cd ../..
npm run backend:migrate:fresh   # migrate + seed demo shipments and an admin user
```

Demo admin login (seeded): `admin@shreejiintl.com` / `Shreeji@Admin2026`

Demo tracking numbers (seeded): `SIC2026081001` … `SIC2026081006`

## Running

```bash
npm run dev
```

Starts both the frontend (Vite, http://localhost:3000) and the backend (Laravel, http://localhost:8010)
together from the root. Individual servers: `npm run dev:frontend`, `npm run dev:backend`.

Other root scripts:

```bash
npm run build     # production build of the frontend
npm run lint       # eslint on the frontend
npm run test       # frontend lint + backend PHPUnit feature tests
```

Backend-specific:

```bash
npm run backend:migrate         # run pending migrations
npm run backend:migrate:fresh   # drop, re-migrate, and reseed
npm run backend:seed            # reseed without dropping tables
npm run test:backend            # php artisan test
```

## Environment variables

**`apps/backend/.env`**

```env
APP_URL=http://localhost:8010
FRONTEND_URL=http://localhost:3000   # used for CORS

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=shreeji_tracking
DB_USERNAME=shreeji_app
DB_PASSWORD=
```

**`apps/frontend/.env.local`**

```env
VITE_API_URL=http://localhost:8010/api
```

## Tracking System overview

- Public tracking search + timeline: home page "Tracking" section, backed by `GET /api/tracking/{trackingNumber}`.
- Admin panel at `/admin` (login required): create/edit/delete shipments, add tracking events, search/filter.
- All tracking data is stored in MySQL and served through the Laravel API nothing is hard-coded in the frontend.
- Courier providers (DHL, FedEx, UPS, Aramex, USPS, Royal Mail, TNT) are stored in a `courier_providers`
  table so more can be added without code changes; there is no live integration with real courier APIs.
