import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solana Guides — SPL Tokens, Liquidity & Memecoin Launch",
  description:
    "Learn how to create Solana SPL tokens, manage revoke authority, launch liquidity pools, understand DexScreener trends and build safer memecoin launches.",

  alternates: {
    canonical: "/guides",
  },

  openGraph: {
    title: "Solana Guides — SPL Tokens, Liquidity & Memecoin Launch",
    description:
      "Practical guides for creating, launching and managing Solana SPL tokens with better branding, liquidity and trust.",
    url: "https://solmint.space/guides",
    siteName: "SolMint Space",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "SolMint Space Guides",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Solana Guides — SPL Tokens, Liquidity & Memecoin Launch",
    description:
      "Professional Solana guides for SPL tokens, liquidity pools, authority revokes and memecoin launches.",
    images: ["/og.svg"],
  },
};

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}