# acmtimehub

TimeHub — timesheets and Service Incentive Leave (AL, SL, DIL) for ACM Recruitment.

## Quick start

```bash
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo logins (password for all: `Password123!`)

| Email | Role |
|---|---|
| `staff.nsw@sil.local` | Staff (NSW PHs) |
| `staff.vic@sil.local` | Staff (VIC PHs) |
| `manager@sil.local` | Manager (approves all) |
| `admin@sil.local` | Admin |

## Locked business rules (v1)

- Fiscal year: **1 Jul – 30 Jun**
- AL: 20 days/year · SL: 10 days/year · pro-rata from start date
- AL carry-over: **enabled** (unused AL carries over as Service Incentive Leave) · SL resets each FY
- Half-days allowed for AL/SL
- Public holidays: **Australian**, per staff **state** (NSW/VIC), **excluded** from AL/SL/DIL Use counts (weekends excluded too)
- SL medical certificate: required after **2 consecutive** calendar days · upload in app
- DIL: earn OT credit (hours) → use hours (decimals OK) · no overdraft · **90 days from OT worked date** · FIFO
- One manager · email/password auth · go-live fresh from **1 Jul 2026** with opening balances

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local development |
| `npm run db:seed` | Seed users + AU holidays |
| `npm run db:migrate` | Create/apply migrations |

## Stack

Next.js · Prisma · SQLite · Auth.js (credentials) · Tailwind · date-holidays (AU-NSW / AU-VIC)
