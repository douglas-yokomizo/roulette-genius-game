import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const QuantityChart = ({ prizes }: { prizes: any[] }) => {
  const data = {
    labels: prizes.map((prize) => prize.prize),
    datasets: [
      {
        label: "Quantidade em Estoque",
        data: prizes.map((prize) => prize.quantity),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={data} />;
};
