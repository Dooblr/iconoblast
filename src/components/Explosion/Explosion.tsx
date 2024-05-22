import React, { useEffect, useState } from "react"
import { HiCubeTransparent } from "react-icons/hi"
import "./Explosion.scss"

interface ExplosionProps {
  x: number
  y: number
  size: string
}

const Explosion: React.FC<ExplosionProps> = ({ x, y, size }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 1000) // Duration of the animation in milliseconds

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className="explosion"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: size,
        height: size,
      }}
    >
      <HiCubeTransparent className="explosion-icon" />
    </div>
  )
}

export default Explosion
