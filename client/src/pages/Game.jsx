import { useEffect, useMemo, useState } from 'react'
import { decoratePuzzle, wordAtCell } from '../lib/puzzle'
import CrosswordBoard from '../components/CrosswordBoard'
import CluePanel from '../components/CluePanel'
import HintButton from '../components/HintButton'
import ExplanationCard from '../components/ExplanationCard'
import ProgressBar from '../components/ProgressBar'

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

export default function Game({ puzzleData, onComplete, onQuit }) {
  const { placements, acrossWords, downWords, cells, numbers } = useMemo(
    () => decoratePuzzle(puzzleData),
    [puzzleData],
  )
  const puzzle = puzzleData
  const total = placements.length
  const first = placements[0]

  const [selected, setSelected] = useState({ row: first.row, col: first.col })
  const [direction, setDirection] = useState('across')
  const [solved, setSolved] = useState(() => new Set())
  const [hinted, setHinted] = useState(() => new Set())
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [explained, setExplained] = useState(null)
  const [retries, setRetries] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [termsLearned, setTermsLearned] = useState([])

  useEffect(() => {
    if (completed) return
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [completed])

  const active =
    wordAtCell(cells, placements, selected.row, selected.col, direction) ??
    wordAtCell(cells, placements, selected.row, selected.col, direction === 'across' ? 'down' : 'across')

  const activeSolved = active ? solved.has(active.index) : false
  const score = solved.size * 100 - hinted.size * 25 + (completed ? 500 : 0)

  function selectCell(row, col) {
    const cell = cells.get(`${row},${col}`)
    if (!cell) return
    setSelected({ row, col })
    const dirs = cell.words.map((i) => placements[i].dir)
    setDirection(dirs.includes(direction) ? direction : dirs[0])
    setFeedback(null)
  }

  function selectWord(p) {
    setSelected({ row: p.row, col: p.col })
    setDirection(p.dir)
    setFeedback(null)
    if (solved.has(p.index)) {
      setExplained(puzzle.terms[p.word])
    }
  }

  function toggleDirection() {
    setDirection((d) => (d === 'across' ? 'down' : 'across'))
    setFeedback(null)
  }

  function move(dr, dc) {
    let r = selected.row + dr
    let c = selected.col + dc
    while (r >= 0 && r < puzzle.rows && c >= 0 && c < puzzle.cols) {
      if (cells.has(`${r},${c}`)) {
        selectCell(r, c)
        return
      }
      r += dr
      c += dc
    }
  }

  function useHint() {
    if (!active || activeSolved) return
    setHinted((prev) => new Set(prev).add(active.index))
    setFeedback({ type: 'hint', message: `Hint: ${puzzle.terms[active.word].hint}` })
  }

  function submit(e) {
    e.preventDefault()
    if (!active || activeSolved) return
    const guess = input.trim().toUpperCase().replace(/[^A-Z]/g, '')
    if (!guess) return
    if (guess === active.word) {
      const next = new Set(solved)
      next.add(active.index)
      setSolved(next)
      setTermsLearned((t) => [...t, puzzle.terms[active.word]])
      setFeedback({ type: 'correct', message: `Correct! ${active.word} — +100 points` })
      setInput('')
      if (next.size === total) {
        setCompleted(true)
      } else {
        setExplained(puzzle.terms[active.word])
      }
    } else {
      setRetries((r) => r + 1)
      setFeedback({
        type: 'incorrect',
        message: 'Not quite — give it another try. Incorrect guesses cost 0 points.',
      })
      setInput('')
    }
  }

  function finish() {
    onComplete({
      score,
      time: elapsed,
      correct: termsLearned.length,
      retries,
      hints: hinted.size,
      total,
      termsLearned,
    })
  }

  const feedbackStyle =
    feedback?.type === 'correct'
      ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
      : feedback?.type === 'incorrect'
        ? 'border-red-300 bg-red-50 text-red-800'
        : feedback?.type === 'hint'
          ? 'border-amber-300 bg-amber-50 text-amber-800'
          : 'hidden'

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Ethi<span className="text-blue-600">Cross</span>
          </h1>
          <span className="text-sm font-medium text-slate-500">{puzzleData.title}</span>
        </div>
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
          <span>
            Score <span className="text-slate-900">{score}</span>
          </span>
          <span className="rounded-md bg-slate-200 px-2 py-1 tabular-nums">
            ⏱ {formatTime(elapsed)}
          </span>
          <button
            type="button"
            onClick={onQuit}
            className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
          >
            Quit
          </button>
        </div>
      </header>

      <div className="mb-6">
        <ProgressBar solvedCount={solved.size} total={total} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col items-center gap-4">
          <CrosswordBoard
            cells={cells}
            rows={puzzle.rows}
            cols={puzzle.cols}
            solved={solved}
            active={active}
            selected={selected}
            numbers={numbers}
            onSelectCell={selectCell}
            onMove={move}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleDirection}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Direction: {direction === 'across' ? 'Across' : 'Down'} (↔ / ↕)
            </button>
            <HintButton
              active={active}
              activeSolved={activeSolved}
              hinted={hinted}
              onUseHint={useHint}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              {active ? `${active.number} ${active.dir}` : 'Select a clue'}
            </p>
            <p className="mt-1 min-h-10 font-medium text-slate-800">
              {active ? active.clue : 'Click a clue or a cell on the grid to begin.'}
            </p>

            <form onSubmit={submit} className="mt-3 flex gap-2">
              <label htmlFor="answer" className="sr-only">
                Your answer for {active ? active.word.length : 'the'} selected clue
              </label>
              <input
                id="answer"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!active || activeSolved}
                autoComplete="off"
                autoCapitalize="characters"
                placeholder={active && !activeSolved ? `Answer (${active.word.length} letters)` : ''}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-lg uppercase tracking-widest text-slate-900 disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="submit"
                disabled={!active || activeSolved}
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Check
              </button>
            </form>

            <p
              role="status"
              aria-live="polite"
              className={`mt-3 rounded-lg border px-3 py-2 text-sm font-medium ${feedbackStyle}`}
            >
              {feedback ? feedback.message : ''}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <CluePanel
              acrossWords={acrossWords}
              downWords={downWords}
              solved={solved}
              hinted={hinted}
              active={active}
              onSelectWord={selectWord}
            />
          </div>
        </div>
      </div>

      {explained && (
        <ExplanationCard term={explained} onDismiss={() => setExplained(null)} />
      )}

      {completed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Puzzle complete"
          className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/60 p-4"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-xl">
            <h2 className="text-2xl font-extrabold text-slate-900">Puzzle Complete!</h2>
            <p className="mt-2 text-slate-600">
              You solved all {total} terms. A completion bonus of +500 points has been added.
            </p>
            <p className="mt-4 text-3xl font-extrabold text-blue-600">{score} points</p>
            <button
              type="button"
              onClick={finish}
              className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
            >
              View Results
            </button>
          </div>
        </div>
      )}
    </div>
  )
}