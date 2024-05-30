// src/components/PowerUp/PowerUp.tsx
import React from "react"
import "./PowerUp.scss"

interface PowerUpProps {
  x: number
  y: number
}

const PowerUp: React.FC<PowerUpProps> = ({ x, y }) => {
  return (
    <div
      className="powerup"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    />
  )
}

export default PowerUp
