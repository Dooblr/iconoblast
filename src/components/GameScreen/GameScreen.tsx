// GameScreen.tsx
import React, { useEffect, useRef, useState } from "react"
import { HiArrowCircleUp, HiChevronUp, HiOutlineUser } from "react-icons/hi"
import "../../App.scss"
import playerHitSound from "../../assets/audio/player_impact.mp3"
import shootSound from "../../assets/audio/shoot.mp3"
import AudioEngine from "../../audio/AudioEngine"
import useCollisionDetection from "../../hooks/useCollisionDetection"
import usePlayerMovement from "../../hooks/usePlayerMovement"
import useProjectileManagement from "../../hooks/useProjectileManagement"
import useWebAudioBackgroundMusic from "../../hooks/useWebAudioBackgroundMusic"
import useStore from "../../store"
import { EnemyData } from "../../types"
import Enemy from "../Enemy/Enemy"
import Explosion from "../Explosion/Explosion"
import GameOver from "../GameOver/GameOver" // Import GameOver component
import HUD from "../HUD/HUD"
import Projectile from "../Projectile/Projectile"
import "./GameScreen.scss"

const GameScreen: React.FC = () => {
  const playerRef = useRef<HTMLDivElement>(null)
  const firePointRef = useRef<HTMLDivElement>(null)
  const {
    playerPosition,
    moveEnemies,
    enemies,
    initializeEnemy,
    points,
    setPoints,
    rotation,
    playerHP,
    resetGame,
    wave,
    setWave,
  } = useStore()
  const [isPaused, setIsPaused] = useState<boolean>(false) // Pause state

  const previousEnemies = useRef(enemies)

  const handleClick = usePlayerMovement(isPaused, playerRef)

  const fireRate = 521.74 // Calculated fire rate for 115 BPM

  const { projectiles, setProjectiles } = useProjectileManagement(
    rotation,
    playerRef,
    isPaused,
    fireRate
  )

  useCollisionDetection(projectiles, setProjectiles, isPaused, playerRef)
  useWebAudioBackgroundMusic(isPaused)

  const [playerHit, setPlayerHit] = useState(false)
  useEffect(() => {
    if (playerHP !== 10) {
      setPlayerHit(true)
      AudioEngine.playSound(playerHitSound)
    }
    setTimeout(() => {
      setPlayerHit(false)
    }, 100)
  }, [playerHP])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        moveEnemies()
      }
    }, 10)

    return () => clearInterval(interval)
  }, [moveEnemies, isPaused])

  const generateRandomPosition = () => {
    const x = Math.random() < 0.5 ? -50 : window.innerWidth + 50
    const y = Math.random() * window.innerHeight
    if (Math.random() < 0.5) {
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() < 0.5 ? -50 : window.innerHeight + 50,
      }
    }
    return { x, y }
  }

  const spawnWave = (count: number) => {
    const newEnemies: EnemyData[] = Array.from({ length: count }, (_, i) => ({
      id: `enemy${Date.now()}${i}`,
      position: generateRandomPosition(),
      health: 10,
      icon: HiOutlineUser,
    }))
    newEnemies.forEach(initializeEnemy)
  }

  useEffect(() => {
    // Initialize the first enemy
    spawnWave(1)
  }, [])

  const resetGameHandler = () => {
    setProjectiles([])
    resetGame()
    spawnWave(1) // Reset to the first wave
  }

  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  // State for explosion coordinates and key
  const [explosions, setExplosions] = useState<
    { key: number; x: number; y: number }[]
  >([])
  const explosionKey = useRef<number>(0)

  const handleExplosion = (x: number, y: number) => {
    explosionKey.current += 1
    setExplosions((prevExplosions) => [
      ...prevExplosions,
      { key: explosionKey.current, x, y },
    ])
  }

  const handleEnemyDeath = (coords: { x: number; y: number }) => {
    setPoints(points + 1)
    handleExplosion(coords.x - 20, coords.y - 10)

    if (enemies.length === 1) {
      setWave(wave + 1)
      spawnWave(wave + 1)
    }
  }

  useEffect(() => {
    if (previousEnemies.current.length !== enemies.length) {
      console.log("Enemies count changed:", enemies)
      const removedEnemy = previousEnemies.current.find(
        (enemy) => !enemies.some((e) => e.id === enemy.id)
      )
      if (removedEnemy) {
        // console.log("Enemy removed:", removedEnemy);
      }
      previousEnemies.current = enemies
    }
  }, [enemies])

  return (
    <>
      {playerHP <= 0 ? (
        <GameOver />
      ) : (
        <>
          {explosions.map((explosion) => (
            <Explosion
              x={explosion.x}
              y={explosion.y}
              size={"50px"}
              key={explosion.key}
            />
          ))}
          <div className="container" onClick={handleClick}>
            {enemies.map((enemy) => (
              <Enemy
                key={enemy.id}
                id={enemy.id}
                maxHealth={enemy.health}
                size={enemy.size || "5rem"}
                Icon={enemy.icon} // Assuming the enemy object now has an 'icon' property
                onDeath={handleEnemyDeath}
                wobble={enemy.wobble || false} // Pass the wobble prop
              />
            ))}
            <div
              className={`player-wrapper`}
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
                <HiArrowCircleUp
                  className={
                    playerHit ? `player-icon player-hit` : "player-icon"
                  }
                />
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
                audioSrc={shootSound}
              />
            ))}
          </div>
          <HUD
            resetGame={resetGameHandler}
            togglePause={togglePause}
            isPaused={isPaused}
          />
        </>
      )}
    </>
  )
}

export default GameScreen
