export default function Home({ onStart }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 py-12 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
        Ethi<span className="text-blue-600">Cross</span>
      </h1>
      <p className="mt-2 text-lg font-medium text-slate-600">
        A crossword game for learning software ethics
      </p>
      <p className="mt-6 max-w-xl text-slate-600">
        Solve clues about ethics in software engineering — privacy, security, fairness, and more.
        Each correct answer unlocks a short lesson with a real-world example.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="mt-8 rounded-xl bg-blue-600 px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        Start Game
      </button>

      <section
        aria-label="How to play"
        className="mt-12 w-full rounded-xl border border-slate-200 bg-white p-6 text-left"
      >
        <h2 className="text-lg font-bold text-slate-900">How to Play</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Click a clue (or a cell on the grid) to select a word.</li>
          <li>Type your answer and press Check to submit it.</li>
          <li>Correct answers earn +100 points and reveal a short lesson.</li>
          <li>Stuck? Hints cost −25 points but never spoil the whole word.</li>
          <li>Finish all 7 terms to earn a +500 completion bonus.</li>
        </ul>
      </section>
    </div>
  )
}