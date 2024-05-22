// ./components/LandingScreen/LandingScreen.tsx

import React from "react"
import useStore from "../../store"
import { CiPlay1 } from "react-icons/ci";
import "./LandingScreen.scss"

const LandingScreen: React.FC = () => {
  const setCurrentPage = useStore((state) => state.setCurrentPage)

  const handlePlay = () => {
    setCurrentPage("game")
  }

  return (
    <div className="landing-screen">
      <button className="play-button" onClick={handlePlay}>
        <CiPlay1 className="play-icon" style={{transform:'translateY(15%)'}}/>
      </button>
    </div>
  )
}

export default LandingScreen
