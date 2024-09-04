"use client";
import { images } from "@/public/images";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const NotThisTimePage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen relative">
      <h1 className="text-9xl font-sharpBold font-[800] text-azul">
        que pena!
      </h1>
      <h3 className="text-7xl text-azul font-sharpBold mt-6">
        não foi dessa vez
      </h3>
      <h4 className="text-5xl font-semibold my-32 text-center">
        retire seu voucher <br /> com a promotora{" "}
      </h4>
      <Image src={images.rocambolePerdeu} alt="C&A Logo" />
      <Image
        src={images.lookOficial}
        alt="C&A Logo"
        width={400}
        className="absolute bottom-20"
      />
    </div>
  );
};

export default NotThisTimePage;
