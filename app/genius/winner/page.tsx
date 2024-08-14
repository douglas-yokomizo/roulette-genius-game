"use client";
import { useGameContext } from "@/app/context/GameContext";

const WinnerPage = () => {
  const { drawnPrize } = useGameContext();

  return (
    <div>
      <h1>Winner</h1>
      <p>{drawnPrize?.prize}</p>
    </div>
  );
};

export default WinnerPage;
