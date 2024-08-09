"use client";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";

export default function AdminPage() {
  const [prizes, setPrizes] = useState<any[]>([]);
  const [prize, setPrize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

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
    const { data, error } = await supabase
      .from("prizes")
      .insert([{ prize, quantity, image_url: imageUrl, active: true }]);
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

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="mb-4 p-4 bg-white shadow-md rounded"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
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
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="quantity"
          >
            Quantidade
          </label>
          <input
            id="quantity"
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
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
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Adicionar Prêmio
        </button>
      </form>
      <ul className="bg-white shadow-md rounded p-4">
        {prizes.map((prize) => (
          <li
            key={prize.id}
            className="flex justify-between items-center mb-2 p-2 border-b"
          >
            <span>
              {prize.prize} - {prize.quantity} -{" "}
              <span
                className={prize.active ? "text-green-500" : "text-red-500"}
              >
                {prize.active ? "Ativo" : "Inativo"}
              </span>
            </span>
            <img
              src={prize.image_url}
              alt={prize.prize}
              className="w-16 h-16"
            />
            <button
              onClick={() => togglePrizeActive(prize.id, prize.active)}
              className={`ml-4 py-1 px-2 rounded ${
                prize.active
                  ? "bg-red-500 hover:bg-red-700"
                  : "bg-green-500 hover:bg-green-700"
              } text-white`}
            >
              {prize.active ? "Desativar" : "Ativar"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
