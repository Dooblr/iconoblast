// types.ts
import { IconType } from "react-icons"

export interface Position {
  x: number
  y: number
}

export interface EnemyData {
  id: string
  position: Position
  health: number
  icon: IconType
  size?: string
  wobble?: boolean
}

export interface ProjectileProps {
  id: number
  x: number
  y: number
  rotation: number
  vx: number
  vy: number
  icon: IconType
  size: string
}
