import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { buildGridRetry, numberPlacements, makeRng } from '../client/src/lib/crossword.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const termsPath = join(__dirname, '..', 'client', 'src', 'data', 'terms.json')
const levelsPath = join(__dirname, '..', 'client', 'src', 'data', 'levels.json')

// Bump this seed to deal a completely fresh set of 100 levels.
const MASTER_SEED = 'ethicross-levels-v1'
const LEVEL_COUNT = 100

const terms = JSON.parse(readFileSync(termsPath, 'utf8'))
const ALL = Object.keys(terms)
const short = ALL.filter((w) => w.length <= 7)
const mid = ALL.filter((w) => w.length >= 8 && w.length <= 10)
const long = ALL.filter((w) => w.length >= 11)

console.log(`pools: short=${short.length} mid=${mid.length} long=${long.length}`)

const CHAPTERS = [
  'First Steps', 'Honest Code', 'Data Trails', 'Secret Keepers', 'Fair Play',
  'Many Voices', 'Free Choice', 'Duty Calls', 'Pro Standards', 'Share Alike',
  'Net Dangers', 'Watchful Eyes', 'Mind Games', 'Power Plays', 'Hard Calls',
  'Deep Systems', 'Long Shadows', 'Glass Houses', 'Storm Season', 'Ethics Master',
]

// slots per tier: [short, mid, long, flex(mid|long)]
function tierSpec(n) {
  if (n <= 15) return { difficulty: 'Warm-up', slots: ['s', 's', 's', 's'] }
  if (n <= 35) return { difficulty: 'Easy', slots: ['s', 's', 's', 'm', 'm'] }
  if (n <= 60) return { difficulty: 'Tricky', slots: ['s', 's', 'm', 'm', 'm', 'f'] }
  if (n <= 85) return { difficulty: 'Hard', slots: ['s', 's', 'm', 'm', 'm', 'l', 'f'] }
  return { difficulty: 'Expert', slots: ['s', 'm', 'm', 'm', 'l', 'l', 'f'] }
}

function pickByUsage(pool, used, counts, rng) {
  const ranked = pool
    .filter((w) => !used.has(w))
    .map((w) => ({ w, key: (counts[w] ?? 0) * 1000 + rng() }))
    .sort((a, b) => a.key - b.key)
  if (ranked.length === 0) throw new Error('pool exhausted')
  return ranked[0].w
}

function dealWords(n, counts, attempt) {
  const { slots } = tierSpec(n)
  const rng = makeRng(`${MASTER_SEED}:deal:L${n}:${attempt}`)
  const used = new Set()
  const words = []
  for (const s of slots) {
    const pool = s === 's' ? short : s === 'm' ? mid : s === 'l' ? long : [...mid, ...long]
    words.push(pickByUsage(pool, used, counts, rng))
    used.add(words[words.length - 1])
  }
  return words
}

const counts = {}
for (const w of ALL) counts[w] = 0
const seen = new Set()
const levels = []

for (let n = 1; n <= LEVEL_COUNT; n++) {
  const { difficulty } = tierSpec(n)
  const chapter = CHAPTERS[Math.ceil(n / 5) - 1]
  const k = ((n - 1) % 5) + 1
  const title = n === LEVEL_COUNT ? 'Grand Master' : `${chapter} ${k}`

  // Collect successful layouts across attempts, keep the most compact.
  let best = null
  let bestWords = null
  let successes = 0
  for (let attempt = 0; attempt < 300 && successes < 8; attempt++) {
    const words = dealWords(n, counts, attempt)
    const sig = [...words].sort().join('+')
    if (seen.has(sig)) continue
    try {
      const built = buildGridRetry(words, makeRng(`${MASTER_SEED}:grid:L${n}:${attempt}`), 60)
      successes++
      if (!best || built.rows * built.cols < best.rows * best.cols) {
        best = built
        bestWords = words
      }
    } catch {
      // unbuildable combo — try another deal
    }
  }
  if (!best) throw new Error(`Could not build level ${n}`)
  for (const w of bestWords) counts[w]++
  seen.add([...bestWords].sort().join('+'))

  const numbered = numberPlacements(best.placements, (w) => terms[w].clue)
  console.log(
    `OK ${String(n).padStart(3)} ${title.padEnd(18)} ${difficulty.padEnd(7)} ` +
    `${numbered.rows}x${numbered.cols} (${bestWords.length} words)`,
  )
  levels.push({
    n,
    id: `level-${n}`,
    title,
    chapter,
    difficulty,
    words: bestWords,
    rows: numbered.rows,
    cols: numbered.cols,
    placements: numbered.placements,
  })
}

writeFileSync(levelsPath, JSON.stringify({ levels }, null, 2) + '\n')
const sizes = levels.map((l) => l.rows * l.cols)
console.log(
  `Wrote ${levels.length} levels. ` +
  `Grid areas min=${Math.min(...sizes)} max=${Math.max(...sizes)}. ` +
  `Word reuse min=${Math.min(...Object.values(counts))} max=${Math.max(...Object.values(counts))}.`,
)
