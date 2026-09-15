const difficultyStyle = {
  'Warm-up': 'bg-emerald-100 text-emerald-800',
  Easy: 'bg-sky-100 text-sky-800',
  Tricky: 'bg-amber-100 text-amber-800',
  Hard: 'bg-orange-100 text-orange-800',
  Expert: 'bg-rose-100 text-rose-800',
}

function Stars({ n }) {
  return (
    <span aria-label={`${n} of 3 stars`} className="text-sm tracking-tight">
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= n ? 'text-amber-400' : 'text-slate-300'}>
          ★
        </span>
      ))}
    </span>
  )
}

export default function Levels({ levels, stars, onPlay, onBack }) {
  const cleared = Object.keys(stars).length
  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0)

  // A level is open when it is #1 or the previous one is cleared.
  const isOpen = (n) => n === 1 || stars[n - 1] !== undefined

  // Group into chapters of 5 for a mobile-style world map.
  const chapters = []
  for (const lv of levels) {
    const last = chapters[chapters.length - 1]
    if (!last || last.name !== lv.chapter) chapters.push({ name: lv.chapter, levels: [lv] })
    else last.levels.push(lv)
  }

  return (
    <div className="t-page">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <header className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to modes"
            className="t-ghost px-3 py-1.5 text-sm"
          >
            ← Modes
          </button>
          <h1 className="t-title text-xl">🏁 Levels</h1>
          <span
            role="status"
            className="t-chip px-3 py-1 text-sm"
          >
            ★ {totalStars} · {cleared}/{levels.length}
          </span>
        </header>

        {chapters.map((ch, ci) => {
          const done = ch.levels.filter((lv) => stars[lv.n] !== undefined).length
          return (
            <section key={ch.name} aria-label={`Chapter ${ci + 1}: ${ch.name}`} className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="t-muted text-sm font-extrabold uppercase tracking-wide">
                  Ch. {ci + 1} — {ch.name}
                </h2>
                <span className="t-muted text-xs font-bold">
                  {done}/{ch.levels.length}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {ch.levels.map((lv) => {
                  const open = isOpen(lv.n)
                  const clearedLv = stars[lv.n] !== undefined
                  return (
                    <button
                      key={lv.id}
                      type="button"
                      disabled={!open}
                      onClick={() => onPlay(lv.n)}
                      aria-label={
                        clearedLv
                          ? `Level ${lv.n} ${lv.title}, cleared with ${stars[lv.n]} stars, replay`
                          : open
                            ? `Level ${lv.n} ${lv.title}, play`
                            : `Level ${lv.n} locked, clear level ${lv.n - 1} first`
                      }
                      className={`t-card relative flex flex-col items-center p-3 transition ${
                        !open ? 'cursor-not-allowed opacity-70' : 'hover:shadow-md'
                      }`}
                    >
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-extrabold text-white ${
                          clearedLv ? 'bg-emerald-500' : open ? 'bg-blue-600' : 'bg-slate-400'
                        }`}
                      >
                        {clearedLv ? '✓' : open ? lv.n : '🔒'}
                      </span>
                      <span className="t-ink mt-1.5 text-center text-xs font-extrabold">
                        {lv.title}
                      </span>
                      <span
                        className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${difficultyStyle[lv.difficulty] ?? 'bg-slate-100 text-slate-700'}`}
                      >
                        {lv.difficulty}
                      </span>
                      {clearedLv && (
                        <span className="mt-0.5">
                          <Stars n={stars[lv.n]} />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}

        <p className="t-muted mt-6 text-center text-sm">
          Clear a level to unlock the next one. Fewer hints and retries earn more ★ stars.
        </p>
      </div>
    </div>
  )
}
