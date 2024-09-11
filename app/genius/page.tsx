"use client";
import React, { useEffect, useState } from "react";
import { useGeniusGame } from "../hooks/useGeniusGame";
import { images } from "@/public/images";
import Image from "next/image";
import { motion } from "framer-motion";

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
  const [countdown, setCountdown] = useState(3);
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);

  const getColorClass = (color: string) => {
    if (activeColor === color || clickedColor === color) {
      return `active-stroke blink-jump`;
    }
    return "";
  };

  const getJumpClass = (color: string) => {
    if (activeColor === color || clickedColor === color) {
      return `jump`;
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
        startGame();
      }
    }, 1000);
  };

  const toggleAccessibilityMode = () => {
    setIsAccessibilityMode(!isAccessibilityMode);
  };

  return (
    <motion.div
      className="flex flex-col h-screen justify-center items-center text-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      onClick={!isGameStarted ? handleStartGame : undefined}
    >
      <motion.div
        className="mb-72 mx-28"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-7xl font-sharpBold font-bold text-azul mb-8">
          mostre que você é <br /> do fandom da C&A
        </h1>
        <h3 className="text-5xl font-sharp font-bold">
          faça a mesma sequência <br /> de peças e cores <br /> para acumular
          pontos
        </h3>
      </motion.div>
      {!isGameStarted ? (
        <motion.div
          className="flex justify-center items-center h-72"
          initial={{ scale: 1 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <p className="text-4xl font-bold">
            Toque na tela para começar o jogo
          </p>
        </motion.div>
      ) : (
        countdown > 0 && (
          <motion.p
            className="text-6xl font-bold"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {countdown}
          </motion.p>
        )
      )}
      {isGameStarted && countdown === 0 && (
        <>
          <button
            onClick={toggleAccessibilityMode}
            className="absolute bottom-5 right-5 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Acessibilidade
          </button>
          {isAccessibilityMode ? (
            <>
              <div className="flex flex-col items-center transform -translate-y-44 justify-center gap-6">
                <p className="text-5xl font-bold w-11/12">
                  acompanhe sua pontuação
                </p>
                <div className="w-full bg-transparent border-[6px] border-azul rounded-full mt-4">
                  <div
                    className="bg-azul h-20 w-4/5 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              <motion.div className="mt-8 mb-2">
                <div className="flex justify-center items-center">
                  <div className="grid grid-rows-2 grid-cols-2 gap-10 gap-y-20">
                    <div
                      className="row-start-1 col-start-1 relative"
                      onClick={() => handleUserClick("roxo")}
                    >
                      <Image
                        src={images.rocamboleRoxo}
                        alt="Rocambole Roxo C&A"
                        className={`active-stroke ${getColorClass("roxo")}`}
                      />
                      <Image
                        src={images.colete}
                        alt="colete"
                        className={`absolute inset-0 m-auto w-3/5 object-contain ${getJumpClass(
                          "roxo"
                        )}`}
                      />
                    </div>
                    <div
                      className="row-start-1 col-start-2 relative"
                      onClick={() => handleUserClick("vermelho")}
                    >
                      <Image
                        src={images.rocamboleVermelho}
                        alt="Rocambole Vermelho C&A"
                        className={`active-stroke ${getColorClass("vermelho")}`}
                      />
                      <Image
                        src={images.camiseta}
                        alt="camiseta"
                        className={`absolute inset-0 m-auto w-5/6 object-contain ${getJumpClass(
                          "vermelho"
                        )}`}
                      />
                    </div>
                    <div
                      className="row-start-2 col-start-1 relative"
                      onClick={() => handleUserClick("rosa")}
                    >
                      <Image
                        src={images.rocamboleRosa}
                        alt="Rocambole Rosa C&A"
                        className={`active-stroke ${getColorClass("rosa")}`}
                      />
                      <Image
                        src={images.shorts}
                        alt="shorts"
                        className={`absolute inset-0 m-auto w-[90%] object-contain ${getJumpClass(
                          "rosa"
                        )}`}
                      />
                    </div>
                    <div
                      className="row-start-2 col-start-2 relative"
                      onClick={() => handleUserClick("amarelo")}
                    >
                      <Image
                        src={images.rocamboleAmarelo}
                        alt="Rocambole Amarelo C&A"
                        className={`active-stroke ${getColorClass("amarelo")}`}
                      />
                      <Image
                        src={images.bermuda}
                        alt="bermuda"
                        className={`absolute inset-0 m-auto w-[90%] object-contain ${getJumpClass(
                          "amarelo"
                        )}`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div className="my-10">
                <div className="flex justify-center items-center h-72">
                  <div className="grid grid-rows-2 grid-cols-2 gap-10 gap-y-20">
                    <div
                      className="row-start-1 col-start-1 relative"
                      onClick={() => handleUserClick("roxo")}
                    >
                      <Image
                        src={images.rocamboleRoxo}
                        alt="Rocambole Roxo C&A"
                        className={`active-stroke ${getColorClass("roxo")}`}
                      />
                      <Image
                        src={images.colete}
                        alt="colete"
                        className={`absolute inset-0 m-auto w-3/5 object-contain ${getJumpClass(
                          "roxo"
                        )}`}
                      />
                    </div>
                    <div
                      className="row-start-1 col-start-2 relative"
                      onClick={() => handleUserClick("vermelho")}
                    >
                      <Image
                        src={images.rocamboleVermelho}
                        alt="Rocambole Vermelho C&A"
                        className={`active-stroke ${getColorClass("vermelho")}`}
                      />
                      <Image
                        src={images.camiseta}
                        alt="camiseta"
                        className={`absolute inset-0 m-auto w-5/6 object-contain ${getJumpClass(
                          "vermelho"
                        )}`}
                      />
                    </div>
                    <div
                      className="row-start-2 col-start-1 relative"
                      onClick={() => handleUserClick("rosa")}
                    >
                      <Image
                        src={images.rocamboleRosa}
                        alt="Rocambole Rosa C&A"
                        className={`active-stroke ${getColorClass("rosa")}`}
                      />
                      <Image
                        src={images.shorts}
                        alt="shorts"
                        className={`absolute inset-0 m-auto w-[90%] object-contain ${getJumpClass(
                          "rosa"
                        )}`}
                      />
                    </div>
                    <div
                      className="row-start-2 col-start-2 relative"
                      onClick={() => handleUserClick("amarelo")}
                    >
                      <Image
                        src={images.rocamboleAmarelo}
                        alt="Rocambole Amarelo C&A"
                        className={`active-stroke ${getColorClass("amarelo")}`}
                      />
                      <Image
                        src={images.bermuda}
                        alt="bermuda"
                        className={`absolute inset-0 m-auto w-[90%] object-contain ${getJumpClass(
                          "amarelo"
                        )}`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
              <div className="flex flex-col items-center justify-center mt-64 gap-6">
                <p className="text-5xl font-bold w-11/12">
                  acompanhe sua pontuação
                </p>
                <div className="w-full bg-transparent border-[6px] border-azul rounded-full mt-4">
                  <div
                    className="bg-azul h-20 w-4/5 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </>
          )}
        </>
      )}
      {message && <p className=" text-4xl my-5">{message}</p>}
      <Image
        src={images.lookOficial}
        alt="Look oficial do RIR"
        width={500}
        className="absolute bottom-20"
      />
    </motion.div>
  );
};

export default GeniusGame;
