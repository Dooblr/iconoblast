import React from 'react';
import { HiCubeTransparent } from 'react-icons/hi';
import './Explosion.scss';

interface ExplosionProps {
  x: number;
  y: number;
  size: string;
}

const Explosion: React.FC<ExplosionProps> = ({ x, y, size }) => {
  return (
    <div
      className="explosion"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: size,
        height: size,
      }}
    >
      <HiCubeTransparent className="explosion-icon" />
    </div>
  );
};

export default Explosion;
