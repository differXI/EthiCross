function ClueList({ title, words, solved, hinted, active, onSelectWord }) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">{title}</h3>
      <ul className="mt-2 space-y-1">
        {words.map((p) => {
          const isSolved = solved.has(p.index)
          const isActive = active && active.index === p.index
          const style = isActive
            ? 'bg-blue-100 font-semibold text-blue-900'
            : isSolved
              ? 'text-slate-400 line-through'
              : 'text-slate-700 hover:bg-slate-100'
          return (
            <li key={`${p.dir}-${p.number}`}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelectWord(p)}
                className={`flex w-full gap-2 rounded px-2 py-1.5 text-left text-sm transition ${style}`}
              >
                <span className="shrink-0 font-semibold">{p.number}.</span>
                <span>{p.clue}</span>
                {isSolved && (
                  <span className="ml-auto shrink-0 font-semibold text-emerald-600">✓</span>
                )}
                {!isSolved && hinted.has(p.index) && (
                  <span className="ml-auto shrink-0 text-xs font-medium text-amber-600">
                    🛈 hint
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function CluePanel({ acrossWords, downWords, solved, hinted, active, onSelectWord }) {
  return (
    <div className="space-y-4">
      <ClueList
        title="Across"
        words={acrossWords}
        solved={solved}
        hinted={hinted}
        active={active}
        onSelectWord={onSelectWord}
      />
      <ClueList
        title="Down"
        words={downWords}
        solved={solved}
        hinted={hinted}
        active={active}
        onSelectWord={onSelectWord}
      />
    </div>
  )
}