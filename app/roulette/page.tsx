"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import caLogo from "../../public/ca-logo.png";
import {
  fetchPrizes,
  updatePrizeQuantity,
  updateDistributedToday,
  drawPrize,
} from "../services/prizesService";
import { useGameContext } from "../context/GameContext";

const RoulettePage = () => {
  const [prizes, setPrizes] = useState<any[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentImage, setCurrentImage] = useState(caLogo);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const router = useRouter();
  const { drawnPrize, setDrawnPrize } = useGameContext();

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
    const distributedToday = prizes.reduce(
      (acc, prize) => acc + prize.distributed_today,
      0
    );
    const prize = drawPrize(prizes, distributedToday);
    if (
      prize &&
      prize.quantity > 0 &&
      prize.daily_limit > prize.distributed_today
    ) {
      try {
        await updatePrizeQuantity(prize.id, prize.quantity - 1);
        await updateDistributedToday(prize.id, prize.distributed_today + 1);
        setPrizes((prevPrizes) =>
          prevPrizes.map((p) =>
            p.id === prize.id
              ? {
                  ...p,
                  quantity: p.quantity - 1,
                  distributed_today: p.distributed_today + 1,
                }
              : p
          )
        );
        setDrawnPrize(prize);
        setCurrentImage(prize.image_url);
      } catch (error) {
        console.log(error);
        setDrawnPrize(null);
        setCurrentImage(caLogo);
      }
    } else {
      setDrawnPrize(null);
      setCurrentImage(caLogo);
    }
  };

  const spinRoulette = () => {
    if (hasSpun) return;
    if (isSpinning) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setIsSpinning(false);
      handleDrawPrize();
      setHasSpun(true);
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
          setHasSpun(true);
        }
      }, 500);
      setIntervalId(newIntervalId);
    }
  };

  if (prizes.length === 0) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="flex flex-col w-full items-center justify-center h-screen bg-gray-100">
      {drawnPrize && <p>Você está concorrendo a</p>}
      <div
        onClick={spinRoulette}
        className={`mt-4 border-4 flex flex-col items-center justify-center border-blue-500 p-2 ${
          isSpinning ? "spinX" : ""
        }`}
      >
        <Image src={currentImage} alt="Prize Image" width={40} height={40} />
        {drawnPrize && <p>{drawnPrize?.prize}</p>}
      </div>
      {!isSpinning ? (
        <>
          {!hasSpun && (
            <p>Gire o logo da C&A para descobrir seu possível prêmio</p>
          )}
          {drawnPrize && (
            <button
              onClick={() => router.push("/genius")}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              Continuar
            </button>
          )}
        </>
      ) : (
        <p>Toque para parar</p>
      )}
      <button onClick={() => router.push("/genius/winner")}>TESTE</button>
      <button onClick={() => router.push("/genius/consolation")}>
        TESTE 2
      </button>
    </div>
  );
};

export default RoulettePage;
