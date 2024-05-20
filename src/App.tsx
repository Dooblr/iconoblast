import { HiArrowCircleUp, HiChevronUp, HiOutlineUser } from "react-icons/hi"
import "./App.scss"
import { useRef, useState, useEffect, useCallback } from "react"
import Enemy from "./components/Enemy/Enemy"
import Projectile from "./components/Projectile/Projectile"
import useStore from "./store"

interface ProjectileData {
  id: number
  x: number
  y: number
  rotation: number
  vx: number
  vy: number
}

const App = () => {
  const playerRef = useRef<HTMLDivElement>(null)
  const firePointRef = useRef<HTMLDivElement>(null)
  const {
    playerPosition,
    setPlayerPosition,
    moveEnemies,
    enemies,
    initializeEnemy,
    removeEnemy,
  } = useStore()
  const [rotation, setRotation] = useState<number>(0)
  const [projectiles, setProjectiles] = useState<ProjectileData[]>([])
  const [projectileId, setProjectileId] = useState<number>(0)
  const [playerHP, setPlayerHP] = useState<number>(10) // Player health state
  const [isPaused, setIsPaused] = useState<boolean>(false) // Pause state

  useEffect(() => {
    initializeEnemy("enemy1", { x: 100, y: 200 }) // Initialize first enemy
    initializeEnemy("enemy2", { x: 200, y: 300 }) // Initialize second enemy
  }, [initializeEnemy])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isPaused) return

      const target = e.currentTarget
      const targetRect = target.getBoundingClientRect()
      const iconRect = playerRef.current!.getBoundingClientRect()

      const targetX = e.clientX - targetRect.left
      const targetY = e.clientY - targetRect.top

      const iconX = iconRect.left + iconRect.width / 2 - targetRect.left
      const iconY = iconRect.top + iconRect.height / 2 - targetRect.top

      const deltaX = targetX - iconX
      const deltaY = targetY - iconY

      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)

      setRotation(angle + 90) // Adjusting the angle to align with the top of the icon

      // Use requestAnimationFrame for smooth animation
      const movePlayer = () => {
        setPlayerPosition({
          x: targetX - iconRect.width / 2,
          y: targetY - iconRect.height / 2,
        })
      }

      requestAnimationFrame(movePlayer)
    },
    [setPlayerPosition, isPaused]
  )

  useEffect(() => {
    if (isPaused) return

    const shootProjectile = () => {
      if (!playerRef.current) return

      const angleRad = (rotation - 90) * (Math.PI / 180)
      const vx = Math.cos(angleRad) * 10
      const vy = Math.sin(angleRad) * 10

      const firePointElement = document.getElementById("fire-point")
      const position = firePointElement!.getBoundingClientRect()
      const x = position.left
      const y = position.top

      const initialX = x
      const initialY = y

      setProjectiles((prev) => [
        ...prev,
        {
          id: projectileId,
          x: initialX,
          y: initialY,
          rotation: rotation,
          vx: vx,
          vy: vy,
        },
      ])
      setProjectileId((prev) => prev + 1)
    }

    const interval = setInterval(() => {
      shootProjectile()
    }, 1000) // Fire projectiles every second

    return () => clearInterval(interval)
  }, [rotation, projectileId, playerPosition, isPaused])

  useEffect(() => {
    const moveProjectiles = () => {
      if (isPaused) return

      setProjectiles(
        (prev) =>
          prev
            .map((proj) => ({
              ...proj,
              x: proj.x + proj.vx,
              y: proj.y + proj.vy,
            }))
            .filter(
              (proj) =>
                proj.x > 0 &&
                proj.x < window.innerWidth &&
                proj.y > 0 &&
                proj.y < window.innerHeight
            ) // Remove projectiles out of bounds
      )
    }

    const interval = setInterval(moveProjectiles, 50) // Move projectiles smoothly

    return () => clearInterval(interval)
  }, [isPaused])

  useEffect(() => {
    const checkCollisions = () => {
      if (isPaused) return

      const enemyElements = document.querySelectorAll(".enemy")
      if (!enemyElements.length) return // Check if there are any enemies

      setProjectiles((prev) => {
        return prev.filter((proj) => {
          for (let enemyElement of enemyElements) {
            const isExploding = enemyElement.classList.contains("exploding")
            if (isExploding) continue

            const targetRect = enemyElement.getBoundingClientRect()
            const projRect = {
              left: proj.x,
              top: proj.y,
              right: proj.x + 20,
              bottom: proj.y + 20,
            }
            const isHit =
              projRect.left < targetRect.right &&
              projRect.right > targetRect.left &&
              projRect.top < targetRect.bottom &&
              projRect.bottom > targetRect.top
            if (isHit) {
              const event = new CustomEvent("enemyHit", {
                detail: { id: enemyElement.id },
              })
              enemyElement.dispatchEvent(event)
              return false
            }
          }
          return true
        })
      })
    }

    const interval = setInterval(checkCollisions, 50) // Check for collisions every 50ms

    return () => clearInterval(interval)
  }, [isPaused])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        moveEnemies()
      }
    }, 100) // Move enemies every 100ms

    return () => clearInterval(interval)
  }, [moveEnemies, isPaused])

  const resetGame = () => {
    setPlayerPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    setRotation(0)
    setProjectiles([])
    setProjectileId(0)
    setPlayerHP(10)
    initializeEnemy("enemy1", { x: 100, y: 200 }) // Reinitialize first enemy
    initializeEnemy("enemy2", { x: 200, y: 300 }) // Reinitialize second enemy
  }

  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  return (
    <>
      <div className="container" onClick={handleClick}>
        {Object.keys(enemies).map((enemyId) => (
          <Enemy
            key={enemyId}
            id={enemyId}
            maxHealth={10}
            size="5rem"
            Icon={HiOutlineUser}
            position={enemies[enemyId]}
            onDeath={() => {
              removeEnemy(enemyId)
            }}
          />
        ))}
        <div
          className="player-wrapper"
          style={{
            left: `${playerPosition.x}px`,
            top: `${playerPosition.y}px`,
            transition: "left 0.5s ease, top 0.5s ease",
          }}
        >
          <div
            ref={playerRef}
            className="player-icon-wrapper"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: "transform 0.5s ease",
            }}
          >
            <HiArrowCircleUp className="player-icon" />
            <div
              style={{
                borderRadius: "100%",
                width: "10px",
                height: "10px",
                background: "red",
                position: "absolute",
                top: "0",
                opacity: "0",
              }}
              id="fire-point"
              ref={firePointRef}
            />
          </div>

          <div className="health-bar">
            <div
              className="health-bar-inner"
              style={{ width: `${(playerHP / 10) * 100}%` }}
            />
          </div>
        </div>

        {projectiles.map((proj) => (
          <Projectile
            key={proj.id}
            id={proj.id}
            x={proj.x}
            y={proj.y}
            rotation={proj.rotation}
            vx={proj.vx}
            vy={proj.vy}
            icon={HiChevronUp}
            size="20px"
          />
        ))}

        <button className="reset-button" onClick={resetGame}>
          Reset
        </button>
        <button className="pause-button" onClick={togglePause}>
          {isPaused ? "Resume" : "Pause"}
        </button>
      </div>
    </>
  )
}

export default App
