# Caza de Recompensas — website specification

## Purpose and scope

Build a Spanish-language, mobile-first website for the Móstoles GO treasure hunt during Área Silvestre Global on 14–15 November 2026. Visitors should be able to understand the two daily challenges, read the verification rules, copy Pokémon GO search filters, and track missions with a nickname.

The site shows a separate leaderboard for each day. It does not verify catches, connect to Campfire or Pokémon GO, submit evidence, or award prizes. Organizers still verify retained Pokémon and Campfire check-in in person.

## Source of truth and editing model

- `src/data/hunt.json` contains the event identity, display copy, shared rules, search guidance, days, and missions. The UI must render from this file rather than containing Saturday- or Sunday-specific mission logic.
- Every event, day, and mission has a stable ID. A new hunt should receive a new event ID. If the meaning of an existing mission changes, give it a new mission ID so saved checkmarks do not silently apply to a different objective.
- The database contains the hunt ID and each day/mission ID and point value from JSON. Keep the database catalog in sync when publishing a new hunt or changing a mission. The server validates completion IDs against this catalog and calculates leaderboard points from it; the browser never submits point totals.
- Mission order follows array order. Daily point totals are computed from mission points rather than typed separately into the UI.
- A mission may have `searchFilter: null`; these missions show a verification label and no copy control.
- Display dates, deadlines, and mission wording are editorial data. The app does not automatically lock a day at its deadline: players may use their checklist afterward, while the published rules explain what can be presented for official verification.

## Page structure

- `/` is the home page. It holds the event hero, dates, overview counts, and clear links to the four other pages.
- `/missions` is the treasure hunt page. Before a player can mark missions, it asks for a nickname and signs them in anonymously with Supabase. It has a day switcher for Saturday 14 and Sunday 15, each day's theme and presentation deadline, mission cards, and the player's server-backed score. Each mission card includes its number, title, objective, points, completion checkbox, and either a copyable Pokémon GO filter or a verification note.
- `/leaderboard` shows a day switcher and a simple nickname/points list for the selected day. It requires the same anonymous sign-in. Players with no completed missions appear with zero points. Equal scores share a rank and are ordered by nickname for a stable display.
- `/rules` holds the shared rules, in-person verification requirements, and tie breakers.
- `/tools` holds the copyable base filter and search guidance, including the 24-hour meaning of `edad0` and the limits of search filters.
- The shared header links between all five pages, including on mobile. Each page has its own title and description. The footer reminds visitors that official verification happens in person.

## Anonymous sign-in and progress

- A nickname is required before starting the checklist. Nicknames are trimmed, 2–24 characters long, and unique within a hunt without regard to case. The nickname belongs to the anonymous Supabase user ID and is reused across the hunt's days. A duplicate nickname shows a clear error and lets the player try another.
- A returning anonymous session resumes its hunt participant and progress. Anonymous accounts cannot be recovered after sign-out, cleared browser data, or a device change; explain this briefly where the nickname is entered. Auth may retain its session in browser storage, but mission progress must never be stored in `localStorage`.
- A player marks a mission complete or incomplete manually. The checkbox is disabled while the save is pending; success updates the displayed state and failure leaves the last server-confirmed state with a retryable error.
- Each day's completed mission count and score update from the checked mission IDs and mission point values. The full day remains 10 missions and 50 points until the JSON changes.
- On load and after refresh, fetch the current user's completed mission IDs for the hunt from Supabase. Keep the selected day in page state. Preserve separate progress for each day and ignore IDs absent from the current JSON when displaying scores.
- A server or network error must show an error and retry control. It must not silently appear as an empty checklist or leaderboard.
- The completion state is self-reported. The UI must avoid wording that implies official validation, especially for Campfire check-in and merchandise eligibility.

## Database and API behavior

- Use Supabase anonymous Auth and its publishable browser key. Never expose a service-role or secret key in the app or build.
- Store hunts, their day/mission IDs and point values, hunt participants keyed to Supabase Auth user IDs, and completed missions. One participant can join multiple hunts; each hunt keeps its own nickname and completions.
- Authenticated operations let a player read only their own completed missions, add a valid mission completion, and remove their own completion. Database constraints prevent duplicate records and missions from another hunt or day. Players cannot write point values or another player's progress.
- An authenticated leaderboard operation accepts the hunt and day IDs and returns only `{ name, points }` for participants in that hunt. The server sums the selected day's completed mission points, including zero-point participants. The app does not read other players' completion records.
- Enable row-level security on exposed tables and restrict table and function privileges to the required operations. A signed-out visitor cannot read or change progress or fetch a leaderboard.

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

- Vite + React + TypeScript, with root `index.html`, page components under `src/pages/`, and React Router for `/missions`, `/leaderboard`, `/rules`, and `/tools`. The static build needs an `index.html` fallback for direct visits and refreshes. `public/_redirects` provides this on Cloudflare Pages; other hosts need an equivalent rewrite.
- Keep data types and Supabase access logic separate from presentation components.
- Provide the Supabase project URL and publishable key as Vite build variables in development and deployment. Google Fonts may be used with a system sans-serif fallback.
- `npm run typecheck` and `npm run build` must pass. Verify the production page can be served from `dist/`.

## Acceptance criteria

- Both days show all 10 missions, correct point values, deadlines, filters, and rules from the supplied brief.
- Each day computes a maximum of 50 points. Server-saved checkmarks affect only their own day, survive refresh, and can be unchecked.
- A player can join with a unique nickname, resume with the same anonymous session, and see a separate daily leaderboard showing names and server-calculated points. Duplicate nickname registration fails clearly.
- Invalid mission IDs, wrong-day missions, duplicate completions, and attempts to access or change another player's progress are rejected by the database.
- Every present filter has a working copy control; the Campfire mission has no copy control.
- Changing the event JSON to another set of days or missions does not require changes to the page components.
- The layout works on narrow and wide screens and remains usable with a keyboard.
- All five page URLs load directly with a host fallback, navigation works between them, and the mission checklist survives page changes and refreshes.
