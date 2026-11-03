# Caza de Recompensas — website specification

## Purpose and scope

Build a Spanish-language, mobile-first website for the Móstoles GO treasure hunt during Área Silvestre Global on 14–15 November 2026. Visitors should be able to understand the two daily challenges, read the verification rules, copy Pokémon GO search filters, and privately track which missions they believe they have completed.

This first version is a self-service companion. It does not verify catches, connect to Campfire or Pokémon GO, submit evidence, register participants, award prizes, or publish a leaderboard. Organizers still verify retained Pokémon and Campfire check-in in person.

## Source of truth and editing model

- `src/data/hunt.json` contains the event identity, display copy, shared rules, search guidance, days, and missions. The UI must render from this file rather than containing Saturday- or Sunday-specific mission logic.
- Every event, day, and mission has a stable ID. A new hunt should receive a new event ID. If the meaning of an existing mission changes, give it a new mission ID so saved checkmarks do not silently apply to a different objective.
- Mission order follows array order. Daily point totals are computed from mission points rather than typed separately into the UI.
- A mission may have `searchFilter: null`; these missions show a verification label and no copy control.
- Display dates, deadlines, and mission wording are editorial data. The app does not automatically lock a day at its deadline: players may use their checklist afterward, while the published rules explain what can be presented for official verification.

## Page structure

- `/` is the home page. It holds the event hero, dates, overview counts, and clear links to the three content pages.
- `/missions` is the treasure hunt page. It has a day switcher for Saturday 14 and Sunday 15, each day's theme and presentation deadline, mission cards, and the player's local score. Each mission card includes its number, title, objective, points, completion checkbox, and either a copyable Pokémon GO filter or a verification note.
- `/rules` holds the shared rules, in-person verification requirements, and tie breakers.
- `/tools` holds the copyable base filter and search guidance, including the 24-hour meaning of `edad0` and the limits of search filters.
- The shared header links between all four pages, including on mobile, without an extra action button. Each page has its own title and description. The footer reminds visitors that local progress is only stored in the current browser.

## Progress behavior

- A player marks a mission complete or incomplete manually. The checkbox state changes immediately.
- Each day's completed mission count and score update from the checked mission IDs and mission point values. The full day remains 10 missions and 50 points until the JSON changes.
- The selected day and checked mission IDs persist in `localStorage`, scoped to the event ID. Progress is browser-local, with no account or cross-device synchronization.
- Loading must tolerate missing, malformed, or inaccessible local storage by starting with empty progress. Unknown IDs saved by an older data version are ignored in calculations and the interface.
- The completion state is self-reported. The UI must avoid wording that implies official validation, especially for Campfire check-in and merchandise eligibility.

## Search-filter copying

- Missions with a search filter and the shared base filter display the exact string from JSON in selectable text with a compact copy icon button.
- The button's accessible name identifies the mission. On success, show a short visible confirmation and announce it to assistive technology; on failure, show a clear error and leave the filter selectable for manual copying.
- Never alter, translate, or silently append conditions to the copied string. The shared guidance explains why a filter alone cannot prove capture date, provenance, or lack of evolution.

## Visual and interaction design

- Follow `DESIGN.md` for the original Night Trail look: the shared `#101820` page background, navy accents, yellow highlights, Lato typography, spacious hero, rounded cards, strong focus rings, and restrained abstract trail artwork.
- Pokémon species, game terminology, event names, and mission wording are allowed where they describe the hunt. Use original visual assets rather than copying the reference page's logos or illustrations.
- Keep the mission list easy to scan on phones. Use large touch targets, readable 16px body copy, clear contrast, and responsive layouts.
- Use semantic headings, buttons, and checkbox controls. Support keyboard operation, visible focus, and reduced-motion preferences. The day switcher must communicate its selected state to assistive technology.

## Implementation

- Vite + React + TypeScript, with root `index.html`, page components under `src/pages/`, and React Router for `/missions`, `/rules`, and `/tools`. The static build needs an `index.html` fallback for direct visits and refreshes. `public/_redirects` provides this on Cloudflare Pages; other hosts need an equivalent rewrite.
- Keep data types and progress-storage logic separate from presentation components.
- No external API calls are needed for runtime features. Google Fonts may be used with a system sans-serif fallback.
- `npm run typecheck` and `npm run build` must pass. Verify the production page can be served from `dist/`.

## Acceptance criteria

- Both days show all 10 missions, correct point values, deadlines, filters, and rules from the supplied brief.
- Each day computes a maximum of 50 points. Checked missions affect only their own day, survive refresh, and can be unchecked.
- Every present filter has a working copy control; the Campfire mission has no copy control.
- Changing the event JSON to another set of days or missions does not require changes to the page components.
- The layout works on narrow and wide screens and remains usable with a keyboard.
- All four page URLs load directly with a host fallback, navigation works between them, and the mission checklist survives page changes and refreshes.
