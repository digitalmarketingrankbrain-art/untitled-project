# Phase 4 — Brand & Design System

Builds on Phases 1–3 (approved). This phase proposes an **original** brand and visual system — nothing here is derived from the reference site's look, only from the institutional tone and trust requirements established in Phase 1.

---

## 0. Working Name Proposal

No name was provided. Three original candidates, none matching any known existing accreditation body (verify trademark/availability before real-world use):

1. **Meridian Accreditation Board** (MAB) — *proposed working default, used from here on*
2. Concordia Accreditation Authority (CAA)
3. Northgate Accreditation Council (NAC)

`[PROPOSED — NOT A FACTUAL CLAIM — REPLACE OR CONFIRM]`. "Meridian" carries a precision/reference-point connotation (a meridian is a fixed, checkable line — apt for an org whose core promise is *checkable* status) without implying geography, government affiliation, or scale. All later phases use "Meridian Accreditation Board" / "MAB" as a placeholder; swapping it later is a find-and-replace, not a redesign.

---

## 1. Brand Direction

**Brand personality:** Precise. Steady. Unembellished. Independent. The kind of organisation that would rather be correct than impressive.

**Visual personality:** Quiet confidence — structured, editorial, document-literate. Closer to a well-run regulator's or standards body's publication than a startup product. Deliberately *not*: gradient-heavy SaaS, big rounded blob illustrations, stock photos of people in suits shaking hands, oversized friendly emoji-style icons, or dark-mode-hacker-tool aesthetics.

**UI principles:**
- Clarity beats decoration on every screen — if a visual choice doesn't help someone understand status, process, or content faster, cut it.
- Structure is the trust signal. Consistent grids, aligned data, predictable placement do more for credibility here than color or imagery.
- Status is never color-only. Every status (verification, application, assessment) pairs color + icon + text label, for both accessibility and because color-only status is exactly the kind of shortcut a low-credibility site would take.
- Numbers and reference codes (accreditation numbers, dates, audit entries) are always set in tabular/monospace figures — it visually signals "this is a precise, checkable record," not prose.
- Whitespace is generous but purposeful, not empty-SaaS-landing-page spacing. Density increases appropriately inside the portal (a working tool) versus the public site (a reading experience).

**Photography/illustration direction:** No generic "trust" stock photography (handshakes, smiling people in blazers) and no flat-illustration blob style. Preferred: real documentary-style photography of actual process/environment (labs, inspection, document review) once available; until then, abstract structured-line motifs (grid lines, scope diagrams, subtle geometric patterns derived from the type system) rather than any illustration or stock photo. `[PLACEHOLDER — no real photography exists yet; Phase 5+ will use the geometric/graphic system, not placeholder stock photos]`.

**Iconography:** A single consistent line-icon set, ~1.5px stroke, minimal corner rounding, geometric and precise rather than playful/rounded. Icons are functional (status, navigation, document type) — never purely decorative.

---

## 2. Colour System

Warm-neutral paper background (not stark white, not cold SaaS gray) with a dark ink-navy primary — evokes a printed institutional report more than a screen-native product.

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#13233E` | Header/nav, primary buttons, headings on light surfaces |
| `primary-hover` | `#0C1729` | Primary button hover/active |
| `secondary` | `#1F4E5F` | Secondary actions, links, in-portal accents |
| `accent` | `#B8722A` | Sparse emphasis only — eyebrow labels, small highlights, active nav underline. **Never** the default button color (keeps CTA tone institutional, not salesy) |
| `background` | `#F7F5F1` | Page background (public site) |
| `background-portal` | `#F4F5F6` | Page background (portal — cooler, denser, tool-like) |
| `surface` | `#FFFFFF` | Cards, panels, modals |
| `border` | `#DCD7CD` | Default borders, dividers on `background` |
| `border-portal` | `#D7DAE0` | Borders inside portal |
| `text` | `#1B2430` | Primary text |
| `text-muted` | `#5B6472` | Secondary text, captions, metadata |
| `text-inverse` | `#F7F5F1` | Text on `primary`/dark surfaces |
| `success` (Active) | text `#1B6B41` / surface `#E5F3EA` | Verification: Active; success alerts |
| `warning` (Suspended) | text `#8A5A0B` / surface `#FBEFDA` | Verification: Suspended; warning alerts |
| `error` (Withdrawn) | text `#A62F27` / surface `#FBEAE9` | Verification: Withdrawn; destructive actions, error alerts |
| `info` / neutral (Expired, Not Found) | text `#4B5563` / surface `#EEF0F2` | Verification: Expired/Not Found; informational alerts |

All text/surface pairs above are chosen for ≥4.5:1 contrast at normal text size; exact ratios to be re-verified with an automated contrast checker once implemented as CSS (WCAG AA minimum, AAA where feasible for body text).

**Deliberate choice:** the accent color (amber) is used *sparingly* — this is not a "brand color everywhere" system. A verification-status color system (success/warning/error/info) is treated as equally important as the brand palette, because status legibility is a Phase 1 trust requirement, not a decoration.

---

## 3. Typography

| Role | Typeface | Notes |
|---|---|---|
| Display / H1 | **Source Serif 4** (serif, medium/semibold) | Used only for hero headlines and top-of-page titles — gravitas, used sparingly |
| H2 / H3 | **IBM Plex Sans** (semibold) | Sans below the top of page keeps long content scannable rather than decorative throughout |
| Body | **IBM Plex Sans** (regular) | Chosen over more generic sans (e.g. Inter) specifically to avoid the now-ubiquitous SaaS-template look |
| Small / caption | IBM Plex Sans (regular, reduced size) | Metadata, captions, timestamps |
| Labels / buttons | IBM Plex Sans (medium, slight letter-spacing on all-caps labels only) | |
| Data / table / reference codes | **IBM Plex Mono** | Accreditation numbers, dates in tables, audit log entries, verification reference codes |

**Type scale (desktop):**

| Level | Size / Line-height |
|---|---|
| Display | 48px / 56px |
| H1 | 36px / 44px |
| H2 | 28px / 36px |
| H3 | 22px / 30px |
| Body | 16px / 26px |
| Small | 14px / 20px |
| Label | 13px / 16px, uppercase, 0.02em tracking |
| Data/mono | 14px / 22px |

Mobile scale steps down roughly one level per heading tier (Display→36/44, H1→28/36, H2→22/30) to avoid oversized type dominating small viewports.

---

## 4. Component Visual Rules

- **Header:** `background: surface`, bottom `border`, logo left, primary nav center/right, "Verify" as a distinct nav item (not styled as a dropdown), Login as a text link, primary CTA as a solid `primary` button. Sticky on scroll with a subtle shadow, not a background color change.
- **Navigation / mega menu:** Flat panel on `surface`, `border` outline, no shadow-heavy dropdown; grouped by section with a one-line description per link (not just link lists) — reinforces "informational institution," not "app menu."
- **Buttons:** Primary = solid `primary` bg / `text-inverse` text, 6px radius (not pill-shaped — pill buttons skew consumer/SaaS). Secondary = `surface` bg, `primary` border + text. Tertiary/text = `secondary` colored text link with underline on hover, not a button shape. Destructive = `error` outline/solid per context.
- **Links:** `secondary` color, underline on hover (not always-on underline in body copy; always-on in dense data tables for scanability).
- **Cards:** `surface` bg, 1px `border`, 8px radius, no drop shadow at rest — a 2px shadow only appears on hover for interactive cards (program cards, resource cards). Flat by default; institutional, not "floating SaaS card."
- **Badges / status indicators:** Pill-shaped (the one deliberate exception to "no pills," since compact status chips read clearly as pills), colored per the semantic table in Section 2, always icon + label, never color-only. Verification status badges are larger and more prominent than internal portal status badges.
- **Forms / inputs / selects:** 1px `border`, 6px radius, `primary` focus ring (2px, visible, not just a color change — keyboard accessibility), label always above field (never placeholder-as-label), required-field marker explicit, inline validation messages follow the "what happened → what it means → what to do" microcopy rule from the project brief.
- **Tables:** Header row `background-portal` tint, `border` row dividers (not zebra-striping, which can read noisy at institutional density), numeric/date columns right-aligned in mono, sortable columns indicated with a small icon, sticky header on scroll for long tables (admin/assessor portals).
- **Alerts:** Left-border accent (4px, semantic color) + tinted background + icon + text — not full-bleed colored banners, which skew more "marketing announcement" than "system message."
- **Modals:** `surface` panel, `border`, moderate shadow (this is the one place a stronger shadow is appropriate, since it needs to visually separate from page content), explicit close control, focus-trapped.
- **Accordions / tabs:** Used for FAQs (accordion) and dense portal detail pages (tabs) — plain underline-style tabs, not pill/button tabs, to keep with the flat institutional language.
- **Breadcrumbs:** Small, muted text, `/` separators, present on every page two levels deep or more (public and portal) — supports the "can I get back to where I was" requirement.
- **Pagination:** Numbered, not infinite scroll — tables and directories are reference material users may need to cite a specific page/position of, which infinite scroll undermines.
- **Search:** Prominent on `/verify`, restrained elsewhere (icon-triggered on public site header, always-visible field in portal data views).
- **Empty states:** Icon + one-sentence explanation + a specific next action (never a bare "No results").
- **Error states:** Same what-happened/what-it-means/what-next structure as form validation; never a raw stack trace or generic message.
- **Loading states:** Skeleton placeholders for content-heavy views (tables, dashboards), simple inline spinner for button actions — never a full-page blocking spinner for partial-page loads.
- **Toasts:** Bottom-right on desktop, bottom-full-width on mobile, auto-dismiss for confirmations, persistent (manual dismiss) for anything requiring acknowledgement (e.g., a failed submission).
- **Footer:** Dense, structured link columns on `primary` dark background (the one large use of the dark primary color) with `text-inverse` — footer as "institutional archive" of every policy/legal/contact link, reinforcing transparency.

---

## 5. Responsive Behaviour

- **Desktop (≥1200px):** Full mega menu, multi-column layouts, data tables shown in full.
- **Tablet (768–1199px):** Mega menu collapses to a simpler dropdown; homepage/program grids drop from 3 to 2 columns; portal sidebar collapses to icons-with-labels-on-hover.
- **Mobile (<768px):** Full hamburger nav with the same descriptive-link-list style as desktop mega menu (not a bare link dump); single-column throughout; data tables convert to stacked card rows per record (not horizontal-scroll-only, though horizontal scroll remains available as a fallback for genuinely wide tables like audit logs); portal sidebar becomes a bottom or slide-in nav; CTAs full-width and thumb-reachable; verification search field is the first thing visible on `/verify`, no scrolling required.

---

## 6. Assumptions

1. "Meridian Accreditation Board" is a placeholder name pending your real choice or confirmation.
2. No real photography exists — Phase 5+ visuals will use the geometric/graphic system instead of stock imagery.
3. Google Fonts (Source Serif 4, IBM Plex Sans, IBM Plex Mono) are proposed as free, self-hostable, non-genericized choices; can be swapped without structural impact if you have licensing preferences.

## 7. Questions / Decisions Needed

1. Keep "Meridian Accreditation Board," pick one of the other two candidates, or provide a real name now?
2. Any existing brand constraints (a logo already made, a color already in use elsewhere) this needs to work around?

Neither blocks proceeding — Phase 5 can be built entirely with the placeholder name/mark and swapped later.

---

## Next Phase

**Phase 5 — Homepage UX/UI**: full section-by-section homepage design using this design system and the Phase 3 copy.
