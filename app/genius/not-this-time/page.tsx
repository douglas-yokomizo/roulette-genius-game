"use client";
import { images } from "@/public/images";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { motion } from "framer-motion";

const NotThisTimePage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="text-9xl font-sharpBold font-[800] text-azul"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        que pena!
      </motion.h1>
      <motion.h3
        className="text-7xl text-azul font-sharpBold mt-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        não foi dessa vez
      </motion.h3>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Image src={images.rocambolePerdeu} alt="C&A Logo" />
      </motion.div>
      <motion.div
        className="absolute bottom-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Image src={images.lookOficial} alt="C&A Logo" width={400} />
      </motion.div>
    </motion.div>
  );
};

export default NotThisTimePage;
