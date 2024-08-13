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

export const drawPrize = (prizes: any[]) => {
  const activePrizes = prizes.filter((prize) => prize.active);
  const totalQuantity = activePrizes.reduce(
    (acc, prize) => acc + prize.quantity,
    0
  );
  const noPrizeProbability = totalQuantity > 0 ? 1 / (totalQuantity + 1) : 1;
  const prizeProbabilities = activePrizes.map((prize) => ({
    ...prize,
    probability: prize.quantity / (totalQuantity + 1),
  }));
  const random = Math.random();
  let accumulated = noPrizeProbability;
  if (random < accumulated) {
    return { prize: "No Prize", image_url: null };
  } else {
    for (let i = 0; i < prizeProbabilities.length; i++) {
      accumulated += prizeProbabilities[i].probability;
      if (random < accumulated) {
        return prizeProbabilities[i];
      }
    }
  }
  return { prize: "No Prize", image_url: null };
};
