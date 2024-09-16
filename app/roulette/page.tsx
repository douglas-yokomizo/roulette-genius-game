"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { images } from "@/public/images";
import { fetchPrizes, drawPrize } from "../services/prizesService";
import { useGameContext } from "../context/GameContext";
import Loading from "../components/Loading";

const RoulettePage = () => {
  const [allPrizes, setAllPrizes] = useState<any[]>([]);
  const [availablePrizes, setAvailablePrizes] = useState<any[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentImage, setCurrentImage] = useState(images.caLogoBgBranco);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const router = useRouter();
  const { drawnPrize, setDrawnPrize } = useGameContext();

  useEffect(() => {
    const loadPrizes = async () => {
      try {
        const data = await fetchPrizes();
        const filteredPrizes = data.filter(
          (prize) =>
            prize.active &&
            prize.daily_limit > prize.distributed_today &&
            prize.quantity > 0
        );
        setAllPrizes(data);
        setAvailablePrizes(filteredPrizes);
      } catch (error) {
        console.error(error);
      }
    };
    loadPrizes();
  }, []);

  const handleDrawPrize = async () => {
    const distributedToday = availablePrizes.reduce(
      (acc, prize) => acc + prize.distributed_today,
      0
    );

    const prize = drawPrize(availablePrizes, distributedToday);
    if (prize) {
      try {
        setDrawnPrize(prize);
        setCurrentImage(prize.image_url);
      } catch (error) {
        console.log(error);
        setDrawnPrize(null);
        setCurrentImage(images.caLogoBgBranco);
      }
    } else {
      setDrawnPrize(null);
      setCurrentImage(images.caLogoBgBranco);
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
        setCurrentImage(() => {
          if (allPrizes.length === 0) {
            return images.caLogoBgBranco;
          }
          return count % 2 === 0
            ? images.caLogoBgBranco
            : allPrizes[Math.floor(count / 2) % allPrizes.length]?.image_url ||
                images.caLogoBgBranco;
        });
        count++;
        if (count === 40) {
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

  if (allPrizes.length === 0) {
    return <Loading />;
  }

  return (
    <div
      className="flex relative flex-col w-full bg-azul items-center justify-center h-screen"
      onClick={handleScreenClick}
    >
      <AnimatePresence>
        {!isSpinning && !hasSpun && (
          <motion.h2
            className="text-center text-white font-thin text-6xl -translate-y-36"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            arraste o logo para <br /> descobrir seu possível <br />
            prêmio
          </motion.h2>
        )}
        {!isSpinning && hasSpun && drawnPrize && (
          <motion.p
            className="text-center text-6xl text-white font-thin -translate-y-36"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 1 }}
          >
            você está <br /> concorrendo a
          </motion.p>
        )}
      </AnimatePresence>
      <motion.div
        onClick={spinRoulette}
        className={`mt-4 flex flex-col items-center justify-center p-2 ${
          isSpinning ? "flip-animation" : ""
        }`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 1 }}
        layout
      >
        <div className="logo-container">
          <Image
            src={images.bgCaBranco}
            alt="C&A Logo"
            className="logo-image"
          />
          <Image
            src={currentImage}
            alt="Prize Image"
            className={`prize-image ${
              currentImage === images.caLogoBgBranco ? "large-logo" : ""
            }`}
            width={240}
            height={240}
          />
        </div>
      </motion.div>
      <AnimatePresence>
        {isSpinning && (
          <motion.p
            className="text-white text-4xl translate-y-20 font-thin"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Toque para parar
          </motion.p>
        )}
        {!isSpinning && hasSpun && (
          <motion.p
            className="translate-y-20 text-center text-white text-5xl font-thin"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 1 }}
          >
            dê um toque na tela <br /> para continuar o jogo
          </motion.p>
        )}
      </AnimatePresence>
      <motion.div
        className="flex text-white absolute bottom-20 text-3xl items-center"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <p>o look oficial do</p>
        <Image src={images.rirLogo} alt="C&A Logo" width={200} />
      </motion.div>
    </div>
  );
};

export default RoulettePage;
