# Phase 15 — Final Polish & Launch

Builds on Phase 14 (Testing, approved). This phase is a launch-readiness checklist and set of documented recommendations, not new application code — the remaining gaps are either real-world decisions only the user can make (domain, hosting account, payment/email vendors, legal review of policy text) or steps that need credentials/access this environment doesn't have.

---

## 1. Production checklist

| Item | Status |
|---|---|
| Application builds cleanly for production (`npm run build`) | ✅ Done, re-verified every milestone |
| TypeScript strict mode, zero errors | ✅ Done |
| ESLint, zero errors/warnings | ✅ Done |
| Database schema + migrations | ✅ Done (Prisma, Postgres 17, ~34 tables) |
| Least-privilege DB role for the running app | ✅ Done (`app_user`, see `prisma/grants.sql`) |
| Auth (session, MFA, RBAC) | ✅ Done |
| Rate limiting on credential-guessing surfaces | ✅ Done — **in-memory, single-instance only** (see §5) |
| Security response headers (CSP, HSTS, etc.) | ✅ Done |
| Audit logging, append-only at the DB grant level | ✅ Done |
| SEO (robots.txt, sitemap.xml, metadataBase, favicon) | ✅ Done |
| `NEXT_PUBLIC_SITE_URL` set to the real domain | ❌ Placeholder — **blocks correct SEO URLs** |
| Real production Postgres instance provisioned | ❌ Not done — needs a hosting decision |
| Payments (Stripe) | ❌ Deferred — no credentials (Phase 13 Milestone 15) |
| Email delivery (vendor TBD) | ❌ Deferred — notifications currently log-only |
| Document storage — S3/R2 | ⚠️ Currently local filesystem (`storage/`), same shape as object storage so the swap is a config change, not a rewrite — but the swap itself hasn't been done |
| Applications/Assignments/Invoices/Messages/Competence/Availability/Verification-records fully on Postgres | ⚠️ Partial — Users, Documents, Notifications, Audit log are real; these remain in-memory (see Milestone 12 notes in `PROGRESS.md`) |
| Real institutional facts (legal name, registration, accreditation body's own credentials, jurisdiction) | ❌ Placeholder throughout, by design — never fabricated per the project's core rule |
| Legal page body text (Terms, Privacy, Accessibility Statement) | ❌ Placeholder structure only — flagged since Phase 6 as needing real legal review |
| `npm audit` build-tooling advisories | ⚠️ Known, accepted risk (see Phase 14 §4) — revisit with a dedicated Next 16 evaluation |
| Device-lab / visual regression testing | ❌ Not performed — no device lab in this environment |
| Live accessibility audit (screen reader, Lighthouse) | ❌ Not performed — no browser tooling in this environment |
| Monitoring / error tracking | ❌ Not configured — no vendor chosen (see §4) |
| Analytics | ❌ Not configured — no vendor chosen, and needs a privacy-policy decision first (see §6) |
| Automated backups | ❌ Not configured — depends on hosting choice (see §3) |

## 2. Deployment strategy

Phase 11 evaluated and recommended Vercel for hosting, given the Next.js App Router stack — it's the path of least friction for this codebase specifically (zero-config App Router support, no `AUTH_TRUST_HOST` needed, preview deployments per branch). That recommendation still holds. A self-hosted alternative (Docker on any VPS/cloud VM, `next start` behind Nginx) works too — it's mechanically how this environment's own production tests in Phase 14/17 were run — but needs `AUTH_TRUST_HOST=true` and a process manager (systemd/pm2) instead of Vercel's managed runtime.

Either way, before the first real deploy:
1. Provision a real Postgres instance (Vercel Postgres, Neon, RDS, or self-managed) and run `prisma migrate deploy` against it (not `migrate dev`, which the app has been using locally).
2. Apply `prisma/grants.sql` against that instance to create the restricted `app_user` role — the production `DATABASE_URL` must use `app_user`, never the superuser/owner role, for the same reason it matters locally: it's what makes the audit log actually append-only rather than append-only by convention.
3. Set every variable in `.env.example` that applies to the chosen host.
4. Point DNS at the new host and set `NEXT_PUBLIC_SITE_URL` accordingly.

This project has no CI/CD pipeline configured yet (no `.github/workflows`, no `vercel.json`) — setting one up is straightforward once a host is chosen, but wasn't built since it depends entirely on that choice.

## 3. Backup strategy (recommendation, not yet configured)

No backups exist today because there's no production database yet — this is a recommendation for whichever managed Postgres is chosen:
- Enable the provider's automated daily snapshots with at least 7-day retention (Neon, RDS, Vercel Postgres, and Supabase all offer this natively — don't hand-roll `pg_dump` cron jobs unless self-hosting Postgres directly).
- The `audit_logs` table is the one table that must never be restorable-over — a restore that silently overwrote audit history would defeat its whole purpose. If self-hosting, back it up separately or verify the provider's point-in-time recovery doesn't let audit rows be selectively dropped without a paper trail of the restore itself.
- Document storage (`storage/documents/` locally, or S3/R2 once migrated) needs its own backup/versioning — S3/R2 versioning + a lifecycle policy is sufficient once that migration happens; the current local-disk storage has no backup at all and should not be used past a real production deploy.

## 4. Monitoring & error tracking (recommendation, not yet configured)

No vendor is wired up. Given the stack:
- **Errors:** Sentry has first-class Next.js App Router support (server + client + edge) and would be the natural choice — not installed, since it needs a real account/DSN.
- **Uptime/logs:** Vercel's own dashboard covers request logs and function errors if deployed there; a self-hosted deploy needs its own log aggregation (even just structured `console.error` to the process manager's log file is a starting point).
- The audit log (Milestone 16) already gives real, durable, queryable **application-level** audit trail — that's a different concern from infrastructure monitoring/alerting and doesn't substitute for it.

## 5. Known architectural limitation to flag before scaling past one instance

The rate limiter (Milestone 17, `src/lib/rate-limit.ts`) and the password-reset token store (`src/lib/auth/store.ts`) are both in-process memory, documented as such at the time they were built. They work correctly for a single running instance (what this project has been tested against throughout) but **do not coordinate across multiple instances** — a horizontally-scaled deploy (multiple Vercel serverless invocations, multiple containers) would give each instance its own independent rate-limit/reset-token state, weakening both. Before scaling beyond one instance, replace both with a shared store (Upstash Redis was Phase 11's original suggestion for rate limiting specifically).

## 6. Analytics

Not configured — deliberately, not as an oversight. Two real prerequisites before adding any analytics:
1. A vendor decision (privacy-respecting options like Plausible/Fathom avoid the cookie-consent-banner requirement that a full Google Analytics setup would trigger under most jurisdictions' privacy law — relevant here since Phase 6's Privacy Policy page is still placeholder text pending real legal review).
2. That legal review should happen *before* analytics go live, not after, so the Privacy Policy accurately describes what's actually being collected instead of being retrofitted.

## 7. Final security checklist

Everything below was verified for real (not just written), per Milestones 11, 16, 17 and Phase 14 §4:
- [x] Least-privilege DB role (`app_user`), verified by attempting and confirming denied writes
- [x] Append-only audit log at the DB grant level
- [x] Password hashing (bcrypt), never plaintext, never logged
- [x] MFA (TOTP) mandatory for Admin/Assessor roles, enforced in middleware
- [x] RBAC enforced at both the route (middleware) and data-query level, not just UI hiding
- [x] Rate limiting on every credential-guessing surface (see §5's single-instance caveat)
- [x] Security response headers incl. CSP with no `unsafe-eval` in production
- [x] No secrets committed (`.env`/`.env.local` gitignored, spot-checked at every commit)
- [x] Session-authenticated (not public-URL) document downloads
- [x] Non-enumerating responses on password reset regardless of account existence or rate-limit state
- [ ] Dependency advisories — 2 known, accepted, build-tooling-only (Phase 14 §4) — revisit before launch
- [ ] Penetration test / third-party security review — not performed, recommended before handling real applicant PII/documents in production

---

## Summary

The application itself — every UI surface across public site, applicant/assessor/admin portals, verification, auth, documents, notifications, audit logging, and security hardening — is real, built, and tested end-to-end against a real Postgres database, not a mockup. What remains before a genuine public launch is almost entirely outside what code alone can finish: a real domain, a real hosting account, real payment/email vendor credentials, real institutional facts to replace the placeholders, real legal review of policy text, and a device-lab/accessibility/penetration-test pass that needs tooling and access this environment doesn't have. Every one of those gaps is listed explicitly above rather than glossed over, per the project's standing rule against fabricating readiness that isn't real.
