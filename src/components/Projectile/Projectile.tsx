// ./components/Projectile/Projectile.tsx

import { IconType } from 'react-icons'
import { motion } from 'framer-motion'
import './Projectile.scss'

interface ProjectileProps {
  id: number
  x: number
  y: number
  rotation: number
  vx: number
  vy: number
  icon: IconType
  size: string
}

const Projectile: React.FC<ProjectileProps> = ({ id, x, y, rotation, icon: Icon, size }) => {
  return (
    <motion.div
      className='projectile'
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `rotate(${rotation}deg)`,
        width: size,
        height: size,
      }}
    >
      <Icon />
    </motion.div>
  )
}

export default Projectile
