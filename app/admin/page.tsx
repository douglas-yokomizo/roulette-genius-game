"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client";
import { useGameContext } from "../context/GameContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const AdminPage = () => {
  const [prizes, setPrizes] = useState<any[]>([]);
  const [prize, setPrize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(0);
  const { difficulty, setDifficulty } = useGameContext();
  const [difficultyState, setDifficultyState] = useState(difficulty);
  const [editingPrize, setEditingPrize] = useState<any | null>(null);
  const [deletingPrize, setDeletingPrize] = useState<any | null>(null);
  const [consolationPrize, setConsolationPrize] = useState<any | null>(null);

  useEffect(() => {
    setDifficultyState(difficulty);
  }, [difficulty]);

  useEffect(() => {
    const fetchPrizes = async () => {
      const { data, error } = await supabase.from("prizes").select("*");
      if (error) {
        console.error(error);
      } else {
        setPrizes(data);
        const consolation = data.find((prize) => prize.is_consolation);
        setConsolationPrize(consolation);
      }
    };
    fetchPrizes();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from("prizes").insert([
      {
        prize,
        quantity,
        daily_limit: dailyLimit,
        active: true,
      },
    ]);
    if (error) {
      console.error(error);
    } else {
      setPrizes((prevPrizes) => [...prevPrizes, ...(data || [])]);
    }
  };

  const handleDeletePrize = async (id: number) => {
    const { error } = await supabase.from("prizes").delete().eq("id", id);
    if (error) {
      console.error(error);
    } else {
      setPrizes((prevPrizes) => prevPrizes.filter((prize) => prize.id !== id));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("prizes")
      .update({
        prize: editingPrize?.prize,
        quantity: editingPrize?.quantity,
        daily_limit: editingPrize?.daily_limit,
        is_consolation: editingPrize?.is_consolation,
      })
      .eq("id", editingPrize?.id);
    if (error) {
      console.error(error);
    } else {
      setPrizes((prevPrizes) =>
        prevPrizes.map((p) => (p.id === editingPrize?.id ? editingPrize : p))
      );
      setEditingPrize(null);
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
    } else {
      setPrizes(data);
    }
  };

  const chartData = {
    labels: prizes.map((prize) => prize.prize),
    datasets: [
      {
        label: "Distribuído Hoje",
        data: prizes.map((prize) => prize.distributed_today),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sharp">
      <ToastContainer />
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Dashboard de Prêmios
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Visão Geral</h2>
            <ul>
              {prizes.map((prize) => (
                <li key={prize.id} className="mb-2">
                  {prize.prize}: {prize.quantity} disponíveis
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Estatísticas</h2>
            <Bar data={chartData} />
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-4">Prêmio de Consolação</h2>
          {consolationPrize ? (
            <div>
              <p>
                Prêmio atual de consolação:{" "}
                <span className="font-semibold">{consolationPrize.prize}</span>
              </p>
              <button
                onClick={() => setEditingPrize(consolationPrize)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md mt-2"
              >
                Editar Prêmio de Consolação
              </button>
            </div>
          ) : (
            <p>Nenhum prêmio de consolação definido.</p>
          )}
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Gestão de Prêmios
        </h1>
        <form onSubmit={handleSubmit} className="mb-6">
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
                      value={editingPrize?.prize}
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
                      value={editingPrize?.quantity}
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
                      value={editingPrize?.daily_limit}
                      onChange={(e) =>
                        setEditingPrize({
                          ...editingPrize,
                          daily_limit: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="edit_is_consolation"
                    >
                      Prêmio de Consolação
                    </label>
                    <input
                      id="edit_is_consolation"
                      type="checkbox"
                      checked={editingPrize?.is_consolation}
                      onChange={(e) =>
                        setEditingPrize({
                          ...editingPrize,
                          is_consolation: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
              ) : deletingPrize && deletingPrize.id === prize.id ? (
                <div>
                  <p className="text-lg font-semibold">
                    Tem certeza que deseja excluir o prêmio {prize.prize}?
                  </p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleDeletePrize(prize.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md mt-2"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setDeletingPrize(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md mt-2 ml-2"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
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
                        onClick={() => setDeletingPrize(prize)}
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
