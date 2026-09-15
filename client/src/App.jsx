import { useState } from 'react'
import Home from './pages/Home'
import Game from './pages/Game'
import Result from './pages/Result'
import Levels from './pages/Levels'
import Endless from './pages/Endless'
import Daily from './pages/Daily'
import Codex from './pages/Codex'
import { levels, LEVEL_COUNT, getLevel, puzzleFromLevel, todayKey, worlds, termList } from './lib/puzzle'

const LEVELS_KEY = 'ethicross-levels-v1'
const ENDLESS_KEY = 'ethicross-endless-best-v1'
const DAILY_KEY = 'ethicross-daily-v1'
const LEARNED_KEY = 'ethicross-learned-v1'

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage unavailable — progress just won't persist
  }
}

function starsFor(res) {
  if (res.hints === 0 && res.retries === 0) return 3
  if (res.hints <= 1 && res.retries <= 3) return 2
  return 1
}

function yesterdayKey() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return todayKey(d)
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [levelN, setLevelN] = useState(1)
  const [gameId, setGameId] = useState(0)
  const [result, setResult] = useState(null)
  const [levelStars, setLevelStars] = useState(() => loadJson(LEVELS_KEY, { stars: {} }).stars ?? {})
  const [endlessBest, setEndlessBest] = useState(() => loadJson(ENDLESS_KEY, 0))
  const [daily, setDaily] = useState(() => loadJson(DAILY_KEY, { lastPlayed: null, streak: 0 }))
  const [learned, setLearned] = useState(() => loadJson(LEARNED_KEY, []))

  const clearedCount = Object.keys(levelStars).length
  const totalStars = Object.values(levelStars).reduce((a, b) => a + b, 0)
  const today = todayKey()
  const dailyDone = daily.lastPlayed === today

  function persistStars(next) {
    setLevelStars(next)
    saveJson(LEVELS_KEY, { stars: next })
  }

  // Track every term solved in any mode — powers the Study Index ✓ marks.
  function addLearned(keys) {
    setLearned((prev) => {
      const next = [...prev]
      for (const k of keys ?? []) {
        if (k && !next.includes(k)) next.push(k)
      }
      saveJson(LEARNED_KEY, next)
      return next
    })
  }

  // --- Levels mode ---
  function startLevel(n) {
    setLevelN(n)
    setGameId((id) => id + 1)
    setResult(null)
    setScreen('game')
  }

  function handleLevelComplete(res) {
    const stars = starsFor(res)
    const level = getLevel(levelN)
    persistStars({ ...levelStars, [levelN]: Math.max(levelStars[levelN] ?? 0, stars) })
    addLearned(res.termsLearned.map((t) => t.term))
    const last = levelN >= LEVEL_COUNT
    setResult({
      mode: 'level',
      res,
      title: `Level ${levelN} Cleared!`,
      subtitle: `${level.title} · ${level.words.length} terms solved`,
      stars,
      buttons: [
        ...(!last ? [{ label: `Next: ${getLevel(levelN + 1).title}`, onClick: () => startLevel(levelN + 1), primary: true }] : []),
        ...(last ? [{ label: 'Play Endless ♾️', onClick: () => setScreen('endless'), primary: true }] : []),
        { label: 'Replay', onClick: () => startLevel(levelN) },
        { label: 'Level Map', onClick: () => setScreen('levels') },
      ],
    })
    setScreen('result')
  }

  // --- Daily mode ---
  function handleDailyComplete(res) {
    const streak = daily.lastPlayed === yesterdayKey() ? daily.streak + 1 : 1
    const next = { lastPlayed: today, streak }
    setDaily(next)
    saveJson(DAILY_KEY, next)
    addLearned(res.termsLearned.map((t) => t.term))
    setResult({
      mode: 'daily',
      res,
      title: 'Daily Complete!',
      subtitle: 'Same puzzle as everyone else today — nice work.',
      stars: starsFor(res),
      badge: `🔥 ${streak}-day streak`,
      buttons: [
        { label: 'Back to Modes', onClick: () => setScreen('home'), primary: true },
        { label: 'Keep Warm in Endless', onClick: () => setScreen('endless') },
      ],
    })
    setScreen('result')
  }

  // --- Endless mode ---
  function handleSaveBest(score, solvedKeys) {
    addLearned(solvedKeys)
    if (score > endlessBest) {
      setEndlessBest(score)
      saveJson(ENDLESS_KEY, score)
    }
  }

  const level = getLevel(levelN)

  return (
    <>
      {screen === 'home' && (
        <Home
          clearedCount={clearedCount}
          levelCount={LEVEL_COUNT}
          totalStars={totalStars}
          endlessBest={endlessBest}
          dailyStreak={daily.streak}
          dailyDone={dailyDone}
          learnedCount={learned.length}
          termCount={termList.length}
          onLevels={() => setScreen('levels')}
          onEndless={() => setScreen('endless')}
          onDaily={() => setScreen('daily')}
          onStudy={() => setScreen('codex')}
        />
      )}
      {screen === 'codex' && (
        <Codex
          worlds={worlds}
          stars={levelStars}
          learned={learned}
          onPlayLevel={startLevel}
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'levels' && (
        <Levels
          levels={levels}
          stars={levelStars}
          onPlay={startLevel}
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'game' && (
        <Game
          key={`level-${levelN}-${gameId}`}
          puzzleData={puzzleFromLevel(level)}
          onComplete={handleLevelComplete}
          onQuit={() => setScreen('levels')}
        />
      )}
      {screen === 'endless' && (
        <Endless best={endlessBest} onSaveBest={handleSaveBest} onQuit={() => setScreen('home')} />
      )}
      {screen === 'daily' && (
        <Daily
          playedToday={dailyDone}
          streak={daily.streak}
          onComplete={handleDailyComplete}
          onQuit={() => setScreen('home')}
        />
      )}
      {screen === 'result' && result && (
        <Result
          result={result.res}
          title={result.title}
          subtitle={result.subtitle}
          stars={result.stars}
          badge={result.badge}
          buttons={result.buttons}
        />
      )}
    </>
  )
}
