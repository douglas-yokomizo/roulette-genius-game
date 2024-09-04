import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "./context/GameContext";
import ToastProvider from "./components/ToastProvider";

export const metadata: Metadata = {
  title: "C&A Rock in Rio 2024",
  description: "Look oficial do Rock in Rio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GameProvider>
      <html lang="en">
        <body>
          <ToastProvider>{children}</ToastProvider>
        </body>
      </html>
    </GameProvider>
  );
}
