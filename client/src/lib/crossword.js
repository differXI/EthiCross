// Shared crossword-layout engine (pure JS — used by the build script AND the app).
// Builds a solved crossing layout for a list of UPPERCASE words.

// Deterministic RNG (mulberry32). Pass a string/number seed for daily puzzles,
// or omit it for random layouts.
export function makeRng(seed) {
  if (seed === undefined || seed === null) return Math.random
  let h = 1779033703
  const s = String(seed)
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = h >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const DELTAS = {
  across: { dr: 0, dc: 1 },
  down: { dr: 1, dc: 0 },
}

// wordList: array of words, longest-first recommended (caller sorts).
// rng: random source (inject a seeded one for deterministic daily puzzles).
// Throws when a word cannot be crossed into the layout.
export function buildGrid(wordList, rng = Math.random) {
  const occupied = new Map() // "r,c" -> letter
  const placements = []

  const sorted = [...wordList]
  const first = sorted.shift()
  const place = (word, row, col, dir) => {
    const { dr, dc } = DELTAS[dir]
    for (let i = 0; i < word.length; i++) {
      occupied.set(`${row + i * dr},${col + i * dc}`, word[i])
    }
    placements.push({ word, row, col, dir })
  }
  place(first, 0, 0, 'across')

  const canPlace = (word, row, col, dir) => {
    const { dr, dc } = DELTAS[dir]
    const start = { r: row - dr, c: col - dc }
    const end = { r: row + word.length * dr, c: col + word.length * dc }
    if (occupied.has(`${start.r},${start.c}`) || occupied.has(`${end.r},${end.c}`)) {
      return null
    }
    let crossings = 0
    for (let i = 0; i < word.length; i++) {
      const r = row + i * dr
      const c = col + i * dc
      const key = `${r},${c}`
      if (occupied.has(key)) {
        if (occupied.get(key) !== word[i]) return null
        crossings++
      } else {
        const a = { r: r + dc, c: c + dr }
        const b = { r: r - dc, c: c - dr }
        if (occupied.has(`${a.r},${a.c}`) || occupied.has(`${b.r},${b.c}`)) return null
      }
    }
    return crossings
  }

  const candidates = []
  const tryWord = (word, dir, rng) => {
    const { dr, dc } = DELTAS[dir]
    for (const [key, letter] of occupied) {
      const [tr, tc] = key.split(',').map(Number)
      for (let i = 0; i < word.length; i++) {
        if (word[i] !== letter) continue
        const row = tr - i * dr
        const col = tc - i * dc
        const crossings = canPlace(word, row, col, dir)
        if (crossings !== null && crossings > 0) {
          let minR = Infinity, minC = Infinity, maxR = -Infinity, maxC = -Infinity
          for (const [k] of occupied) {
            const [r, c] = k.split(',').map(Number)
            minR = Math.min(minR, r); minC = Math.min(minC, c)
            maxR = Math.max(maxR, r); maxC = Math.max(maxC, c)
          }
          minR = Math.min(minR, row); minC = Math.min(minC, col)
          maxR = Math.max(maxR, row + (word.length - 1) * dr)
          maxC = Math.max(maxC, col + (word.length - 1) * dc)
          const size = Math.max(maxR - minR, maxC - minC)
          candidates.push({
            word, row, col, dir, crossings, size,
            score: crossings * 1000 - size + rng() * 0.01,
          })
        }
      }
    }
  }

  const rngTie = rng
  for (const word of sorted) {
    candidates.length = 0
    tryWord(word, 'across', rngTie)
    tryWord(word, 'down', rngTie)
    candidates.sort((a, b) => b.score - a.score)
    if (candidates.length === 0) {
      throw new Error(`No crossing placement found for ${word}`)
    }
    const best = candidates[0]
    place(best.word, best.row, best.col, best.dir)
  }

  let minR = Infinity, minC = Infinity, maxR = -Infinity, maxC = -Infinity
  for (const key of occupied.keys()) {
    const [r, c] = key.split(',').map(Number)
    minR = Math.min(minR, r); minC = Math.min(minC, c)
    maxR = Math.max(maxR, r); maxC = Math.max(maxC, c)
  }
  for (const p of placements) {
    p.row += -minR
    p.col += -minC
  }
  return { placements, rows: maxR - minR + 1, cols: maxC - minC + 1 }
}

// Try several shuffled insertion orders; returns the first layout that works.
// rng: function returning [0,1). maxAttempts caps the work.
export function buildGridRetry(words, rng = Math.random, maxAttempts = 50) {
  const ordered = [...words].sort((a, b) => b.length - a.length)
  const head = ordered.slice(0, 1)
  const tail = ordered.slice(1)
  let lastErr = null
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const shuffled = [...tail]
    if (attempt > 0) {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
    }
    try {
      return buildGrid([...head, ...shuffled], rng)
    } catch (e) {
      lastErr = e
    }
  }
  throw lastErr
}

// Assign standard crossword clue numbers (row-major) to raw placements.
export function numberPlacements(placements, clueOf) {
  const rows = Math.max(...placements.map((p) => (p.dir === 'down' ? p.row + p.word.length - 1 : p.row))) + 1
  const cols = Math.max(...placements.map((p) => (p.dir === 'across' ? p.col + p.word.length - 1 : p.col))) + 1
  const numbers = new Map()
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isDownStart = placements.some((p) => p.dir === 'down' && p.row === r && p.col === c)
      const isAcrossStart = placements.some((p) => p.dir === 'across' && p.row === r && p.col === c)
      if (isDownStart || isAcrossStart) numbers.set(`${r},${c}`, numbers.size + 1)
    }
  }
  return {
    rows,
    cols,
    placements: placements.map((p) => ({
      number: numbers.get(`${p.row},${p.col}`),
      dir: p.dir,
      word: p.word,
      row: p.row,
      col: p.col,
      clue: clueOf(p.word),
    })),
  }
}
