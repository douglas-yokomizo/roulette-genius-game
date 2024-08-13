"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import caLogo from "../../public/ca-logo.png";
import {
  fetchPrizes,
  updatePrizeQuantity,
  drawPrize,
} from "../services/prizesService";

export default function Home() {
  const [prizes, setPrizes] = useState<any[]>([]);
  const [result, setResult] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentImage, setCurrentImage] = useState(caLogo);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadPrizes = async () => {
      try {
        const data = await fetchPrizes();
        setPrizes(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadPrizes();
  }, []);

  const handleDrawPrize = async () => {
    const drawnPrize = drawPrize(prizes);
    if (drawnPrize.prize !== "No Prize" && drawnPrize.quantity > 0) {
      try {
        await updatePrizeQuantity(drawnPrize.id, drawnPrize.quantity - 1);
        setPrizes((prevPrizes) =>
          prevPrizes.map((p) =>
            p.id === drawnPrize.id ? { ...p, quantity: p.quantity - 1 } : p
          )
        );
        setResult(drawnPrize.prize);
        setCurrentImage(drawnPrize.image_url);
      } catch (error) {
        console.error(error);
        setResult("Error updating the prize");
        setCurrentImage(caLogo);
      }
    } else {
      setResult("No Prize");
      setCurrentImage(caLogo);
    }
  };

  const spinRoulette = () => {
    if (isSpinning) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setIsSpinning(false);
      handleDrawPrize();
    } else {
      setIsSpinning(true);
      let count = 0;
      const newIntervalId = setInterval(() => {
        setCurrentImage((prevImage) =>
          prevImage === caLogo
            ? prizes[count % prizes.length].image_url
            : caLogo
        );
        count++;
        if (count === 20) {
          clearInterval(newIntervalId);
          setIsSpinning(false);
          handleDrawPrize();
        }
      }, 500);
      setIntervalId(newIntervalId);
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center h-screen bg-gray-100">
      <div
        onClick={spinRoulette}
        className={`mt-4 border-4 border-blue-500 p-2 ${
          isSpinning ? "spinX" : ""
        }`}
      >
        <Image src={currentImage} alt="Prize Image" width={40} height={40} />
      </div>
      <p className="mt-4 text-lg">{result}</p>
      {!isSpinning && <p>Clique na imagem para girar a roleta</p>}
    </div>
  );
}
