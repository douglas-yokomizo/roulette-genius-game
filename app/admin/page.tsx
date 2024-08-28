"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client";
import Image from "next/image";

const AdminPage = () => {
  const [prizes, setPrizes] = useState<any[]>([]);
  const [prize, setPrize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [dailyLimit, setDailyLimit] = useState(0);

  useEffect(() => {
    const fetchPrizes = async () => {
      const { data, error } = await supabase.from("prizes").select("*");
      if (error) console.error(error);
      else setPrizes(data);
    };
    fetchPrizes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from("prizes").insert([
      {
        prize,
        quantity,
        image_url: imageUrl,
        daily_limit: dailyLimit,
        active: true,
      },
    ]);
    if (error) console.error(error);
    else {
      console.log("Prize inserted:", data);
      setPrizes([...prizes, ...(data || [])]);
    }
  };

  const togglePrizeActive = async (id: number, currentStatus: boolean) => {
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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

  const resetDistributedToday = async () => {
    const savePromises = prizes.map(async (prize) => {
      const { data, error } = await supabase.from("distributed_prizes").insert({
        prize_id: prize.id,
        distributed_today: prize.distributed_today,
      });
      if (error) console.error(error);
      return data;
    });

    await Promise.all(savePromises);

    const resetPromises = prizes.map(async (prize) => {
      const { data, error } = await supabase
        .from("prizes")
        .update({ distributed_today: 0 })
        .eq("id", prize.id);
      if (error) console.error(error);
      return data;
    });

    await Promise.all(resetPromises);

    const { data, error } = await supabase.from("prizes").select("*");
    if (error) console.error(error);
    else setPrizes(data);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Adicionar Prêmio
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="prize"
            >
              Prêmio
            </label>
            <input
              id="prize"
              type="text"
              placeholder="Nome do Prêmio"
              value={prize}
              onChange={(e) => setPrize(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="quantity"
            >
              Quantidade
            </label>
            <input
              id="quantity"
              type="number"
              placeholder="Quantidade"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="daily_limit"
            >
              Limite Diário
            </label>
            <input
              id="daily_limit"
              type="number"
              placeholder="Limite Diário"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Adicionar
          </button>
        </form>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Prêmios</h2>
        <button
          onClick={resetDistributedToday}
          className="bg-red-500 text-white px-4 py-2 rounded-md mb-4"
        >
          Resetar Quantidades Distribuídas
        </button>
        <ul>
          {prizes.map((prize) => (
            <li key={prize.id} className="mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{prize.prize}</h3>
                  <p>Quantidade: {prize.quantity}</p>
                  <p>Limite Diário: {prize.daily_limit}</p>
                  <p>Distribuído Hoje: {prize.distributed_today}</p>
                </div>
                <button
                  onClick={() => togglePrizeActive(prize.id, prize.active)}
                  className={`px-4 py-2 rounded-md ${
                    prize.active ? "bg-green-500" : "bg-gray-500"
                  } text-white`}
                >
                  {prize.active ? "Desativar" : "Ativar"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
