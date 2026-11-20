# Supabase setup (required for production persistence)

Vercel serverless resets in-memory data on every cold start. Production should use Supabase.

## 1. Create tables

In the Supabase SQL editor, run `schema.sql`.

## 2. Seed real orders (optional if auto-seed works)

Run `seed.sql` after schema.  
If you leave the tables empty, the app will auto-seed the 50 real orders on first request when `SUPABASE_SERVICE_ROLE_KEY` is set on Vercel.

## 3. Vercel environment variables

Set these on the **Production** environment (and Preview if you want):

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / public key |
| `SUPABASE_URL` | Same as project URL (optional if public URL set) |
| `SUPABASE_ANON_KEY` | Same as anon key (optional if public key set) |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (server-only — never expose to the browser) |

Redeploy after saving env vars.

## 4. Auth user for the client

In Supabase → Authentication → Users, create an email/password for the owner (or client). That is the login for https://platterhub-o5ln.vercel.app — not a Vercel login.

## Regenerate seed files

```bash
npm run seed:generate
```
