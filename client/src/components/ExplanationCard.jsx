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
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-slate-900">{term.term}</h3>
        <dl className="mt-3 space-y-3 text-sm text-slate-700">
          <div>
            <dt className="font-semibold text-slate-900">Definition</dt>
            <dd>{term.definition}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Why it matters</dt>
            <dd>{term.importance}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Real-world example</dt>
            <dd>{term.example}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          Continue
        </button>
      </div>
    </div>
  )
}