# Caza de Recompensas · Móstoles GO

Website for the 14–15 November 2026 treasure hunt. It explains the missions and rules, provides copyable Pokémon GO search filters, and saves a player's self-reported checklist in their browser.

## Run locally

```sh
npm install
npm run dev
```

Run `npm run typecheck` and `npm run build` to validate a production build. The static output is in `dist/`.

The site has four routes: `/` (home), `/missions`, `/rules`, and `/tools`. The repository uses the usual Vite layout: `index.html` at the root, React page components in `src/pages/`, and shared UI in `src/components/`. React Router loads each page on demand. Navigation labels and page copy remain in Spanish.

Production hosts must serve `dist/index.html` for requests to `/missions`, `/rules`, and `/tools` so direct links and refreshes work. `public/_redirects` supplies that rewrite on Cloudflare Pages; configure an equivalent fallback on other hosts.

## GitHub Pages deployment

`.github/workflows/deploy-pages.yml` builds and deploys the site on pushes to `master`. You can also run **Deploy to GitHub Pages** from the repository's Actions tab using **Run workflow** on `master`. The workflow sets Vite's project base path from the repository name, writes an `index.html` for each route, and adds a `404.html` fallback. The expected URL is `https://adriangl.github.io/mostolesgo-treasure-hunt/`.

## Edit this or create another hunt

All event-specific content is in [`src/data/hunt.json`](src/data/hunt.json): event details, days, missions, point values, filters, rules, and search notes. The page renders however many days and missions are listed there, and calculates totals from the mission points.

- Give a new hunt a new event `id`. Browser progress is stored under that ID.
- Keep day IDs unique within the hunt and mission IDs unique within each day.
- If you change a mission's meaning, change its ID too; otherwise an existing local checkmark will still apply.
- Set `searchFilter` to `null` for a mission without a Pokémon GO filter. You can then supply a `verification` label.
- Add an optional `meetupUrl` to a check-in mission to show a direct Campfire link in its card.
- Keep filters exactly as players should paste them into Pokémon GO. The copy button copies the JSON string without modification.

Progress is browser-local and self-reported. It is not official verification or a shared leaderboard. See [`SPEC.md`](SPEC.md) for the full product specification.
