# Core vs Pro — Open source boundary

This document is the **contract** for what ships in the **free / open-source** build versus what stays **commercial (Pro)** only. The **`luckee-open-source` web app implements the free slice** (dashboard, leads, customers, projects, tickets, time tracking). Pro UI and OSS-v1 Costs have been removed from this tree. Use it when aligning the Express API ([mentorai-server](https://github.com/trouthouse-tech/luckee-open-source-express-server) / public fork) with this client.

**Last updated:** 2026-03-21

---

## 1. Product tiers (only two)

### Free (open source)

End-user capabilities intended for the public repos:

| Area | Notes |
|------|--------|
| **Dashboard** | Home / overview after sign-in |
| **Leads** | Find leads (e.g. maps scrape flows), email queue, lead contacts, sent emails, lead detail flows |
| **Customers** | Customer records |
| **Projects** | Project tracking |
| **Tickets** | Ticket / issue tracking |
| **Time tracking** | Time entries |

**Explicitly not in the first OSS app build**

- **Costs** — remove UI, nav, thunks, and dedicated costs APIs from the OSS tree until you intentionally add it back as part of **free** (same tier; just not v1 of the cut).
- **Pro** features below — no UI, no client calls, no server routes.

### Pro (commercial, not in OSS)

| Area | Notes |
|------|--------|
| **Business coach** | Chat / exchanges, “My Data” exchange views, recent-request aggregation |
| **Context & facts** | Memory facts, fact versions, domain fact tables used only for coach context |
| **Fundraising** | Pitch deck and related fundraising UI |

---

## 2. Repositories

| Role | Private source | Public target (planned) |
|------|----------------|-------------------------|
| Web | `luckee-web` | `trouthouse-tech/luckee-open-source` |
| API | `mentorai-server` | `trouthouse-tech/luckee-open-source-express-server` |

---

## 3. Express server — domain routers to **omit** in OSS

In `mentorai-server/index.ts`, the OSS build should **not** mount (remove imports + `app.use`):

| Mount prefix | Reason |
|--------------|--------|
| `/api/business-coach` | Pro — coach AI |
| `/api/fact-extractor` | Pro — fact pipeline for coach |
| `/api/pot-notes` | Other product surface; not Luckee OSS |
| `/api/bitit` | Other product surface |
| `/api/spotter` | Other product surface |
| `/api/testing` | Dev / test harness |
| `/api/summarizer` | Not part of agreed free Luckee scope |

Keep for the free app only what the stripped **luckee-web** still calls (health, `api/data/*` allowlist, email, webhooks, cron, stats, summaries, users — see inventory pass).

---

## 4. Express server — `/api/data/*` routers to **omit** in OSS (Pro / coach)

These are registered in `mentorai-server/src/data/index.ts`. **Do not expose** in the public API build:

- `/facts`, `/fact-versions`
- All **`*-facts`** routers (company, competition, customer, finance, goals, identity, legal, marketing, operations, people, product, sales, strategy)
- `/business-coach-exchanges`

**MentorAI-mobile / legacy** data routes (personas, sessions, mentor-*, credits, IAP, paywall, badges, reports, chat-messages, feedback, etc.) are **not** part of Luckee free scope — **remove** from the OSS server unless the inventory proves the OSS web app still calls them (it should not after the cut).

---

## 5. Express server — `/api/data/*` **candidates** for free (verify before locking)

These align with the **free** feature list. **Final allowlist** must match a grep of the OSS web app’s `SERVER_URL` / `apiClient` / `fetch` usage after Pro and Costs code is deleted:

| Prefix | Maps to free feature |
|--------|----------------------|
| `/users` | Auth profile / user rows |
| `/customers` | Customers |
| `/leads` | Leads |
| `/lead-categories` | Lead taxonomy |
| `/lead-contacts` | Lead contacts |
| `/lead-sent-emails` | Sent mail log |
| `/lead-contact-email-queue` | Outbound queue |
| `/lead-contact-emails` | Email threads / bodies as modeled |
| `/lead-contact-email-attachments` | Attachments (if used) |
| `/lead-notes` | Notes |
| `/lead-costs` | **Drop for OSS v1** if only used by Costs; **keep** if still required by leads workflows — decide in inventory |
| `/campaign-email-variations`, `/campaign-leads`, `/campaign-disqualifications` | Lead email campaigns (if free UI uses them) |
| `/projects` | Projects |
| `/tickets` | Tickets |
| `/time-entries` | Time tracking |
| `/website-scrape-runs` | **Note:** luckee-web also references `google-maps-scrape-runs` — confirm actual router name in server and parity |

---

## 6. Pro — client-visible API paths (strip from OSS web + block on OSS server)

Documented call sites in current `luckee-web` (remove with Pro UI):

| Method / path | Used for |
|---------------|----------|
| `GET /api/business-coach/recent-requests` | Coach history |
| `GET /api/data/business-coach-exchanges` | All exchanges / My Data |
| `GET /api/data/facts` | Context & facts |
| `GET /api/data/fact-versions` | Fact history |

Any **POST** coach chat or onboarding routes under `/api/business-coach/*` or related services must be removed from the OSS client; ensure server mounts are gone.

---

## 7. Database strategy (choose one before publishing migrations)

**Option A — Minimal schema**  
Public migrations create only tables the **free** app uses. Cleanest for self-hosters; more work to maintain vs private.

**Option B — Full private schema**  
Ship same Supabase schema; document tables as “unused in OSS.” Faster first release; confusing for adopters.

**Decision:** _record here when chosen._

---

## 8. Verification checklist (run before tagging OSS)

1. Grep OSS web for `NEXT_PUBLIC_SERVER_URL`, `SERVER_URL`, `` `/api/` ``, and `apiClient` — build a **sorted unique list** of paths.
2. Every path must either be implemented on the OSS server or removed from the client.
3. Grep OSS server `createDataService` + root `index.ts` — no Pro mounts, no Mentor-only junk.
4. `next build` and API smoke test against a fresh DB or documented seed.
5. No secrets in repo; `.env.example` only.

---

## 9. Porting changes from private → OSS later

When you fix a **free** feature in private (e.g. lead detail), mirror the same paths in the OSS repo. Folders that are good “sync candidates” (adjust after your cut):

- Web: `src/packages` and `src/api` for leads, customers, projects, tickets, time tracking, dashboard
- Server: `src/data/leads*`, `lead-*`, `customers`, `projects`, `tickets`, `time-entries`, shared `services/`, `routes/users`

Do **not** blindly port `business-coach`, `facts`, `pitch-deck`, or costs-only code until you explicitly expand OSS scope.

---

## 10. Copy of this doc

When the Express repo is published, duplicate or link this file there (`docs/CORE_VS_PRO.md`) so server-only contributors see the same contract.
