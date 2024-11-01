"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useGameContext } from "../context/GameContext";
import {
  updatePrizeQuantity,
  updateDistributedToday,
} from "../services/prizesService";

const colors = ["vermelho", "roxo", "rosa", "amarelo"];

export const useGeniusGame = () => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [message, setMessage] = useState("");
  const [phase, setPhase] = useState(1);
  const [sequenceCount, setSequenceCount] = useState(0);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [clickedColor, setClickedColor] = useState<string | null>(null);
  const [hasWon, setHasWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { drawnPrize, difficulty } = useGameContext();
  const router = useRouter();

  const getWinningSequenceCount = () => {
    switch (difficulty) {
      case "easy":
        return 2;
      case "medium":
        return 8;
      case "hard":
      default:
        return 10;
    }
  };

  useEffect(() => {
    if (userSequence.length === sequence.length && isUserTurn) {
      if (userSequence.join("") === sequence.join("")) {
        setMessage("Acertou! Começando próximo round...");
        setUserSequence([]);
        setIsUserTurn(false);
        setSequenceCount(sequenceCount + 1);

        if (sequenceCount + 1 === getWinningSequenceCount()) {
          setMessage("Parabéns! Você completou o jogo.");
          setHasWon(true);
          deductPrize(drawnPrize);
          return;
        }

        if ((sequenceCount + 1) % 3 === 0 && phase < 3) {
          setPhase(phase + 1);
          setMessage(`Parabéns! Você avançou para a fase ${phase + 1}`);
        }

        setTimeout(() => {
          addColorToSequence();
        }, 1000);
      } else {
        setMessage("Não foi dessa vez!");
        setIsUserTurn(false);
        router.push("/genius/not-this-time");
      }
    }
  }, [userSequence, sequence, isUserTurn, sequenceCount, phase]);

  useEffect(() => {
    if (gameStarted) {
      if (hasWon) {
        router.push("/genius/winner");
      } else if (
        !hasWon &&
        !isUserTurn &&
        userSequence.length === sequence.length &&
        sequence.length > 0
      ) {
        router.push("/genius/not-this-time");
      }
    }
  }, [hasWon, gameStarted, isUserTurn, userSequence, sequence, router]);

  const addColorToSequence = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence([...sequence, randomColor]);
    setIsUserTurn(false);
    setTimeout(() => {
      playSequence([...sequence, randomColor]);
    }, 500);
  };

  const playSequence = (seq: string[]) => {
    const delay = 500;
    seq.forEach((color, index) => {
      setTimeout(() => {
        setActiveColor(color);
      }, index * delay);
      setTimeout(() => {
        setActiveColor(null);
      }, index * delay + delay / 2);
    });
    setTimeout(() => {
      setMessage("Sua vez");
      setIsUserTurn(true);
    }, seq.length * delay + delay / 2);
  };

  const handleUserClick = (color: string) => {
    if (isUserTurn) {
      const newSequence = [...userSequence, color];
      setUserSequence(newSequence);
      setClickedColor(color);

      if (sequence[newSequence.length - 1] !== color) {
        setMessage("Não foi dessa vez!");
        setIsUserTurn(false);
        router.push("/genius/not-this-time");
        return;
      }

      setTimeout(() => {
        setClickedColor(null);
      }, 300);
    }
  };

  const deductPrize = async (prize: any) => {
    try {
      await updatePrizeQuantity(prize.id, prize.quantity - 1);
      await updateDistributedToday(prize.id, prize.distributed_today + 1);
    } catch (error) {
      console.error("Failed to deduct prize:", error);
    }
  };

  const startGame = () => {
    setSequence([]);
    setUserSequence([]);
    setMessage("Prepare-se...");
    setPhase(1);
    setSequenceCount(0);
    setHasWon(false);
    setGameStarted(true);
    setTimeout(() => {
      addColorToSequence();
    }, 1000);
  };

  const progressPercentage = (sequenceCount / getWinningSequenceCount()) * 100;

  return {
    sequence,
    userSequence,
    isUserTurn,
    message,
    phase,
    sequenceCount,
    activeColor,
    clickedColor,
    handleUserClick,
    startGame,
    progressPercentage,
    hasWon,
    gameStarted,
  };
};