# Fantasy Ligi production checklist

## Must complete before real-money launch

- [ ] Kenyan legal/regulatory review for paid fantasy/cash-prize operation
- [ ] Safaricom Daraja production credentials
- [ ] Registered/approved business payment configuration
- [ ] STK Push pending transaction mapping
- [ ] Duplicate callback/idempotency tests
- [ ] B2C withdrawal approval policy
- [ ] B2C result/timeout callbacks
- [ ] Wallet reconciliation job
- [ ] OTP phone verification
- [ ] Password reset
- [ ] Rate limiting
- [ ] Admin RBAC
- [ ] Audit log UI
- [ ] Full FPL scoring validation against official FPL results
- [ ] Squad constraints and transfer/hit accounting
- [ ] Deadline locking
- [ ] Gameweek settlement transaction tests
- [ ] Tie-breaker deterministic seeded draw
- [ ] Refund path tests
- [ ] Failure/retry tests
- [ ] Database backups
- [ ] Error monitoring
- [ ] Terms, privacy and responsible-play notices

## Weekly reset invariant

At the start of each new gameweek, the scoring query must filter by the current `gameweekId`. Never aggregate historical `GameweekScore` rows into the current competition leaderboard.

## Financial invariant

Never directly mutate a wallet without writing a corresponding immutable transaction record in the same database transaction.
