// ./App.tsx

import React from "react"
import LandingScreen from "./components/LandingScreen/LandingScreen"
import GameScreen from "./components/GameScreen/GameScreen" // rename the existing App component to GameScreen
import useStore from "./store"
import "./App.scss"

const App: React.FC = () => {
  const currentPage = useStore((state) => state.currentPage)

  return (
    <>
      {currentPage === "landing" && <LandingScreen />}
      {currentPage === "game" && <GameScreen />}
    </>
  )
}

export default App
