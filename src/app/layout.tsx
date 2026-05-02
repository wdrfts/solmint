import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SolanaWalletProvider } from "@/components/WalletProvider";
import PremiumBackground from "@/components/PremiumBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SolMint — Crea Token Solana",
  description: "Crea il tuo token Solana in pochi click",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={`${inter.className} text-white min-h-screen`} style={{ background: "#07070f" }}>
        <PremiumBackground />
        <SolanaWalletProvider>
          <div style={{ position: "relative", zIndex: 1 }}>
            {children}
          </div>
        </SolanaWalletProvider>
      </body>
    </html>
  );
}