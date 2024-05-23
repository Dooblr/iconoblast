import { useEffect, useRef } from "react"
import useStore from "../store"

const useCollisionDetection = (
  projectiles: any[],
  setProjectiles: (fn: (prev: any[]) => any[]) => void,
  isPaused: boolean,
  playerRef: React.RefObject<HTMLDivElement>
) => {
  const { playerHP, setPlayerHP } = useStore()
  const damageIntervalRef = useRef<number | null>(null)

  useEffect(() => {
    const checkCollisions = () => {
      if (isPaused) return

      const enemyElements = document.querySelectorAll(".enemy")
      if (!enemyElements.length) return // Check if there are any enemies

      // Detect collisions between projectiles and enemies
      setProjectiles((prev) => {
        return prev.filter((proj) => {
          for (let enemyElement of enemyElements) {
            // Allow projectiles to pass through explosions
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

      // Detect collisions between player and enemies
      if (playerRef.current && playerHP > 0) {
        const playerRect = playerRef.current.getBoundingClientRect()
        let isPlayerColliding = false

        enemyElements.forEach((enemyElement) => {
          const enemyRect = enemyElement.getBoundingClientRect()
          const isColliding = !(
            playerRect.right < enemyRect.left ||
            playerRect.left > enemyRect.right ||
            playerRect.bottom < enemyRect.top ||
            playerRect.top > enemyRect.bottom
          )
          if (isColliding) {
            console.log(
              "Collision detected between player and enemy:",
              enemyElement.id
            )
            isPlayerColliding = true
          }
        })

        // Handle continuous damage if player is colliding
        if (isPlayerColliding) {
          if (damageIntervalRef.current === null) {
            setPlayerHP(playerHP - 1)
            damageIntervalRef.current = window.setInterval(() => {
              setPlayerHP(playerHP - 1)
              console.log("Player HP reduced:", playerHP - 1)
            }, 1000) // Apply damage every 1 second
          }
        } else {
          if (damageIntervalRef.current !== null) {
            clearInterval(damageIntervalRef.current)
            damageIntervalRef.current = null
          }
        }
      }
    }

    const interval = setInterval(checkCollisions, 50) // Check for collisions every 50ms

    return () => {
      clearInterval(interval)
      if (damageIntervalRef.current !== null) {
        clearInterval(damageIntervalRef.current)
      }
    }
  }, [isPaused, setProjectiles, playerRef, playerHP, setPlayerHP])
}

export default useCollisionDetection
