// src/components/Projectile/Projectile.tsx
import { IconType } from "react-icons"
import { motion } from "framer-motion"
import { useEffect } from "react"
import "./Projectile.scss"
import AudioEngine from "../../audio/AudioEngine"

interface ProjectileProps {
  id: number
  x: number
  y: number
  rotation: number
  vx: number
  vy: number
  icon: IconType
  size: string
  audioSrc: string
}

const Projectile: React.FC<ProjectileProps> = ({
  id,
  x,
  y,
  rotation,
  icon: Icon,
  size,
  audioSrc,
}) => {
  useEffect(() => {
    const playAudio = async () => {
      await AudioEngine.playSound(audioSrc)
    }

    playAudio()
  }, [audioSrc])

  return (
    <motion.div
      className="projectile"
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rotation}deg)`,
        width: size,
        height: size,
      }}
    >
      <Icon className="projectile-icon" />
    </motion.div>
  )
}

export default Projectile
