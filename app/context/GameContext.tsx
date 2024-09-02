"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";

interface GameContextValue {
  drawnPrize: any;
  setDrawnPrize: React.Dispatch<React.SetStateAction<any>>;
  geniusResult: string;
  setGeniusResult: React.Dispatch<React.SetStateAction<string>>;
  consolationPrize: any;
  setConsolationPrize: React.Dispatch<React.SetStateAction<any>>;
  difficulty: string;
  setDifficulty: (newDifficulty: string) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [drawnPrize, setDrawnPrize] = useState<any>(null);
  const [geniusResult, setGeniusResult] = useState<string>("");
  const [consolationPrize, setConsolationPrize] = useState(null);
  const [difficulty, setDifficultyState] = useState<string>("hard"); // Alterado para "hard"

  useEffect(() => {
    const fetchDifficulty = async () => {
      const { data, error } = await supabase
        .from("game_settings")
        .select("difficulty")
        .single();
      if (error) {
        console.error("Error fetching difficulty:", error);
      } else if (data) {
        setDifficultyState(data.difficulty);
      }
    };

    fetchDifficulty();
  }, []);

  const setDifficulty = async (newDifficulty: string) => {
    setDifficultyState(newDifficulty);
    const { error } = await supabase
      .from("game_settings")
      .update({ difficulty: newDifficulty })
      .eq("id", 1);
    if (error) {
      console.error("Error updating difficulty:", error);
    }
  };

  return (
    <GameContext.Provider
      value={{
        drawnPrize,
        setDrawnPrize,
        geniusResult,
        setGeniusResult,
        consolationPrize,
        setConsolationPrize,
        difficulty,
        setDifficulty,
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
