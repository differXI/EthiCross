import { useState } from 'react'
import Home from './pages/Home'
import Game from './pages/Game'
import Result from './pages/Result'

export default function App() {
  const [page, setPage] = useState('home')
  const [result, setResult] = useState(null)
  const [gameId, setGameId] = useState(0)

  function startGame() {
    setGameId((id) => id + 1)
    setResult(null)
    setPage('game')
  }

  function handleComplete(res) {
    setResult(res)
    setPage('result')
  }

  return (
    <>
      {page === 'home' && <Home onStart={startGame} />}
      {page === 'game' && (
        <Game key={gameId} onComplete={handleComplete} onQuit={() => setPage('home')} />
      )}
      {page === 'result' && result && (
        <Result result={result} onRestart={startGame} onHome={() => setPage('home')} />
      )}
    </>
  )
}