import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        azul: "url('../public/images/bgAzul.png')",
      },
      fontFamily: {
        sharp: ["SharpSans", "sans-serif"],
        sharpBold: ["SharpSans-Bold", "sans-serif"],
      },
      colors: {
        azul: "#4200F8",
        cinza: "#E6E6E6",
      },
    },
  },
  plugins: [],
};
export default config;
