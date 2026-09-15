# AGENTS.md

## Repo state

- The project spec is `EthiCross-README.md` (note the non-standard filename; there is no `README.md`).
- Phase 1–4 prototype is implemented in `client/` (Vite + React 19 + Tailwind v4). Backend (`server/`) is Phase 5 and does not exist yet.

## Commands (run in `client/`)

- `npm.cmd run dev` — dev server (HMR)
- `npm.cmd run build` — production build
- `npm.cmd run lint` — oxlint (no config file; runs with defaults)
- **Gotcha:** plain `npm` fails on this machine (PowerShell execution policy blocks `npm.ps1`). Always use `npm.cmd`.

## Source of truth

`EthiCross-README.md` is the authoritative spec for EthiCross (an educational crossword game teaching software-ethics terms for course 953420, CMU). Read it before implementing anything. It specifies:

- **Stack:** React + Tailwind CSS frontend, Node/Express backend + MySQL later. The prototype uses JSON puzzle data locally and **Phases 1–4 only** — backend/database is Phase 5, out of scope.
- **Puzzle data schema:** per-term `{ term, clue, hint, definition, importance, example }` — keep this exact shape.
- **Core terms (single source for puzzle content):** PRIVACY, SECURITY, FAIRNESS, ACCOUNTABILITY, TRANSPARENCY, COPYRIGHT, ACCESSIBILITY. Answers are case-insensitive; never reveal a full answer on an incorrect attempt.
- **Scoring:** +100 correct, −25 hint, +0 incorrect, +500 completion bonus (adjustable).
- **Required gameplay flow:** Home → Start Game → crossword grid with across/down clues → answer entry with feedback → explanation on correct answer → results page (score, time, terms learned).

## Code layout / how it works

- `client/src/data/terms.json` — the shared **terms bank** (70 ethics terms, each with `{ term, clue, hint, definition, importance, example }`). All three modes draw from it.
- `client/src/data/levels.json` — **generated file.** 100 levels in 20 chapters of 5 (4→7 words, warm-up→expert) + computed `placements` + grid `rows`/`cols`. Do not hand-edit placements; regenerate. (`client/src/data/puzzle.json` is the legacy single-puzzle file, kept for reference.)
- `scripts/build-levels.mjs` (repo root) — regenerates all 100 levels: `node scripts/build-levels.mjs`. Deterministic from `MASTER_SEED` (bump it to deal a fresh set); word slots per difficulty tier and chapter names live at the top of the script. Level picks balance word reuse and it keeps the most compact of up to 8 candidate layouts per level. (`scripts/build-grid.mjs` is the legacy single-puzzle builder.)
- `client/src/lib/crossword.js` — shared grid engine (`buildGrid`, `buildGridRetry`, `numberPlacements`, seeded `makeRng`) used by both the build script and the app (daily puzzles are built in-browser, deterministically from the date).
- `client/src/lib/puzzle.js` — mode data helpers (`terms`, `levels`, `puzzleFromLevel`, `buildDailyPuzzle`) plus board derivation (`decoratePuzzle`, cell→letters, clue numbering). `Game.jsx` receives one crossword via the `puzzleData` prop (`{ title, rows, cols, placements, terms }`).
- Modes: `pages/Home.jsx` (mode select), `pages/Levels.jsx` (100-level map grouped by chapter, with locks/stars), `pages/Game.jsx` (grid gameplay for Levels + Daily), `pages/Endless.jsx` (hearts/streak survival), `pages/Daily.jsx` (1-play-per-day gate + countdown), `pages/Codex.jsx` (📚 Study Index: per-world term reader + search, with ✓ learned marks), `pages/Result.jsx` (generic: stars, badge, buttons). App switches screens with local state — no router. Progress persists in `localStorage` (`ethicross-levels-v1`, `ethicross-endless-best-v1`, `ethicross-daily-v1`, `ethicross-learned-v1`).

## Conventions / gotchas

- Accessibility is a named design principle: don't use color alone to signal correct/incorrect (solved cells also show a ✓ symbol), keep typography/contrast readable, keyboard interactions (arrow keys move grid selection).
- Implement features in the README's phase order (UI → gameplay → learning → results) rather than jumping to backend work.