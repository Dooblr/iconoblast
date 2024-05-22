// ./components/LandingScreen/LandingScreen.tsx

import React from "react"
import useStore from "../../store"
import "./LandingScreen.scss"

const LandingScreen: React.FC = () => {
  const setCurrentPage = useStore((state) => state.setCurrentPage)

  const handlePlay = () => {
    setCurrentPage("game")
  }

  return (
    <div className="landing-screen">
      <button className="play-button" onClick={handlePlay}>
        Play
      </button>
    </div>
  )
}

export default LandingScreen
