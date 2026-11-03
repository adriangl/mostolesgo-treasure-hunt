# Caza de Recompensas · Móstoles GO

Website for the 14–15 November 2026 treasure hunt. It explains the missions and rules, provides copyable Pokémon GO search filters, and saves player checklists and daily leaderboards in Supabase.

## Run locally

```sh
npm install
cp .env.example .env.local
npm run dev
```

Edit `.env.local` before starting the app: set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the Supabase project's API settings. `.env.local` is ignored by Git.

Run `npm run typecheck` and `npm run build` to validate a production build. The static output is in `dist/`.

The site has five routes: `/` (home), `/missions`, `/leaderboard`, `/rules`, and `/tools`. The repository uses the usual Vite layout: `index.html` at the root, React page components in `src/pages/`, and shared UI in `src/components/`. React Router loads each page on demand. Navigation labels and page copy remain in Spanish.

Production hosts must serve `dist/index.html` for requests to `/missions`, `/leaderboard`, `/rules`, and `/tools` so direct links and refreshes work. `public/_redirects` supplies that rewrite on Cloudflare Pages; configure an equivalent fallback on other hosts.

## Supabase setup

The app uses Supabase project `ukqmoasozstmxqanytid`. Commit only `.env.example`; keep actual values in the ignored `.env.local` for local development. Never put a secret or service-role key in a `VITE_` variable. Supabase Auth has anonymous sign-in enabled in `supabase/config.toml`; `supabase/migrations/` defines the database tables, row policies, and daily leaderboard function.

To use another Supabase project, change the two values in `.env.local`, apply the migrations with the Supabase CLI, and enable anonymous sign-ins for that project. The browser keeps the anonymous Auth session so the player can return; mission completions live only in Supabase. A cleared browser or different device cannot recover an anonymous account.

## GitHub Pages deployment

`.github/workflows/deploy-pages.yml` builds and deploys the site on pushes to `master`. You can also run **Deploy to GitHub Pages** from the repository's Actions tab using **Run workflow** on `master`. The workflow sets Vite's project base path from the repository name, writes an `index.html` for each route, and adds a `404.html` fallback. The expected URL is `https://adriangl.github.io/mostolesgo-treasure-hunt/`.

Before deploying, create GitHub repository **Actions variables** named `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` with the same public values used in `.env.local`. The workflow passes them to Vite at build time and stops if either is missing. Vite includes these public values in the browser bundle; no `.env` file is deployed or committed.

## Edit this or create another hunt

All event-specific content is in [`src/data/hunt.json`](src/data/hunt.json): event details, days, missions, point values, filters, rules, and search notes. The page renders however many days and missions are listed there, and calculates totals from the mission points.

- Give a new hunt a new event `id`. Player registration, completions, and leaderboards are scoped to that ID in Supabase.
- Keep day IDs unique within the hunt and mission IDs unique within each day.
- If you change a mission's meaning, change its ID too; otherwise an existing server-saved checkmark will still apply.
- Set `searchFilter` to `null` for a mission without a Pokémon GO filter. You can then supply a `verification` label.
- Add an optional `meetupUrl` to a check-in mission to show a direct Campfire link in its card.
- Keep filters exactly as players should paste them into Pokémon GO. The copy button copies the JSON string without modification.

For a new hunt or any mission ID/point change, add a database migration that inserts the new hunt and its mission catalog in `public.hunts` and `public.hunt_missions`. Keep those IDs and point values aligned with `hunt.json`: the database validates completion records and computes each day's leaderboard score. Nicknames are unique within a hunt. Official verification stays in person. See [`SPEC.md`](SPEC.md) for the full product specification.
