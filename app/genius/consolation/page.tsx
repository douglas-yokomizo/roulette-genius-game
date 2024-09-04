"use client";
import { useEffect, useState } from "react";
import {
  fetchConsolationPrize,
  updatePrizeQuantity,
  updateDistributedToday,
} from "@/app/services/prizesService";
import Image from "next/image";
import { images } from "@/public/images";
import { useRouter } from "next/navigation";
import { useGameContext } from "@/app/context/GameContext";

interface Prize {
  id: number;
  image_url: string;
  prize: string;
  quantity: number;
  distributed_today: number;
}

const ConsolationPage = () => {
  const [consolationPrize, setConsolationPrize] = useState<Prize | null>(null);
  const router = useRouter();
  const { setDrawnPrize } = useGameContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDrawnPrize(null); // Limpa o estado do prêmio
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router, setDrawnPrize]);

  useEffect(() => {
    const getConsolationPrize = async () => {
      try {
        const prize = await fetchConsolationPrize();
        setConsolationPrize(prize);

        if (prize) {
          await updatePrizeQuantity(prize.id, prize.quantity - 1);
          await updateDistributedToday(prize.id, prize.distributed_today + 1);
        }
      } catch (error) {
        console.error("Failed to fetch consolation prize:", error);
      }
    };

    getConsolationPrize();
  }, []);

  return (
    <div className="flex bg-azul h-screen text-white flex-col items-center justify-center">
      <h1 className="text-9xl font-sharpBold font-[800] mb-6">parabéns!</h1>
      <h2 className="text-5xl tracking-wider font-semibold text-center">
        você mostrou que é quase <br /> um expert em moda
      </h2>
      <div className="relative w-full flex justify-center items-center">
        <Image src={images.rocamboleGanhador} alt="" className="w-full" />
        {consolationPrize?.image_url && (
          <Image
            src={consolationPrize.image_url}
            alt="Prêmio"
            width={240}
            height={240}
            className="absolute w-1/3 h-auto z-10 top-1/2 left-1/2 tranform -translate-x-1/2 -translate-y-1/2"
          />
        )}
      </div>
      <p className="text-4xl italic">retire seu ticket com a promotora</p>
      <div className="flex text-white absolute bottom-20 text-3xl items-center gap-2 font-sharpBold font-bold">
        <p>o look oficial do</p>
        <Image src={images.rirLogo} alt="C&A Logo" width={200} />
      </div>
    </div>
  );
};

export default ConsolationPage;
