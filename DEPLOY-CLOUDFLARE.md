# Cloudflare Workers deploy (acmtimehub)

Production uses **Cloudflare D1** (database) and **R2** (medical certificate files). Local `npm run dev` still uses **SQLite** via `DATABASE_URL=file:...`.

Worker name: `acmtimehub` · Repo: https://github.com/csagun1985/acmtimehub

## Binding names (must match `wrangler.jsonc`)

| Binding | Type | Resource name |
|---|---|---|
| `DB` | D1 | `acmtimehub-db` |
| `MED_CERTS` | R2 | `acmtimehub-med-certs` |

## One-time Cloudflare setup (boss checklist)

### 1. Create D1 database

```bash
npx wrangler login
npx wrangler d1 create acmtimehub-db
```

Copy the printed `database_id` into `wrangler.jsonc` → `d1_databases[0].database_id` (replace `REPLACE_WITH_D1_DATABASE_ID`).

Commit that change (or set the same id in the Cloudflare dashboard Worker → Settings → Bindings).

### 2. Create R2 bucket

```bash
npx wrangler r2 bucket create acmtimehub-med-certs
```

Binding `MED_CERTS` → bucket `acmtimehub-med-certs` is already declared in `wrangler.jsonc`.

### 3. Apply schema to remote D1

Checked-in SQL matches the current Prisma schema (local SQLite may have been updated with `db push`, so do **not** rely only on the old Prisma migration folder for prod):

```bash
npx wrangler d1 execute acmtimehub-db --remote --file=./scripts/d1-schema.sql
```

To regenerate that file after schema changes:

```bash
npm run db:d1-schema > scripts/d1-schema.sql
```

### 4. Worker secrets

Set on the Worker (dashboard **Settings → Variables and Secrets**, or CLI):

```bash
npx wrangler secret put AUTH_SECRET
npx wrangler secret put AUTH_URL
npx wrangler secret put AUTH_TRUST_HOST
```

Suggested values:

| Secret | Value |
|---|---|
| `AUTH_SECRET` | long random string (e.g. `openssl rand -base64 32`) |
| `AUTH_URL` | public Worker URL, e.g. `https://acmtimehub.<account>.workers.dev` (or custom domain) |
| `AUTH_TRUST_HOST` | `true` |

Do **not** set `DATABASE_URL` on the Worker. Production Prisma uses the `DB` D1 binding.

Optional: `SHOW_DEMO_LOGINS=1` only if you intentionally want demo accounts listed on `/login` (off by default in production builds).

### 5. Seed one admin user

Generate a bcrypt hash locally (Node, from repo root after `npm install`):

```bash
node -e "require('bcryptjs').hash('YOUR_STRONG_PASSWORD', 10).then(console.log)"
```

Then insert (replace placeholders):

```bash
npx wrangler d1 execute acmtimehub-db --remote --command="INSERT INTO User (id, email, passwordHash, name, startDate, state, role, employmentStatus, employmentType, entitleAlAccrual, entitleSlAccrual, entitlePublicHoliday, active, createdAt, updatedAt) VALUES ('admin_cuid_1', 'admin@yourcompany.com', 'PASTE_BCRYPT_HASH', 'Admin', '2024-07-01T00:00:00.000Z', 'NSW', 'ADMIN', 'PERMANENT', 'FULL_TIME', 1, 1, 1, 1, datetime('now'), datetime('now'));"
```

Or seed the full demo dataset against **local SQLite only**: `npm run db:seed` (not for production).

### 6. Build and deploy

From the repo (Node 20+ recommended):

```bash
npm install
npx prisma generate
npm run deploy
```

Equivalent:

```bash
npx opennextjs-cloudflare build
npx opennextjs-cloudflare deploy
```

Scripts:

| Script | Purpose |
|---|---|
| `npm run build` | OpenNext Cloudflare build |
| `npm run build:next` | Plain `next build` (used inside OpenNext) |
| `npm run deploy` | Build + deploy Worker |
| `npm run preview` | Build + local Workers preview |

### 7. Dashboard checks after first deploy

1. Workers & Pages → `acmtimehub` → **Bindings**: `DB`, `MED_CERTS`, `ASSETS`, etc.
2. D1 → `acmtimehub-db` → confirm tables exist (`User`, `LeaveRequest`, …).
3. R2 → `acmtimehub-med-certs` → empty until first med-cert upload.
4. Open `/login`, sign in as the admin you seeded.
5. Upload a sick-leave med cert and open **View cert** (served from `/api/med-cert/<id>`, auth required — not a public R2 URL).

## Local development

```bash
# .env (do not commit)
DATABASE_URL="file:./dev.db"
AUTH_SECRET="local-dev-secret"
AUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST="true"

npm install
npx prisma migrate deploy   # or migrate dev / db push if schema drifted
npm run db:seed             # optional demo users
npm run dev
```

- **SQLite** when `DATABASE_URL` starts with `file:` (default).
- **D1** on Workers when the `DB` binding is present and you are not on a file URL.
- Force D1 locally (wrangler / preview): set `USE_D1=1`.
- Med certs: write to `public/uploads/...` locally; write to R2 `MED_CERTS` on Cloudflare. Downloads always go through authenticated `/api/med-cert/[requestId]`.

## Windows / OpenNext notes

- OpenNext Cloudflare builds can be slow or flaky on some Windows setups; if `npm run deploy` fails oddly, retry or build from WSL/CI.
- After changing Prisma schema, run `npx prisma generate` and refresh `scripts/d1-schema.sql` before applying to remote D1.
- Never commit real secrets; keep `.env` / `.dev.vars` local only.
