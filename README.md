# The Platter Hub — Order Management

Internal order management web app for a catering business. Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase** (database + auth).

Primary accent: olive green `#556B2F`. Currency: **Canadian dollars (CAD)**.

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

### Auth

- **Published private/team app:** Cursor sign-in (no password form). Viewer identity comes from `cursor/identity.ts`.
- **Local development:** a simulated Cursor viewer (`cursor/identity.dev.ts`) so pages work without secrets.
- **Optional Supabase Auth:** set Supabase env vars to enable email/password login.

### Sample data

Without Supabase, orders/menu/customers come from an in-memory sample store (`src/lib/data/`).

### Supabase setup (optional)

1. Create a Supabase project
2. Run `supabase/schema.sql` then `supabase/seed.sql` in the SQL editor
3. Create an Auth user (email/password) for the owner
4. Copy `.env.example` to `.env.local` and fill in the Supabase values

> Wire Supabase queries into `src/lib/data/store.ts` when you are ready to persist beyond sample data.

## Scripts

- `npm run dev` — development server on port 3847
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint
