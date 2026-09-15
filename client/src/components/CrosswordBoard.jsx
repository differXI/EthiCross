import { cellsOfWord } from '../lib/puzzle'

export default function CrosswordBoard({
  cells,
  rows,
  cols,
  solved,
  active,
  selected,
  numbers,
  onSelectCell,
  onMove,
}) {
  const activeCells = active ? cellsOfWord(active) : []
  const activeSet = new Set(activeCells.map((c) => `${c.row},${c.col}`))

  function handleKey(e) {
    const map = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    }
    const move = map[e.key]
    if (!move) return
    e.preventDefault()
    onMove(...move)
  }

  const rowsArr = Array.from({ length: rows }, (_, r) => r)
  const colsArr = Array.from({ length: cols }, (_, c) => c)

  return (
    <div
      role="grid"
      aria-label="Crossword grid"
      onKeyDown={handleKey}
      className="t-board w-full max-w-xl"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {rowsArr.flatMap((r) =>
        colsArr.map((c) => {
          const key = `${r},${c}`
          const cell = cells.get(key)
          if (!cell) {
            return (
              <div key={key} aria-hidden="true" className="t-hole aspect-square" />
            )
          }
          const isSolved = cell.words.some((i) => solved.has(i))
          const isSelected = selected && selected.row === r && selected.col === c
          const isActive = activeSet.has(key)
          const num = numbers.get(key)
          const state = isSelected
            ? 'is-selected'
            : isActive
              ? 'is-active'
              : isSolved
                ? 'is-solved'
                : ''
          return (
            <button
              key={key}
              type="button"
              role="gridcell"
              tabIndex={isSelected ? 0 : -1}
              aria-label={`Row ${r + 1} column ${c + 1}${num ? `, clue ${num}` : ''}${isSolved ? `, solved, letter ${cell.letter}` : ', empty'}`}
              aria-pressed={isSelected}
              onClick={() => onSelectCell(r, c)}
              className={`t-gcell relative aspect-square ${state} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600`}
            >
              {num && (
                <span className="t-num pointer-events-none absolute left-0.5 top-0 text-[9px] font-semibold leading-none">
                  {num}
                </span>
              )}
              <span className="text-base uppercase sm:text-lg">
                {isSolved ? cell.letter : '\u00A0'}
              </span>
              {isSolved && (
                <span className="pointer-events-none absolute bottom-0 right-0.5 text-[10px] leading-none">
                  ✓
                </span>
              )}
            </button>
          )
        }),
      )}
    </div>
  )
}
