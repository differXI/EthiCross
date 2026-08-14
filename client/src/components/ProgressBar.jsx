export default function ProgressBar({ solvedCount, total }) {
  const pct = Math.round((solvedCount / total) * 100)
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
        <span>Progress</span>
        <span>
          {solvedCount} / {total} terms
        </span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          role="progressbar"
          aria-valuenow={solvedCount}
          aria-valuemin={0}
          aria-valuemax={total}
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}