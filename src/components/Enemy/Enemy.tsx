import { useState, useEffect, useRef } from 'react';
import { IconType } from 'react-icons';
import './Enemy.scss';
import useStore from '../../store';
import Explosion from '../Explosion/Explosion';

interface EnemyProps {
  maxHealth: number;
  size: string;
  Icon: IconType;
  onDeath: () => void;
  id: string;
  position: any;
}

const Enemy: React.FC<EnemyProps> = ({ maxHealth, size, Icon, onDeath, id }) => {
  const enemyRef = useRef<HTMLDivElement>(null);
  const [currentHealth, setCurrentHealth] = useState<number>(maxHealth);
  const [isHit, setIsHit] = useState<boolean>(false);
  const [isExploding, setIsExploding] = useState<boolean>(false);
  const [explosionCoords, setExplosionCoords] = useState<{ x: number; y: number } | null>(null);
  const { enemies, removeEnemy } = useStore();

  useEffect(() => {
    if (currentHealth === 0) {
      setIsExploding(true);
      const coords = { x: enemies[id]?.x, y: enemies[id]?.y };
      setExplosionCoords(coords);
      setTimeout(() => {
        setIsExploding(false);
        onDeath();
        removeEnemy(id);
      }, 3000); // Explosion lasts 3 seconds
    }
  }, [currentHealth, onDeath, removeEnemy, id, enemies]);

  const handleHit = () => {
    setIsHit(true);
    setCurrentHealth((health) => Math.max(health - 1, 0));
    setTimeout(() => setIsHit(false), 200); // Flash red for 200ms
  };

  useEffect(() => {
    const enemyElement = enemyRef.current;
    if (enemyElement) {
      const handleEnemyHit = () => handleHit();
      enemyElement.addEventListener('enemyHit', handleEnemyHit);
      return () => {
        enemyElement.removeEventListener('enemyHit', handleEnemyHit);
      };
    }
  }, []);

  return (
    <>
      {!isExploding && (
        <div
          className="enemy"
          ref={enemyRef}
          style={{
            left: `${enemies[id]?.x}px`,
            top: `${enemies[id]?.y}px`,
          }}
        >
          <div className="enemy-health-bar">
            <div
              className="enemy-health-bar-inner"
              style={{ width: `${(currentHealth / maxHealth) * 100}%` }}
            />
          </div>
          <Icon
            className={`enemy-icon ${isHit ? 'hit' : ''}`}
            style={{ width: size, height: size }}
          />
        </div>
      )}
      {isExploding && explosionCoords && (
        <Explosion x={explosionCoords.x} y={explosionCoords.y} size="5rem" />
      )}
    </>
  );
};

export default Enemy;
