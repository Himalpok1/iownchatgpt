# iownchatgpt.com — Project Details

**GitHub:** https://github.com/Himalpok1/iownchatgpt  
**Last Updated:** 2026-05-12

---

## Work Log

### 2026-05-13 18:44:30 CDT — Overlap and hidden-element UI fixes verified
- Files changed: `src/app/globals.css`, `src/app/auth/login/page.tsx`, `src/app/auth/register/page.tsx`, `eslint.config.mjs`, `details.md`
- What changed: Added a shared nav-height-driven page offset, created dedicated auth page shell classes, reduced the homepage hero heading scale, increased section spacing, strengthened game-card sizing and copy rhythm, and excluded `.hostinger-deploy/**` from ESLint so source linting stays focused on real app code instead of generated deployment artifacts.
- Verification: `npm run lint` passed after the new ignore; `npm run build` passed and generated 83 routes; Computer Use checked `http://127.0.0.1:3000/auth/login`, `/`, and `/games` in Chrome and confirmed the login title is no longer clipped under the fixed nav, the homepage hero no longer crowds the next section, and the Games grid cards render with clearer spacing and no visible overlap.
- Follow-up: Carry the same spacing audit through the remaining utility pages if any new screenshots surface, then push the visual refinements to production.

### 2026-05-13 16:23:40 CDT — Hostinger GitHub deployment completed
- Files changed: `details.md`
- What changed: Corrected the local git remote to `Himalpok1/iownchatgpt`, committed the current newsroom/UI/deployment work, pushed `main` to GitHub, connected the new Hostinger Node.js app to the GitHub repo, added the production environment variables in Hostinger, and completed the first live deployment for `iownchatgpt.com`.
- Verification: `git push origin main` updated GitHub from `9e03bd2` to `ca86ad6`; Hostinger deployment finished with a successful build from GitHub; `curl -I https://iownchatgpt.com` returned `x-powered-by: Next.js` and `platform: hostinger`; `curl -L https://iownchatgpt.com` returned the new Next.js homepage HTML; Chrome loaded `https://iownchatgpt.com/` with the live app shell instead of the old FTP-only static site.
- Follow-up: Configure Google OAuth client credentials in production when ready, then add the editorial cron trigger on Hostinger or another scheduler so `/api/editorial/run` executes three times daily in production.

### 2026-05-13 16:15:37 CDT — GitHub deployment handoff started
- Files changed: `details.md`
- What changed: Confirmed the working tree is based on `Himalpok1/iownchatgpt` history, detected that the local `origin` remote was incorrectly pointing at `Himalpok1/himal-cloud`, and began the handoff to a GitHub-based Hostinger deployment flow instead of raw FTP upload.
- Verification: `git log` shows the local `main` head at `9e03bd2`; `git ls-remote https://github.com/Himalpok1/iownchatgpt.git HEAD` returned the same commit hash, confirming the repo lineage matches the intended `iownchatgpt` repository.
- Follow-up: Repoint `origin` to `Himalpok1/iownchatgpt`, commit the current app changes, push `main`, then connect the Node.js app to GitHub from Hostinger hPanel.

### 2026-05-13 11:15:00 CDT — UI overhaul verified in live browsers
- Files changed: `details.md`
- What changed: Completed live breakpoint checks for the redesigned homepage and the refreshed Games index using both the Browser plugin and Computer Use in Chrome.
- Verification: `npm run lint` passed; `npm run build` passed; Browser mobile screenshots confirmed the homepage no longer clips the brand or wastes most of the viewport on an oversized hero; Browser mobile verification also confirmed `/games` now uses the same denser card system; Computer Use desktop checks on Chrome confirmed both `/` and `/games` render with cleaner hierarchy and without the previous overlapping-card feel.
- Follow-up: The biggest remaining visual opportunities are secondary pages like Contact, Blog, and legal content, but the core public-facing shell and primary discovery pages now share the new design language.

### 2026-05-13 11:13:42 CDT — Games page aligned with the new design system
- Files changed: `src/app/games/page.tsx`, `details.md`
- What changed: Reworked the Games index page so it uses the new library layout, summary panels, and denser game-card treatment instead of the old oversized centered cards.
- Verification: The redesigned homepage in Chrome showed the site shell and hero were improved, but the `/games` page was still visually stuck in the previous style. The page now shares the same card language and page framing as the homepage.
- Follow-up: Rerun lint/build and do one more live pass in Browser and Computer Use across `/` and `/games`.

### 2026-05-13 11:10:43 CDT — UI overhaul in progress
- Files changed: `src/app/globals.css`, `src/app/page.tsx`, `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`, `details.md`
- What changed: Replaced the previous neon landing-page styling with a calmer product/editorial visual system, rebuilt the homepage around tighter sections and denser content blocks, and redesigned the site chrome to reduce overlap, oversized hero behavior, and generic “AI slop” aesthetics.
- Verification: Live mobile inspection in the in-app browser showed the old homepage clipping the brand and letting the hero dominate the viewport. The new shell and homepage structure are in place and ready for lint/build plus breakpoint QA.
- Follow-up: Run the redesigned app in Browser and Computer Use, fix any remaining overlap or responsiveness issues, then log the final visual verification.

### 2026-05-12 15:26:16 CDT — Post-upgrade auth and scoring rechecked
- Files changed: `details.md`
- What changed: Re-ran the credential signup, login, session, and score submission flow after the dependency cleanup and fresh dev server restart.
- Verification: A scripted pass against `http://127.0.0.1:3000` successfully created a new credentials user, established a NextAuth session, and submitted a Snake score that came back with a persisted score id and leaderboard rank.
- Follow-up: The remaining unfinished work is outside the current app codepath: Google OAuth client creation plus any optional future-feature expansion.

### 2026-05-12 15:25:32 CDT — Dependency cleanup verified
- Files changed: `package.json`, `package-lock.json`, `details.md`
- What changed: Applied dependency overrides so the installed tree now uses `protobufjs@7.5.8` and `postcss@8.5.14`, while keeping the earlier direct upgrades to Next 16.2.6 and `@google/genai@2.1.0`.
- Verification: `npm install` reduced `npm audit` from 8 findings to 4 moderate findings; `npm run lint` passed; `npm run build` passed on Next 16.2.6; `npm ls` confirmed `@google/genai -> protobufjs@7.5.8` and both root and Next-resolved `postcss@8.5.14`; a fresh dev server on `http://localhost:3000` returned a live Gemini chess move (`c5`) and persisted a post-upgrade contact inquiry row to Neon.
- Follow-up: The remaining audit issues are all tied to `drizzle-kit` and its `@esbuild-kit` chain; everything user-facing is now passing, so only Google OAuth credential creation and optional future features remain.

### 2026-05-12 15:23:54 CDT — Dependency cleanup started
- Files changed: `package.json`, `package-lock.json`, `details.md`
- What changed: Upgraded the app to `next@16.2.6`, `eslint-config-next@16.2.6`, `@google/genai@2.1.0`, and added dependency overrides to force newer `postcss` and `protobufjs` patch lines where compatible.
- Verification: `npm install` completed successfully for the direct dependency upgrades; `npm run build` passed on Next 16.2.6; `npm audit --json` confirmed the remaining issues are now isolated to `drizzle-kit`, `postcss`, and `protobufjs` transitive paths pending the new overrides install.
- Follow-up: Apply the override lockfile changes, rerun lint/build/audit, and verify that the Chess API still works with the updated Gemini SDK.

### 2026-05-12 15:22:38 CDT — Inquiry inbox verified end to end
- Files changed: `src/lib/db/migrations/0001_complete_king_cobra.sql`, `src/lib/db/migrations/meta/*`, `details.md`
- What changed: Generated and applied the `inquiries` migration, then verified both contact and game request submissions through the live dev app and direct database reads.
- Verification: `npm run lint` passed; `npm run db:generate` created `0001_complete_king_cobra.sql`; `npm run db:migrate` applied successfully to Neon; API smoke test created `contact` and `game_request` rows; browser submissions on `/contact` and `/` showed success messages and reset the form; direct SQL confirmed four inquiry rows persisted with `status='new'`.
- Follow-up: Update dependencies to reduce audit exposure, then rerun lint/build/audit against the current app state.

### 2026-05-12 15:20:23 CDT — Inquiry inbox backend added
- Files changed: `src/lib/db/schema.ts`, `src/app/api/inquiries/route.ts`, `src/components/forms/InquiryForm.tsx`, `src/app/contact/page.tsx`, `src/app/page.tsx`, `details.md`
- What changed: Added a persisted `inquiries` table shape, created `POST /api/inquiries`, and replaced the homepage game request form plus contact page form with a shared in-app submission flow instead of `mailto`.
- Verification: Code review confirmed the new flow captures `contact` and `game_request` submissions with validation for name, email, subject, and message content, and routes both pages through the same API surface.
- Follow-up: Generate and apply a new Drizzle migration, then test both forms against the live Neon-backed app.

### 2026-05-12 14:03:13 CDT — Local repo materialized
- Files changed: `details.md`
- What changed: Cloned `https://github.com/Himalpok1/iownchatgpt` into the local workspace while preserving this project log as an untracked local file.
- Verification: Confirmed `git status --short --branch` reports `main...origin/main` and `details.md` as untracked; confirmed repo files such as `package.json`, `src/`, `legacy/`, and `.git/` are present.
- Follow-up: Inspect core project files, install dependencies, and run baseline checks.

### 2026-05-12 14:04:33 CDT — Dependencies installed
- Files changed: `details.md`
- What changed: Installed dependencies from `package-lock.json` using `npm ci`.
- Verification: `npm ci` completed successfully and installed 549 packages.
- Follow-up: Review audit findings later; baseline lint/build checks still need to run.

### 2026-05-12 14:05:23 CDT — Chess lint errors fixed
- Files changed: `src/components/chess/ChessGame.tsx`, `legacy/chess/App.tsx`, `details.md`
- What changed: Replaced literal quote characters around AI commentary with JSX-safe `&ldquo;` / `&rdquo;` entities.
- Verification: Initial `npm run lint` showed 4 `react/no-unescaped-entities` errors at these two commentary lines; `npm run build` completed successfully.
- Follow-up: Rerun lint to confirm the blocking errors are resolved and review remaining warnings.

### 2026-05-12 14:06:27 CDT — Active app lint warnings reduced
- Files changed: `src/components/chess/ChessGame.tsx`, `src/app/games/[slug]/page.tsx`, `src/app/profile/page.tsx`, `details.md`
- What changed: Removed unused chess `userId` prop plumbing, removed an unused computed chess board value, and removed the unused `users` import from the profile page.
- Verification: `npm run lint` passed after the previous fix with 0 errors and 59 warnings; this cleanup targets the remaining active app warnings.
- Follow-up: Rerun lint and build after the cleanup.

### 2026-05-12 14:07:20 CDT — Legacy bundles excluded from lint
- Files changed: `eslint.config.mjs`, `details.md`
- What changed: Added `legacy/**` and `public/legacy/**` to ESLint global ignores so archived/static game bundles and generated public copies do not pollute app lint output.
- Verification: Previous `npm run lint` passed with 0 errors and 56 warnings, all from legacy/public legacy files.
- Follow-up: Rerun lint to confirm a clean app-code lint result, then rerun build.

### 2026-05-12 14:07:54 CDT — Baseline checks passing
- Files changed: `details.md`
- What changed: Verified the app after lint fixes and lint-scope cleanup.
- Verification: `npm run lint` completed with no output; `npm run build` completed successfully, synced 17 legacy game directories, and generated 78 static pages.
- Follow-up: Start the local dev server and inspect primary routes in the browser.

### 2026-05-12 14:10:17 CDT — Scores API dev fallback added
- Files changed: `src/lib/db/index.ts`, `src/app/api/scores/route.ts`, `details.md`
- What changed: Added an `isDatabaseConfigured` flag and made `GET /api/scores` return an empty leaderboard when `DATABASE_URL` is not configured.
- Verification: Browser smoke tests rendered the homepage, games, Snake page, leaderboard page, global leaderboards, auth pages, blog listing, blog post, and Chess page without visible app errors. API smoke test showed `GET /api/scores?game=snake` returned 500 before this change when no database was configured.
- Follow-up: Retest the scores API fallback, then rerun lint/build.

### 2026-05-12 14:11:01 CDT — Scores fallback verified
- Files changed: `details.md`
- What changed: Verified the no-database scores fallback and final app checks.
- Verification: `GET /api/scores?game=snake&limit=5&period=all` now returns `200` with `{"leaderboard":[]}`; `POST /api/scores` while signed out returns `401`; `POST /api/chess/move` without `GEMINI_API_KEY` returns the configured AI-unavailable fallback; `npm run lint` and `npm run build` both pass.
- Follow-up: Configure real `DATABASE_URL`, auth secrets, Google OAuth credentials, and `GEMINI_API_KEY` before production-like scoring/auth/chess testing.

### 2026-05-12 14:15:34 CDT — Computer Use hydration overlay fix
- Files changed: `src/app/layout.tsx`, `details.md`
- What changed: Added `suppressHydrationWarning` to the root `<html>` element.
- Verification: Computer Use opened `http://localhost:3000` in Chrome and the app rendered, but the Next dev overlay showed 2 hydration issues tied to a Chrome extension mutating the JSON-LD script in `src/app/layout.tsx`.
- Follow-up: Reload in Chrome with Computer Use and confirm the dev overlay no longer blocks QA.

### 2026-05-12 14:16:31 CDT — JSON-LD hydration guard tightened
- Files changed: `src/app/layout.tsx`, `details.md`
- What changed: Added `suppressHydrationWarning` directly to the two layout-level JSON-LD `<script>` tags.
- Verification: Computer Use reload still showed the Next dev issues badge after the root `<html>` guard, so the script elements needed direct suppression.
- Follow-up: Reload again in Chrome and continue manual route testing.

### 2026-05-12 14:17:49 CDT — Local Auth.js secret fallback added
- Files changed: `src/lib/auth.ts`, `details.md`
- What changed: Added a development-only Auth.js secret fallback when neither `AUTH_SECRET` nor `NEXTAUTH_SECRET` is configured.
- Verification: Computer Use opened the Next dev overlay and the remaining issue was `ClientFetchError` from Auth.js; dev server logs confirmed `MissingSecret` on `/api/auth/session`.
- Follow-up: Reload in Chrome and confirm `/api/auth/session` no longer raises the overlay in local development.

### 2026-05-12 14:19:32 CDT — Snake score event wired
- Files changed: `legacy/snake/script.js`, `public/legacy/snake/script.js`, `details.md`
- What changed: Added `window.parent.postMessage({ type: "GAME_OVER", score }, "*")` when Snake ends, then synced legacy assets into `public/legacy`.
- Verification: Computer Use started Snake from `/games/snake`; the game ran and ended, but no sign-in score nudge appeared. Code inspection confirmed Snake did not emit the `GAME_OVER` event that `GameWrapper` listens for.
- Follow-up: Retest Snake game-over in Chrome and confirm the sign-in nudge appears for signed-out users.

### 2026-05-12 14:46:06 CDT — Remaining legacy score events wired in source
- Files changed: `legacy/pong/script.js`, `legacy/breakout/script.js`, `legacy/tetris/script.js`, `legacy/space-shooter/script.js`, `legacy/whack-a-mole/script.js`, `legacy/simon-memory/script.js`, `legacy/memory-match/script.js`, `legacy/rock-paper-scissors/script.js`, `legacy/2048/script.js`, `details.md`
- What changed: Added guarded `GAME_OVER` postMessage reporting to the remaining score-capable legacy games so each one can report a final score back to `GameWrapper` exactly once per round or match.
- Verification: Code review confirmed each game now reports its terminal score metric at its existing end state: points for Pong/Breakout/Tetris/Space Shooter/Whack-a-Mole/2048, level for Simon Memory, elapsed seconds for Memory Match, and player wins for Rock Paper Scissors.
- Follow-up: Sync the generated `public/legacy` copies, then verify the updated event wiring in the browser and with lint/build.

### 2026-05-12 14:49:26 CDT — Legacy score wiring synced and smoke-tested
- Files changed: `details.md`
- What changed: Synced the patched legacy sources into `public/legacy`, reran baseline checks, and smoke-tested one of the newly wired games end to end.
- Verification: `npm run sync-legacy`, `npm run lint`, and `npm run build` all completed successfully. Computer Use played `/games/rock-paper-scissors` to match end and confirmed the signed-out “Sign in to save your score” banner appears after the iframe emits `GAME_OVER`.
- Follow-up: Spot-check additional newly wired games as needed, then move on to real environment setup for database, OAuth, and Gemini.

### 2026-05-12 14:49:26 CDT — External environment setup pages inspected
- Files changed: `details.md`
- What changed: Used Computer Use to inspect the logged-in Hostinger dashboard and Google AI Studio API keys page without copying, revealing, or creating any credentials.
- Verification: Hostinger hPanel is accessible in Chrome; Google AI Studio is accessible in Chrome and shows an existing masked Gemini API key entry plus a `Create API key` action.
- Follow-up: Get explicit confirmation before copying/revealing an existing Gemini key or creating any new API/OAuth credentials, then continue with Google Cloud and database setup.

### 2026-05-12 14:49:26 CDT — Google Cloud OAuth project check
- Files changed: `details.md`
- What changed: Used Computer Use to inspect Google Cloud Console credentials and project selection state for an `iownchatgpt`-named project.
- Verification: Google Cloud Console is accessible in Chrome, but searching the project picker for `iownchatgpt` returned “No resources to display,” so there is not an obvious existing project by that name to reuse for OAuth credentials.
- Follow-up: Decide whether to reuse an existing Google Cloud project or create a new one before setting up Google OAuth for `iownchatgpt`.

### 2026-05-12 15:09:08 CDT — Real local environment file added
- Files changed: `.env.local`, `src/lib/auth.ts`, `src/app/auth/login/page.tsx`, `src/app/auth/register/page.tsx`, `details.md`
- What changed: Added a real local `.env.local` with a fresh Neon Postgres connection string, Gemini API key, and auth secret. Also made Google auth provider registration conditional and hid the Google buttons from the login/register UI unless `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true`.
- Verification: Verified the Neon connection string by running a direct SQL `select 1` against the new database. The Gemini key was copied from Google AI Studio. Login/register pages now have a clean fallback path when Google OAuth is not configured yet.
- Follow-up: Run Drizzle generate/migrate/seed against Neon, then restart the app and test credential-based auth, scoring, and chess with the real environment.

### 2026-05-12 15:16:17 CDT — Neon database initialized
- Files changed: `src/lib/db/migrations/0000_normal_jamie_braddock.sql`, `src/lib/db/migrations/meta/*`, `details.md`
- What changed: Generated the initial Drizzle migration, applied it to the new Neon database, and seeded the `games` table from the in-app registry.
- Verification: `npm run db:generate` created the migration, `npm run db:migrate` completed successfully after exporting `.env.local`, and `npm run db:seed` inserted the game catalog into Neon.
- Follow-up: Exercise real auth and score submission flows against the live database.

### 2026-05-12 15:16:17 CDT — Real auth, score, and chess flows verified
- Files changed: `details.md`
- What changed: Ran live end-to-end checks against the environment-backed app instance.
- Verification: A scripted pass against `http://localhost:3000` successfully:
  - registered a new credentials user,
  - logged in through NextAuth credentials,
  - fetched a valid authenticated session,
  - submitted a Snake score to `/api/scores`,
  - read the saved score back from the Snake leaderboard,
  - and received live Gemini chess responses from `/api/chess/move` after retrying through a transient upstream `503`.
  `npm run build` also passed with `.env.local` active.
- Follow-up: Finish Google OAuth client setup if we want Google sign-in enabled locally and in production, then decide whether to replace the mailto forms with a real submission backend.

### 2026-05-12 14:24:26 CDT — Static contact forms wired
- Files changed: `src/app/contact/page.tsx`, `src/app/page.tsx`, `details.md`
- What changed: Added mailto form actions, `method="post"`, `encType="text/plain"`, and named fields to the Contact page form and homepage game-request form.
- Verification: Computer Use opened the Contact page successfully; code inspection showed the Contact form and homepage game-request form had required fields but no submit action or handler.
- Follow-up: Retest page rendering and run lint/build.

### 2026-05-12 14:25:18 CDT — Score wiring reality check
- Files changed: `details.md`
- What changed: Recorded that only Snake currently emits the `GAME_OVER` postMessage event.
- Verification: `rg` across `legacy/`, `public/legacy/`, and `src/` found `GAME_OVER` only in Snake and `GameWrapper`.
- Follow-up: Wire the remaining score-capable legacy games listed below before claiming full leaderboard integration.

### 2026-05-12 14:26:19 CDT — Computer Use pass verified
- Files changed: `details.md`
- What changed: Completed the Computer Use manual pass and final automated checks after the fixes above.
- Verification: Chrome showed the homepage without Next dev overlay; Games page rendered; Snake starts, ends, and now shows the signed-out score nudge; Snake leaderboard shows the no-score empty state; login with invalid local credentials shows an inline error; blog category filtering and article pages work; Contact page renders; `npm run lint` and `npm run build` both pass.
- Follow-up: Remaining known issues are Google OAuth/real auth needing production env vars, database-backed register/login/score saving needing `DATABASE_URL`, and score postMessage wiring for the remaining score-capable games.

---

## ✅ Completed

### Phase 2 — Authentication & Database
- NextAuth.js with Google OAuth sign-in
- Drizzle ORM + Neon PostgreSQL database
- Schema: users, accounts, sessions, scores tables
- DrizzleAdapter wired to NextAuth
- Register/Login pages (`/auth/login`, `/auth/register`)
- User profile page (`/profile`)
- Lazy DB connection (safe at build time without `DATABASE_URL`)

### Phase 3 — Leaderboard System
- Score submission API (`POST /api/scores`)
- Per-game leaderboard page (`/games/[slug]/leaderboard`)
- Today / This Week / All Time tabs (URL-based, no client flicker)
- Global leaderboards page (`/leaderboards`)
- Rank medals (🥇🥈🥉), avatar initials fallback
- "Your rank: #N" banner for signed-in users
- "Be the first" empty state CTA

### Phase 4 — Blog MDX Migration
- 20 blog posts migrated from legacy HTML → MDX
- `/blog` listing page with category filter (URL searchParams)
- `/blog/[slug]` dynamic pages with SSG (`generateStaticParams`)
- `export const metadata` pattern inside MDX files
- `mdx-components.tsx` styled overrides (h2/h3/p/ul/ol/li/a/hr)
- Related articles (same category, max 3)
- Schema.org `BlogPosting` + `BreadcrumbList` JSON-LD
- 20 redirect rules: legacy `.html` URLs → clean paths
- Blog categories: AI & Technology, Crypto & Web3, Gadgets & Hardware, Security

### Phase 1 — Game Engine Integration
- All 17 legacy games served via iframe from `public/legacy/`
- `scripts/sync-legacy.ts` copies game files before every build (`prebuild`)
- `GameWrapper.tsx` — responsive iframe, postMessage listener, score banner
- 1 game currently verified with `window.parent.postMessage({ type: 'GAME_OVER', score })`:
  - Snake
- Remaining score-capable games still need score event wiring:
  - Pong, Breakout, Tetris, Space Shooter
  - Whack-a-Mole, Simon Memory, Memory Match, Rock Paper Scissors, 2048
- 7 games iframe-only (no scores): Tic-Tac-Toe, Connect Four, Word Guess, Minesweeper, Sudoku, Viral Imposter, Flappy Bird
- Chess vs Gemini AI — full React component absorbed from legacy Vite app
- `/api/chess/move` — server-side Gemini proxy (API key never in client bundle)
- Chess uses `gemini-2.5-flash` with structured JSON output for move + commentary

---

## 🔧 Environment Variables Needed

Before deploying, add these to `.env.local`:

```env
DATABASE_URL=          # Neon PostgreSQL connection string
GOOGLE_CLIENT_ID=      # Google Cloud Console OAuth app
GOOGLE_CLIENT_SECRET=  # Google Cloud Console OAuth app
NEXTAUTH_SECRET=       # Random secret: openssl rand -base64 32
NEXTAUTH_URL=          # e.g. https://iownchatgpt.com
GEMINI_API_KEY=        # Google AI Studio — for Chess vs Gemini
```

### Setup Steps (one-time)
1. Create a [Neon](https://neon.tech) database
2. Run `npm run db:generate && npm run db:migrate && npm run db:seed`
3. Create a Google OAuth app at [console.cloud.google.com](https://console.cloud.google.com)
   - Authorized redirect URI: `https://yourdomain.com/api/auth/callback/google`
4. Get a Gemini API key from [aistudio.google.com](https://aistudio.google.com)

---

## 🚧 What's Next

### Phase 5 — Multiplayer
- Real-time 1v1 Pong via Socket.io (server on Railway)
- Turn-based Tic-Tac-Toe multiplayer with room codes
- Turn-based Connect Four multiplayer
- Spectator mode
- Room code share links

### Phase 6 — Polish & Launch
- **Achievements/Badges** — unlock badges for milestones (first win, 10 games played, etc.)
- **PWA Support** — installable app, offline playable games, service worker caching
- **Dark/Light Mode Toggle** — CSS custom property switch, persisted to localStorage
- **Admin Dashboard** — `/admin` page: user count, score submissions, top games, blog analytics
- **Social Score Sharing** — "I scored 4,200 on Snake — beat me!" share card (OG image)
- **Deployment** — Vercel for Next.js, Railway for Socket.io multiplayer server

---

## 📁 Key Files

| Path | Purpose |
|------|---------|
| `src/lib/games.ts` | All 17 game definitions |
| `src/lib/blog.ts` | All 20 blog post metadata |
| `src/lib/db/schema.ts` | Drizzle ORM schema |
| `src/lib/auth.ts` | NextAuth configuration |
| `src/components/games/GameWrapper.tsx` | iframe + score handler |
| `src/components/chess/ChessGame.tsx` | Chess React app |
| `src/app/api/chess/move/route.ts` | Gemini API proxy |
| `src/app/api/scores/route.ts` | Score submission + leaderboard API |
| `scripts/sync-legacy.ts` | Copies legacy games to public/ |
| `legacy/` | Original static game files |
| `src/content/blog/` | 20 MDX blog posts |

---

## Work Log

### 2026-05-13 11:32:09 CDT — Internal page UI overhaul in progress
- Files changed:
  - `src/app/globals.css`
  - `src/app/blog/page.tsx`
  - `src/app/guides/page.tsx`
  - `src/app/leaderboards/page.tsx`
  - `src/app/contact/page.tsx`
  - `src/app/blog/[slug]/page.tsx`
  - `mdx-components.tsx`
- What changed:
  - Added a shared internal-page layout system for hero sections, summary cards, filter chips, article grids, guide cards, article headers, and related-content blocks.
  - Reworked Blog into a stronger editorial index with a cleaner hero, stat strip, topic filters, and denser article cards.
  - Rebuilt Guides as a structured strategy hub with better hierarchy and supporting side panels instead of old stacked content blocks.
  - Reworked Leaderboards into a clearer browsing surface with summary panels and consistent game-card treatment.
  - Rebuilt Contact around the backend-powered form, direct contact panels, and practical support guidance.
  - Restyled blog article pages and MDX typography so long-form reading now matches the newer shell.
- Verification performed:
  - Pending lint/build and live browser checks.
- Remaining follow-up:
  - Run `npm run lint`
  - Run `npm run build`
  - Verify `/blog`, `/blog/[slug]`, `/guides`, `/leaderboards`, and `/contact` in the browser

### 2026-05-13 11:34:09 CDT — Internal page UI overhaul verified
- Files changed:
  - `details.md`
- What changed:
  - Logged the results of the second-wave UI pass after verification.
- Verification performed:
  - `npm run lint` — passed
  - `npm run build` — passed
  - Browser-mode checks on:
    - `/blog`
    - `/guides`
    - `/leaderboards`
    - `/contact`
    - `/blog/ai-search-and-seo-in-2026`
  - Verified each page loaded with the new headline structure and no Next.js runtime/build overlay.
- Remaining follow-up:
  - Continue the visual pass into additional utility/content pages if we want the entire site to feel equally polished end to end.

### 2026-05-13 13:20:45 CDT — Editorial automation foundation added
- Files changed:
  - `src/types/next-auth.d.ts`
  - `src/lib/admin.ts`
  - `src/lib/auth.ts`
  - `src/lib/db/schema.ts`
  - `src/lib/editorial/html.ts`
  - `src/lib/editorial/settings.ts`
  - `src/lib/editorial/feeds.ts`
  - `src/lib/editorial/articles.ts`
  - `src/lib/editorial/service.ts`
- What changed:
  - Added admin-email based access control plumbing and exposed `isAdmin` through the auth session.
  - Added the core newsroom schema for settings, article runs, generated articles, article sources, and article review history.
  - Built the first pass of the editorial service layer: feed collection, source ranking, HTML sanitization, schedule settings, and Gemini-powered roundup generation.
  - Chose a mixed static-plus-database blog model so new AI roundups can publish live without redeploying the app.
- Verification performed:
  - Pending migration generation and TypeScript/lint/build checks after the public routes and admin UI are wired in.
- Remaining follow-up:
  - Merge generated posts into `/blog` and `/blog/[slug]`
  - Add cron/admin APIs
  - Build the admin panel
  - Generate migrations and run validation

### 2026-05-13 13:25:06 CDT — Public newsroom and admin surfaces wired
- Files changed:
  - `src/lib/blog.ts`
  - `src/app/api/editorial/run/route.ts`
  - `src/app/api/editorial/settings/route.ts`
  - `src/app/api/editorial/articles/[id]/route.ts`
  - `src/app/api/editorial/cover/route.ts`
  - `src/app/blog/page.tsx`
  - `src/app/blog/[slug]/page.tsx`
  - `src/app/sitemap.ts`
  - `src/components/admin/EditorialSettingsForm.tsx`
  - `src/components/admin/EditorialRunPanel.tsx`
  - `src/components/admin/EditorialArticleEditor.tsx`
  - `src/app/admin/blog/page.tsx`
  - `src/app/admin/blog/[id]/page.tsx`
  - `src/components/auth/UserMenu.tsx`
  - `src/app/editorial-policy/page.tsx`
- What changed:
  - Merged database-backed roundup posts into the public blog index and detail route while keeping static MDX posts as the archive layer.
  - Added admin-only APIs for generation runs, newsroom settings, article edits, and branded fallback cover images.
  - Built the first newsroom dashboard and article editor so runs, source inspection, and post corrections can happen in-app.
  - Updated the editorial policy to disclose automated roundup publication and the post-publication correction workflow.
- Verification performed:
  - Pending migration generation plus lint/build/runtime checks.
- Remaining follow-up:
  - Generate and apply the new migration
  - Fix any TypeScript/lint issues surfaced by the new files
  - Verify the public blog and admin pages live in the browser

### 2026-05-13 13:28:10 CDT — Editorial automation verified end to end
- Files changed:
  - `src/lib/editorial/articles.ts`
  - `src/lib/db/migrations/0002_cool_thor_girl.sql`
  - `src/lib/db/migrations/meta/0002_snapshot.json`
  - `src/lib/db/migrations/meta/_journal.json`
  - `details.md`
- What changed:
  - Hardened generated-article reads so the site fails soft before the newsroom tables exist.
  - Generated and applied the newsroom migration.
  - Successfully ran the generator once, which created a live published roundup article from 9 current sources.
- Verification performed:
  - `npm run lint` — passed
  - `npm run db:generate` — passed
  - `npm run db:migrate` — passed after loading `.env.local`
  - `npm run build` — passed
  - Browser verification:
    - `/blog` loads and includes the generated roundup
    - `/blog/2026-05-13-morning-morning-brief-ai-security-social-app-clones-and-crypto-market-shifts` renders with disclosure and source log
    - `/admin/blog` redirects unauthenticated users to login
  - `sitemap.xml` includes the generated roundup URL
- Remaining follow-up:
  - Optional: set `EDITORIAL_CRON_SECRET` in production so an external scheduler can hit `/api/editorial/run`
  - Optional: sign in with an admin email to exercise the full admin edit flow interactively

### 2026-05-13 13:50:36 CDT — Local admin env configuration in progress
- Files changed:
  - `.env.local`
  - `details.md`
- What changed:
  - Preparing to add the admin email allowlist and editorial cron secret to local environment configuration so the newsroom admin route and scheduler auth work in development.
- Verification performed:
  - Confirmed `ADMIN_EMAILS` and `EDITORIAL_CRON_SECRET` were not already present in `.env.local`.
- Remaining follow-up:
  - Add the env vars
  - Restart the dev server
  - Re-check the admin route

### 2026-05-13 13:50:51 CDT — Local admin env configuration applied
- Files changed:
  - `.env.local`
  - `details.md`
- What changed:
  - Added the admin allowlist email and editorial cron secret to local environment config.
  - Stopped the current dev server so it can restart with the new environment.
- Verification performed:
  - Applied both env values to `.env.local`.
- Remaining follow-up:
  - Restart the dev server
  - Re-check the admin route

### 2026-05-13 13:51:05 CDT — Local admin env restart verified
- Files changed:
  - `details.md`
- What changed:
  - Restarted the local dev server after updating admin/newsroom environment configuration.
- Verification performed:
  - Dev server restarted successfully on `http://127.0.0.1:3000`
  - `GET /admin/blog` now returns `307`, which confirms the route is alive and still protected by auth redirect behavior
- Remaining follow-up:
  - Sign in with the admin email in the browser to reach the newsroom dashboard interactively

### 2026-05-13 13:58:21 CDT — Deployment prep and remaining UI polish in progress
- Files changed:
  - `next.config.ts`
  - `scripts/prepare-hostinger-deploy.ts`
  - `package.json`
  - `src/app/about/page.tsx`
  - `src/app/auth/login/page.tsx`
  - `src/app/auth/register/page.tsx`
  - `details.md`
- What changed:
  - Enabled Next.js standalone output and added a Hostinger-oriented deployment bundle script for Node.js app packaging.
  - Continued the design pass on About and both auth pages so the remaining older templates match the newer site shell more closely.
- Verification performed:
  - Confirmed the FTP target currently exposes a static `public_html` tree rather than an existing Node.js app deployment layout.
- Remaining follow-up:
  - Run lint/build again
  - Generate the Hostinger bundle
  - Re-check the polished pages in the browser

### 2026-05-13 13:59:25 CDT — Hostinger deployment prep verified
- Files changed:
  - `.hostinger-deploy/`
  - `details.md`
- What changed:
  - Produced a standalone Hostinger-oriented Node deployment bundle after build output was available.
  - Verified the refreshed About and auth pages load cleanly after the final UI pass.
- Verification performed:
  - `npm run lint` — passed
  - `npm run build` — passed with standalone output
  - `npm run prepare:hostinger` — passed
  - Browser verification:
    - `/about` loads with the refreshed layout
    - `/auth/login` loads with the refreshed layout
    - `/auth/register` loads with the refreshed layout
  - FTP inspection:
    - Confirmed the remote account currently exposes a legacy static `public_html` tree
    - Did not find an existing Node.js app deployment target in the accessible FTP paths
- Remaining follow-up:
  - Provision or expose a Hostinger Node.js app target before attempting live deployment of this Next.js app

### 2026-05-13 19:17:03 CDT — Firebase auth and admin-subdomain groundwork connected
- Files changed:
  - `.env.local`
  - `src/lib/auth.ts`
  - `src/app/layout.tsx`
  - `src/components/layout/Navbar.tsx`
  - `src/components/auth/UserMenu.tsx`
  - `src/components/auth/FirebaseGoogleButton.tsx`
  - `src/app/auth/login/page.tsx`
  - `src/app/auth/register/page.tsx`
  - `src/lib/firebase/client.ts`
  - `src/lib/hosts.ts`
  - `src/types/next-auth.d.ts`
  - `middleware.ts`
  - `package.json`
  - `package-lock.json`
  - `details.md`
- What changed:
  - Created a new Firebase project for `iownchatgpt`, enabled Google as a Firebase Authentication provider, and registered a web app for the site.
  - Added Firebase client configuration to local env and switched the user-facing Google button over to Firebase popup sign-in.
  - Extended app auth so Firebase logins are synced into the local `users` table and converted into the existing NextAuth session model.
  - Added host-aware admin routing and shell behavior so `admin.iownchatgpt.com` can act as a dedicated newsroom/admin surface.
  - Reworked Firebase token verification to use Google's Identity Toolkit lookup API, which avoids blocking the flow on a downloaded Admin SDK key file.
- Verification performed:
  - `npm run lint` — passed
  - `npm run build` — passed
  - Firebase console verification:
    - Google provider enabled in Firebase Authentication
    - Firebase web app `iownchatgpt-web` created
    - Web config values captured into `.env.local`
- Remaining follow-up:
  - Add `iownchatgpt.com`, `admin.iownchatgpt.com`, and production preview domains to Firebase Authentication authorized domains
  - Finish the Hostinger Node app creation flow for `admin.iownchatgpt.com`
  - Push the Firebase/admin-subdomain changes to GitHub so Hostinger can deploy them

### 2026-05-13 19:24:30 CDT — GitHub updated and Hostinger subdomain created
- Files changed:
  - `details.md`
- What changed:
  - Pushed commit `3d5d1cd` (`Add Firebase Google auth and admin host routing`) to `origin/main`.
  - Created the `admin.iownchatgpt.com` subdomain inside Hostinger.
  - Confirmed the main `iownchatgpt.com` Node.js app deployment picked up the GitHub update successfully.
- Verification performed:
  - `git push origin main` — passed
  - Hostinger deployment view shows latest deployed commit `3d5d1cd`
  - `curl -I https://iownchatgpt.com/auth/login` returns `x-powered-by: Next.js`
  - `curl -I https://admin.iownchatgpt.com` returns `200`, but currently serves Hostinger's default PHP page rather than the Next.js app
- Remaining follow-up:
  - Rebind `admin.iownchatgpt.com` to a Node.js/GitHub deployment target instead of the default static subdomain folder
  - Add Firebase Authentication authorized domains for the production hostnames once the admin host binding is finalized

### 2026-05-14 12:47:37 CDT — Admin subdomain recreated as an independent Node.js site
- Files changed:
  - `details.md`
- What changed:
  - Deleted the old `admin.iownchatgpt.com` file-based subdomain entry under `iownchatgpt.com` in Hostinger after confirming it was the blocker.
  - Recreated `admin.iownchatgpt.com` through Hostinger's Node.js onboarding as an independent website.
  - Reconnected the new admin site to the `Himalpok1/iownchatgpt` GitHub repository on the `main` branch with the Next.js preset.
  - Imported a deployment-specific environment bundle for the admin host, including database access, auth secrets, Firebase public config, admin emails, and editorial cron secret.
  - Triggered the first deployment for the new admin site and removed the temporary local env import file after Hostinger accepted the values.
- Verification performed:
  - Hostinger Node.js onboarding accepted `admin.iownchatgpt.com` once the old subdomain entry was removed.
  - Hostinger build settings resolved to:
    - framework preset: `Next.js`
    - branch: `main`
    - node version: `22.x`
    - environment variables: `16` imported
  - `curl -I https://admin.iownchatgpt.com` now returns `307` with `location: /admin/blog` instead of the old PHP response.
  - `curl -I https://admin.iownchatgpt.com/admin/blog` returns `307` to `/auth/login` with `x-powered-by: Next.js`, confirming the admin site is now running the app and protecting the admin route.
- Remaining follow-up:
  - Confirm the Hostinger deployment job reaches a completed state in hPanel.
  - Add `admin.iownchatgpt.com` and `iownchatgpt.com` to Firebase Authentication authorized domains if they are not already present.
  - Sign in through the live admin host and verify `/admin/blog` loads for the admin account.

### 2026-05-14 23:49:00 CDT — Replaced request-time host sniffing with deployment-mode layout selection
- Files changed:
  - `src/app/layout.tsx`
  - `details.md`
- What changed:
  - Removed the root layout dependency on `headers()` and `x-forwarded-host` for admin/public shell selection.
  - Switched the shell mode decision to a deployment-level `ADMIN_HOST_MODE` environment flag instead.
  - This keeps the admin/public split intact across the two Hostinger deployments while avoiding request-time rendering for the public shell.
- Verification performed:
  - `npm run lint` — passed
  - `npm run build` — passed
  - Build output now prerenders the public pages again, including `/auth/login`, `/auth/register`, `/about`, `/contact`, `/games`, `/guides`, `/leaderboards`, `/privacy-policy`, and `/terms`.
- Remaining follow-up:
  - Add `ADMIN_HOST_MODE=false` to the main Hostinger deployment and `ADMIN_HOST_MODE=true` to the admin Hostinger deployment.
  - Redeploy both Hostinger apps and re-run live auth/admin QA on the production domains.

### 2026-05-15 00:05:00 CDT — Replaced admin host middleware with app-level redirect
- Files changed:
  - `src/app/page.tsx`
  - `middleware.ts`
  - `details.md`
- What changed:
  - Moved the admin root redirect into the homepage server component using `redirect("/admin/blog")` when `ADMIN_HOST_MODE=true`.
  - Removed the project-level middleware so Hostinger no longer has to execute host-based edge logic for every non-static route.
  - Kept the admin/public shell split through deployment env vars instead of request-time routing decisions.
- Verification performed:
  - Pending local lint/build after patch application.
- Remaining follow-up:
  - Run `npm run lint` and `npm run build`.
  - Redeploy both Hostinger apps and re-check live auth and admin routes.
