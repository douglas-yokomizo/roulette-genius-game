"use client";
import { useGameContext } from "@/app/context/GameContext";
import { images } from "@/public/images";
import Image from "next/image";

const WinnerPage = () => {
  const { drawnPrize } = useGameContext();

  return (
    <div className="flex bg-azul h-screen text-white flex-col items-center justify-center">
      <h1 className="text-[9rem] font-sharpBold font-[800] mb-6">parabéns!</h1>
      <h2 className="text-7xl tracking-wider font-semibold text-center">
        você mostrou que é <br /> um expert em moda
      </h2>
      <div className="relative w-full flex justify-center items-center">
        <Image src={images.rocamboleGanhador} alt="" className="w-full" />
        {drawnPrize?.image_url && (
          <Image
            src={drawnPrize.image_url}
            alt="Prêmio"
            className="absolute w-1/2 h-auto z-10 top-1/2 left-1/2 tranform -translate-x-1/2 -translate-y-1/2"
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

export default WinnerPage;
