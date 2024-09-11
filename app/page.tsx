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
import { parsePhoneNumber, ParseError } from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";
import VirtualKeyboard from "./components/VirtualKeyboard";

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
      <p className="text-5xl text-white mt-10 font-sharpBold font-bold">
        o look oficial do
      </p>
      <Image
        src={images.rirLogo1000}
        alt="RIR Logo"
        width={800}
        height={800}
        layout="responsive"
        quality={100}
      />
    </motion.div>
  </motion.div>
);

const StartPage = () => {
  const [cpf, setCpf] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [countryCode, setCountryCode] = useState("BR");
  const [isBrazilian, setIsBrazilian] = useState(true);
  const [showCover, setShowCover] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
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

  const handleWhatsappChange = (
    value: string,
    country: { dialCode: string; countryCode: string }
  ) => {
    setWhatsapp(`+${value}`);
    setCountryCode(country.countryCode);
  };

  const validateWhatsApp = (value: any, countryCode: any) => {
    if (!value) return false;
    try {
      const phoneNumber = parsePhoneNumber(value, countryCode);
      return phoneNumber.isValid();
    } catch (error) {
      return false;
    }
  };

  const handleStart = async () => {
    if (isBrazilian && !cpf) {
      toast("Por favor, insira CPF.", { type: "error" });
      return;
    }

    if (!isBrazilian && !whatsapp) {
      toast("Por favor, insira WhatsApp.", { type: "error" });
      return;
    }

    let data, error;

    if (isBrazilian) {
      ({ data, error } = await supabase
        .from("users")
        .select("cpf, hasPlayed")
        .eq("cpf", cpf)
        .single());
    } else {
      try {
        // Use the exact input value for WhatsApp
        const formattedWhatsapp = whatsapp;
        console.log("Formatted WhatsApp:", formattedWhatsapp);
        ({ data, error } = await supabase
          .from("users")
          .select("whatsapp, hasPlayed")
          .eq("whatsapp", formattedWhatsapp)
          .single());
      } catch (error) {
        if (
          error instanceof ParseError &&
          error.message === "INVALID_COUNTRY"
        ) {
          toast(
            "Código de país inválido. Por favor, verifique e tente novamente.",
            {
              type: "error",
            }
          );
          return;
        } else {
          console.error("Erro ao formatar o número de WhatsApp:", error);
          toast(
            "Houve um erro ao formatar o número de WhatsApp. Tente novamente.",
            {
              type: "error",
            }
          );
          return;
        }
      }
    }

    console.log("Supabase response:", { data, error });

    if (error || !data) {
      toast(
        "CPF ou WhatsApp não encontrado. Por favor, verifique e tente novamente.",
        {
          type: "error",
        }
      );
    } else {
      // Commenting out the check for whether the user has already played
      // if (data.hasPlayed) {
      //   toast("Você já jogou. Não é permitido jogar novamente.", {
      //     type: "error",
      //   });
      // } else {
      if (isBrazilian && "cpf" in data && formatCpf(data.cpf) === cpf) {
        // CPF validation passed
        await updateUserStatus();
      } else if (
        !isBrazilian &&
        "whatsapp" in data &&
        validateWhatsApp(data.whatsapp, countryCode.toUpperCase())
      ) {
        // WhatsApp validation passed
        await updateUserStatus();
      } else {
        toast(
          "CPF ou WhatsApp inválido. Por favor, verifique e tente novamente.",
          {
            type: "error",
          }
        );
      }
      // }
    }
  };

  const updateUserStatus = async () => {
    let identifier;
    let formattedWhatsapp;

    if (isBrazilian) {
      identifier = cpf;
    } else {
      try {
        // Use the exact input value for WhatsApp
        formattedWhatsapp = whatsapp;
        identifier = formattedWhatsapp;
      } catch (error) {
        console.error("Erro ao formatar o número de WhatsApp:", error);
        toast(
          "Houve um erro ao formatar o número de WhatsApp. Tente novamente.",
          {
            type: "error",
          }
        );
        return;
      }
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ hasPlayed: true })
      .eq(isBrazilian ? "cpf" : "whatsapp", identifier);

    if (updateError) {
      console.error("Erro ao atualizar o status do jogo:", updateError);
      toast("Houve um erro ao iniciar o jogo. Tente novamente.", {
        type: "error",
      });
    } else {
      router.push("/roulette");
    }
  };

  const handleInputFocus = (inputName: string) => {
    setFocusedInput(inputName);
    setIsKeyboardVisible(true);
  };

  const handleVirtualKeyboardChange = (value: string) => {
    if (focusedInput === "cpf") {
      setCpf(formatCpf(value));
    } else if (focusedInput === "whatsapp") {
      setWhatsapp(value.startsWith("+") ? value : `+${value}`);
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
            <p className="text-4xl text-white mt-10 font-semibold">
              O look oficial do
            </p>
            <Image
              src={images.rirLogo1000}
              alt="C&A Logo"
              width={400}
              quality={100}
            />
            <div className="my-10 flex gap-4">
              <button
                className={`px-6 py-3 rounded-full text-2xl font-bold ${
                  isBrazilian
                    ? "bg-orange-500 text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => setIsBrazilian(true)}
              >
                Brasileiro(a)
              </button>
              <button
                className={`px-6 py-3 rounded-full text-2xl font-bold ${
                  !isBrazilian
                    ? "bg-orange-500 text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => setIsBrazilian(false)}
              >
                Estrangeiro(a)
              </button>
            </div>
            {isBrazilian ? (
              <motion.input
                type="text"
                placeholder="CPF"
                autoComplete="off"
                value={cpf}
                onChange={handleCpfChange}
                onFocus={() => handleInputFocus("cpf")}
                className="text-center placeholder:text-white py-2 placeholder:font-thin bg-transparent my-32 text-white border-4 border-orange-500 text-6xl rounded-full px-2 w-2/4"
                initial={{ opacity: 0 }}
                animate={{ opacity: showInput ? 1 : 0 }}
                transition={{ duration: 1 }}
              />
            ) : (
              <PhoneInput
                country={"br"} // Set country to Brazil
                value={whatsapp}
                onChange={handleWhatsappChange}
                onFocus={() => handleInputFocus("whatsapp")}
                containerClass="text-center placeholder:text-white py-2 placeholder:font-thin bg-transparent my-32 text-white border-4 border-orange-500 text-6xl rounded-full px-10 w-2/4"
                inputStyle={{
                  width: "100%",
                  backgroundColor: "transparent",
                  color: "white",
                  fontSize: "2rem",
                  padding: "0.5rem",
                  textAlign: "center",
                }}
                buttonStyle={{ backgroundColor: "transparent", border: "none" }}
                placeholder="WhatsApp"
              />
            )}
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
      <VirtualKeyboard
        isVisible={isKeyboardVisible}
        onChange={handleVirtualKeyboardChange}
        focusedInput={focusedInput}
      />
    </>
  );
};

export default StartPage;
