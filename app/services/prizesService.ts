import { supabase } from "../utils/supabase/client";

export const fetchPrizes = async () => {
  const { data, error } = await supabase.from("prizes").select("*");
  if (error) throw error;
  return data;
};

export const updatePrizeQuantity = async (id: number, quantity: number) => {
  const { data, error } = await supabase
    .from("prizes")
    .update({ quantity })
    .eq("id", id);
  if (error) throw error;
  return data;
};

export const drawPrize = (prizes: any[], distributedToday: number) => {
  const activePrizes = prizes.filter(
    (prize) =>
      prize.active &&
      prize.daily_limit > prize.distributed_today &&
      !prize.is_consolation
  );
  const totalQuantity = activePrizes.reduce(
    (acc, prize) => acc + prize.quantity,
    0
  );
  const prizeProbabilities = activePrizes.map((prize) => ({
    ...prize,
    probability: prize.quantity / totalQuantity,
  }));

  const random = Math.random();
  let accumulated = 0;
  for (let i = 0; i < prizeProbabilities.length; i++) {
    accumulated += prizeProbabilities[i].probability;
    if (random < accumulated) {
      return prizeProbabilities[i];
    }
  }
  return prizeProbabilities[prizeProbabilities.length - 1];
};

export const updateDistributedToday = async (
  id: number,
  distributedToday: number
) => {
  const { data, error } = await supabase
    .from("prizes")
    .update({ distributed_today: distributedToday })
    .eq("id", id);
  if (error) throw error;
  return data;
};

export const fetchConsolationPrize = async () => {
  const { data, error } = await supabase
    .from("prizes")
    .select("*")
    .eq("is_consolation", true)
    .single();
  if (error) throw error;
  return data;
};
