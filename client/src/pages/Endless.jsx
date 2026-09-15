import { useMemo, useState } from 'react'
import { terms, termList } from '../lib/puzzle'

const MAX_HEARTS = 3

function shuffledKeys() {
  const pool = [...termList]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}

function Hearts({ left }) {
  return (
    <span aria-label={`${left} of ${MAX_HEARTS} hearts left`} className="text-lg tracking-tight">
      {Array.from({ length: MAX_HEARTS }, (_, i) => (
        <span key={i}>{i < left ? '❤️' : '🖤'}</span>
      ))}
    </span>
  )
}

export default function Endless({ best, onSaveBest, onQuit }) {
  const [queue, setQueue] = useState(shuffledKeys)
  const [pos, setPos] = useState(0)
  const [hearts, setHearts] = useState(MAX_HEARTS)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [solved, setSolved] = useState(0)
  const [solvedKeys, setSolvedKeys] = useState([])
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [hintShown, setHintShown] = useState(false)
  const [over, setOver] = useState(false)
  const [newBest, setNewBest] = useState(false)

  const key = queue[pos % queue.length]
  const term = terms[key]
  const over_ = over || hearts <= 0

  const message = useMemo(() => {
    if (streak >= 8) return '🔥 UNSTOPPABLE!'
    if (streak >= 5) return '🔥 On fire!'
    if (streak >= 3) return '🔥 Streak x' + streak
    return null
  }, [streak])

  function advance() {
    setInput('')
    setHintShown(false)
    if (pos + 1 >= queue.length) {
      // Reshuffle, avoiding an instant repeat of the last word.
      setQueue((q) => {
        let next = shuffledKeys()
        if (next[0] === q[q.length - 1]) next = [...next.slice(1), next[0]]
        return next
      })
      setPos(0)
    } else {
      setPos((p) => p + 1)
    }
  }

  function endGame(finalScore, finalSolved, finalKeys) {
    setOver(true)
    if (finalScore > best) {
      setNewBest(true)
    }
    onSaveBest(finalScore, finalKeys)
    setFeedback({
      type: 'over',
      message: `Game over — you solved ${finalSolved} term${finalSolved === 1 ? '' : 's'}.`,
    })
  }

  function submit(e) {
    e.preventDefault()
    if (over_) return
    const guess = input.trim().toUpperCase().replace(/[^A-Z]/g, '')
    if (!guess) return
    if (guess === key) {
      const s = score + 100
      const st = streak + 1
      setScore(s)
      setStreak(st)
      setBestStreak((b) => Math.max(b, st))
      setSolved((n) => n + 1)
      setSolvedKeys((ks) => (ks.includes(key) ? ks : [...ks, key]))
      setFeedback({ type: 'correct', message: `+100 — ${key}: ${term.definition}` })
      advance()
    } else {
      const h = hearts - 1
      setHearts(h)
      setStreak(0)
      if (h <= 0) {
        endGame(score, solved, solvedKeys)
      } else {
        setFeedback({
          type: 'incorrect',
          message: `Wrong answer — you lost a heart! (${h} left, 0 pts)`,
        })
        advance()
      }
    }
  }

  function useHint() {
    if (over_ || hintShown) return
    setHintShown(true)
    setScore((s) => Math.max(0, s - 25))
    setFeedback({ type: 'hint', message: `Hint (−25 pts): ${term.hint}` })
  }

  function restart() {
    setQueue(shuffledKeys())
    setPos(0)
    setHearts(MAX_HEARTS)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setSolved(0)
    setSolvedKeys([])
    setInput('')
    setFeedback(null)
    setHintShown(false)
    setOver(false)
    setNewBest(false)
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
    <div className="t-page">
      <div className="mx-auto max-w-2xl px-4 py-6">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="t-title text-xl">♾️ Endless</h1>
        <div className="t-muted flex items-center gap-3 text-sm font-bold">
          <Hearts left={hearts} />
          <span>
            Score <span className="t-ink">{score}</span>
          </span>
          <span className="t-chip px-2 py-1">Best {Math.max(best, newBest ? score : best)}</span>
          <button
            type="button"
            onClick={onQuit}
            className="t-muted rounded-md px-2 py-1 font-semibold hover:brightness-90"
          >
            Quit
          </button>
        </div>
      </header>

      {message && !over_ && (
        <p role="status" className="mt-3 text-center text-lg font-extrabold text-orange-500">
          {message}
        </p>
      )}

      {!over_ ? (
        <div className="t-card mt-4 p-5">
          <p className="t-muted text-xs font-bold uppercase tracking-wide">
            Term {solved + 1} · {key.length} letters · 🔥 streak {streak}
          </p>
          <p className="t-ink mt-2 min-h-12 text-lg font-medium">{term.clue}</p>
          <form onSubmit={submit} className="mt-4 flex gap-2">
            <label htmlFor="endless-answer" className="sr-only">
              Your answer, {key.length} letters
            </label>
            <input
              id="endless-answer"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
              autoCapitalize="characters"
              placeholder={`Answer (${key.length} letters)`}
              className="t-input w-full px-3 py-2 font-mono text-lg uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="t-btn px-4 py-2"
            >
              Go
            </button>
          </form>
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={useHint}
              disabled={hintShown}
              className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              💡 Hint (−25)
            </button>
            <span className="t-muted text-xs font-medium">
              Wrong answer = −1 ❤️ · 3 strikes and you&apos;re out
            </span>
          </div>
          <p
            role="status"
            aria-live="polite"
            className={`mt-3 rounded-lg border px-3 py-2 text-sm font-medium ${feedbackStyle}`}
          >
            {feedback ? feedback.message : ''}
          </p>
        </div>
      ) : (
        <div className="t-card mt-4 p-6 text-center">
          <p className="text-5xl">💀</p>
          <h2 className="t-ink mt-2 text-2xl font-extrabold">Run Over!</h2>
          {newBest && (
            <p className="mt-1 inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-extrabold text-amber-800">
              🏆 NEW BEST!
            </p>
          )}
          <div className="mx-auto mt-4 grid max-w-sm grid-cols-3 gap-2">
            {[
              ['Score', score],
              ['Solved', solved],
              ['Best 🔥', bestStreak],
            ].map(([label, value]) => (
              <div key={label} className="t-soft p-3">
                <p className="t-muted text-[11px] font-bold uppercase tracking-wide">{label}</p>
                <p className="t-ink text-2xl font-extrabold">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={restart}
              className="t-btn px-6 py-2"
            >
              Play Again
            </button>
            <button
              type="button"
              onClick={onQuit}
              className="t-ghost px-6 py-2"
            >
              Modes
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
