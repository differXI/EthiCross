import data from '../data/puzzle.json'

export const puzzle = data

export const placements = data.placements.map((p, index) => ({ ...p, index }))

export const acrossWords = placements
  .filter((p) => p.dir === 'across')
  .sort((a, b) => a.number - b.number)

export const downWords = placements
  .filter((p) => p.dir === 'down')
  .sort((a, b) => a.number - b.number)

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

export function numberByCell() {
  const map = new Map()
  placements.forEach((p) => {
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
