# Repository guide

## Project

This is the Spanish-language Móstoles GO treasure hunt companion for Área Silvestre Global 2026. It explains the missions and rules, offers copyable Pokémon GO search filters, and lets players track their own progress in this browser. The site does not perform official verification or provide accounts, evidence uploads, or a leaderboard.

Read `SPEC.md` for behavior and acceptance criteria, `DESIGN.md` for the visual system, and `README.md` for setup and editing guidance. The event facts and mission wording live in `src/data/hunt.json`.

## App structure

- Use the standard Vite layout: root `index.html`, React and TypeScript source under `src/`, and static assets under `public/`.
- Routes are `/`, `/missions`, `/rules`, and `/tools`. URLs are English; visitor-facing labels and copy are Spanish. Page components live in `src/pages/`; shared UI lives in `src/components/`.
- React Router loads pages from `src/router.tsx`. A production host must serve `dist/index.html` for direct requests to the three subroutes. `public/_redirects` supplies the rewrite on Cloudflare Pages.
- Keep `dist/` and `node_modules/` generated and untracked.

## Hunt data and player progress

- Render days, missions, points, filters, deadlines, rules, and search notes from `src/data/hunt.json`. Do not add day-specific mission data or point totals to page components.
- Keep event, day, and mission IDs stable. Give a new hunt a new event ID; give a changed mission a new mission ID so old checkmarks do not carry over incorrectly.
- Progress is self-reported and stored only in browser `localStorage`, scoped by event ID. Preserve separate progress for each day and tolerate missing, malformed, or unavailable storage.
- Copy Pokémon GO filters exactly as written in JSON. Missions with `searchFilter: null` have no copy button. Filters help find candidates but do not replace the in-person verification described in the rules.
- Pokémon names and game terminology are appropriate in mission copy. Keep the visual identity original; do not reuse the reference screenshot's logos, characters, or artwork.

## Design and checks

- Use `#101820` as the common page background. Keep the responsive layout, readable body copy, keyboard focus, and reduced-motion support described in `DESIGN.md`.
- Run `npm run typecheck` and `npm run build` after app changes. Check direct route loads when changing routing or deployment configuration.
- The site version is in `package.json` and `package-lock.json`; the footer reads it from `package.json`.
- Follow Conventional Commits for commit messages. The relevant local guides are `.agents/skills/vite-react-best-practices/`, `.agents/skills/conventional-git/`, and `.agents/skills/publish-to-pages/`. `.claude/skills/` contains symlinks to those same guides.
