# UASL public website reference rebuild

Reference: https://uasl.uk.com/ (inspected 23 September 2026).
Content source: the existing `UASL_Design_and_Content_Prompt.md` supplied in this workspace, supplemented by the existing homepage copy.

## Changes

- Replaced the marketing-style homepage with the reference header, original four-slide photography, three contiguous blue service blocks, introductory text, accreditation diagram and five-column footer.
- Matched the public information, accreditation, schemes, careers and legal pages to simple white content pages. Static text lives in `frontend/src/lib/uasl-reference-content.json` and is rendered as paragraphs and semantic lists.
- Copied the reference header/footer logos, member logos, recognition certificate pages, slider images and procedure diagram into `frontend/public/images/uasl`. Images are served locally rather than hotlinked.
- Retained local routes, portal pages and existing search components. Added label associations, the existing shared country list, query prefill and an initially empty accredited-body search.
- Contact and feedback submit buttons open an email draft. They no longer falsely claim a message was sent.
- Cookie settings have keyboard focus management, saved preferences and a footer control to reopen them. No external font/map/video services are loaded by the new public components.
- Desktop dropdowns support hover and keyboard interaction. Mobile dropdowns use click interaction. The slider has direct selection, pause and reduced-motion handling.
- Public styling is scoped in `frontend/src/app/(public)/reference.css`. The reference's white background, blue blocks, original wording and traditional spacing intentionally override generic design defaults.
- Development output uses `.next-dev`; production uses `.next`, preventing concurrent dev/build manifest collisions.

## Validation

- Frontend TypeScript check: passed.
- Frontend ESLint: passed.
- Production build: passed; generated all 114 static pages.
- Browser: desktop and 390px mobile screenshots; homepage has no horizontal overflow or broken images; slider selection, dropdown navigation, cookie dialog and preferences, query prefill, country selection and sample search results checked.

## Limits

- Verification still uses the project's pre-existing mock records, now labelled as demo results. Live verification integration was not part of this layout/content change.
- Contact/feedback use an email draft; server-side delivery is not configured.
- This is a responsive recreation, not a pixel-identical export of the WordPress theme. Typography uses the reference-style sans-serif fallback. Footer colouring follows the supplied content/design specification.
- No deployment was performed.

The optional `node scripts/sync-uasl-content.mjs` command regenerates the 16 static route wrappers and content JSON from the supplied specification. It overwrites those generated files; edit the specification first if regenerating.
