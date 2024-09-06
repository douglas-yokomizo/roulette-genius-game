"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import caLogoAzul from "../public/images/caLogoBgBranco.png";
import rirLogo from "../public/images/rirLogoBranco.png";
import rightArrow from "../public/images/rightArrow.png";
import { supabase } from "./utils/supabase/client";
import { toast } from "react-toastify";
import { images } from "@/public/images";

const Cover = ({ onClick }: { onClick: () => void }) => (
  <motion.div
    className="relative flex items-center justify-center h-screen bg-black text-white"
    onClick={onClick}
    initial={{ opacity: 1 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1 }}
  >
    <Image
      src={images.iddleBg}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
    />
    <motion.div
      className="relative flex animate-bounce flex-col items-center justify-center"
      initial={{ y: 0 }}
      animate={{ y: -0 }}
      transition={{ duration: 1 }}
    >
      <Image src={caLogoAzul} alt="C&A Logo" width={400} />
      <p className="text-5xl text-white my-10 font-sharpBold font-bold">
        o look oficial do
      </p>
      <Image src={rirLogo} alt="C&A Logo" width={400} quality={100} />
    </motion.div>
  </motion.div>
);

const StartPage = () => {
  const [cpf, setCpf] = useState("");
  const [showCover, setShowCover] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!showCover) {
      setTimeout(() => {
        setShowInput(true);
      }, 500);
    }
  }, [showCover]);

  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue.length <= 11) {
      setCpf(formatCpf(e.target.value));
    }
  };

  const handleStart = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("cpf, hasPlayed")
      .eq("cpf", cpf)
      .single();

    if (error || !data) {
      toast("CPF não encontrado. Por favor, verifique e tente novamente.", {
        type: "error",
      });
    } else if (data.hasPlayed) {
      toast("Você já jogou. Não é permitido jogar novamente.", {
        type: "error",
      });
    } else {
      const formattedCpfFromSupabase = formatCpf(data.cpf);
      if (formattedCpfFromSupabase === cpf) {
        const { error: updateError } = await supabase
          .from("users")
          .update({ hasPlayed: true })
          .eq("cpf", cpf);

        if (updateError) {
          console.error("Erro ao atualizar o status do jogo:", updateError);
          toast("Houve um erro ao iniciar o jogo. Tente novamente.", {
            type: "error",
          });
        } else {
          router.push("/roulette");
        }
      } else {
        toast("CPF não encontrado. Por favor, verifique e tente novamente.", {
          type: "error",
        });
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {showCover ? (
          <Cover onClick={() => setShowCover(false)} />
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center h-screen bg-azul"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: -50 }}
              transition={{ duration: 1 }}
            >
              <Image src={caLogoAzul} alt="C&A Logo" width={400} />
            </motion.div>
            <p className="text-4xl text-white my-10 font-semibold">
              O look oficial do
            </p>
            <Image src={rirLogo} alt="C&A Logo" width={400} quality={100} />
            <motion.input
              type="text"
              placeholder="CPF"
              autoComplete="off"
              value={cpf}
              onChange={handleCpfChange}
              className="text-center placeholder:text-white py-2 placeholder:font-thin bg-transparent my-32 text-white border-4 border-orange-500 text-6xl rounded-full px-2 w-2/4"
              initial={{ opacity: 0 }}
              animate={{ opacity: showInput ? 1 : 0 }}
              transition={{ duration: 1 }}
            />
            <Image
              src={rightArrow}
              alt="Arrow Logo"
              width={120}
              className="hover:cursor-pointer"
              onClick={handleStart}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StartPage;
