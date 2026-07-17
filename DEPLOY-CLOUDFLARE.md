# Cloudflare Workers deploy (acmtimehub)

Production uses **Cloudflare D1** (database) and **R2** (medical certificate files). Local `npm run dev` still uses **SQLite** via `DATABASE_URL=file:...`.

Worker name: `acmtimehub` · Repo: https://github.com/csagun1985/acmtimehub

## Binding names (must match `wrangler.jsonc`)

| Binding | Type | Resource name |
|---|---|---|
| `DB` | D1 | `acmtimehub-db` |
| `MED_CERTS` | R2 | `acmtimehub-med-certs` |

## One-time Cloudflare setup (boss checklist)

### 1. D1 database

`wrangler.jsonc` binds `DB` → database name `acmtimehub-db` and **omits** `database_id` so wrangler **4.45+** can auto-provision on deploy.

Preferable one-time create (gives you a real UUID for dashboard / `d1 execute`):

```bash
npx wrangler login
npx wrangler d1 create acmtimehub-db
```

Then either:

- paste the printed UUID into `wrangler.jsonc` as `"database_id": "<uuid>"` and commit, **or**
- set the same binding in the Cloudflare dashboard (Worker → Settings → Bindings)

Never put a fake string like `REPLACE_WITH_...` in `database_id` — deploy fails with Cloudflare API **10021** (“must have a valid id”).

### 2. Create R2 bucket

```bash
npx wrangler r2 bucket create acmtimehub-med-certs
```

Binding `MED_CERTS` → bucket `acmtimehub-med-certs` is already declared in `wrangler.jsonc`. Wrangler may also auto-create the bucket on deploy if it does not exist.

### 3. Apply schema to remote D1 (required before login works)

Deploy creates an **empty** D1. Apply the checked-in SQL (matches current Prisma schema; do **not** rely only on old Prisma migration folders for prod):

```bash
npx wrangler d1 execute acmtimehub-db --remote --file=./scripts/d1-schema.sql
```

To regenerate that file after schema changes:

```bash
npm run db:d1-schema > scripts/d1-schema.sql
```

### 4. Worker secrets (runtime)

Set on the Worker (dashboard **Settings → Variables and Secrets**, or CLI) **before** relying on login:

```bash
npx wrangler secret put AUTH_SECRET
npx wrangler secret put AUTH_URL
```

| Secret | Required? | Value |
|---|---|---|
| `AUTH_SECRET` | **Yes** | long random string (e.g. `openssl rand -base64 32`). Without it Auth.js throws `MissingSecret` on sign-in. |
| `AUTH_URL` | Recommended | public Worker URL, e.g. `https://acmtimehub.<account>.workers.dev` (or custom domain) |
| `AUTH_TRUST_HOST` | Optional | App already sets `trustHost: true` in code; setting this secret is harmless but not required |

Do **not** set `DATABASE_URL` on the Worker. Production Prisma uses the `DB` D1 binding.

Optional: `SHOW_DEMO_LOGINS=1` only if you intentionally want demo accounts listed on `/login` (off by default in production builds).

### 5. Seed one admin user (required — empty DB cannot log in)

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

**Cloudflare Workers Builds** (recommended for boss):

| Step | Command |
|---|---|
| Build | `npm run build` (= `opennextjs-cloudflare build`) |
| Deploy | `npx wrangler deploy` |

After a successful build, `npx wrangler deploy` detects OpenNext and runs `opennextjs-cloudflare deploy` (cache populate + wrangler). That is OK — do **not** skip the OpenNext build; plain `wrangler deploy` without `.open-next/worker.js` fails.

From a laptop (Node 20+):

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
2. D1 → `acmtimehub-db` → confirm tables exist (`User`, `LeaveRequest`, …). If empty, re-run step 3 schema SQL.
3. R2 → `acmtimehub-med-certs` → empty until first med-cert upload.
4. Open `/login`, sign in as the admin you seeded in step 5. **No seed = login always fails** (invalid credentials), even if deploy succeeded.
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
