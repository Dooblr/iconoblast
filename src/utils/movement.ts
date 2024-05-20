// utils/movement.ts

export const moveTowardsTarget = (
  currentX: number,
  currentY: number,
  targetX: number,
  targetY: number,
  speed: number
): { x: number; y: number } => {
  const angle = Math.atan2(targetY - currentY, targetX - currentX)
  const vx = Math.cos(angle) * speed
  const vy = Math.sin(angle) * speed
  return {
    x: currentX + vx,
    y: currentY + vy,
  }
}
