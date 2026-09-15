import terms from '../data/terms.json'
import levelsData from '../data/levels.json'
import { buildGridRetry, numberPlacements, makeRng } from './crossword'

// --- Terms bank (all ethics terms, shared by every mode) ---
export { terms }
export const termList = Object.keys(terms)

// --- Levels mode: 100 crosswords in 20 chapters, warm-up → expert ---
export const levels = levelsData.levels
export const LEVEL_COUNT = levels.length

export function getLevel(n) {
  return levels.find((l) => l.n === n) ?? levels[0]
}

// --- Study index: levels grouped into worlds (chapters), each with the
// union of terms appearing in its levels. Read before you play.
export const worlds = (() => {
  const map = []
  for (const lv of levels) {
    let w = map[map.length - 1]
    if (!w || w.name !== lv.chapter) {
      w = { name: lv.chapter, from: lv.n, to: lv.n, levels: [], words: [] }
      map.push(w)
    }
    w.to = lv.n
    w.levels.push(lv.n)
    for (const word of lv.words) {
      if (!w.words.includes(word)) w.words.push(word)
    }
  }
  return map.map((w, i) => ({ ...w, index: i + 1, words: [...w.words].sort() }))
})()

// Shape a level into the { title, rows, cols, placements, terms } object
// that Game.jsx plays.
export function puzzleFromLevel(level) {
  const t = {}
  for (const w of level.words) t[w] = terms[w]
  return {
    title: `Level ${level.n} — ${level.title}`,
    rows: level.rows,
    cols: level.cols,
    placements: level.placements,
    terms: t,
  }
}

// --- Board derivation for one puzzle object ---
export function decoratePuzzle(puzzleData) {
  const placements = puzzleData.placements.map((p, index) => ({ ...p, index }))
  const acrossWords = placements
    .filter((p) => p.dir === 'across')
    .sort((a, b) => a.number - b.number)
  const downWords = placements
    .filter((p) => p.dir === 'down')
    .sort((a, b) => a.number - b.number)
  return {
    placements,
    acrossWords,
    downWords,
    cells: buildCells(placements),
    numbers: numberByCell(placements),
  }
}

// --- Daily mode: same 7-word puzzle for everyone, derived from the date ---
export function todayKey(date = new Date()) {
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${m}-${d}`
}

export function dailyLabel(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

function shuffledPool(rng) {
  const pool = [...termList]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}

// Deterministic: every device builds the identical grid for a given date.
export function buildDailyPuzzle(dateKey) {
  for (let attempt = 0; attempt < 50; attempt++) {
    const words = shuffledPool(makeRng(`daily:${dateKey}:${attempt}`)).slice(0, 7)
    try {
      const built = buildGridRetry(words, makeRng(`grid:${dateKey}:${attempt}`), 30)
      const numbered = numberPlacements(built.placements, (w) => terms[w].clue)
      const t = {}
      for (const w of words) t[w] = terms[w]
      return {
        title: `Daily — ${dailyLabel(dateKey)}`,
        rows: numbered.rows,
        cols: numbered.cols,
        placements: numbered.placements,
        terms: t,
      }
    } catch {
      // try the next deterministic candidate set
    }
  }
  // Ultra-rare fallback: rotate through the level list by day of year.
  const [y, m, d] = dateKey.split('-').map(Number)
  const dayOfYear = Math.floor((new Date(y, m - 1, d) - new Date(y, 0, 0)) / 86400000)
  const level = levels[dayOfYear % levels.length]
  return { ...puzzleFromLevel(level), title: `Daily — ${dailyLabel(dateKey)}` }
}

// --- Generic board helpers ---
export function buildCells(placementList) {
  const cells = new Map()
  placementList.forEach((p) => {
    const dr = p.dir === 'across' ? 0 : 1
    const dc = p.dir === 'across' ? 1 : 0
    for (let i = 0; i < p.word.length; i++) {
      const key = `${p.row + i * dr},${p.col + i * dc}`
      if (!cells.has(key)) cells.set(key, { letter: p.word[i], words: [] })
      cells.get(key).words.push(p.index)
    }
  })
  return cells
}

export function wordAtCell(cells, placementList, row, col, dir) {
  const cell = cells.get(`${row},${col}`)
  if (!cell) return null
  const idx = cell.words.find((i) => placementList[i].dir === dir)
  return idx === undefined ? null : placementList[idx]
}

export function numberByCell(placementList) {
  const map = new Map()
  placementList.forEach((p) => {
    const key = `${p.row},${p.col}`
    if (!map.has(key)) map.set(key, p.number)
  })
  return map
}

export function cellsOfWord(p) {
  const dr = p.dir === 'across' ? 0 : 1
  const dc = p.dir === 'across' ? 1 : 0
  return Array.from({ length: p.word.length }, (_, i) => ({
    row: p.row + i * dr,
    col: p.col + i * dc,
  }))
}
