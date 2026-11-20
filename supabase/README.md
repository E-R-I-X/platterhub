# Supabase setup

1. Create a Supabase project.
2. In the SQL editor, run `schema.sql`.
3. Then run `seed.sql` (real Platter Hub orders in CAD).

`seed.sql` truncates menu/customer/order tables first, then inserts the real dataset generated from `scripts/generate-real-seed.mjs`.

Regenerate seeds after editing the script:

```bash
npm run seed:generate
```
