// ./hooks/usePlayerMovement.ts

import { useCallback } from 'react';
import useStore from '../store';

const usePlayerMovement = (isPaused: boolean, playerRef: React.RefObject<HTMLDivElement>) => {
  const { setPlayerPosition, setRotation } = useStore();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isPaused || !playerRef.current) return;

      const target = e.target as HTMLElement;

      if (target.closest(".reset-button") || target.closest(".pause-button")) {
        return; // Do not trigger movement if clicking on pause/play or reset button
      }

      const targetRect = e.currentTarget.getBoundingClientRect();
      const iconRect = playerRef.current.getBoundingClientRect();

      const targetX = e.clientX - targetRect.left;
      const targetY = e.clientY - targetRect.top;

      const iconX = iconRect.left + iconRect.width / 2 - targetRect.left;
      const iconY = iconRect.top + iconRect.height / 2 - targetRect.top;

      const deltaX = targetX - iconX;
      const deltaY = targetY - iconY;

      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

      setRotation(angle + 90); // Adjusting the angle to align with the top of the icon

      // Use requestAnimationFrame for smooth animation
      const movePlayer = () => {
        setPlayerPosition({
          x: targetX - iconRect.width / 2,
          y: targetY - iconRect.height / 2,
        });
      };

      requestAnimationFrame(movePlayer);
    },
    [setPlayerPosition, setRotation, isPaused, playerRef]
  );

  return handleClick;
};

export default usePlayerMovement;
