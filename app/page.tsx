"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/roulette")}
      className="flex flex-col text-3xl items-center justify-center h-screen"
    >
      <h1>C&A Rock in Rio 2024</h1>
      <p className="animate-pulse text-xl">Clique para continuar</p>
    </div>
  );
}
