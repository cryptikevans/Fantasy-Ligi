# Fantasy Ligi

Kenya-only weekly cash-pool Fantasy Premier League application built with Next.js, Prisma and Supabase Postgres.

## Competition rule

**Every gameweek is a new cash competition.**

- New entries are paid every gameweek.
- Weekly points reset to zero at the beginning of every gameweek.
- A previous gameweek's points never affect the current gameweek winner.
- Historical results remain available for audit/statistics.
- Wallet balance carries forward between gameweeks.

## Stack

- Next.js App Router
- TypeScript
- Prisma ORM
- PostgreSQL / Supabase
- Tailwind-ready CSS structure
- FPL API
- Safaricom Daraja integration points
- Vercel Cron

## Local setup

1. Install Node.js 20+.
2. Create a Supabase project.
3. Copy `.env.example` to `.env`.
4. Put the Supabase pooled connection in `DATABASE_URL` and direct connection in `DIRECT_URL`.
5. Install dependencies:

```bash
npm install
```

6. Generate Prisma client:

```bash
npm run db:generate
```

7. Create/apply the database:

```bash
npx prisma migrate dev --name init
```

8. Seed templates and demo admin:

```bash
npm run db:seed
```

Demo admin credentials:
- Phone: `0700000000`
- Password: `ChangeMe123!`

Change these immediately for any non-local environment.

9. Sync FPL data:

```bash
npm run fpl:sync
```

10. Create the current gameweek's league instances:

```bash
npm run leagues:create
```

11. Start:

```bash
npm run dev
```

## Supabase

In Supabase, create a PostgreSQL project and use the connection strings shown in the database Connect panel.

For Prisma:
- `DATABASE_URL`: pooled connection recommended for application runtime.
- `DIRECT_URL`: direct connection for migrations.

Do not commit either value.

## Vercel

Import the GitHub repository into Vercel and add all variables from `.env.example`.

Set:

```text
DATABASE_URL
DIRECT_URL
AUTH_SECRET
NEXTAUTH_URL
MPESA_*
FPL_API_URL
CRON_SECRET
```

Vercel Cron calls `/api/cron/sync` using the configured cron secret.

## M-Pesa

The callback route is intentionally conservative. A production STK implementation must:

1. Create a pending deposit transaction before/while initiating STK.
2. Store CheckoutRequestID and a server-generated idempotency key.
3. Send STK Push.
4. Receive Daraja callback.
5. Verify CheckoutRequestID against the pending deposit.
6. Verify the exact amount and account/user mapping server-side.
7. Credit the wallet once.
8. Store MpesaReceiptNumber.
9. Ignore duplicate callbacks.

Never credit a wallet based solely on a client-supplied amount or phone number.

B2C withdrawals must similarly create a pending withdrawal, call Daraja, and only finalize the debit on a successful result callback. Failure must reverse/release the pending amount.

## Weekly lifecycle

```text
FPL Gameweek
  ↓
Open league instances
  ↓
Users reserve entry fee
  ↓
League fills
  ↓
Held entries become completed
  ↓
League becomes active
  ↓
FPL matches + live scoring
  ↓
GW ends
  ↓
Final scores + tiebreakers
  ↓
90% winner payout / 10% platform fee
  ↓
League completed
  ↓
Next gameweek instances
```

## Wallet

The user sees:

- Available balance
- Reserved balance
- Total balance
- Full transaction history

Transactions are immutable ledger records containing:
- type
- amount
- status
- balance before/after
- reserved balance before/after
- league
- M-Pesa reference
- idempotency key
- timestamp
- metadata

All money values are integers in Kenyan shillings (whole KSh units). If the business later needs sub-shilling accounting, change the unit consistently across the system.

## Important production work

This repository is a deployable foundation, not a claim that real-money production operations are legally or operationally ready.

Before taking real-money entries:
- Complete and test Daraja STK Push and B2C flows.
- Add phone OTP verification/SMS provider.
- Add robust auth rate limiting and CSRF/session hardening.
- Implement complete official FPL scoring, including bonus/BPS and final-gameweek data.
- Implement squad formation/transfer rules and lock deadlines.
- Implement settlement in database transactions with idempotency.
- Add admin authentication/authorization UI and audit controls.
- Add reconciliation jobs for M-Pesa.
- Add monitoring and alerting.
- Obtain the required Kenyan legal, gaming, payment and data-protection advice/approvals for the actual business model.

## GitHub

```bash
git init
git add .
git commit -m "Initial Fantasy Ligi application"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY
git push -u origin main
```

## License

Private project. Add the appropriate commercial license before public distribution.
