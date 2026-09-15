import { useEffect, useMemo, useState } from 'react'
import Game from './Game'
import { buildDailyPuzzle, todayKey } from '../lib/puzzle'

function msUntilMidnight() {
  const now = new Date()
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
  return next - now
}

function formatCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Daily({ playedToday, streak, onComplete, onQuit }) {
  const today = todayKey()
  const puzzleData = useMemo(() => buildDailyPuzzle(today), [today])
  const [left, setLeft] = useState(msUntilMidnight)

  useEffect(() => {
    if (!playedToday) return
    const id = setInterval(() => setLeft(msUntilMidnight()), 1000)
    return () => clearInterval(id)
  }, [playedToday])

  if (playedToday) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-12 text-center">
        <p className="text-5xl">📅</p>
        <h1 className="mt-3 text-2xl font-extrabold text-slate-900">Today&apos;s puzzle done!</h1>
        <p className="mt-2 text-slate-600">
          You already played the daily. Come back tomorrow for a fresh crossword.
        </p>
        <p className="mt-4 rounded-full bg-orange-100 px-4 py-1 text-sm font-extrabold text-orange-700">
          🔥 {streak}-day streak
        </p>
        <p className="mt-3 rounded-xl bg-slate-100 px-4 py-2 font-mono text-lg font-bold text-slate-800">
          Next puzzle in {formatCountdown(left)}
        </p>
        <button
          type="button"
          onClick={onQuit}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700"
        >
          Back to Modes
        </button>
      </div>
    )
  }

  return (
    <Game
      key={`daily-${today}`}
      puzzleData={puzzleData}
      onComplete={onComplete}
      onQuit={onQuit}
    />
  )
}
