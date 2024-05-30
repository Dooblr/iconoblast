// src/components/PowerUp/PowerUp.tsx
import React, { useEffect, useState } from "react"
import "./PowerUp.scss"
import { HiOutlineChartBar } from "react-icons/hi"

interface PowerUpProps {
  x: number
  y: number
  collected: boolean
}

const PowerUp: React.FC<PowerUpProps> = ({ x, y, collected }) => {
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    if (collected) {
      setBurst(true)
      setTimeout(() => setBurst(false), 500) // Reset burst state after animation
    }
  }, [collected])

  return (
    <HiOutlineChartBar
      className={`powerup ${burst ? "burst" : ""}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    />
  )
}

export default PowerUp
