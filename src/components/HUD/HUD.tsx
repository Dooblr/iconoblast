import React, { useEffect } from "react"
import { GrPowerReset } from "react-icons/gr"
import { HiMiniPause, HiMiniPlay } from "react-icons/hi2"
import useStore from "../../store"
import AudioEngine from "../../audio/AudioEngine"
import "./HUD.scss"

interface HUDProps {
  resetGame: () => void
  togglePause: () => void
  isPaused: boolean
}

const HUD: React.FC<HUDProps> = ({ resetGame, togglePause, isPaused }) => {
  const { points, playerHP } = useStore()

  const handleTogglePause = () => {
    if (isPaused) {
      AudioEngine.resumeBackgroundMusic()
      togglePause()
      setTimeout(() => {
        AudioEngine.playHUDSound("/src/assets/audio/resume.mp3")
      }, 0)
    } else {
      AudioEngine.pauseBackgroundMusic()
      togglePause()
      setTimeout(() => {
        AudioEngine.playHUDSound("/src/assets/audio/pause.mp3")
      }, 0)
    }
  }

  const getHealthColor = () => {
    if (playerHP >= 5) return "rgb(150,255,150)"
    if (playerHP >= 2) return "rgb(255,255,150)"
    return "tomato"
  }

  return (
    <div className="hud-container">
      <h1 className="points-tracker shimmer">{points}</h1>
      <div className="health-bar-wrapper">
        <div
          className="health-bar"
          style={{
            width: `${playerHP * 10}%`,
            backgroundColor: getHealthColor(),
          }}
        />
      </div>
      <div className="menu-buttons">
        <button className="reset-button" onClick={resetGame}>
          <GrPowerReset />
        </button>
        <button
          className={isPaused ? "play-button" : "pause-button"}
          onClick={handleTogglePause}
        >
          {isPaused ? <HiMiniPlay /> : <HiMiniPause />}
        </button>
      </div>
    </div>
  )
}

export default HUD
