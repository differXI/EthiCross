const THEMES = [
  { id: 'scholar', emoji: '📖', name: 'Scholar', swatch: 'linear-gradient(135deg,#ffffff 50%,#2563eb 50%)' },
  { id: 'candy', emoji: '🍬', name: 'Candy', swatch: 'linear-gradient(135deg,#ec4899,#f97316)' },
  { id: 'neon', emoji: '🌙', name: 'Neon', swatch: 'linear-gradient(135deg,#0a0e27 50%,#22d3ee 50%)' },
  { id: 'pixel', emoji: '👾', name: 'Pixel', swatch: 'linear-gradient(135deg,#fffdf5 50%,#e63946 50%)' },
]

export default function ThemeSwitcher({ theme, onChange }) {
  return (
    <div
      role="group"
      aria-label="Color theme"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      {THEMES.map((t) => {
        const active = theme === t.id
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            aria-pressed={active}
            aria-label={`${t.name} theme${active ? ', active' : ''}`}
            title={`${t.emoji} ${t.name}`}
            className={`flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-extrabold transition ${
              active
                ? 'border-current bg-slate-900 text-white'
                : 'border-slate-300 bg-white text-slate-600 hover:border-slate-500'
            }`}
          >
            <span
              aria-hidden="true"
              className="h-4 w-4 rounded-full border border-black/20"
              style={{ background: t.swatch }}
            />
            {t.name}
          </button>
        )
      })}
    </div>
  )
}
