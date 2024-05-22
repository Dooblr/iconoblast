// src/components/HUD/HUD.tsx

import React from "react"
import { GrPowerReset } from "react-icons/gr"
import { HiMiniPause, HiMiniPlay } from "react-icons/hi2"
import useStore from "../../store"
import AudioEngine from "../../audio/AudioEngine" // Import the AudioEngine
import "./HUD.scss"

interface HUDProps {
  resetGame: () => void
  togglePause: () => void
  isPaused: boolean
}

const HUD: React.FC<HUDProps> = ({ resetGame, togglePause, isPaused }) => {
  const { points } = useStore()

  const handleTogglePause = () => {
    if (isPaused) {
      togglePause() // Toggle pause first to update the state
      setTimeout(() => {
        AudioEngine.playHUDSound("/src/assets/audio/resume.mp3")
      }, 0) // Play resume sound after state has been updated
    } else {
      togglePause() // Toggle pause first to update the state
      setTimeout(() => {
        AudioEngine.playHUDSound("/src/assets/audio/pause.mp3")
      }, 0) // Play pause sound after state has been updated
    }
  }

  return (
    <div className="hud-container">
      <h1 className="points-tracker shimmer">{points}</h1>
      <div style={{ flexGrow: "2" }} />
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
  )
}

export default HUD
