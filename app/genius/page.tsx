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
    <div style={{ textAlign: "center" }}>
      <h1>
        Mostre que você é craque nos looks C&A Faça a mesma sequência de peças e
        cores para acumular pontos!
      </h1>
      <p>{message}</p>
      <div className="my-10">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateRows: "1fr 1fr 1fr",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
            }}
          >
            <div style={{ gridRow: "1 / 2", gridColumn: "2 / 3" }}>
              <button
                onClick={() => handleUserClick("vermelho")}
                style={{
                  backgroundColor:
                    activeColor === "vermelho" ? "lightcoral" : "red",
                  width: 100,
                  height: 100,
                }}
              >
                Vermelho
              </button>
            </div>
            <div style={{ gridRow: "2 / 3", gridColumn: "1 / 2" }}>
              <button
                onClick={() => handleUserClick("azul")}
                style={{
                  backgroundColor:
                    activeColor === "azul" ? "lightblue" : "blue",
                  width: 100,
                  height: 100,
                }}
              >
                Azul
              </button>
            </div>
            <div style={{ gridRow: "2 / 3", gridColumn: "3 / 4" }}>
              <button
                onClick={() => handleUserClick("amarelo")}
                style={{
                  backgroundColor:
                    activeColor === "amarelo" ? "lightyellow" : "yellow",
                  width: 100,
                  height: 100,
                }}
              >
                Amarelo
              </button>
            </div>
            <div style={{ gridRow: "3 / 4", gridColumn: "2 / 3" }}>
              <button
                onClick={() => handleUserClick("verde")}
                style={{
                  backgroundColor:
                    activeColor === "verde" ? "lightgreen" : "green",
                  width: 100,
                  height: 100,
                }}
              >
                Verde
              </button>
            </div>
          </div>
        </div>
      </div>
      <button onClick={startGame}>Começar</button>
      <div style={{ marginTop: 20, width: "100%", backgroundColor: "#e0e0e0" }}>
        <div
          style={{
            width: `${progressPercentage}%`,
            height: 20,
            backgroundColor: "green",
          }}
        ></div>
      </div>
    </div>
  );
};

export default GeniusGame;
