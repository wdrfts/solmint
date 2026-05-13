import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SolanaWalletProvider } from "@/components/WalletProvider";
import PremiumBackground from "@/components/PremiumBackground";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://solmint.space";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "SolMint Space — Solana Token Launcher",
    template: "%s | SolMint Space",
  },

  description:
    "Create Solana SPL tokens in minutes with AI meme ideas, trending token discovery, metadata, revoke authority tools and non-custodial liquidity management.",

  keywords: [
    "Solana token launcher",
    "create Solana token",
    "create SPL token",
    "Solana memecoin creator",
    "SPL token generator",
    "Solana token creator",
    "AI memecoin generator",
    "DexScreener Solana trending",
    "Raydium liquidity pool",
    "revoke mint authority",
    "revoke freeze authority",
    "SolMint Space",
  ],

  authors: [{ name: "SolMint Space" }],
  creator: "SolMint Space",
  publisher: "SolMint Space",

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    title: "SolMint Space — Solana Token Launcher",
    description:
      "Create Solana SPL tokens, discover live trends, generate AI meme ideas and prepare your launch with non-custodial tools.",
    url: siteUrl,
    siteName: "SolMint Space",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "SolMint Space — Solana Token Launcher",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SolMint Space — Solana Token Launcher",
    description:
      "Create Solana SPL tokens, discover trends and generate AI meme ideas before launching.",
    images: ["/og.svg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body
        className={`${inter.className} text-white min-h-screen`}
        style={{ background: "#07070f" }}
      >
        <PremiumBackground />
        <SolanaWalletProvider>
          <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
        </SolanaWalletProvider>
      </body>
    </html>
  );
}