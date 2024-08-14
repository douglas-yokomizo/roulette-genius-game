"use client";
import React, { createContext, useContext, useState } from "react";

interface GameContextValue {
  drawnPrize: any;
  setDrawnPrize: React.Dispatch<React.SetStateAction<any>>;
  geniusResult: string;
  setGeniusResult: React.Dispatch<React.SetStateAction<string>>;
  consolationPrize: any;
  setConsolationPrize: React.Dispatch<React.SetStateAction<any>>;
}

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [drawnPrize, setDrawnPrize] = useState<any>(null);
  const [geniusResult, setGeniusResult] = useState<string>("");
  const [consolationPrize, setConsolationPrize] = useState(null);

  return (
    <GameContext.Provider
      value={{
        drawnPrize,
        setDrawnPrize,
        geniusResult,
        setGeniusResult,
        consolationPrize,
        setConsolationPrize,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
