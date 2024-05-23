import React from "react";
import useStore from "../../store";
import "./GameOver.scss";

const GameOver: React.FC = () => {
  const resetGame = useStore((state) => state.resetGame);

  return (
    <div className="game-over">
      <h1>Game Over</h1>
      <button onClick={resetGame}>Restart Game</button>
    </div>
  );
};

export default GameOver;
