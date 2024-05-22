import React from "react"
import { GrPowerReset } from "react-icons/gr"
import { HiMiniPause, HiMiniPlay } from "react-icons/hi2"
import useStore from "../../store"
import './HUD.scss'

interface HUDProps {
  resetGame: () => void
  togglePause: () => void
  isPaused: boolean
}

const HUD: React.FC<HUDProps> = ({ resetGame, togglePause, isPaused }) => {
  const { points } = useStore()
  return (
    <div className="hud-container">
      <h1 className="points-tracker shimmer">{points}</h1>
      <div style={{ flexGrow: "2" }} />
      <button className="reset-button" onClick={resetGame}>
        <GrPowerReset />
      </button>
      <button className={isPaused ? "play-button" : "pause-button"} onClick={togglePause}>
        {isPaused ? <HiMiniPlay /> : <HiMiniPause />}
      </button>
    </div>
  )
}

export default HUD
