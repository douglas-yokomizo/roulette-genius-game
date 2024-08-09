"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client";
import Image from "next/image";

export default function Home() {
  const [prizes, setPrizes] = useState<any[]>([]);
  const [result, setResult] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentImage, setCurrentImage] = useState("logo");

  useEffect(() => {
    const fetchPrizes = async () => {
      const { data, error } = await supabase.from("prizes").select("*");
      if (error) console.error(error);
      else setPrizes(data);
    };
    fetchPrizes();
  }, []);

  const drawPrize = async () => {
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    setCurrentImage(prize.image_url);
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
            } else {
              setResult(drawnPrize.prize);
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
          }
          break;
        }
      }
    }
  };

  const spinRoulette = () => {
    setIsSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === "logo" ? "product" : "logo"));
      count++;
      if (count === 10) {
        clearInterval(interval);
        setIsSpinning(false);
        drawPrize();
      }
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={spinRoulette}
        className="mt-8 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={isSpinning}
      >
        Spin Roulette
      </button>
      <div className="mt-4">
        {currentImage === "logo" ? (
          <Image src="../../public/next.svg" alt="Logo" />
        ) : (
          <Image src="../../public/vercel.svg" alt="Product" />
        )}
      </div>
      <p className="mt-4 text-lg">{result}</p>
    </div>
  );
}
