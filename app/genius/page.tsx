"use client";
import React, { useEffect, useState } from "react";
import { useGeniusGame } from "../hooks/useGeniusGame";
import { images } from "@/public/images";
import Image from "next/image";

const GeniusGame = () => {
  const {
    message,
    activeColor,
    clickedColor,
    handleUserClick,
    startGame,
    progressPercentage,
    sequence,
    isUserTurn,
  } = useGeniusGame();

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const getColorClass = (color: string) => {
    if (activeColor === color || clickedColor === color) {
      return `active-stroke ${color}-blink`;
    }
    return "";
  };

  useEffect(() => {
    if (!isUserTurn) {
      sequence.forEach((color, index) => {
        setTimeout(() => {
          handleUserClick(color);
        }, index * 500);
      });
    }
  }, [sequence, isUserTurn, handleUserClick]);

  const handleStartGame = () => {
    setIsGameStarted(true);
    let timer = countdown;

    const countdownInterval = setInterval(() => {
      if (timer > 1) {
        timer--;
        setCountdown(timer);
      } else {
        clearInterval(countdownInterval);
        setCountdown(0);
        startGame(); // Inicia o jogo após a contagem regressiva
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center text-center">
      <div className="mb-4 mx-28 -translate-y-72">
        <h1 className="text-7xl font-sharpBold font-bold text-indigo-600 mb-8">
          mostre que você é <br /> do fandom da C&A
        </h1>
        <h3 className="text-5xl font-sharp font-bold">
          faça a mesma sequência <br /> de peças e cores <br /> para acumular
          pontos
        </h3>
      </div>
      {!isGameStarted ? (
        <div
          className="flex justify-center items-center h-72"
          onClick={handleStartGame}
        >
          <p className="text-5xl font-bold animate-pulse">
            Toque na tela para começar o jogo
          </p>
        </div>
      ) : (
        countdown > 0 && <p className="text-3xl font-bold">{countdown}</p>
      )}
      {isGameStarted && countdown === 0 && (
        <div className="my-10">
          <div className="flex justify-center items-center h-72">
            <div className="grid grid-rows-2 grid-cols-2 gap-10 gap-y-20">
              <div
                className="row-start-1 col-start-1 relative"
                onClick={() => handleUserClick("roxo")}
              >
                <Image
                  src={images.rocamboleRoxo}
                  alt="Rocambole Roxo C&A"
                  className={getColorClass("roxo")}
                />
                <Image
                  src={images.colete}
                  alt="colete"
                  className="absolute inset-0 m-auto w-3/5 object-contain"
                />
              </div>
              <div
                className="row-start-1 col-start-2 relative"
                onClick={() => handleUserClick("vermelho")}
              >
                <Image
                  src={images.rocamboleVermelho}
                  alt="Rocambole Vermelho C&A"
                  className={getColorClass("vermelho")}
                />
                <Image
                  src={images.camiseta}
                  alt="camiseta"
                  className="absolute inset-0 m-auto w-5/6 object-contain"
                />
              </div>
              <div
                className="row-start-2 col-start-1 relative"
                onClick={() => handleUserClick("rosa")}
              >
                <Image
                  src={images.rocamboleRosa}
                  alt="Rocambole Rosa C&A"
                  className={getColorClass("rosa")}
                />
                <Image
                  src={images.shorts}
                  alt="shorts"
                  className="absolute inset-0 m-auto w-[90%] object-contain"
                />
              </div>
              <div
                className="row-start-2 col-start-2 relative"
                onClick={() => handleUserClick("amarelo")}
              >
                <Image
                  src={images.rocamboleAmarelo}
                  alt="Rocambole Amarelo C&A"
                  className={getColorClass("amarelo")}
                />
                <Image
                  src={images.bermuda}
                  alt="bermuda"
                  className="absolute inset-0 m-auto w-[90%] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <p className="my-5">Sua pontuação</p>
      <div className="flex items-center justify-center">
        <div className="w-2/3 bg-gray-200 rounded-full">
          <div
            className="bg-green-800 h-4 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      {message && <p className="my-5">{message}</p>}
    </div>
  );
};

export default GeniusGame;
