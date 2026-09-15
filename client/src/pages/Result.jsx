function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

function Stat({ label, value }) {
  return (
    <div className="t-card p-4 text-center">
      <p className="t-muted text-xs font-bold uppercase tracking-wide">{label}</p>
      <p className="t-ink mt-1 text-2xl font-extrabold">{value}</p>
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
    <div className="t-page">
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
      <h1 className="t-title text-3xl">{title ?? 'Puzzle Complete!'}</h1>
      {subtitle && <p className="t-muted mt-1">{subtitle}</p>}
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
      <p className="t-muted mt-2 text-center text-xs">
        {result.hints > 0
          ? `Used ${result.hints} hint${result.hints > 1 ? 's' : ''} (−25 pts each).`
          : 'No hints used — well done!'}
      </p>

      {result.termsLearned?.length > 0 && (
        <section
          className="t-card mt-8 p-6 text-left"
          aria-label="Terms learned"
        >
          <h2 className="t-ink text-lg font-bold">Ethics terms learned</h2>
          <ul className="mt-3 space-y-4">
            {result.termsLearned.map((t) => (
              <li key={t.term} className="t-soft mt-3 p-3 first:mt-0">
                <h3 className="t-ink font-bold">
                  {t.term}
                  <span className="ml-2 text-sm font-semibold text-emerald-600">✓ learned</span>
                </h3>
                <p className="t-muted mt-1 text-sm">{t.definition}</p>
              </li>
            ))}
          </ul>
          <p className="t-soft t-muted mt-4 px-3 py-2 text-sm">
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
                ? 't-btn px-6 py-2'
                : 't-ghost px-6 py-2'
            }
          >
            {b.label}
          </button>
        ))}
      </div>
      </div>
    </div>
  )
}
