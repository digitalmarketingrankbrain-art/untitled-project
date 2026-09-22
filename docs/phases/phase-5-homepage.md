# Phase 5 — Homepage UX/UI

Builds on Phases 1–4 (approved). Uses the Phase 4 design system tokens/type scale and the Phase 3 homepage copy directly — this phase is the layout/interaction spec that ties them together, section by section.

Test against the hero's required answers throughout: **Who are you? What do you do? Why should I trust you? What should I do next?** — all four must be answerable before a visitor scrolls past section 2.

---

## 1. Header

**Purpose:** Orientation and access — never competes with the hero for attention.
**Layout:** `surface` background, 1px bottom `border`, sticky on scroll with a subtle shadow (no background color change on stick). Logo/wordmark left. Primary nav center-right: Accreditation (mega menu), Verify (single link, visually distinct — not a dropdown), About (dropdown), Resources (dropdown), News, Contact. Right-aligned: "Log In" text link, then primary button "Verify an Accreditation."
**Content:** Nav labels only — mega menu panels carry one-line descriptions per link (per Phase 4 component rule), not bare link lists.
**CTA:** Primary = Verify an Accreditation (header, not "Apply") — verification is the lowest-friction, highest-frequency action and belongs in the persistent header; Apply lives in the hero and final CTA instead.
**Interaction:** Mega menu opens on click (not hover-only, for touch/accessibility parity); closes on outside click or Escape; focus-trapped while open.
**Mobile:** Logo + hamburger only. Hamburger opens a full-screen panel with the same descriptive-link groups as desktop mega menu, "Log In" and "Verify an Accreditation" pinned at the bottom of the panel.

---

## 2. Hero

**Purpose:** Answer all four hero questions immediately, for all audience types.
**Layout:** Two-column on desktop — left ~55% text column, right ~45% an abstract geometric graphic panel (structured grid/reticle motif in `primary`/`accent`, not a photo or illustration — per Phase 4 direction). Generous top/bottom padding (institutional, not cramped).
**Content (from Phase 3):**
- Eyebrow: organisation name, small caps, `accent` color
- Headline (Display/serif): "Accreditation you can verify, not just trust."
- Description (body, `text-muted`): scope + process framing
- Primary CTA button: "Verify an Accreditation"
- Secondary CTA (text link with arrow): "Explore Accreditation Programs"
**Interaction:** No carousel, no auto-rotating claims — a single, static, confident statement. Graphic panel may have a very subtle static or slow-loop micro-animation (e.g., a line drawing itself once on load) but nothing continuously distracting.
**Mobile:** Single column, text first, graphic panel becomes a smaller decorative strip below the CTAs (not above — text must load/read first). Both CTAs full-width, stacked, primary on top.

---

## 3. Trust/Value Strip

**Purpose:** Immediate, low-effort trust signals for visitors who won't read further.
**Layout:** Full-width strip directly under hero, `surface` background distinct from hero, 3-column row on desktop (icon + short label + one-line text each).
**Content (from Phase 3, no fabricated claims):** Public real-time verification · Published governance & impartiality policy · Documented assessment & decision process. *(A 4th slot is reserved for a real, confirmable credential once provided — not filled with a placeholder tag, to avoid a visibly broken-looking trust strip.)*
**CTA:** None — informational only.
**Interaction:** Static; icons from the Phase 4 line-icon set.
**Mobile:** Stacks to single column, each item full-width with icon left/text right (not centered — centered stacked icons read as decorative rather than informational).

---

## 4. Accreditation Programs

**Purpose:** Let a prospective applicant self-identify their scope within seconds.
**Layout:** Heading + one-sentence intro, then a card grid — 3 columns desktop, 2 tablet, 1 mobile.
**Content:** One card per program (5 placeholder scopes from Phase 2/3): icon, program name, one-line scope description, "View program →" link. Cards use the Phase 4 flat-card style (no shadow at rest, 2px shadow on hover).
**CTA:** Each card links to `/accreditation/programs/[slug]`; section has no separate CTA — the cards are the CTA.
**Interaction:** Hover state = subtle shadow + border color shift to `secondary`, no scale/transform (avoid bouncy SaaS card hover).
**Mobile:** Single column stack, full-width cards; no horizontal swipe (swipeable card rows hide content from users who don't discover the gesture — inconsistent with the "nothing hidden" trust principle).

---

## 5. Why Accreditation Matters

**Purpose:** Explain the *concept* of accreditation for visitors unfamiliar with it, without resorting to statistics that don't exist.
**Layout:** Two-column: left = heading + body copy (Phase 3), right = a simple structured diagram (not a stat callout, since no verified stats exist): "Claim → Independent Assessment → Verifiable Record," three connected nodes in the line-icon style.
**Content:** Phase 3 copy verbatim; diagram labels only, no numbers.
**CTA:** None forced.
**Mobile:** Stacked, diagram becomes a simple vertical 3-step visual under the text.

---

## 6. How Accreditation Works

**Purpose:** Make the process itself a trust signal by being fully legible.
**Layout:** Horizontal 6-step stepper on desktop (connected by a thin line), each step a number + short title + one-line description; wraps to a vertical stepper on tablet/mobile.
**Content:** The 6 stages from Phase 3 (Apply → Review → Assessment → Decision → Accreditation → Ongoing), with Decision explicitly noted as independent of the assessor's recommendation (a specific trust detail worth surfacing here, not just in the full process page).
**CTA:** "Read the full process" (secondary button) linking to `/accreditation/how-it-works`.
**Interaction:** Static on load; steps are not clickable individually (avoid implying each step is a separate destination when the CTA already covers "read more").
**Mobile:** Vertical stepper, connecting line runs vertically along the left edge.

---

## 7. Verification

**Purpose:** The single highest-value action on the page — deserves visual distinction from surrounding marketing sections.
**Layout:** Full-width band with a visually distinct treatment — `background-portal` tint or a bordered panel — signaling "this is a tool, not copy." Centered heading + body + a real-looking search input (accreditation number / organisation name) with a primary button "Verify now," plus "No account required" microcopy directly beneath the field.
**Content:** Phase 3 copy; the input itself is the content.
**CTA:** Primary button submits to `/verify?q=...`; section CTA and header CTA both point to the same destination intentionally (redundant access to the platform's most important action is correct here, not duplicative clutter).
**Interaction:** Enter-to-submit. Field autofocus is NOT applied on the homepage — only on the dedicated `/verify` page — so the homepage doesn't hijack scroll/focus unexpectedly.
**Mobile:** Field and button stack full-width; section retains its distinct background treatment so it doesn't visually blend into the scroll.

---

## 8. Transparency / Resources

**Purpose:** Reinforce "nothing is hidden" with a concrete, browsable destination.
**Layout:** Heading + body, three inline link items with icons (Policies / Procedures / Forms) rather than a full card grid — this section supports Resources, it isn't the Resources page itself.
**CTA:** "Browse resources" secondary button.
**Mobile:** Three icon-links stack vertically.

---

## 9. Training

**Purpose:** Should-Have visibility for training without overweighting it against the Must-Have sections.
**Layout:** Deliberately smaller/quieter than sections 4–7 — a single-row band, heading + one line + CTA, not a full section with its own heading hierarchy weight.
**Content:** `[PLACEHOLDER — conditional per Phase 2 open question on whether Training stays permanent nav]`. If deferred, this section is simply omitted from the homepage (not shown empty/greyed out).
**CTA:** "View training" text link.
**Mobile:** Single stacked block, same reduced visual weight preserved.

---

## 10. Latest Resources / Notices

**Purpose:** Demonstrate the organisation is active and transparent, including about adverse events (Phase 3 principle: adverse notices are shown, not hidden).
**Layout:** Heading "Recent notices" + a row of 3 latest items (desktop), each: date (mono), category tag (routine/status-change — status-change tags use `warning`/`error` badge coloring, not a neutral tag, so a withdrawal notice is visually distinguishable at a glance), title, one-line excerpt.
**CTA:** "View all notices" link, right-aligned next to the heading.
**Interaction:** Pulled dynamically from `/news` (admin-published, per Phase 2/10) — not hardcoded.
**Mobile:** Single column stack, 3 items still shown (not truncated to fewer — this is short content).

---

## 11. Final CTA

**Purpose:** Last-chance conversion for visitors who scrolled the whole page without acting yet.
**Layout:** Full-width band on `primary` dark background, `text-inverse` type, centered content — the one large use of the dark primary color on the page (matches Footer's use of the same treatment, bookending the page).
**Content:** Phase 3 copy — "Ready to start?" heading, one-line body, two buttons.
**CTA:** Primary = "Start an Application" (light/inverse-styled button on dark bg), Secondary = "Verify an Accreditation" (ghost/outline button).
**Mobile:** Buttons stack full-width, primary on top.

---

## 12. Footer

**Purpose:** Institutional archive — the place a skeptical visitor or auditor goes looking for the page they expect to exist.
**Layout:** `primary` dark background, `text-inverse`, structured multi-column link groups (Accreditation, About, Resources, Legal, Contact), plus Complaints & Appeals and Report Fraud as explicitly separate, non-buried links, plus Accessibility Statement.
**Content:** Full sitemap-style footer per Phase 2 nav structure; no marketing copy in the footer, just structure.
**Mobile:** Columns collapse into stacked accordion groups to avoid an extremely long scroll of flat links.

---

## Section Order Rationale

Header → Hero → Trust strip → Programs → Why it matters → How it works → Verification → Transparency/Resources → Training → Notices → Final CTA → Footer.

This order deliberately puts **Verification after the process explanation, not before it** — a first-time visitor needs to understand what accreditation *is* (sections 4–6) before the verification tool means anything to them; a returning visitor who already knows what they want reaches it in one header click regardless of scroll position, since Verify is also in the header on every page.

---

## Assumptions

1. Training section's presence is still conditional on the open Phase 2 question; spec above accounts for both outcomes.
2. Hero graphic panel and "why it matters" diagram use the geometric/line motif system from Phase 4, not photography, since none exists yet.
3. Trust strip's 4th slot is left unfilled rather than placeheld, to avoid a visibly broken trust signal shipping by accident.

## Questions / Decisions Needed

None new — carries forward the still-open Phase 2/3/4 questions (Training nav permanence, real name, real scopes, any real trust-strip facts). None block proceeding.

I can also produce an actual rendered visual mockup of this homepage (not just the written spec) if that would be more useful to review before moving to Phase 6 — say the word and I'll build it.

---

## Next Phase

**Phase 6 — Internal Public Pages**: About, Governance, Accreditation program pages, Process, Resources, Training, Contact, FAQs, Complaints, Fraud reporting, Legal pages — layout, sections, copy, CTAs, and trust elements for each.
