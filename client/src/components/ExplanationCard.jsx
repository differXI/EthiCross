export default function ExplanationCard({ term, onDismiss }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${term.term} explanation`}
      onClick={onDismiss}
      className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/60 p-4"
    >
        <div
        className="t-card w-full max-w-lg p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="t-ink text-xl font-bold">{term.term}</h3>
        <dl className="t-muted mt-3 space-y-3 text-sm">
          <div>
            <dt className="t-ink font-semibold">Definition</dt>
            <dd>{term.definition}</dd>
          </div>
          <div>
            <dt className="t-ink font-semibold">Why it matters</dt>
            <dd>{term.importance}</dd>
          </div>
          <div>
            <dt className="t-ink font-semibold">Real-world example</dt>
            <dd>{term.example}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={onDismiss}
          className="t-btn mt-5 w-full px-4 py-2 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          Continue
        </button>
      </div>
    </div>
  )
}