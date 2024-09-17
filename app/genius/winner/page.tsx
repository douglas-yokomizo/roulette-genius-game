"use client";
import { useGameContext } from "@/app/context/GameContext";
import { images } from "@/public/images";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const WinnerPage = () => {
  const { drawnPrize, setDrawnPrize } = useGameContext();
  const router = useRouter();
  const touchStartX = useRef(0);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      router.replace("/genius/winner"); // Redirect back to the WinnerPage
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault(); // Disable right-click
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault(); // Disable key presses
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartX.current = event.touches[0].clientX;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touchEndX = event.touches[0].clientX;
      if (touchEndX > touchStartX.current + 50) {
        event.preventDefault(); // Prevent swipe to the right
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDrawnPrize(null);
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router, setDrawnPrize]);

  return (
    <motion.div
      className="flex bg-azul h-screen text-white flex-col items-center justify-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="text-[9rem] font-sharpBold font-[800] mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        parabéns!
      </motion.h1>
      <motion.h2
        className="text-7xl tracking-wider font-semibold text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        você mostrou que é <br /> um expert em moda
      </motion.h2>
      <div className="relative w-full flex justify-center items-center">
        <Image src={images.rocamboleGanhador} alt="" className="w-full" />
        {drawnPrize?.image_url && (
          <motion.div
            initial={{ scale: 0, rotate: 0, opacity: 0 }}
            animate={{ scale: 1, rotate: 360, opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex justify-center items-center"
          >
            <Image
              src={drawnPrize.image_url}
              alt="Prêmio"
              width={600}
              height={600}
            />
          </motion.div>
        )}
      </div>
      <motion.p
        className="text-4xl italic"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        retire seu ticket com a promotora
      </motion.p>
      <motion.div
        className="flex text-white absolute bottom-20 text-3xl items-center gap-2 font-sharpBold font-bold"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <p>o look oficial do</p>
        <Image src={images.rirLogo} alt="C&A Logo" width={200} />
      </motion.div>
      {/* Full-screen overlay to block interactions */}
      <div
        className="absolute inset-0 bg-transparent z-50"
        style={{ pointerEvents: "none" }}
      ></div>
    </motion.div>
  );
};

export default WinnerPage;
