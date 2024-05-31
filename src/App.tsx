import React from "react"
import LandingScreen from "./components/LandingScreen/LandingScreen"
import GameScreen from "./components/GameScreen/GameScreen" // rename the existing App component to GameScreen
import useStore from "./store"
import { FaCrosshairs } from "react-icons/fa"
import { renderToString } from "react-dom/server"
import "./App.scss"

const App: React.FC = () => {
  const currentPage = useStore((state) => state.currentPage)
  // const dimensions = { width: window.innerWidth, height: window.innerHeight }

  const getSvgDataUrl = (): string => {
    const svgString = encodeURIComponent(
      renderToString(<FaCrosshairs size={36} color={"white"} />)
    )
    return `data:image/svg+xml;charset=UTF-8,${svgString}`
  }

  const cursorSvgUrl = getSvgDataUrl()

  return (
    <>
      <div
        style={{
          cursor: `url("${cursorSvgUrl}") 12 12, auto`,
        }}
      >
        {currentPage === "landing" && <LandingScreen />}
        {currentPage === "game" && <GameScreen />}
      </div>
    </>
  )
}

export default App
