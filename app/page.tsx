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
import { parsePhoneNumber, ParseError, CountryCode } from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";

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
  const [whatsapp, setWhatsapp] = useState("");
  const [countryCode, setCountryCode] = useState("br");
  const [isBrazilian, setIsBrazilian] = useState(true);
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

  const handleWhatsappChange = (
    value: string,
    country: { dialCode: string; countryCode: string }
  ) => {
    setWhatsapp(value);
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
        const phoneNumber = parsePhoneNumber(
          whatsapp,
          countryCode.toUpperCase() as CountryCode | undefined
        );
        const formattedWhatsapp = phoneNumber.format("E.164");
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
    } else if (data.hasPlayed) {
      toast("Você já jogou. Não é permitido jogar novamente.", {
        type: "error",
      });
    } else {
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
    }
  };

  const updateUserStatus = async () => {
    //@ts-ignore
    const phoneNumber = parsePhoneNumber(whatsapp, countryCode.toUpperCase());
    const formattedWhatsapp = phoneNumber.format("E.164");
    const { error: updateError } = await supabase
      .from("users")
      .update({ hasPlayed: true })
      .eq(
        isBrazilian ? "cpf" : "whatsapp",
        isBrazilian ? cpf : formattedWhatsapp
      );

    if (updateError) {
      console.error("Erro ao atualizar o status do jogo:", updateError);
      toast("Houve um erro ao iniciar o jogo. Tente novamente.", {
        type: "error",
      });
    } else {
      router.push("/roulette");
    }
  };

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    const {
      name,
      cpf,
      whatsapp,
      email,
      privacyTerms,
      imageTerms,
      bigScreenAgreement,
      comunicationAgreement,
      isNotBrazilianUser,
    } = values;

    const formattedName = name
      .split(" ")
      .map(
        (word: string) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");

    if (!isNotBrazilianUser) {
      const { data: cpfData } = await supabase
        .from("users")
        .select("cpf")
        .eq("cpf", cpf)
        .single();

      if (cpfData) {
        toast("CPF já cadastrado. Por favor, verifique e tente novamente.", {
          type: "error",
        });
        setSubmitting(false);
        return;
      }
    }

    const { data: emailData } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (emailData) {
      toast("Email já cadastrado. Por favor, verifique e tente novamente.", {
        type: "error",
      });
      setSubmitting(false);
      return;
    }

    let formattedWhatsapp = whatsapp;
    if (!isNotBrazilianUser) {
      try {
        const phoneNumber = parsePhoneNumber(
          whatsapp,
          //@ts-ignore
          countryCode.toUpperCase()
        );
        formattedWhatsapp = phoneNumber.format("E.164");
      } catch (error) {
        console.error("Erro ao formatar o número de WhatsApp:", error);
        toast(
          "Houve um erro ao formatar o número de WhatsApp. Tente novamente.",
          {
            type: "error",
          }
        );
        setSubmitting(false);
        return;
      }
    }

    const { data: whatsappData } = await supabase
      .from("users")
      .select("whatsapp")
      .eq("whatsapp", formattedWhatsapp)
      .single();

    if (whatsappData) {
      toast("WhatsApp já cadastrado. Por favor, verifique e tente novamente.", {
        type: "error",
      });
      setSubmitting(false);
      return;
    }

    const { data, error } = await supabase.from("users").insert([
      {
        name: formattedName,
        cpf: isNotBrazilianUser ? null : cpf, // Set CPF to null if the user is not Brazilian
        whatsapp: formattedWhatsapp,
        email,
        privacyTerms,
        imageTerms,
        bigScreenAgreement,
        comunicationAgreement,
      },
    ]);

    if (error) {
      console.error("Erro ao cadastrar usuário:", error);
      toast("Houve um erro ao cadastrar. Tente novamente.", {
        type: "error",
      });
    } else {
      toast("Usuário cadastrado com sucesso!", {
        type: "success",
      });
      resetForm();
      router.push("/register/success");
    }
    setSubmitting(false);
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
            <div className="my-10">
              <label className="text-white text-2xl">
                Você é do Brasil?
                <input
                  type="radio"
                  name="country"
                  value="yes"
                  checked={isBrazilian}
                  onChange={() => setIsBrazilian(true)}
                  className="ml-2"
                />
                Sim
                <input
                  type="radio"
                  name="country"
                  value="no"
                  checked={!isBrazilian}
                  onChange={() => setIsBrazilian(false)}
                  className="ml-2"
                />
                Não
              </label>
            </div>
            {isBrazilian ? (
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
            ) : (
              <PhoneInput
                country={"br"}
                value={whatsapp}
                onChange={handleWhatsappChange}
                containerClass="text-center placeholder:text-white py-2 placeholder:font-thin bg-transparent my-32 text-white border-4 border-orange-500 text-6xl rounded-full px-2 w-2/4"
                inputStyle={{
                  width: "100%",
                  backgroundColor: "transparent",
                  color: "white",
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
    </>
  );
};

export default StartPage;
