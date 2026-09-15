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
    <div className="mx-auto max-w-3xl px-4 py-6">
      <header className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to modes"
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
        >
          ← Modes
        </button>
        <h1 className="text-xl font-extrabold text-slate-900">🏁 Levels</h1>
        <span
          role="status"
          className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800"
        >
          ★ {totalStars} · {cleared}/{levels.length}
        </span>
      </header>

      {chapters.map((ch, ci) => {
        const done = ch.levels.filter((lv) => stars[lv.n] !== undefined).length
        return (
          <section key={ch.name} aria-label={`Chapter ${ci + 1}: ${ch.name}`} className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">
                Ch. {ci + 1} — {ch.name}
              </h2>
              <span className="text-xs font-bold text-slate-400">
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
                    className={`relative flex flex-col items-center rounded-2xl border-2 p-3 transition ${
                      clearedLv
                        ? 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100'
                        : open
                          ? 'border-blue-400 bg-white shadow-md hover:bg-blue-50'
                          : 'cursor-not-allowed border-slate-200 bg-slate-100 opacity-70'
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-extrabold text-white ${
                        clearedLv ? 'bg-emerald-500' : open ? 'bg-blue-600' : 'bg-slate-400'
                      }`}
                    >
                      {clearedLv ? '✓' : open ? lv.n : '🔒'}
                    </span>
                    <span className="mt-1.5 text-center text-xs font-extrabold text-slate-900">
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

      <p className="mt-6 text-center text-sm text-slate-500">
        Clear a level to unlock the next one. Fewer hints and retries earn more ★ stars.
      </p>
    </div>
  )
}
