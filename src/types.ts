import { IconType } from "react-icons";

export interface ProjectileProps {
  id: number;
  x: number;
  y: number;
  rotation: number;
  vx: number;
  vy: number;
  icon: IconType;
  size: string;
}