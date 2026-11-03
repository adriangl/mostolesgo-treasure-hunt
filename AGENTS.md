# Repository guide

## Project

This is the Spanish-language Móstoles GO treasure hunt companion for Área Silvestre Global 2026. It explains the missions and rules, offers copyable Pokémon GO search filters, and lets players track progress with a nickname. Supabase stores progress and powers a separate leaderboard for each day. The site does not perform official verification or provide evidence uploads.

Read `SPEC.md` for behavior and acceptance criteria, `DESIGN.md` for the visual system, and `README.md` for setup and editing guidance. The event facts and mission wording live in `src/data/hunt.json`.

## App structure

- Use the standard Vite layout: root `index.html`, React and TypeScript source under `src/`, and static assets under `public/`.
- Routes are `/`, `/missions`, `/leaderboard`, `/rules`, and `/tools`. URLs are English; visitor-facing labels and copy are Spanish. Page components live in `src/pages/`; shared UI lives in `src/components/`.
- React Router loads pages from `src/router.tsx`. A production host must serve `dist/index.html` for direct requests to the four subroutes. `public/_redirects` supplies the rewrite on Cloudflare Pages.
- GitHub Pages deployment runs from `.github/workflows/deploy-pages.yml` on pushes to `master` or a manual workflow dispatch. The workflow sets `PAGES_BASE_PATH` for Vite, writes route entry files, and creates a `404.html` fallback.
- Keep Supabase browser configuration in ignored `.env.local` for local development and in the two GitHub Actions variables named in `README.md` for deployment. Commit only `.env.example`; never put a secret or service-role key in a `VITE_` variable.
- Keep `dist/` and `node_modules/` generated and untracked.

## Hunt data and player progress

- Render days, missions, points, filters, deadlines, rules, and search notes from `src/data/hunt.json`. Do not add day-specific mission data or point totals to page components.
- Keep event, day, and mission IDs stable. Give a new hunt a new event ID; give a changed mission a new mission ID so old checkmarks do not carry over incorrectly.
- Progress is self-reported and stored in Supabase under the anonymous Auth user ID and hunt ID. Keep day progress separate. The browser may retain the Auth session, but never store mission checkmarks in `localStorage`.
- A nickname signs the player in with Supabase anonymous Auth before mission editing or leaderboard access. The session survives refresh in the same browser, but it cannot be recovered after sign-out, cleared browser data, or a device change. Nicknames are unique within a hunt, ignoring case.
- Keep Supabase access in `src/lib/huntApi.ts`. A player may read, add, or remove only their own completion records. The authenticated daily leaderboard returns only `{ name, points }`; the database calculates points from valid mission records. Keep row-level security and table/function grants aligned with these rules.
- The database mission catalog must match `hunt.json` IDs and points so the server can validate completions and calculate daily leaderboard scores. Keep `supabase/migrations/` and `supabase/config.toml` versioned.
- Keep visitor-facing score copy simple. Explain in-person verification in the rules or footer without repeatedly labeling points as self-reported.
- Copy Pokémon GO filters exactly as written in JSON. Missions with `searchFilter: null` have no copy button. Filters help find candidates but do not replace the in-person verification described in the rules.
- Pokémon names and game terminology are appropriate in mission copy. Keep the visual identity original; do not reuse the reference screenshot's logos, characters, or artwork.

## Design and checks

- Use `#101820` as the common page background. Keep the responsive layout, readable body copy, keyboard focus, and reduced-motion support described in `DESIGN.md`.
- Run `npm run typecheck` and `npm run build` after app changes. Check direct route loads when changing routing or deployment configuration.
- After changing Auth, database access, or leaderboard SQL, verify the authenticated API and row policies with temporary users; remove test records afterward.
- The site version is in `package.json` and `package-lock.json`; the footer reads it from `package.json`.
- Follow Conventional Commits for commit messages. The relevant local guides are `.agents/skills/vite-react-best-practices/`, `.agents/skills/supabase/`, `.agents/skills/supabase-postgres-best-practices/`, `.agents/skills/conventional-git/`, and `.agents/skills/publish-to-pages/`. `.claude/skills/` contains symlinks to those same guides.
