# AGENTS.md

## Repo state

- The project spec is `EthiCross-README.md` (note the non-standard filename; there is no `README.md`).
- **Phase 1–4 prototype is implemented** in `client/` (Vite + React 19 + Tailwind v4). Backend (`server/`) is Phase 5 and does not exist yet.
- The git repo has no commits yet.

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

- `client/src/data/puzzle.json` — **generated file.** Contains terms + computed `placements` (word, row, col, dir, clue number) + grid `rows`/`cols`. Do not hand-edit placements; regenerate.
- `scripts/build-grid.mjs` (repo root) — regenerates placements: `node scripts/build-grid.mjs`. It reads the terms from `puzzle.json` and rewrites the file with a solved crossword layout. Run it after adding/removing terms.
- `client/src/lib/puzzle.js` — derives the board (cell→letters, clue numbering, across/down word lists) from `puzzle.json`.
- Pages: `pages/Home.jsx`, `pages/Game.jsx` (all gameplay state), `pages/Result.jsx`. Components under `components/`. App switches pages with local state — no router.
- Scoring/hints/timer are computed in `Game.jsx`; final results passed up via `onComplete`.

## Conventions / gotchas

- Accessibility is a named design principle: don't use color alone to signal correct/incorrect (solved cells also show a ✓ symbol), keep typography/contrast readable, keyboard interactions (arrow keys move grid selection).
- Implement features in the README's phase order (UI → gameplay → learning → results) rather than jumping to backend work.