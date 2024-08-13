"use client";
import React, { useState, useEffect } from "react";

const colors = ["vermelho", "verde", "azul", "amarelo"];

const GeniusGame = () => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [message, setMessage] = useState("Presione botão para começar");
  const [phase, setPhase] = useState(1);
  const [sequenceCount, setSequenceCount] = useState(0);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [clickedColor, setClickedColor] = useState<string | null>(null);

  useEffect(() => {
    if (userSequence.length === sequence.length && isUserTurn) {
      if (userSequence.join("") === sequence.join("")) {
        setMessage("Acertou! Começando próximo round...");
        setUserSequence([]);
        setIsUserTurn(false);
        setSequenceCount(sequenceCount + 1);

        if (sequenceCount + 1 === 10) {
          setMessage("Parabéns! Você completou o jogo.");
          return;
        }

        if ((sequenceCount + 1) % 3 === 0) {
          setPhase(phase + 1);
          setMessage(`Parabéns! Você avançou para a fase ${phase + 1}`);
        }

        setTimeout(() => {
          addColorToSequence();
        }, 1000);
      } else {
        setMessage("Não foi dessa vez!");
        setIsUserTurn(false);
      }
    }
  }, [userSequence]);

  const addColorToSequence = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence([...sequence, randomColor]);
    setIsUserTurn(false);
    setTimeout(() => {
      playSequence([...sequence, randomColor]);
    }, 500);
  };

  const playSequence = (seq: string[]) => {
    seq.forEach((color, index) => {
      setTimeout(() => {
        setActiveColor(color);
      }, index * 1000);
      setTimeout(() => {
        setActiveColor(null);
      }, index * 1000 + 500);
    });
    setTimeout(() => {
      setMessage("Sua vez");
      setIsUserTurn(true);
    }, seq.length * 1000 + 500);
  };

  const handleUserClick = (color: string) => {
    if (isUserTurn) {
      setUserSequence([...userSequence, color]);
      setClickedColor(color);
      setTimeout(() => {
        setClickedColor(null);
      }, 300); // Reset clicked color after 300ms
    }
  };

  const startGame = () => {
    setSequence([]);
    setUserSequence([]);
    setMessage("Prepare-se...");
    setPhase(1);
    setSequenceCount(0);
    setTimeout(() => {
      addColorToSequence();
    }, 1000);
  };

  const progressPercentage = (sequenceCount / 10) * 100;

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">
        Mostre que você é craque nos looks C&A Faça a mesma sequência de peças e
        cores para acumular pontos!
      </h1>
      <p>{message}</p>
      <div className="my-10">
        <div className="flex justify-center items-center h-72">
          <div className="grid grid-rows-3 grid-cols-3 gap-2">
            <div className="row-start-1 col-start-2">
              <button
                onClick={() => handleUserClick("vermelho")}
                className={`w-24 h-24 ${
                  activeColor === "vermelho" || clickedColor === "vermelho"
                    ? "bg-red-300"
                    : "bg-red-600"
                }`}
              >
                Vermelho
              </button>
            </div>
            <div className="row-start-2 col-start-1">
              <button
                onClick={() => handleUserClick("azul")}
                className={`w-24 h-24 ${
                  activeColor === "azul" || clickedColor === "azul"
                    ? "bg-blue-300"
                    : "bg-blue-600"
                }`}
              >
                Azul
              </button>
            </div>
            <div className="row-start-2 col-start-3">
              <button
                onClick={() => handleUserClick("amarelo")}
                className={`w-24 h-24 ${
                  activeColor === "amarelo" || clickedColor === "amarelo"
                    ? "bg-yellow-300"
                    : "bg-yellow-600"
                }`}
              >
                Amarelo
              </button>
            </div>
            <div className="row-start-3 col-start-2">
              <button
                onClick={() => handleUserClick("verde")}
                className={`w-24 h-24 ${
                  activeColor === "verde" || clickedColor === "verde"
                    ? "bg-green-300"
                    : "bg-green-600"
                }`}
              >
                Verde
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        className="bg-blue-800 p-4 rounded-xl text-white"
        onClick={startGame}
      >
        Começar
      </button>
      <p className="my-5">Sua pontuação</p>
      <div className="flex items-center justify-center">
        <div className="w-2/3 bg-gray-200 rounded-full">
          <div
            className="bg-green-800 h-4 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default GeniusGame;
