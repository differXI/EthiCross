import { useState } from 'react'
import { terms, termList } from '../lib/puzzle'

function TermCard({ word, learned }) {
  const t = terms[word]
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h4 className="font-extrabold tracking-wide text-slate-900">
        {t.term}
        {learned && (
          <span className="ml-2 text-xs font-bold text-emerald-600">✓ learned</span>
        )}
      </h4>
      <p className="mt-1 text-sm text-slate-600">
        <span className="font-semibold text-slate-700">Clue: </span>
        {t.clue}
      </p>
      <p className="mt-1 text-sm text-slate-600">
        <span className="font-semibold text-slate-700">Definition: </span>
        {t.definition}
      </p>
      <p className="mt-1 text-sm text-slate-600">
        <span className="font-semibold text-slate-700">Why it matters: </span>
        {t.importance}
      </p>
      <p className="mt-1 rounded-lg bg-white px-2 py-1 text-sm text-slate-600">
        <span className="font-semibold text-slate-700">Example: </span>
        {t.example}
      </p>
      {!learned && (
        <p className="mt-1 text-xs font-medium text-amber-600">🛈 Hint: {t.hint}</p>
      )}
    </article>
  )
}

export default function Codex({ worlds, stars, learned, onPlayLevel, onBack }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(() => {
    // Open the first world the player hasn't finished yet.
    const idx = worlds.findIndex((w) =>
      w.levels.some((n) => stars[n] === undefined),
    )
    return new Set([idx === -1 ? 0 : idx])
  })

  const learnedSet = new Set(learned)
  const q = query.trim().toUpperCase()
  const searchHits = q
    ? termList.filter(
        (w) =>
          w.includes(q) ||
          terms[w].definition.toUpperCase().includes(q) ||
          terms[w].clue.toUpperCase().includes(q),
      )
    : null

  function toggle(i) {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
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
        <h1 className="text-xl font-extrabold text-slate-900">📚 Study Index</h1>
        <span
          role="status"
          className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800"
        >
          {learnedSet.size}/{termList.length} learned
        </span>
      </header>

      <p className="mt-3 text-sm text-slate-600">
        Read a world&apos;s terms first, then play its levels with confidence.
        Terms you solve in any mode are marked ✓ learned.
      </p>

      <div className="mt-4">
        <label htmlFor="codex-search" className="sr-only">
          Search all ethics terms
        </label>
        <input
          id="codex-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Search 70 ethics terms… (e.g. privacy, bias, license)"
          autoComplete="off"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {searchHits ? (
        <section aria-label="Search results" className="mt-4 space-y-3">
          <p className="text-sm font-bold text-slate-500">
            {searchHits.length} result{searchHits.length === 1 ? '' : 's'}
          </p>
          {searchHits.map((w) => (
            <TermCard key={w} word={w} learned={learnedSet.has(w)} />
          ))}
          {searchHits.length === 0 && (
            <p className="rounded-xl bg-white p-4 text-center text-sm text-slate-500">
              No terms match “{query}”. Try another word.
            </p>
          )}
        </section>
      ) : (
        <div className="mt-4 space-y-3">
          {worlds.map((w, i) => {
            const done = w.levels.filter((n) => stars[n] !== undefined).length
            const isOpen = open.has(i)
            const firstUncleared = w.levels.find((n) => stars[n] === undefined)
            return (
              <section
                key={w.name}
                aria-label={`World ${w.index}: ${w.name}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-slate-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-extrabold text-white">
                    {w.index}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-extrabold text-slate-900">
                      World {w.index} — {w.name}
                    </span>
                    <span className="block text-xs font-medium text-slate-500">
                      Levels {w.from}–{w.to} · {w.words.length} terms · {done}/{w.levels.length} cleared
                    </span>
                  </span>
                  <span className="shrink-0 text-slate-400">{isOpen ? '▾' : '▸'}</span>
                </button>
                {isOpen && (
                  <div className="space-y-3 border-t border-slate-100 p-4">
                    <button
                      type="button"
                      onClick={() => onPlayLevel(firstUncleared ?? w.from)}
                      className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      {firstUncleared
                        ? `▶ Play Level ${firstUncleared}`
                        : `↻ Replay Level ${w.from}`}
                    </button>
                    {w.words.map((word) => (
                      <TermCard key={word} word={word} learned={learnedSet.has(word)} />
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
