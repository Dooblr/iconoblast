import useStore from "../store";

// export const initializeEnemies = () => {
//   const { initializeEnemy } = useStore.getState(); 
//   initializeEnemy("enemy1", { x: 100, y: 200 });
//   initializeEnemy("enemy2", { x: 200, y: 300 });
// };

export const handleEnemyDeath = (id: string) => {
  const { removeEnemy, setPoints, points } = useStore.getState();
  setPoints(points + 1);
  removeEnemy(id);
};
