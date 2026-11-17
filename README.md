# The Platter Hub — Order Management

Internal order management web app for a catering business. Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase** (database + auth).

Primary accent: olive green `#556B2F`. Currency: **Naira (₦)**.

## Features

- Email login for the business owner
- Two order types: **Food Delivery** and **Event Catering**
- Dashboard, Orders (filterable), Order Detail, New/Edit Order
- Calendar (monthly), Menu (variants + categories), Finance, Customers
- Responsive sidebar + mobile card layouts
- Loading skeletons on data-heavy pages

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3847](http://localhost:3847).

### Demo mode (no Supabase)

If Supabase env vars are not set, the app uses an in-memory demo store and cookie login:

- Email: `owner@platterhub.ng`
- Password: `platterhub`

### Supabase setup

1. Create a Supabase project
2. Run `supabase/schema.sql` then `supabase/seed.sql` in the SQL editor
3. Create an Auth user (email/password) for the owner
4. Set in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

> Note: the current app data layer uses the local demo store so the UI works without credentials. Wire Supabase queries into `src/lib/data/store.ts` (or a parallel repository) once your project is ready.

## Scripts

- `npm run dev` — development server on port 3847
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint
