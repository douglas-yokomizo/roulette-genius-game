"use client";
import { images } from "@/public/images";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const SuccessRegisterPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-success bg-cover bg-center relative p-4 md:p-10">
      <Image
        src={images.caLogoBgBranco}
        alt="C&A Logo"
        className="absolute top-24 w-1/3 md:w-1/5"
      />
      <Image
        src={images.qrCodeFaceMatch}
        alt="qr code"
        className="absolute bottom-32 md:bottom-64 border-2 border-white rounded-lg p-4 md:p-8 w-3/4 md:w-auto"
      />
      <div className="text-white font-sharp font-bold text-xl md:text-3xl flex flex-col gap-6 md:gap-10 items-center absolute bottom-10 md:bottom-14">
        <p
          onClick={() => router.push("/register")}
          className="animate-pulse hover:cursor-pointer text-center"
        >
          clique aqui para retornar à página de registro
        </p>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0">
          <p>o look oficial do</p>
          <Image src={images.rirLogo} alt="Look Oficial" width={150} />
        </div>
      </div>
    </div>
  );
};

export default SuccessRegisterPage;
