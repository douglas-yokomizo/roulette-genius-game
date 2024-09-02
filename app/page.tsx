"use client";
import Image from "next/image";
import caLogoAzul from "../public/images/caLogoBgBranco.png";
import rirLogo from "../public/images/rirLogoBranco.png";
import rightArrow from "../public/images/rightArrow.png";
import { useRouter } from "next/navigation";

const StartPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-azul bg-cover bg-center bg-no-repeat">
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
        className="text-center placeholder:text-white py-2 placeholder:font-thin bg-transparent my-32 text-white border-4 border-orange-500 text-6xl rounded-full px-2 w-2/4"
      />
      <Image
        src={rightArrow}
        alt="Arrow Logo"
        width={120}
        className="hover:cursor-pointer"
        onClick={() => router.push("/roulette")}
      />
    </div>
  );
};

export default StartPage;
