// ./store.ts

import create from "zustand"
import { moveTowardsTarget } from "./utils/movement"

interface Position {
  x: number
  y: number
}

interface StoreState {
  playerPosition: Position
  setPlayerPosition: (position: Position) => void
  playerHP: number
  setPlayerHP: (hp: number) => void
  enemies: { [id: string]: Position }
  setEnemyPosition: (id: string, position: Position) => void
  removeEnemy: (id: string) => void
  initializeEnemy: (id: string, position: Position) => void
  moveEnemies: () => void
  isPaused: boolean
  togglePause: () => void
}

const useStore = create<StoreState>((set, get) => ({
  playerPosition: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  setPlayerPosition: (position) => set({ playerPosition: position }),
  playerHP: 10,
  setPlayerHP: (hp) => set({ playerHP: hp }),
  enemies: {},
  setEnemyPosition: (id, position) =>
    set((state) => ({
      enemies: { ...state.enemies, [id]: position },
    })),
  removeEnemy: (id) =>
    set((state) => {
      const newEnemies = { ...state.enemies }
      delete newEnemies[id]
      return { enemies: newEnemies }
    }),
  initializeEnemy: (id, position) =>
    set((state) => ({
      enemies: { ...state.enemies, [id]: { x: position.x, y: position.y } },
    })),

  moveEnemies: () => {
    set((state) => {
      if (state.isPaused) return
      const { playerPosition, enemies } = state
      const newEnemies = { ...enemies }
      Object.keys(newEnemies).forEach((id) => {
        const enemy = newEnemies[id]
        const newPos = moveTowardsTarget(
          enemy.x,
          enemy.y,
          playerPosition.x,
          playerPosition.y,
          1 // Adjust speed to make it slower and smoother
        )
        newEnemies[id] = newPos
      })
      return { enemies: newEnemies }
    })
  },
  isPaused: false,
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
}))

export default useStore
