import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const puzzlePath = join(__dirname, '..', 'client', 'src', 'data', 'puzzle.json')

const puzzle = JSON.parse(readFileSync(puzzlePath, 'utf8'))
const words = Object.keys(puzzle.terms)

const DELTAS = {
  across: { dr: 0, dc: 1 },
  down: { dr: 1, dc: 0 },
}

function buildGrid(wordList) {
  const occupied = new Map() // "r,c" -> letter
  const placements = []

  const sorted = [...wordList].sort((a, b) => b.length - a.length)
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
  const tryWord = (word, dir) => {
    const { dr, dc } = DELTAS[dir]
    for (const [key, letter] of occupied) {
      const [tr, tc] = key.split(',').map(Number)
      for (let i = 0; i < word.length; i++) {
        if (word[i] !== letter) continue
        const row = tr - i * dr
        const col = tc - i * dc
        const crossings = canPlace(word, row, col, dir)
        if (crossings !== null) {
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
          candidates.push({ word, row, col, dir, crossings, size, score: crossings * 1000 - size })
        }
      }
    }
  }

  for (const word of sorted) {
    candidates.length = 0
    tryWord(word, 'across')
    tryWord(word, 'down')
    candidates.sort((a, b) => b.score - a.score)
    if (candidates.length === 0) {
      throw new Error(`No placement found for ${word}`)
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
  const shiftR = -minR
  const shiftC = -minC
  for (const p of placements) {
    p.row += shiftR
    p.col += shiftC
  }
  return { placements, rows: maxR - minR + 1, cols: maxC - minC + 1 }
}

const { placements, rows, cols } = buildGrid(words)

const numbers = new Map()
const holdsDown = (p, r, c) => p.dir === 'down' && r === p.row && c === p.col
const holdsAcross = (p, r, c) => p.dir === 'across' && c === p.col && r === p.row

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const key = `${r},${c}`
    const isDownStart = placements.some((p) => p.dir === 'down' && p.row === r && p.col === c)
    const isAcrossStart = placements.some((p) => p.dir === 'across' && p.row === r && p.col === c)
    if (isDownStart || isAcrossStart) {
      numbers.set(key, numbers.size + 1)
    }
  }
}

const finalPlacements = placements.map((p) => ({
  number: numbers.get(`${p.row},${p.col}`),
  dir: p.dir,
  word: p.word,
  row: p.row,
  col: p.col,
  clue: puzzle.terms[p.word].clue,
}))

const result = {
  title: puzzle.title,
  rows,
  cols,
  placements: finalPlacements,
  terms: puzzle.terms,
}

writeFileSync(puzzlePath, JSON.stringify(result, null, 2) + '\n')
console.log(`Grid ${rows}x${cols} with ${placements.length} words:`)
for (const p of finalPlacements) {
  console.log(`  ${p.number} ${p.dir.padEnd(6)} ${p.word.padEnd(14)} row=${p.row} col=${p.col}`)
}