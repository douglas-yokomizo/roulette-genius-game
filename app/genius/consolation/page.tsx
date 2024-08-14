"use client";
import { useEffect, useState } from "react";
import { fetchConsolationPrize } from "@/app/services/prizesService";
import Image from "next/image";

interface Prize {
  image_url: string;
  prize: string;
}

const ConsolationPage = () => {
  const [consolationPrize, setConsolationPrize] = useState<Prize | null>(null);

  useEffect(() => {
    const getConsolationPrize = async () => {
      try {
        const prize = await fetchConsolationPrize();
        setConsolationPrize(prize);
      } catch (error) {
        console.error("Failed to fetch consolation prize:", error);
      }
    };

    getConsolationPrize();
  }, []);

  return (
    <div>
      <h1>Não foi dessa vez! Mas você ganhou um prêmio de consolação:</h1>
      {consolationPrize && (
        <>
          <Image
            src={consolationPrize.image_url}
            alt="Consolation Prize"
            width={90}
            height={90}
          />
          <p>{consolationPrize.prize}</p>
        </>
      )}
    </div>
  );
};

export default ConsolationPage;
