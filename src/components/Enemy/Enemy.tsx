// Enemy.tsx
import { useEffect, useRef, useState } from "react"
import { IconType } from "react-icons"
import impactSound from "../../assets/audio/enemy_impact.mp3" // Import the impact sound
import explosionSound from "../../assets/audio/explosion.mp3" // Import the explosion sound
import AudioEngine from "../../audio/AudioEngine"
import useStore from "../../store"
import "./Enemy.scss"
import { Position } from "../../types"

interface EnemyProps {
  maxHealth: number
  size: string
  Icon: IconType
  onDeath: (coords: { x: number; y: number }) => void
  id: string
  wobble?: boolean // Add the wobble prop
}

const Enemy: React.FC<EnemyProps> = ({
  maxHealth,
  size,
  Icon,
  onDeath,
  id,
  wobble = false,
}) => {
  const enemyRef = useRef<HTMLDivElement>(null)
  const [currentHealth, setCurrentHealth] = useState<number>(maxHealth)
  const [isHit, setIsHit] = useState<boolean>(false)
  const { enemies, removeEnemy } = useStore()

  useEffect(() => {
    if (currentHealth === 0) {
      const enemyElement = enemyRef.current
      let coords = { x: 0, y: 0 }
      if (enemyElement) {
        const rect = enemyElement.getBoundingClientRect()
        coords = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        }
      }
      onDeath(coords)
      removeEnemy(id)
      AudioEngine.playSound(explosionSound) // Play explosion sound
    }
  }, [currentHealth, id, onDeath, removeEnemy])

  const handleHit = () => {
    setIsHit(true)
    setCurrentHealth((health) => Math.max(health - 1, 0))
    AudioEngine.playSound(impactSound) // Play impact sound when enemy is hit
    setTimeout(() => setIsHit(false), 200) // Flash red for 200ms
  }

  useEffect(() => {
    const enemyElement = enemyRef.current
    if (enemyElement) {
      const handleEnemyHit = () => handleHit()
      enemyElement.addEventListener("enemyHit", handleEnemyHit)
      return () => {
        enemyElement.removeEventListener("enemyHit", handleEnemyHit)
      }
    }
  }, [])

  const enemy = enemies.find((e) => e.id === id)

  if (!enemy) return null

  return (
    <>
      <div
        className={`enemy ${wobble ? "wobble" : ""}`} // Apply wobble class if wobble is true
        ref={enemyRef}
        style={{
          left: `${enemy.position.x}px`,
          top: `${enemy.position.y}px`,
        }}
      >
        <div className="enemy-health-bar">
          <div
            className="enemy-health-bar-inner"
            style={{ width: `${(currentHealth / maxHealth) * 100}%` }}
          />
        </div>
        <Icon
          className={`enemy-icon ${isHit ? "hit" : ""}`}
          style={{ width: size, height: size }}
        />
      </div>
    </>
  )
}

export default Enemy
