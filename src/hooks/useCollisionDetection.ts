import { useEffect } from 'react';

const useCollisionDetection = (
  projectiles: any[],
  setProjectiles: (fn: (prev: any[]) => any[]) => void,
  isPaused: boolean,
  playerRef: React.RefObject<HTMLDivElement>,
  setPlayerHP: React.Dispatch<React.SetStateAction<number>>,
  playerHP: number
) => {
  useEffect(() => {
    const checkCollisions = () => {
      if (isPaused) return;

      const enemyElements = document.querySelectorAll(".enemy");
      if (!enemyElements.length) return; // Check if there are any enemies

      // Detect collisions between projectiles and enemies
      setProjectiles((prev) => {
        return prev.filter((proj) => {
          for (let enemyElement of enemyElements) {
            const isExploding = enemyElement.classList.contains("exploding");
            if (isExploding) continue;

            const targetRect = enemyElement.getBoundingClientRect();
            const projRect = {
              left: proj.x,
              top: proj.y,
              right: proj.x + 20,
              bottom: proj.y + 20,
            };
            const isHit =
              projRect.left < targetRect.right &&
              projRect.right > targetRect.left &&
              projRect.top < targetRect.bottom &&
              projRect.bottom > targetRect.top;
            if (isHit) {
              const event = new CustomEvent("enemyHit", {
                detail: { id: enemyElement.id },
              });
              enemyElement.dispatchEvent(event);
              return false;
            }
          }
          return true;
        });
      });

      // Detect collisions between player and enemies
      if (playerRef.current && playerHP > 0) {
        const playerRect = playerRef.current.getBoundingClientRect();
        enemyElements.forEach((enemyElement) => {
          const enemyRect = enemyElement.getBoundingClientRect();
          const isColliding = !(
            playerRect.right < enemyRect.left ||
            playerRect.left > enemyRect.right ||
            playerRect.bottom < enemyRect.top ||
            playerRect.top > enemyRect.bottom
          );
          if (isColliding) {
            setPlayerHP((hp) => Math.max(hp - 1, 0));
            // Handle player flashing or other effects here if needed
          }
        });
      }
    };

    const interval = setInterval(checkCollisions, 50); // Check for collisions every 50ms

    return () => clearInterval(interval);
  }, [isPaused, setProjectiles, playerRef, setPlayerHP, playerHP]);
};

export default useCollisionDetection;
