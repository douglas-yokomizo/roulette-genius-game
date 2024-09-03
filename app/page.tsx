"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import caLogoAzul from "../public/images/caLogoBgBranco.png";
import rirLogo from "../public/images/rirLogoBranco.png";
import rightArrow from "../public/images/rightArrow.png";
import { supabase } from "./utils/supabase/client";

const StartPage = () => {
  const [cpf, setCpf] = useState("");
  const router = useRouter();

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(e.target.value);
  };

  const handleStart = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("cpf")
      .eq("cpf", cpf)
      .single();

    if (error || !data) {
      alert("CPF não encontrado. Por favor, verifique e tente novamente.");
    } else {
      router.push("/roulette");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-azul">
      <Image src={caLogoAzul} alt="C&A Logo" width={400} />
      <p className="text-4xl text-white my-10 font-semibold">
        O look oficial do
      </p>
      <Image
        src={rirLogo}
        alt="C&A Logo"
        width={400}
        quality={100}
        layout="intrinsic"
      />
      <input
        type="text"
        placeholder="CPF"
        autoComplete="off"
        value={cpf}
        onChange={handleCpfChange}
        className="text-center placeholder:text-white py-2 placeholder:font-thin bg-transparent my-32 text-white border-4 border-orange-500 text-6xl rounded-full px-2 w-2/4"
      />
      <Image
        src={rightArrow}
        alt="Arrow Logo"
        width={120}
        className="hover:cursor-pointer"
        onClick={handleStart}
      />
    </div>
  );
};

export default StartPage;
