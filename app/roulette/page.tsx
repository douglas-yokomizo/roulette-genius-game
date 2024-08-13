"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client";
import Image from "next/image";
import caLogo from "../../public/ca-logo.png";

export default function Home() {
  const [prizes, setPrizes] = useState<any[]>([]);
  const [result, setResult] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentImage, setCurrentImage] = useState(caLogo);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchPrizes = async () => {
      const { data, error } = await supabase.from("prizes").select("*");
      if (error) console.error(error);
      else setPrizes(data);
    };
    fetchPrizes();
  }, []);

  const drawPrize = async () => {
    const activePrizes = prizes.filter((prize) => prize.active);
    const totalQuantity = activePrizes.reduce(
      (acc, prize) => acc + prize.quantity,
      0
    );
    const noPrizeProbability = totalQuantity > 0 ? 1 / (totalQuantity + 1) : 1;
    console.log("Probability of no prize:", noPrizeProbability);
    const prizeProbabilities = activePrizes.map((prize) => ({
      ...prize,
      probability: prize.quantity / (totalQuantity + 1),
    }));
    console.log("Probabilities of each prize:", prizeProbabilities);
    const random = Math.random();
    let accumulated = noPrizeProbability;
    if (random < accumulated) {
      setResult("No Prize");
      setCurrentImage(caLogo);
    } else {
      for (let i = 0; i < prizeProbabilities.length; i++) {
        accumulated += prizeProbabilities[i].probability;
        if (random < accumulated) {
          const drawnPrize = prizeProbabilities[i];
          if (drawnPrize.quantity > 0) {
            const { data, error } = await supabase
              .from("prizes")
              .update({ quantity: drawnPrize.quantity - 1 })
              .eq("id", drawnPrize.id);
            if (error) {
              console.error(error);
              setResult("Error updating the prize");
              setCurrentImage(caLogo);
            } else {
              setResult(drawnPrize.prize);
              setCurrentImage(drawnPrize.image_url);
              setPrizes((prevPrizes) =>
                prevPrizes.map((p) =>
                  p.id === drawnPrize.id
                    ? { ...p, quantity: p.quantity - 1 }
                    : p
                )
              );
            }
          } else {
            setResult("No Prize");
            setCurrentImage(caLogo);
          }
          break;
        }
      }
    }
  };

  const spinRoulette = () => {
    if (isSpinning) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setIsSpinning(false);
      drawPrize();
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
          // Adjust the count as needed
          clearInterval(newIntervalId);
          setIsSpinning(false);
          drawPrize();
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
