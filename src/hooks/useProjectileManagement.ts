// ./hooks/useProjectileManagement.ts

import { useEffect, useState } from "react"

interface ProjectileData {
  id: number
  x: number
  y: number
  rotation: number
  vx: number
  vy: number
}

const useProjectileManagement = (
  rotation: number,
  playerRef: React.RefObject<HTMLDivElement>,
  isPaused: boolean,
  fireRate: number
) => {
  const [projectiles, setProjectiles] = useState<ProjectileData[]>([])
  const [projectileId, setProjectileId] = useState<number>(0)

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
    }, fireRate) // Use the fireRate parameter

    return () => clearInterval(interval)
  }, [rotation, projectileId, playerRef, isPaused, fireRate])

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

  return { projectiles, setProjectiles }
}

export default useProjectileManagement
