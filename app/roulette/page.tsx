"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import caLogo from "../../public/images/caLogoBgBranco.png";
import bgCaBranco from "../../public/images/bgCaBranco.png";
import rirLogo from "../../public/images/rirLogo.png";
import { fetchPrizes, drawPrize } from "../services/prizesService";
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
    if (prize) {
      try {
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
        setCurrentImage((prevImage) => {
          const filteredPrizes = prizes.filter(
            (prize) => !prize.is_consolation
          );
          return prevImage === caLogo
            ? filteredPrizes[count % filteredPrizes.length]?.image_url || caLogo
            : caLogo;
        });
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

  const handleScreenClick = () => {
    if (!isSpinning && hasSpun) {
      router.push("/genius");
    }
  };

  if (prizes.length === 0) {
    return <p>Carregando...</p>;
  }

  return (
    <div
      className="flex relative flex-col w-full bg-azul bg-cover bg-center items-center justify-center h-screen bg-gray-100"
      onClick={handleScreenClick}
    >
      {!isSpinning && !hasSpun && (
        <p className="text-center text-white font-thin text-6xl -translate-y-36">
          arraste o logo para <br /> descobrir seu possível <br />
          prêmio
        </p>
      )}
      {!isSpinning && hasSpun && drawnPrize && (
        <p className="text-center text-6xl text-white font-thin -translate-y-36">
          Você está concorrendo a
        </p>
      )}
      <div
        onClick={spinRoulette}
        className={`mt-4 flex flex-col items-center justify-center p-2 ${
          isSpinning ? "flip-animation" : ""
        }`}
      >
        <div className="logo-container">
          <Image src={bgCaBranco} alt="C&A Logo" className="logo-image" />
          <Image
            src={currentImage}
            alt="Prize Image"
            className={`prize-image ${
              currentImage === caLogo ? "large-logo" : ""
            }`}
            width={240}
            height={240}
          />
        </div>
      </div>
      {isSpinning && (
        <p className="text-white text-4xl translate-y-20 font-thin">
          Toque para parar
        </p>
      )}
      {!isSpinning && hasSpun && (
        <p className="translate-y-20 text-center text-white text-5xl font-thin">
          dê um toque na tela <br /> para continuar o jogo
        </p>
      )}
      <div className="flex text-white absolute bottom-20 text-3xl items-center">
        <p>o look oficial do</p>
        <Image src={rirLogo} alt="C&A Logo" width={200} />
      </div>
    </div>
  );
};

export default RoulettePage;
