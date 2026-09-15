import { useMemo, useState } from 'react'
import { terms, termList } from '../lib/puzzle'

const QUIZ_KEY = 'ethicross-quiz-v1'
const QUESTION_COUNT = 10

function shuffled(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Build a test: each question shows a definition, player picks the term.
function buildTest() {
  return shuffled(termList).slice(0, QUESTION_COUNT).map((answer) => {
    const distractors = shuffled(termList.filter((w) => w !== answer)).slice(0, 3)
    return { answer, options: shuffled([answer, ...distractors]) }
  })
}

function loadAttempts() {
  try {
    const raw = localStorage.getItem(QUIZ_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function toCSV(rows) {
  const head = 'test,name,score,total,percent,date'
  const lines = rows.map((r) =>
    [r.type, `"${(r.name ?? '').replace(/"/g, '""')}"`, r.score, r.total, r.percent, r.date].join(','),
  )
  return [head, ...lines].join('\n')
}

export default function Quiz({ onBack }) {
  const [phase, setPhase] = useState('start') // start | run | review
  const [testType, setTestType] = useState('post')
  const [name, setName] = useState('')
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [qi, setQi] = useState(0)
  const [attempts, setAttempts] = useState(loadAttempts)
  const [copied, setCopied] = useState(false)

  const score = useMemo(() => {
    if (phase !== 'review') return null
    let s = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) s++
    })
    return s
  }, [phase, questions, answers])

  function start(type) {
    setTestType(type)
    setQuestions(buildTest())
    setAnswers(Array(QUESTION_COUNT).fill(null))
    setQi(0)
    setPhase('run')
  }

  function choose(option) {
    setAnswers((prev) => {
      const next = [...prev]
      next[qi] = option
      return next
    })
  }

  function submit() {
    let s = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) s++
    })
    const attempt = {
      type: testType,
      name: name.trim(),
      score: s,
      total: QUESTION_COUNT,
      percent: Math.round((s / QUESTION_COUNT) * 100),
      date: new Date().toISOString(),
    }
    const next = [attempt, ...attempts].slice(0, 50)
    setAttempts(next)
    try {
      localStorage.setItem(QUIZ_KEY, JSON.stringify(next))
    } catch {
      // storage unavailable — result still shown on screen
    }
    setPhase('review')
  }

  async function copyCSV() {
    try {
      await navigator.clipboard.writeText(toCSV(attempts))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const answeredCount = answers.filter((a) => a !== null).length
  const q = questions[qi]

  return (
    <div className="t-page">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <header className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={phase === 'run' ? () => setPhase('start') : onBack}
            aria-label={phase === 'run' ? 'Back to test setup' : 'Back to modes'}
            className="t-ghost px-3 py-1.5 text-sm"
          >
            ← {phase === 'run' ? 'Setup' : 'Modes'}
          </button>
          <h1 className="t-title text-xl">📝 Knowledge Test</h1>
          <span className="t-chip px-3 py-1 text-sm">{attempts.length} taken</span>
        </header>

        {phase === 'start' && (
          <>
            <div className="t-card mt-4 p-5">
              <h2 className="t-ink font-extrabold">How it works</h2>
              <ul className="t-muted mt-2 list-disc space-y-1 pl-5 text-sm">
                <li>{QUESTION_COUNT} multiple-choice questions: read a definition, pick the ethics term.</li>
                <li><strong>Post-test (required):</strong> take it after playing, to show what you learned.</li>
                <li><strong>Pre-test (optional):</strong> take it before playing, to compare before vs after.</li>
                <li>Your name/ID is optional and stays on this device — share results with your group via Copy CSV.</li>
              </ul>
              <label htmlFor="quiz-name" className="t-ink mt-4 block text-sm font-bold">
                Name / Student ID <span className="t-muted font-medium">(optional)</span>
              </label>
              <input
                id="quiz-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 65XXXXXXXX"
                autoComplete="off"
                maxLength={40}
                className="t-input mt-1 w-full px-3 py-2"
              />
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button type="button" onClick={() => start('pre')} className="t-ghost px-4 py-2.5">
                  Take Pre-test
                </button>
                <button type="button" onClick={() => start('post')} className="t-btn px-4 py-2.5">
                  Take Post-test ✓
                </button>
              </div>
            </div>

            {attempts.length > 0 && (
              <section aria-label="Past results" className="t-card mt-4 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="t-ink font-extrabold">Past results</h2>
                  <button
                    type="button"
                    onClick={copyCSV}
                    className="t-ghost px-3 py-1.5 text-xs"
                  >
                    {copied ? '✓ Copied!' : '📋 Copy CSV'}
                  </button>
                </div>
                <ul className="mt-3 space-y-2">
                  {attempts.map((a, i) => (
                    <li key={`${a.date}-${i}`} className="t-soft flex items-center justify-between px-3 py-2 text-sm">
                      <span>
                        <span className={`mr-2 rounded-full px-2 py-0.5 text-xs font-bold ${a.type === 'post' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'}`}>
                          {a.type === 'post' ? 'Post' : 'Pre'}
                        </span>
                        <span className="t-ink font-bold">{a.score}/{a.total} ({a.percent}%)</span>
                        {a.name && <span className="t-muted"> · {a.name}</span>}
                      </span>
                      <span className="t-muted text-xs">
                        {new Date(a.date).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="t-muted mt-3 text-xs">
                  For data collection: press Copy CSV and paste it into your group&apos;s spreadsheet.
                </p>
              </section>
            )}
          </>
        )}

        {phase === 'run' && q && (
          <div className="t-card mt-4 p-5">
            <p className="t-muted text-xs font-bold uppercase tracking-wide">
              {testType === 'post' ? 'Post-test' : 'Pre-test'} · Question {qi + 1} of {QUESTION_COUNT}
            </p>
            <div className="t-soft mt-2 h-2 w-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${((qi + 1) / QUESTION_COUNT) * 100}%` }}
              />
            </div>
            <p className="t-ink mt-4 font-medium">{terms[q.answer].definition}</p>
            <div className="mt-4 grid gap-2" role="radiogroup" aria-label={`Question ${qi + 1} options`}>
              {q.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  role="radio"
                  aria-checked={answers[qi] === opt}
                  onClick={() => choose(opt)}
                  className={`rounded-xl border-2 px-4 py-2.5 text-left font-mono font-bold tracking-wide transition ${
                    answers[qi] === opt
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 't-soft hover:brightness-95'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setQi((v) => Math.max(0, v - 1))}
                disabled={qi === 0}
                className="t-ghost px-4 py-2 text-sm disabled:opacity-50"
              >
                ← Back
              </button>
              <span className="t-muted text-xs">{answeredCount}/{QUESTION_COUNT} answered</span>
              {qi < QUESTION_COUNT - 1 ? (
                <button type="button" onClick={() => setQi((v) => v + 1)} className="t-btn px-4 py-2 text-sm">
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={answeredCount < QUESTION_COUNT}
                  className="t-btn px-4 py-2 text-sm disabled:opacity-50"
                >
                  Submit ✓
                </button>
              )}
            </div>
          </div>
        )}

        {phase === 'review' && score !== null && (
          <>
            <div className="t-card mt-4 p-6 text-center">
              <h2 className="t-ink text-2xl font-extrabold">
                {testType === 'post' ? 'Post-test' : 'Pre-test'}: {score}/{QUESTION_COUNT}
              </h2>
              <p className="t-sub text-4xl font-extrabold">{Math.round((score / QUESTION_COUNT) * 100)}%</p>
              <p className="t-muted mt-1 text-sm">
                {score === QUESTION_COUNT
                  ? 'Perfect — ethics master! 🏆'
                  : score >= 7
                    ? 'Great job — solid understanding! 🎉'
                    : score >= 5
                      ? 'Good start — try the Study Index, then retake! 📚'
                      : 'Keep learning — play some levels and try again! 💪'}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button type="button" onClick={() => start(testType)} className="t-ghost px-4 py-2 text-sm">
                  Retake {testType === 'post' ? 'Post-test' : 'Pre-test'}
                </button>
                <button type="button" onClick={() => setPhase('start')} className="t-btn px-4 py-2 text-sm">
                  All Results
                </button>
              </div>
            </div>
            <section aria-label="Answer review" className="mt-4 space-y-2">
              {questions.map((qq, i) => {
                const ok = answers[i] === qq.answer
                return (
                  <div key={i} className="t-card p-4 text-sm">
                    <p className="t-ink font-bold">
                      <span className={ok ? 'text-emerald-600' : 'text-red-600'}>
                        {ok ? '✓' : '✗'} Q{i + 1}
                      </span>
                      {' '}· {terms[qq.answer].definition}
                    </p>
                    <p className="t-muted mt-1">
                      Your answer: <strong className={ok ? 'text-emerald-600' : 'text-red-600'}>{answers[i]}</strong>
                      {!ok && (
                        <> · Correct: <strong className="text-emerald-600">{qq.answer}</strong></>
                      )}
                    </p>
                  </div>
                )
              })}
            </section>
          </>
        )}
      </div>
    </div>
  )
}
