import { useState } from 'react'
import { terms, termList } from '../lib/puzzle'

function TermCard({ word, learned }) {
  const t = terms[word]
  return (
    <article className="t-soft p-4">
      <h4 className="t-ink font-extrabold tracking-wide">
        {word}
        {learned && (
          <span className="ml-2 text-xs font-bold text-emerald-600">✓ learned</span>
        )}
      </h4>
      <p className="t-muted mt-1 text-sm">
        <span className="t-ink font-semibold">Clue: </span>
        {t.clue}
      </p>
      <p className="t-muted mt-1 text-sm">
        <span className="t-ink font-semibold">Definition: </span>
        {t.definition}
      </p>
      <p className="t-muted mt-1 text-sm">
        <span className="t-ink font-semibold">Why it matters: </span>
        {t.importance}
      </p>
      <p className="t-soft mt-1 bg-white/40 px-2 py-1 text-sm">
        <span className="font-semibold">Example: </span>
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
          <h1 className="t-title text-xl">📚 Study Index</h1>
          <span
            role="status"
            className="t-chip px-3 py-1 text-sm"
          >
            {learnedSet.size}/{termList.length} learned
          </span>
        </header>

        <p className="t-muted mt-3 text-sm">
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
            placeholder="🔍 Search ethics terms… (e.g. privacy, bias, license)"
            autoComplete="off"
            className="t-input w-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {searchHits ? (
          <section aria-label="Search results" className="mt-4 space-y-3">
            <p className="t-muted text-sm font-bold">
              {searchHits.length} result{searchHits.length === 1 ? '' : 's'}
            </p>
            {searchHits.map((w) => (
              <TermCard key={w} word={w} learned={learnedSet.has(w)} />
            ))}
            {searchHits.length === 0 && (
              <p className="t-card p-4 text-center text-sm">
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
                  className="t-card overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-3 p-4 text-left transition hover:brightness-95"
                  >
                    <span className="t-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm">
                      {w.index}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="t-ink block truncate font-extrabold">
                        World {w.index} — {w.name}
                      </span>
                      <span className="t-muted block text-xs font-medium">
                        Levels {w.from}–{w.to} · {w.words.length} terms · {done}/{w.levels.length} cleared
                      </span>
                    </span>
                    <span className="t-muted shrink-0">{isOpen ? '▾' : '▸'}</span>
                  </button>
                  {isOpen && (
                    <div className="space-y-3 p-4 pt-1">
                      <button
                        type="button"
                        onClick={() => onPlayLevel(firstUncleared ?? w.from)}
                        className="t-btn w-full px-4 py-2 text-sm"
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
    </div>
  )
}
