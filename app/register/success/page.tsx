"use client";
import { images } from "@/public/images";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const SuccessRegisterPage = () => {
  const router = useRouter();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.push("/register");
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, [router]);

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-success bg-cover bg-center relative">
      <Image
        src={images.caLogoBgBranco}
        alt="C&A Logo"
        className="absolute top-24 w-1/5"
      />
      <Image
        src={images.qrCodeFaceMatch}
        alt="qr code"
        className="absolute bottom-64 border-2 border-white rounded-lg p-8"
      />
      <div className="text-white font-sharp font-bold text-3xl flex items-center absolute bottom-14">
        <p>o look oficial do</p>
        <Image src={images.rirLogo} alt="Look Oficial" width={200} />
      </div>
    </div>
  );
};

export default SuccessRegisterPage;
