"use client"
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client";
import Image from "next/image";
import { QuantityChart } from "../admin/components/QuantityChart";

function Test() {
  const [prizes, setPrizes] = useState<any[]>([]);

  useEffect(() => {
    const fetchPrizes = async () => {
      const { data, error } = await supabase.from("prizes").select("*");
      if (error) console.error(error);
      else setPrizes(data);
    };
    fetchPrizes();
  }, []);

  const togglePrizeActive = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase
      .from("prizes")
      .update({ active: !currentStatus })
      .eq("id", id);
    if (error) console.error(error);
    else {
      setPrizes(
        prizes.map((p) => (p.id === id ? { ...p, active: !currentStatus } : p))
      );
    }
  };

  const updatePrizeQuantity = async (
    id: number,
    newQuantity: number,
    newDailyLimit: number
  ) => {
    const { error } = await supabase
      .from("prizes")
      .update({ quantity: newQuantity, daily_limit: newDailyLimit })
      .eq("id", id);
    if (error) console.error(error);
    else {
      setPrizes(
        prizes.map((p) =>
          p.id === id
            ? { ...p, quantity: newQuantity, daily_limit: newDailyLimit }
            : p
        )
      );
    }
  };

  return (
    <div className='flex bg-[#f8f7f2] h-screen w-screen px-3 py-12 gap-5'>
      {/* Coluna 1 */}
      <div className="flex-2 w-[30em]">
        <div className="flex h-64 justify-center items-center bg-[#84AAB7]/20 rounded-xl">
          <p className="text-blue-600 uppercase font-bold text-xl"> C&A</p>
        </div>
        <div className="mt-6 p-5 flex justify-center items-center bg-[#84AAB7]/10 rounded-xl">
          <QuantityChart prizes={prizes} />
        </div>
        <div className='flex mt-6 justify-center gap-6 h-64'>
          <div className="flex-1 items-center bg-[#84AAB7]/20 rounded-xl">
            <p> faixa 3</p>
          </div>
          <div className="flex flex-1 justify-center items-center bg-[#84AAB7] rounded-xl">
            <p className="text-white uppercase font-bold text-xl"> Adicionar prêmio </p>
          </div>
        </div>
      </div>
      {/* Coluna 2 */}
      <div className="flex-1">
        <div className="bg-[#84AAB7]/90 p-5 rounded-lg">
          <ul className="space-y-4">
            {prizes.map((prize) => (
              <li
                key={prize.id}
                className="p-2 flex justify-between items-center border-b border-white/20"
              >
                <div className="flex-1">
                  <div className="flex gap-2 items-center">
                    <span
                      className={`inline-block w-4 h-4 rounded-full ${
                        prize.active
                          ? "bg-green-500 shadow-sm shadow-green-600"
                          : "bg-red-500 shadow-sm shadow-red-600"
                      }`}
                      aria-label={prize.active ? "Ativo" : "Inativo"}
                    ></span>
                    <p className="text-lg font-semibold text-white">
                      {prize.prize}
                    </p>
                  </div>

                  <div className="mt-2 flex space-x-4">
                    <div>
                      <label className="block text-white mb-1">Quantidade</label>
                      <input
                        type="number"
                        value={prize.quantity}
                        onChange={(e) =>
                          updatePrizeQuantity(
                            prize.id,
                            Number(e.target.value),
                            prize.daily_limit
                          )
                        }
                        className="w-20 px-2 py-1 border border-white/80 bg-transparent text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-1">Limite Diário</label>
                      <input
                        type="number"
                        value={prize.daily_limit}
                        onChange={(e) =>
                          updatePrizeQuantity(
                            prize.id,
                            prize.quantity,
                            Number(e.target.value)
                          )
                        }
                        className="w-20 px-2 py-1 border border-white/80 bg-transparent text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Image
                    src={prize.image_url}
                    alt={prize.prize}
                    className="w-16 h-16 rounded-md"
                    width={64}
                    height={64}
                  />
                  <div
                    onClick={() => togglePrizeActive(prize.id, prize.active)}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                      prize.active ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        prize.active ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className='flex-2'>
          <div className='flex mt-6 justify-center gap-6 h-[23.5rem]'>
            <div className="flex flex-1 justify-center items-center bg-[#84AAB7]/30 rounded-xl ">
              <p> faixa 3</p>
            </div>
            <div className="flex flex-1 justify-center items-center bg-[#84AAB7]/10 rounded-xl ">
              <p className="text-white uppercase font-bold text-xl"> faixa </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Test;
