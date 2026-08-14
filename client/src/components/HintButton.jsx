export default function HintButton({ active, activeSolved, hinted, onUseHint }) {
  const used = active ? hinted.has(active.index) : false
  const disabled = !active || activeSolved || used
  return (
    <button
      type="button"
      onClick={onUseHint}
      disabled={disabled}
      className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {used ? 'Hint used' : 'Get a hint (−25 pts)'}
    </button>
  )
}