// ./components/LandingScreen/LandingScreen.tsx

import React from "react"
import { FaPlay } from "react-icons/fa"
import gameLogo from "../../assets/images/logo.svg"
import useStore from "../../store"

import "./LandingScreen.scss"

const LandingScreen: React.FC = () => {
  const setCurrentPage = useStore((state) => state.setCurrentPage)

  const handlePlay = () => {
    setCurrentPage("game")
  }

  return (
    <div className="landing-screen">
      <img
        src={gameLogo}
        style={{ filter: "invert(1)", marginBottom: "3rem" }}
        className="landing-title"
      />
      <button className="start-button" onClick={handlePlay}>
        <FaPlay
          className="start-icon"
          style={{ transform: "translateY(15%)" }}
        />
      </button>
    </div>
  )
}

export default LandingScreen
