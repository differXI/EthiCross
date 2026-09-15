import ThemeSwitcher from '../components/ThemeSwitcher'

function ModeCard({ emoji, title, blurb, status, action, onPlay }) {
  return (
    <article className="t-card p-5 text-left transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <p className="text-4xl" aria-hidden="true">{emoji}</p>
        <span className="t-chip px-2.5 py-1 text-xs">
          {status}
        </span>
      </div>
      <h2 className="t-ink mt-2 text-xl font-extrabold">{title}</h2>
      <p className="t-muted mt-1 text-sm">{blurb}</p>
      <button
        type="button"
        onClick={onPlay}
        className="t-btn mt-4 w-full px-4 py-2.5 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        {action}
      </button>
    </article>
  )
}

export default function Home({
  clearedCount,
  levelCount,
  totalStars,
  endlessBest,
  dailyStreak,
  dailyDone,
  learnedCount,
  termCount,
  theme,
  onTheme,
  onLevels,
  onEndless,
  onDaily,
  onStudy,
}) {
  return (
    <div className="t-page">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center px-4 py-10">
        <h1 className="t-title text-center text-5xl tracking-tight">
          Ethi<span className="t-sub">Cross</span>
        </h1>
        <p className="t-muted mt-2 text-center text-lg font-medium">
          Learn software ethics — pick your game!
        </p>
        <div className="mt-4">
          <ThemeSwitcher theme={theme} onChange={onTheme} />
        </div>

        <div className="mt-8 grid w-full gap-4">
          <ModeCard
            emoji="🏁"
            title="Levels"
            blurb="Battle through 100 crosswords across 20 themed chapters — from 4-word warm-ups to the Grand Master finale."
            status={`★ ${totalStars} · ${clearedCount}/${levelCount} cleared`}
            action={clearedCount > 0 ? 'Continue Climb' : 'Start Climb'}
            onPlay={onLevels}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <ModeCard
              emoji="♾️"
              title="Endless"
              blurb="Clues keep coming until you run out of hearts. 3 strikes and you're out!"
              status={endlessBest > 0 ? `Best ${endlessBest}` : 'No runs yet'}
              action="Survive"
              onPlay={onEndless}
            />
            <ModeCard
              emoji="📅"
              title="Daily"
              blurb="One fresh crossword every day. Play it once, build your streak."
              status={dailyDone ? `Done ✓ · 🔥 ${dailyStreak}` : `🔥 ${dailyStreak}-day streak`}
              action={dailyDone ? 'View Status' : "Play Today's"}
              onPlay={onDaily}
            />
          </div>
          <ModeCard
            emoji="📚"
            title="Study Index"
            blurb="New here? Read each world's terms — definitions, why they matter, and real examples — before you play."
            status={`${learnedCount}/${termCount} learned`}
            action="Read the Worlds"
            onPlay={onStudy}
          />
        </div>

        <section
          aria-label="How to play"
          className="t-card mt-8 w-full p-6 text-left"
        >
          <h2 className="t-ink text-lg font-bold">How to Play</h2>
          <ul className="t-muted mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>New here? Open the 📚 Study Index to read each world&apos;s terms first.</li>
            <li>Click a clue (or a cell on the grid) to select a word.</li>
            <li>Type your answer and press Check to submit it.</li>
            <li>Correct answers earn +100 points and reveal a short lesson.</li>
            <li>Stuck? Hints cost −25 points but never spoil the whole word.</li>
            <li>Finish a crossword to earn a +500 completion bonus.</li>
            <li>In Levels, clean runs (no hints, no retries) earn ★★★ stars.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
