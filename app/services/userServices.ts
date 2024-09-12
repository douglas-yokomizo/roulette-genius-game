import { supabase } from "@/app/utils/supabase/client";

export const fetchUserStatistics = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("id, created_at");

  if (error) {
    throw error;
  }

  const totalUsers = data.length;
  const usersByDay = data.reduce((acc: { [key: string]: number }, user) => {
    const date = new Date(user.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  return { totalUsers, usersByDay };
};

export const fetchParticipants = async (page: number, limit: number = 10) => {
    const { data, error } = await supabase
    .from("users")
    .select("id, name, email,whatsapp, bigScreenAgreement, comunicationAgreement")
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    throw error;
  }

  return data;
};