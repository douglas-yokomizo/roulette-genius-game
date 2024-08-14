"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client";
import Image from "next/image";
import { QuantityChart } from "./components/QuantityChart";

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
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="image_url"
            >
              URL da Imagem
            </label>
            <input
              id="image_url"
              type="text"
              placeholder="URL da Imagem"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Adicionar Prêmio
          </button>
        </form>
      </div>

      <ul className="space-y-4">
        {prizes.map((prize) => (
          <li
            key={prize.id}
            className="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center"
          >
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-800">
                {prize.prize}
              </p>
              <div className="mt-2 flex space-x-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Quantidade
                  </label>
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
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Limite Diário
                  </label>
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
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <p
                className={`mt-2 font-medium ${
                  prize.active ? "text-green-600" : "text-red-600"
                }`}
              >
                {prize.active ? "Ativo" : "Inativo"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Image
                src={prize.image_url}
                alt={prize.prize}
                className="w-16 h-16 rounded-md"
                width={64}
                height={64}
              />
              <button
                onClick={() => togglePrizeActive(prize.id, prize.active)}
                className={`py-2 px-4 rounded-md text-white ${
                  prize.active
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {prize.active ? "Desativar" : "Ativar"}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Estatísticas de Estoque</h2>
    <QuantityChart prizes={prizes} />
  </div>
    </div>
  );
};

export default AdminPage;
