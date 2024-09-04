"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client";
import { useGameContext } from "../context/GameContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminPage = () => {
  const [prizes, setPrizes] = useState<any[]>([]);
  const [prize, setPrize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [dailyLimit, setDailyLimit] = useState(0);
  const { difficulty, setDifficulty } = useGameContext();
  const [difficultyState, setDifficultyState] = useState(difficulty);
  const [editingPrize, setEditingPrize] = useState<any | null>(null);

  useEffect(() => {
    setDifficultyState(difficulty);
  }, [difficulty]);

  const handleDifficultyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newDifficulty = event.target.value;
    setDifficultyState(newDifficulty);
  };

  const handleSaveDifficulty = async () => {
    setDifficulty(difficultyState);
    const { data, error } = await supabase
      .from("game_settings")
      .update({ difficulty: difficultyState })
      .eq("id", 1);
    if (error) {
      console.error(error);
      toast.error("Erro ao salvar dificuldade");
    } else {
      toast.success("Dificuldade salva com sucesso");
    }
  };

  useEffect(() => {
    const fetchPrizes = async () => {
      const { data, error } = await supabase.from("prizes").select("*");
      if (error) {
        console.error(error);
        toast.error("Erro ao buscar prêmios");
      } else {
        setPrizes(data);
      }
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
    if (error) {
      console.error(error);
      toast.error("Erro ao adicionar prêmio");
    } else {
      console.log("Prize inserted:", data);
      setPrizes([...prizes, ...(data || [])]);
      toast.success("Prêmio adicionado com sucesso");
    }
  };

  const handleDeletePrize = async (id: number) => {
    const { error } = await supabase.from("prizes").delete().eq("id", id);
    if (error) {
      console.error(error);
      toast.error("Erro ao excluir prêmio");
    } else {
      setPrizes(prizes.filter((prize) => prize.id !== id));
      toast.success("Prêmio excluído com sucesso");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("prizes")
      .update({
        prize: editingPrize.prize,
        quantity: editingPrize.quantity,
        image_url: editingPrize.image_url,
        daily_limit: editingPrize.daily_limit,
      })
      .eq("id", editingPrize.id);
    if (error) {
      console.error(error);
      toast.error("Erro ao editar prêmio");
    } else {
      setPrizes(
        prizes.map((p) => (p.id === editingPrize.id ? editingPrize : p))
      );
      setEditingPrize(null);
      toast.success("Prêmio editado com sucesso");
    }
  };

  const togglePrizeActive = async (id: number, currentStatus: boolean) => {
    const { data, error } = await supabase
      .from("prizes")
      .update({ active: !currentStatus })
      .eq("id", id);

    if (error) {
      console.error(error);
    } else {
      setPrizes((prevPrizes) =>
        prevPrizes.map((p) =>
          p.id === id ? { ...p, active: !currentStatus } : p
        )
      );
    }
  };

  const resetDistributedToday = async () => {
    const savePromises = prizes.map(async (prize) => {
      const { data, error } = await supabase.from("distributed_prizes").insert({
        prize_id: prize.id,
        distributed_today: prize.distributed_today,
        prize_name: prize.prize,
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
    if (error) {
      console.error(error);
      toast.error("Erro ao resetar quantidades distribuídas");
    } else {
      setPrizes(data);
      toast.success("Quantidades distribuídas resetadas com sucesso");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sharp">
      <ToastContainer />
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
        <label
          htmlFor="difficulty"
          className="block text-gray-700 font-medium mb-2 mt-4"
        >
          Selecione a dificuldade do Genius:
        </label>
        <select
          id="difficulty"
          value={difficultyState}
          onChange={handleDifficultyChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="easy">Fácil</option>
          <option value="medium">Médio</option>
          <option value="hard">Difícil</option>
        </select>
        <button
          onClick={handleSaveDifficulty}
          className="bg-green-500 text-white px-4 py-2 rounded-md mt-4"
        >
          Salvar Dificuldade
        </button>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Prêmios</h2>
        <button
          onClick={resetDistributedToday}
          className="bg-red-500 text-white px-4 py-2 rounded-md mb-4"
        >
          Resetar Quantidades Distribuídas
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {prizes.map((prize) => (
            <div key={prize.id} className="border rounded-lg p-4 shadow-md">
              {editingPrize && editingPrize.id === prize.id ? (
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="edit_prize"
                    >
                      Prêmio
                    </label>
                    <input
                      id="edit_prize"
                      type="text"
                      placeholder="Nome do Prêmio"
                      value={editingPrize.prize}
                      onChange={(e) =>
                        setEditingPrize({
                          ...editingPrize,
                          prize: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="edit_quantity"
                    >
                      Quantidade
                    </label>
                    <input
                      id="edit_quantity"
                      type="number"
                      placeholder="Quantidade"
                      value={editingPrize.quantity}
                      onChange={(e) =>
                        setEditingPrize({
                          ...editingPrize,
                          quantity: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="edit_daily_limit"
                    >
                      Limite Diário
                    </label>
                    <input
                      id="edit_daily_limit"
                      type="number"
                      placeholder="Limite Diário"
                      value={editingPrize.daily_limit}
                      onChange={(e) =>
                        setEditingPrize({
                          ...editingPrize,
                          daily_limit: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPrize(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2"
                  >
                    Cancelar
                  </button>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-semibold flex items-center">
                    <span
                      className={`w-3 h-3 rounded-full mr-2 ${
                        prize.active ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    {prize.prize}
                  </h3>
                  <p>Quantidade: {prize.quantity}</p>
                  <p>Limite Diário: {prize.daily_limit}</p>
                  <p>Distribuído Hoje: {prize.distributed_today}</p>
                  <div className="flex justify-between items-center">
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
                    <div className="flex">
                      <button
                        onClick={() => setEditingPrize(prize)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md mt-2 ml-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeletePrize(prize.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md mt-2 ml-2"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
