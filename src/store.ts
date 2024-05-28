// store.ts
import create from "zustand"
import { moveTowardsTarget } from "./utils/movement"
import { EnemyData, Position } from "./types"

interface ExplosionData {
  id: string
  x: number
  y: number
}

interface StoreState {
  enemyExplosion: ExplosionData | null
  setEnemyExplosion: (explosion: ExplosionData | null) => void
  points: number
  setPoints: (newPoints: number) => void
  playerPosition: Position
  setPlayerPosition: (position: Position) => void
  playerHP: number
  setPlayerHP: (hp: number) => void
  rotation: number
  setRotation: (rotation: number) => void
  enemies: EnemyData[]
  setEnemyPosition: (id: string, position: Position) => void
  removeEnemy: (id: string) => void
  initializeEnemy: (enemy: EnemyData) => void
  moveEnemies: () => void
  isPaused: boolean
  togglePause: () => void
  currentPage: string
  setCurrentPage: (page: string) => void
  resetGame: () => void
  wave: number
  setWave: (wave: number) => void
}

const useStore = create<StoreState>((set, get) => ({
  enemyExplosion: null,
  setEnemyExplosion: (explosion) => set({ enemyExplosion: explosion }),
  points: 0,
  setPoints: (newPoints: number) => set({ points: newPoints }),
  playerPosition: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  setPlayerPosition: (position) => set({ playerPosition: position }),
  playerHP: 10,
  setPlayerHP: (hp) => set({ playerHP: hp }),
  rotation: 0,
  setRotation: (rotation) => set({ rotation }),
  enemies: [],
  setEnemyPosition: (id, position) =>
    set((state) => ({
      enemies: state.enemies.map((enemy) =>
        enemy.id === id ? { ...enemy, position } : enemy
      ),
    })),
  removeEnemy: (id) =>
    set((state) => ({
      enemies: state.enemies.filter((enemy) => enemy.id !== id),
    })),
  initializeEnemy: (enemy: EnemyData) =>
    set((state: any) => ({
      enemies: [...state.enemies, enemy],
    })),
  moveEnemies: () => {
    set((state) => {
      if (state.isPaused) return state // Return the current state if paused
      const { playerPosition, enemies } = state
      const newEnemies = enemies.map((enemy) => {
        if (enemy.wobble) {
          const newPos = {
            ...enemy.position,
            x: enemy.position.x + Math.sin(Date.now() / 100) * 5, // Wobble effect
          }
          return { ...enemy, position: newPos }
        }
        const newPos = moveTowardsTarget(
          enemy.position.x,
          enemy.position.y,
          playerPosition.x,
          playerPosition.y,
          0.5 // Adjust speed to make it slower and smoother
        )
        return { ...enemy, position: newPos }
      })
      return { enemies: newEnemies }
    })
  },
  isPaused: false,
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  currentPage: "landing",
  setCurrentPage: (page: string) => set({ currentPage: page }),
  resetGame: () => {
    set({
      playerHP: 10,
      points: 0,
      enemies: [],
      playerPosition: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      wave: 1,
    })
  },
  wave: 1,
  setWave: (wave) => set({ wave }),
}))

export default useStore
