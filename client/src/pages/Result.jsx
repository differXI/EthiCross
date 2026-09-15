function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  )
}

function BigStars({ n }) {
  return (
    <p aria-label={`${n} of 3 stars`} className="mt-2 text-4xl tracking-tight">
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= n ? 'text-amber-400' : 'text-slate-300'}>
          ★
        </span>
      ))}
    </p>
  )
}

// Generic result screen for Levels / Daily.
// buttons: [{ label, onClick, primary }]
export default function Result({ result, title, subtitle, stars, badge, buttons }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-center">
      <h1 className="text-3xl font-extrabold text-slate-900">{title ?? 'Puzzle Complete!'}</h1>
      {subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}
      {stars !== undefined && <BigStars n={stars} />}
      {badge && (
        <p className="mt-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-extrabold text-orange-700">
          {badge}
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 text-left sm:grid-cols-4">
        <Stat label="Final score" value={result.score} />
        <Stat label="Time" value={formatTime(result.time)} />
        <Stat label="Correct" value={`${result.correct} / ${result.total}`} />
        <Stat label="Retries" value={result.retries} />
      </div>
      <p className="mt-2 text-center text-xs text-slate-500">
        {result.hints > 0
          ? `Used ${result.hints} hint${result.hints > 1 ? 's' : ''} (−25 pts each).`
          : 'No hints used — well done!'}
      </p>

      {result.termsLearned?.length > 0 && (
        <section
          className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-left"
          aria-label="Terms learned"
        >
          <h2 className="text-lg font-bold text-slate-900">Ethics terms learned</h2>
          <ul className="mt-3 space-y-4">
            {result.termsLearned.map((t) => (
              <li key={t.term} className="border-t border-slate-100 pt-3 first:border-t-0 first:pt-0">
                <h3 className="font-bold text-slate-900">
                  {t.term}
                  <span className="ml-2 text-sm font-semibold text-emerald-600">✓ learned</span>
                </h3>
                <p className="mt-1 text-sm text-slate-600">{t.definition}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
            Review these terms before your next game — each one matters for responsible software
            development.
          </p>
        </section>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {(buttons ?? []).map((b) => (
          <button
            key={b.label}
            type="button"
            onClick={b.onClick}
            className={
              b.primary
                ? 'rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700'
                : 'rounded-lg border border-slate-300 bg-white px-6 py-2 font-semibold text-slate-700 transition hover:bg-slate-100'
            }
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  )
}
