import React from "react"
import useStore from "../../store"
import "./GameOver.scss"
import { TiArrowRepeatOutline } from "react-icons/ti"

const GameOver: React.FC = () => {
  const resetGame = useStore((state) => state.resetGame)

  return (
    <div className="game-over-container container">
      <h1>Game Over</h1>
      <button onClick={resetGame} className="play-button">
        <TiArrowRepeatOutline />
      </button>
    </div>
  )
}

export default GameOver
