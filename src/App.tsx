// App.tsx

import { HiArrowCircleUp, HiChevronUp, HiOutlineUser } from "react-icons/hi";
import { HiMiniPause, HiMiniPlay } from "react-icons/hi2";
import { GrPowerReset } from "react-icons/gr";
import "./App.scss";
import { useRef, useState, useEffect } from "react";
import Enemy from "./components/Enemy/Enemy";
import Projectile from "./components/Projectile/Projectile";
import useStore from "./store";
import HUD from "./components/HUD/HUD";
import useCollisionDetection from "./hooks/useCollisionDetection";
import useProjectileManagement from "./hooks/useProjectileManagement";
import usePlayerMovement from "./hooks/usePlayerMovement";
import useWebAudioBackgroundMusic from "./hooks/useWebAudioBackgroundMusic";

const App = () => {
  const playerRef = useRef<HTMLDivElement>(null);
  const firePointRef = useRef<HTMLDivElement>(null);
  const {
    playerPosition,
    moveEnemies,
    enemies,
    initializeEnemy,
    points,
    setPoints,
    rotation,
  } = useStore();
  const [playerHP, setPlayerHP] = useState<number>(10); // Player health state
  const [isPaused, setIsPaused] = useState<boolean>(false); // Pause state

  useEffect(() => {
    initializeEnemy("enemy1", { x: 100, y: 200 }); // Initialize first enemy
    initializeEnemy("enemy2", { x: 200, y: 300 }); // Initialize second enemy
  }, [initializeEnemy]);

  const handleClick = usePlayerMovement(isPaused, playerRef);

  const { projectiles, setProjectiles } = useProjectileManagement(
    rotation,
    playerRef,
    isPaused
  );

  useCollisionDetection(projectiles, setProjectiles, isPaused);
  useWebAudioBackgroundMusic(isPaused);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        moveEnemies();
      }
    }, 100); // Move enemies every 100ms

    return () => clearInterval(interval);
  }, [moveEnemies, isPaused]);

  const resetGame = () => {
    setProjectiles([]);
    setPlayerHP(10);
    setPoints(0);
    initializeEnemy("enemy1", { x: 100, y: 200 }); // Reinitialize first enemy
    initializeEnemy("enemy2", { x: 200, y: 300 }); // Reinitialize second enemy
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

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
              setPoints(points + 1);
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

        <HUD resetGame={resetGame} togglePause={togglePause} isPaused={isPaused} />
      </div>
    </>
  );
};

export default App;
