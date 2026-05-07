"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import TokenForm from "@/components/TokenForm";
import LiquidityPool from "@/components/LiquidityPool";


const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then(m => m.WalletMultiButton),
  { ssr: false }
);

type Lang = "IT" | "EN";
type NavLink = [string, string];

const NAV_LINKS: Record<Lang, NavLink[]> = {
  IT: [
    ["Features", "#features"],
    ["Come funziona", "#come-funziona"],
    ["Prezzi", "#prezzi"],
    ["FAQ", "#faq"],
    ["Trending", "/trending"],
    ["Guide", "/guides"],
    ["AI Meme", "/ai-meme"],
  ],
  EN: [
    ["Features", "#features"],
    ["How it works", "#come-funziona"],
    ["Pricing", "#prezzi"],
    ["FAQ", "#faq"],
    ["Trending", "/trending"],
    ["Guides", "/guides"],
    ["AI Meme", "/ai-meme"],
  ],
};

const TEXT = {
  IT: {
    brandSub: "Solana Token Launcher",
    launchApp: "Lancia App",
    mainnet: "Mainnet",
    createTab: "Crea Token",
    poolTab: "Liquidity Pool",
    appFooter: "SolMint Space — Non-custodial Token Launcher su Solana",

    heroBadge: "Trustless · Non-custodial · AI-powered",
    hero1: "Il modo più semplice",
    hero2: "per lanciare",
    hero3: "su Solana.",
    heroDesc:
      "Crea token SPL professionali in 60 secondi. Usa i trend Solana e l’AI Meme Generator per trovare la narrativa giusta prima di lanciare.",
    createToken: "Crea il tuo token",
    howItWorks: "Come funziona",
    generateAI: "Genera idea AI",
    heroNote: "Nessuna registrazione. Connetti Phantom, trova il trend e inizia.",

    statCreate: "Per creare un token",
    statSecure: "On-chain e non-custodial",

    aiBadge: "Trending + AI Meme",
    aiTitle1: "Non lanciare a caso.",
    aiTitle2: "Lancia sulla narrativa giusta.",
    aiDesc:
      "SolMint non è solo un token launcher: ti aiuta a trovare i trend Solana più forti, trasformarli in idee memecoin e lanciarle on-chain in pochi minuti.",

    builtOn: "Costruito su",
    featuresBadge: "Features",
    featuresTitle1: "Tutto quello",
    featuresTitle2: "che ti serve.",
    featuresDesc:
      "Una piattaforma completa per creare token professionali su Solana. Nessun compromesso.",

    howBadge: "Come funziona",
    howTitle1: "Quattro step.",
    howTitle2: "Token live.",

    pricingBadge: "Prezzi",
    pricingTitle1: "Trasparenti.",
    pricingTitle2: "Definitivi.",
    pricingDesc: "Paghi una volta. Nessun abbonamento. Nessuna sorpresa.",
    fee: "+ fee di rete (~0.01 SOL)",
    startNow: "Inizia ora",
    mostChosen: "Più scelto",

    faqBadge: "FAQ",
    faqTitle: "Hai domande?",

    ctaTitle1: "Pronto",
    ctaTitle2: "a lanciare?",
    ctaDesc:
      "Trova un trend, genera una meme idea con AI e crea il tuo token in meno di 60 secondi.",
    starterNote: "Piano Starter da 0.1 SOL + fee di rete",

    footerDesc:
      "Crea token SPL, prepara il lancio con strumenti AI e gestisci la liquidità in modo non-custodial su Solana.",
    product: "Product",
    resources: "Resources",
    support: "Supporto",
    privacy: "Privacy",
    terms: "Termini",
    rights: "Tutti i diritti riservati.",
    built: "Costruito su Solana.",
  },

  EN: {
    brandSub: "Solana Token Launcher",
    launchApp: "Launch App",
    mainnet: "Mainnet",
    createTab: "Create Token",
    poolTab: "Liquidity Pool",
    appFooter: "SolMint Space — Non-custodial Token Launcher on Solana",

    heroBadge: "Trustless · Non-custodial · AI-powered",
    hero1: "The easiest way",
    hero2: "to launch",
    hero3: "on Solana.",
    heroDesc:
      "Create professional SPL tokens in 60 seconds. Use Solana trends and the AI Meme Generator to find the right narrative before launching.",
    createToken: "Create your token",
    howItWorks: "How it works",
    generateAI: "Generate AI idea",
    heroNote: "No registration needed. Connect Phantom, find a trend and start.",

    statCreate: "To create a token",
    statSecure: "On-chain and non-custodial",

    aiBadge: "Trending + AI Meme",
    aiTitle1: "Don’t launch randomly.",
    aiTitle2: "Launch with the right narrative.",
    aiDesc:
      "SolMint is more than a token launcher: discover the strongest Solana trends, turn them into meme coin ideas and launch them on-chain in minutes.",

    builtOn: "Built on",
    featuresBadge: "Features",
    featuresTitle1: "Everything",
    featuresTitle2: "you need.",
    featuresDesc:
      "A complete platform to create professional tokens on Solana. No compromises.",

    howBadge: "How it works",
    howTitle1: "Four steps.",
    howTitle2: "Token live.",

    pricingBadge: "Pricing",
    pricingTitle1: "Transparent.",
    pricingTitle2: "Final.",
    pricingDesc: "Pay once. No subscriptions. No hidden fees.",
    fee: "+ network fee (~0.01 SOL)",
    startNow: "Get started",
    mostChosen: "Most popular",

    faqBadge: "FAQ",
    faqTitle: "Questions?",

    ctaTitle1: "Ready",
    ctaTitle2: "to launch?",
    ctaDesc:
      "Find a trend, generate an AI meme idea and create your token in under 60 seconds.",
    starterNote: "Starter plan from 0.1 SOL + network fee",

    footerDesc:
      "Create SPL tokens, prepare launches with AI tools and manage liquidity in a fully non-custodial way on Solana.",
    product: "Product",
    resources: "Resources",
    support: "Support",
    privacy: "Privacy",
    terms: "Terms",
    rights: "All rights reserved.",
    built: "Built on Solana.",
  },
};

const PARTNERS = ["Solana", "Metaplex", "Raydium", "Pinata", "Phantom", "Dexscreener", "Axiom", "Photon"];

const PartnerLogos: Record<string, ReactNode> = {
  Solana: (
    <svg width="22" height="18" viewBox="0 0 397 311" fill="none">
      <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zM64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8zM333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#solG)"/>
      <defs><linearGradient id="solG" x1="0" y1="0" x2="397" y2="311" gradientUnits="userSpaceOnUse"><stop stopColor="#9945FF"/><stop offset="1" stopColor="#14F195"/></linearGradient></defs>
    </svg>
  ),
  Metaplex: (
    <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="16" fill="url(#metG)"/>
      <path d="M17 45V19h8l7 11 7-11h8v26h-8V32l-7 10-7-10v13h-8z" fill="white"/>
      <defs><linearGradient id="metG" x1="0" y1="0" x2="64" y2="64"><stop stopColor="#FF4ECD"/><stop offset="0.5" stopColor="#875CFF"/><stop offset="1" stopColor="#00E7FF"/></linearGradient></defs>
    </svg>
  ),
  Raydium: (
    <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="16" fill="#10172A"/>
      <path d="M18 18h20c8.3 0 14 5.4 14 13.1 0 6-3.4 10.5-8.8 12.2L53 53H40.5l-8.8-9.1H29V53H18V18zm11 9.6v7.9h8.4c2.5 0 4.1-1.6 4.1-4s-1.6-3.9-4.1-3.9H29z" fill="#22D3EE"/>
    </svg>
  ),
  Pinata: (
    <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="16" fill="#6D28D9"/>
      <path d="M32 10c8 0 14 6 14 14 0 10-14 30-14 30S18 34 18 24c0-8 6-14 14-14z" fill="#FDE047"/>
      <circle cx="32" cy="24" r="6" fill="#6D28D9"/>
    </svg>
  ),
  Phantom: (
    <svg width="22" height="22" viewBox="0 0 128 128" fill="none">
      <rect width="128" height="128" rx="28" fill="#AB9FF2"/>
      <path d="M64 20c25 0 45 19.2 45 43 0 23.7-20 43-45 43H39c-6.5 0-10.2-7.5-6.1-12.5l6.3-7.7C27.3 78.4 19 66.6 19 53c0-18.2 15.3-33 34.2-33H64z" fill="#4C43B8"/>
      <circle cx="48" cy="57" r="6" fill="white"/>
      <circle cx="78" cy="57" r="6" fill="white"/>
    </svg>
  ),
  Dexscreener: (
    <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="16" fill="#050505"/>
      <path d="M12 45l11-17 9 12 9-22 11 27" stroke="#00D4AA" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="44" cy="26" r="5" fill="#00D4AA"/>
    </svg>
  ),
  Axiom: (
    <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="16" fill="#0B0B0F"/>
      <path d="M14 49L32 14l18 35H14z" stroke="white" strokeWidth="4.5" strokeLinejoin="round"/>
      <path d="M23 39h18" stroke="#14F195" strokeWidth="4.5" strokeLinecap="round"/>
    </svg>
  ),
  Photon: (
    <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="16" fill="#111827"/>
      <circle cx="32" cy="32" r="10" fill="#FFD700"/>
      <circle cx="32" cy="32" r="20" stroke="#FFD700" strokeWidth="3" opacity="0.45"/>
      <path d="M32 6v10M32 48v10M6 32h10M48 32h10" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  ),
};

const DATA = {
  IT: {
    features: [
      { num: "01", icon: "◎", title: "Token SPL nativi", desc: "Token creati direttamente on-chain. Nessun intermediario, nessun database. Solo tu e la blockchain.", tag: "On-chain", color: "#9945FF" },
      { num: "02", icon: "📁", title: "Metadata permanenti", desc: "Logo, nome, simbolo e link salvati su IPFS tramite Pinata. Immutabili, decentralizzati, permanenti.", tag: "IPFS", color: "#14F195" },
      { num: "03", icon: "🔒", title: "Revoke authorities", desc: "Rendi il tuo token trustless revocando Mint, Freeze e Update authority in un solo click.", tag: "Sicurezza", color: "#9945FF" },
      { num: "04", icon: "⚡", title: "Lancio rapido", desc: "Configura, firma e crea il tuo token SPL in un flusso semplice, pulito e pensato per creator e builder.", tag: "Fast launch", color: "#14F195" },
      { num: "05", icon: "💧", title: "Liquidity Pool", desc: "Crea e gestisci pool su Raydium CPMM con fee tier personalizzabili. Rimuovi liquidità quando vuoi.", tag: "Raydium", color: "#9945FF" },
      { num: "06", icon: "🛡", title: "100% non-custodial", desc: "Non custodiamo mai i tuoi fondi. Nessuna chiave privata, nessun rischio controparte. Mai.", tag: "Safe", color: "#14F195" },
    ],
    steps: [
      { n: "1", title: "Connetti il wallet", desc: "Apri Phantom o Solflare. Un click e sei dentro. Nessun account, nessuna email, nessuna verifica.", tag: "Phantom · Solflare", color: "#9945FF" },
      { n: "2", title: "Configura il token", desc: "Nome, simbolo, supply, decimali, logo, link social. Scegli se revocare le authority per renderlo trustless.", tag: "Meno di 60 secondi", color: "#14F195" },
      { n: "3", title: "Firma e ricevi il token", desc: "Conferma la transazione con Phantom. Il token viene creato on-chain e arriva direttamente nel tuo wallet.", tag: "Immediato", color: "#9945FF" },
      { n: "4", title: "Prepara il lancio", desc: "Usa trend, AI e liquidity tools per organizzare il lancio in modo più chiaro, ordinato e professionale.", tag: "Launch ready", color: "#14F195" },
    ],
    aiCards: [
      { icon: "🔥", title: "Scopri cosa sta pumpando", desc: "Analizza i token Solana trending in tempo reale e capisci quali narrative stanno attirando volume, market cap e attenzione.", href: "/trending", cta: "Vedi Trending", color: "#14F195" },
      { icon: "🤖", title: "Genera idee meme con AI", desc: "Usa i trend reali del momento per creare nome, simbolo, descrizione, strategia e prompt immagine per la tua prossima memecoin.", href: "/ai-meme", cta: "Apri AI Meme", color: "#9945FF" },
      { icon: "🚀", title: "Da idea a token live", desc: "Trova la narrativa, genera il concept, crea il token SPL e prepara il lancio. Tutto nello stesso ecosistema.", href: "?app=true", cta: "Crea Token", color: "#14F195" },
    ],
    faq: [
      { q: "SolMint è sicuro?", a: "Sì. SolMint non ha mai accesso alle tue chiavi private. Tutto avviene tramite il tuo wallet Phantom. Il codice è open source e verificabile." },
      { q: "Cosa significa revocare le authority?", a: "Revocare la Mint Authority significa che nessuno può più creare nuovi token. Revocare la Freeze Authority significa che nessuno può congelare i wallet degli holder. Revocare la Update Authority rende i metadata immutabili." },
      { q: "Quanto costa creare un token?", a: "Il piano Starter costa 0.1 SOL + fee di rete. Il piano Standard costa 0.2 SOL e include 1 revoke a scelta. Il piano Pro costa 0.4 SOL con tutte e 3 le revoke incluse." },
      { q: "Posso creare una liquidity pool?", a: "Sì. Puoi usare la sezione Liquidity Pool per creare e gestire liquidità su Raydium, mantenendo sempre il controllo dal tuo wallet." },
      { q: "Posso rimuovere la liquidità dopo?", a: "Sì. Puoi rimuovere tutta o parte della liquidità in qualsiasi momento dalla sezione Liquidity Pool." },
      { q: "Hai bisogno di aiuto?", a: "Scrivici a info@solmint.space — rispondiamo entro 24 ore." },
    ],
    pricing: [
      { name: "Starter", price: "0.1", badge: null, highlight: false, features: ["Token SPL on-chain", "Metadata su IPFS", "Logo + link social", "Pronto per creare liquidità"] },
      { name: "Standard", price: "0.2", badge: "Più scelto", highlight: true, features: ["Tutto di Starter", "1 revoke a scelta", "Mint / Freeze / Update", "Priorità di elaborazione"] },
      { name: "Pro", price: "0.4", badge: null, highlight: false, features: ["Tutto di Standard", "Tutte e 3 le revoke", "Token 100% trustless", "Supporto prioritario"] },
    ],
  },

  EN: {
    features: [
      { num: "01", icon: "◎", title: "Native SPL tokens", desc: "Tokens created directly on-chain. No intermediaries, no database. Just you and the blockchain.", tag: "On-chain", color: "#9945FF" },
      { num: "02", icon: "📁", title: "Permanent metadata", desc: "Logo, name, symbol and links stored on IPFS through Pinata. Immutable, decentralized and permanent.", tag: "IPFS", color: "#14F195" },
      { num: "03", icon: "🔒", title: "Revoke authorities", desc: "Make your token trustless by revoking Mint, Freeze and Update authority in one flow.", tag: "Security", color: "#9945FF" },
      { num: "04", icon: "⚡", title: "Fast launch", desc: "Configure, sign and create your SPL token through a clean flow built for creators and builders.", tag: "Fast launch", color: "#14F195" },
      { num: "05", icon: "💧", title: "Liquidity Pool", desc: "Create and manage Raydium CPMM pools with customizable fee tiers. Remove liquidity whenever you want.", tag: "Raydium", color: "#9945FF" },
      { num: "06", icon: "🛡", title: "100% non-custodial", desc: "We never custody your funds. No private keys, no counterparty risk. Ever.", tag: "Safe", color: "#14F195" },
    ],
    steps: [
      { n: "1", title: "Connect your wallet", desc: "Open Phantom or Solflare. One click and you are in. No account, no email, no verification.", tag: "Phantom · Solflare", color: "#9945FF" },
      { n: "2", title: "Configure the token", desc: "Name, symbol, supply, decimals, logo and social links. Choose whether to revoke authorities.", tag: "Under 60 seconds", color: "#14F195" },
      { n: "3", title: "Sign and receive", desc: "Confirm the transaction with Phantom. The token is created on-chain and sent directly to your wallet.", tag: "Instant", color: "#9945FF" },
      { n: "4", title: "Prepare the launch", desc: "Use trends, AI and liquidity tools to organize your launch in a clearer and more professional way.", tag: "Launch ready", color: "#14F195" },
    ],
    aiCards: [
      { icon: "🔥", title: "Discover what is trending", desc: "Analyze trending Solana tokens in real time and understand which narratives are attracting volume, market cap and attention.", href: "/trending", cta: "View Trending", color: "#14F195" },
      { icon: "🤖", title: "Generate meme ideas with AI", desc: "Use real market trends to create a name, symbol, description, strategy and image prompt for your next meme coin.", href: "/ai-meme", cta: "Open AI Meme", color: "#9945FF" },
      { icon: "🚀", title: "From idea to live token", desc: "Find the narrative, generate the concept, create the SPL token and prepare the launch in one ecosystem.", href: "?app=true", cta: "Create Token", color: "#14F195" },
    ],
    faq: [
      { q: "Is SolMint safe?", a: "Yes. SolMint never has access to your private keys. Everything happens through your Phantom wallet." },
      { q: "What does revoking authorities mean?", a: "Revoking Mint Authority means no one can create more tokens. Revoking Freeze Authority means no one can freeze holder wallets. Revoking Update Authority makes metadata immutable." },
      { q: "How much does it cost to create a token?", a: "The Starter plan costs 0.1 SOL + network fees. Standard costs 0.2 SOL and includes 1 revoke. Pro costs 0.4 SOL with all 3 revokes included." },
      { q: "Can I create a liquidity pool?", a: "Yes. You can use the Liquidity Pool section to create and manage liquidity on Raydium while keeping full wallet control." },
      { q: "Can I remove liquidity later?", a: "Yes. You can remove all or part of your liquidity whenever you want from the Liquidity Pool section." },
      { q: "Need help?", a: "Contact us at info@solmint.space — we reply within 24 hours." },
    ],
    pricing: [
      { name: "Starter", price: "0.1", badge: null, highlight: false, features: ["On-chain SPL token", "Metadata on IPFS", "Logo + social links", "Ready for liquidity"] },
      { name: "Standard", price: "0.2", badge: "Most popular", highlight: true, features: ["Everything in Starter", "1 revoke included", "Mint / Freeze / Update", "Priority processing"] },
      { name: "Pro", price: "0.4", badge: null, highlight: false, features: ["Everything in Standard", "All 3 revokes", "100% trustless token", "Priority support"] },
    ],
  },
};

function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="url(#mainLg)" />
      <circle cx="16" cy="16" r="6" stroke="white" strokeWidth="2" fill="none" />
      <path d="M16 10V8M16 24v-2M10 16H8M24 16h-2" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="mainLg" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#9945FF" />
          <stop offset="1" stopColor="#14F195" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b cursor-pointer group" style={{ borderColor: "rgba(255,255,255,0.08)" }} onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between py-6 gap-4">
        <span className="text-white font-semibold text-base">{q}</span>
        <span className="text-xl flex-shrink-0 transition-all duration-200" style={{ color: open ? "#9945FF" : "rgba(255,255,255,0.3)", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>
          +
        </span>
      </div>

      {open && (
        <p className="text-sm leading-relaxed pb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
          {a}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState("create");
  const [showApp, setShowApp] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("IT");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = TEXT[lang];
  const data = DATA[lang];
  const navLinks = NAV_LINKS[lang];

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("app=true")) {
      setShowApp(true);
    }
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (showApp) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    const ps = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.3,
      o: Math.random() * 0.3 + 0.05,
    }));

    let id: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ps.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(153,69,255,${p.o})`;
        ctx.fill();
      });

      id = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(id);
    };
  }, [showApp]);

  if (showApp) {
    return (
      <main className="min-h-screen" style={{ background: "transparent" }}>
        <header className="border-b px-4 sm:px-6 py-4 sticky top-0 z-50" style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(7,7,15,0.98)", backdropFilter: "blur(20px)" }}>
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 cursor-pointer group min-w-0" onClick={() => setShowApp(false)}>
              <Logo size={30} />
              <span className="font-black text-white tracking-tight truncate">SolMint Space</span>
              <span className="hidden sm:inline-flex text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "rgba(20,241,149,0.1)", color: "#14F195", border: "1px solid rgba(20,241,149,0.25)" }}>
                {t.mainnet}
              </span>
            </div>

            <WalletMultiButton
              style={{
                background: "linear-gradient(135deg, #9945FF, #14F195)",
                borderRadius: "10px",
                fontSize: "13px",
                padding: "8px 16px",
                height: "auto",
                fontFamily: "inherit",
              }}
            />
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-2">
          <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <button onClick={() => setTab("create")} className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all" style={tab === "create" ? { background: "linear-gradient(135deg, #9945FF, #14F195)", color: "white" } : { color: "rgba(255,255,255,0.4)" }}>
              {t.createTab}
            </button>

            <button onClick={() => setTab("pool")} className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all" style={tab === "pool" ? { background: "linear-gradient(135deg, #9945FF, #14F195)", color: "white" } : { color: "rgba(255,255,255,0.4)" }}>
              {t.poolTab}
            </button>
          </div>
        </div>

        {tab === "create" ? <TokenForm /> : <LiquidityPool />}

        <footer className="text-center py-10 text-xs" style={{ color: "rgba(255,255,255,0.12)" }}>
          {t.appFooter}
        </footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: "#07070f", color: "white" }}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(153,69,255,0.16) 0%, transparent 38%), radial-gradient(circle at 85% 28%, rgba(20,241,149,0.10) 0%, transparent 34%), radial-gradient(circle at 15% 45%, rgba(153,69,255,0.10) 0%, transparent 32%), linear-gradient(180deg, #07070f 0%, #090914 45%, #050509 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(circle at center, black 0%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 0%, transparent 72%)",
          }}
        />
      </div>

      <nav
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 transition-all duration-300"
        style={{
          background: scrolled || mobileMenuOpen ? "rgba(7,7,15,0.82)" : "transparent",
          backdropFilter: scrolled || mobileMenuOpen ? "blur(26px)" : "none",
          WebkitBackdropFilter: scrolled || mobileMenuOpen ? "blur(26px)" : "none",
          borderBottom: scrolled || mobileMenuOpen ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
        }}
      >
        <div
          className="max-w-6xl mx-auto flex items-center justify-between gap-3 rounded-2xl lg:rounded-full transition-all duration-300"
          style={{
            padding: scrolled || mobileMenuOpen ? "10px 12px" : "0px",
            background: scrolled || mobileMenuOpen ? "rgba(255,255,255,0.035)" : "transparent",
            border: scrolled || mobileMenuOpen ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
          }}
        >
          <a href="/" className="flex items-center gap-3 min-w-0">
            <Logo size={34} />
            <div className="leading-tight min-w-0">
              <span className="block font-black text-lg sm:text-xl tracking-tight truncate">SolMint Space</span>
              <span className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.28)" }}>
                {t.brandSub}
              </span>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-1 px-2 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {navLinks.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="px-3 py-2 rounded-full text-sm font-semibold transition-all"
                style={{ color: "rgba(255,255,255,0.52)" }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.52)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button onClick={() => setLang(lang === "IT" ? "EN" : "IT")} className="flex items-center gap-1 p-1 rounded-full text-xs font-black" style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.1)" }}>
              {(["IT", "EN"] as Lang[]).map(code => (
                <span key={code} className="px-3 py-1.5 rounded-full transition-all" style={{ color: lang === code ? "white" : "rgba(255,255,255,0.35)", background: lang === code ? "linear-gradient(135deg, #9945FF, #14F195)" : "transparent" }}>
                  {code}
                </span>
              ))}
            </button>

            <button onClick={() => setShowApp(true)} className="px-5 py-2.5 rounded-full text-sm font-black text-white transition-all hover:opacity-90 hover:scale-105" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", boxShadow: "0 12px 35px rgba(153,69,255,0.26)" }}>
              {t.launchApp}
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-11 h-11 rounded-2xl flex items-center justify-center transition-all" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} aria-label="Apri menu">
            <span className="relative w-5 h-4 block">
              <span className="absolute left-0 top-0 w-5 h-0.5 bg-white transition-all duration-300" style={{ transform: mobileMenuOpen ? "translateY(7px) rotate(45deg)" : "none" }} />
              <span className="absolute left-0 top-2 w-5 h-0.5 bg-white transition-all duration-300" style={{ opacity: mobileMenuOpen ? 0 : 1 }} />
              <span className="absolute left-0 bottom-0 w-5 h-0.5 bg-white transition-all duration-300" style={{ transform: mobileMenuOpen ? "translateY(-7px) rotate(-45deg)" : "none" }} />
            </span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden max-w-6xl mx-auto pt-4">
            <div className="rounded-[28px] p-4" style={{ background: "rgba(10,10,22,0.96)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 28px 90px rgba(0,0,0,0.55)" }}>
              <div className="grid gap-2">
                {navLinks.map(([label, href]) => (
                  <a key={label} href={href} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-bold transition-all" style={{ color: "rgba(255,255,255,0.84)", background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.055)" }}>
                    {label}
                    <span style={{ color: "rgba(255,255,255,0.24)" }}>→</span>
                  </a>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button onClick={() => setLang(lang === "IT" ? "EN" : "IT")} className="rounded-2xl p-1 text-xs font-black" style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <span className="grid grid-cols-2 gap-1">
                    {(["IT", "EN"] as Lang[]).map(code => (
                      <span key={code} className="py-2 rounded-xl" style={{ color: lang === code ? "white" : "rgba(255,255,255,0.35)", background: lang === code ? "linear-gradient(135deg, #9945FF, #14F195)" : "transparent" }}>
                        {code}
                      </span>
                    ))}
                  </span>
                </button>

                <button onClick={() => { setMobileMenuOpen(false); setShowApp(true); }} className="py-3 rounded-2xl text-sm font-black text-white" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", boxShadow: "0 18px 45px rgba(153,69,255,0.26)" }}>
                  {t.launchApp}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <section className="relative pt-36 sm:pt-40 lg:pt-48 pb-20 sm:pb-24 lg:pb-28 px-4 sm:px-6 text-center" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex flex-wrap justify-center items-center gap-2 px-4 py-2 rounded-full text-[11px] sm:text-xs font-semibold mb-8 sm:mb-10 lg:mb-12" style={{ background: "rgba(153,69,255,0.1)", border: "1px solid rgba(153,69,255,0.2)", color: "rgba(255,255,255,0.65)", boxShadow: "0 0 35px rgba(153,69,255,0.1)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#14F195", boxShadow: "0 0 8px #14F195" }} />
            {t.heroBadge}
          </div>

          <h1 className="font-black mb-6 sm:mb-8 leading-[0.94]" style={{ fontSize: "clamp(48px, 10vw, 104px)", letterSpacing: "-0.055em" }}>
            <span style={{ color: "rgba(255,255,255,0.95)" }}>{t.hero1}</span>
            <br />
            <span style={{ background: "linear-gradient(90deg, #9945FF 0%, #14F195 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.hero2}</span>
            <br />
            <span style={{ color: "rgba(255,255,255,0.95)" }}>{t.hero3}</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 lg:mb-12 mx-auto leading-relaxed px-1" style={{ color: "rgba(255,255,255,0.44)", maxWidth: 680 }}>
            {t.heroDesc}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-xl sm:max-w-none mx-auto">
            <button onClick={() => setShowApp(true)} className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-2xl text-base font-black text-white transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", boxShadow: "0 0 50px rgba(153,69,255,0.35)" }}>
              {t.createToken}
            </button>

            <a href="#come-funziona" className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-2xl text-base font-semibold transition-all hover:scale-105" style={{ color: "rgba(255,255,255,0.68)", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
              {t.howItWorks}
            </a>

            <a href="/ai-meme" className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-2xl text-base font-semibold transition-all hover:scale-105" style={{ color: "#14F195", border: "1px solid rgba(20,241,149,0.18)", background: "rgba(20,241,149,0.05)" }}>
              {t.generateAI}
            </a>
          </div>

          <p className="text-xs mt-6" style={{ color: "rgba(255,255,255,0.18)" }}>
            {t.heroNote}
          </p>
        </div>
      </section>

      <section className="relative px-4 sm:px-6 py-8" style={{ zIndex: 1 }}>
        <div className="max-w-2xl mx-auto grid grid-cols-2 gap-px rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          {[
            { val: "60s", label: t.statCreate },
            { val: "100%", label: t.statSecure },
          ].map(s => (
            <div key={s.label} className="text-center py-8 sm:py-10 px-4" style={{ background: "#07070f" }}>
              <div className="text-3xl sm:text-4xl font-black mb-2" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {s.val}
              </div>
              <div className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative px-4 sm:px-6 py-20" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: "#14F195" }}>{t.aiBadge}</p>
            <h2 className="font-black leading-tight mb-5" style={{ fontSize: "clamp(34px, 5vw, 58px)", letterSpacing: "-0.03em" }}>{t.aiTitle1}<br />{t.aiTitle2}</h2>
            <p className="mx-auto text-base md:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.42)", maxWidth: 680 }}>{t.aiDesc}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {data.aiCards.map(item => (
              <a key={item.title} href={item.href} className="group p-8 rounded-3xl transition-all hover:scale-105" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)", textDecoration: "none" }}>
                <div className="text-4xl mb-7">{item.icon}</div>
                <h3 className="text-xl font-black mb-3 text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed mb-7" style={{ color: "rgba(255,255,255,0.42)" }}>{item.desc}</p>
                <span className="inline-flex items-center gap-2 text-sm font-black transition-all group-hover:gap-3" style={{ color: item.color }}>{item.cta}<span>→</span></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 sm:px-6 py-24" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-black mb-12 tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.18)" }}>{t.builtOn}</p>
          <div className="flex flex-wrap justify-center gap-4">
            {PARTNERS.map(name => (
              <div key={name} className="flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all hover:scale-105 hover:border-purple-500" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {PartnerLogos[name]}
                <span className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.8)" }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="relative px-4 sm:px-6 py-28" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 max-w-xl">
            <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: "#9945FF" }}>{t.featuresBadge}</p>
            <h2 className="font-black leading-tight mb-5" style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.03em" }}>{t.featuresTitle1}<br />{t.featuresTitle2}</h2>
            <p style={{ color: "rgba(255,255,255,0.38)", lineHeight: 1.7 }}>{t.featuresDesc}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.features.map(f => (
              <div key={f.num} className="p-8 rounded-3xl transition-all hover:scale-105 hover:border-purple-500" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-2xl">{f.icon}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black" style={{ color: "rgba(255,255,255,0.1)" }}>{f.num}</span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: `rgba(${f.color === "#9945FF" ? "153,69,255" : "20,241,149"},0.1)`, color: f.color, border: `1px solid rgba(${f.color === "#9945FF" ? "153,69,255" : "20,241,149"},0.2)` }}>{f.tag}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="come-funziona" className="relative px-4 sm:px-6 py-28" style={{ zIndex: 1, background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: "#14F195" }}>{t.howBadge}</p>
            <h2 className="font-black leading-tight" style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.03em" }}>{t.howTitle1}<br />{t.howTitle2}</h2>
          </div>

          <div className="space-y-5">
            {data.steps.map((s, i) => (
              <div key={s.n} className="flex flex-col sm:flex-row gap-5 sm:gap-6 md:gap-10 items-start p-6 sm:p-8 rounded-3xl transition-all hover:scale-[1.01]" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0" style={{ background: `linear-gradient(135deg, ${i % 2 === 0 ? "#9945FF, #7b35d0" : "#0fa872, #14F195"})`, boxShadow: `0 0 30px rgba(${i % 2 === 0 ? "153,69,255" : "20,241,149"},0.25)` }}>{s.n}</div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold">{s.title}</h3>
                    <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: `rgba(${i % 2 === 0 ? "153,69,255" : "20,241,149"},0.1)`, color: s.color, border: `1px solid rgba(${i % 2 === 0 ? "153,69,255" : "20,241,149"},0.2)` }}>{s.tag}</span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.42)", lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="prezzi" className="relative px-4 sm:px-6 py-28" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: "#9945FF" }}>{t.pricingBadge}</p>
            <h2 className="font-black leading-tight mb-5" style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.03em" }}>{t.pricingTitle1}<br />{t.pricingTitle2}</h2>
            <p style={{ color: "rgba(255,255,255,0.35)" }}>{t.pricingDesc}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {data.pricing.map(p => (
              <div key={p.name} className="rounded-3xl p-8 relative overflow-hidden transition-all hover:scale-105" style={p.highlight ? { background: "linear-gradient(135deg, rgba(153,69,255,0.12), rgba(20,241,149,0.06))", border: "1.5px solid rgba(153,69,255,0.35)", boxShadow: "0 0 60px rgba(153,69,255,0.12)" } : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {p.badge && <div className="absolute top-0 right-0 text-xs font-black px-4 py-2 rounded-bl-2xl rounded-tr-3xl" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", color: "white" }}>{p.badge}</div>}
                <p className="text-sm font-semibold mb-6" style={{ color: "rgba(255,255,255,0.35)" }}>{p.name}</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-black" style={{ fontSize: 52, background: p.highlight ? "linear-gradient(135deg, #9945FF, #14F195)" : "white", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{p.price}</span>
                  <span className="text-2xl font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>SOL</span>
                </div>
                <p className="text-xs mb-8" style={{ color: "rgba(255,255,255,0.2)" }}>{t.fee}</p>
                <div className="space-y-3 mb-8">
                  {p.features.map(f => (
                    <div key={f} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(20,241,149,0.12)", border: "1px solid rgba(20,241,149,0.25)" }}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#14F195" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <span style={{ color: "rgba(255,255,255,0.7)" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowApp(true)} className="w-full py-4 rounded-2xl text-sm font-bold transition-all hover:opacity-90" style={p.highlight ? { background: "linear-gradient(135deg, #9945FF, #14F195)", color: "white" } : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {t.startNow}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="relative px-4 sm:px-6 py-28" style={{ zIndex: 1, background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: "#14F195" }}>{t.faqBadge}</p>
            <h2 className="font-black leading-tight" style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.03em" }}>{t.faqTitle}</h2>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {data.faq.map(faq => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      <section className="relative px-4 sm:px-6 py-28" style={{ zIndex: 1 }}>
        <div className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(153,69,255,0.12) 0%, rgba(20,241,149,0.06) 100%)", border: "1px solid rgba(153,69,255,0.2)" }}>
          <div className="absolute inset-0 rounded-3xl" style={{ background: "radial-gradient(circle at 50% -20%, rgba(153,69,255,0.2) 0%, transparent 60%)" }} />
          <div className="relative">
            <h2 className="font-black leading-tight mb-6" style={{ fontSize: "clamp(36px, 6vw, 72px)", letterSpacing: "-0.03em" }}>{t.ctaTitle1}<br />{t.ctaTitle2}</h2>
            <p className="text-base sm:text-lg mb-10 mx-auto" style={{ color: "rgba(255,255,255,0.4)", maxWidth: 460 }}>{t.ctaDesc}</p>
            <button onClick={() => setShowApp(true)} className="w-full sm:w-auto px-10 sm:px-12 py-5 rounded-2xl text-lg font-black text-white transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", boxShadow: "0 0 70px rgba(153,69,255,0.4)" }}>
              {t.createToken}
            </button>
            <p className="text-xs mt-6" style={{ color: "rgba(255,255,255,0.18)" }}>{t.starterNote}</p>
          </div>
        </div>
      </section>

      <footer className="relative px-4 sm:px-6 py-16" style={{ zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="rounded-[32px] p-6 sm:p-8 lg:p-10" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 90px rgba(0,0,0,0.28)" }}>
            <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <Logo size={34} />
                  <div>
                    <div className="font-black text-white text-lg">SolMint Space</div>
                    <div className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.25)" }}>{t.brandSub}</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed max-w-sm" style={{ color: "rgba(255,255,255,0.42)" }}>{t.footerDesc}</p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {["Non-custodial", "On-chain", "AI-powered"].map(item => (
                    <span key={item} className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ color: "rgba(255,255,255,0.62)", background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.08)" }}>{item}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black mb-4 text-white">{t.product}</h3>
                <div className="grid gap-3">
                  {navLinks.slice(0, 4).map(([label, href]) => (
                    <a key={label} href={href} className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.36)" }}>{label}</a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black mb-4 text-white">{t.resources}</h3>
                <div className="grid gap-3">
                  {navLinks.slice(4).map(([label, href]) => (
                    <a key={label} href={href} className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.36)" }}>{label}</a>
                  ))}
                  <a href="mailto:info@solmint.space" className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.36)" }}>{t.support}</a>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black mb-4 text-white">Contact</h3>
                <a href="mailto:info@solmint.space" className="inline-flex items-center gap-2 text-sm font-bold px-4 py-3 rounded-2xl transition-all hover:scale-105" style={{ color: "#14F195", background: "rgba(20,241,149,0.06)", border: "1px solid rgba(20,241,149,0.16)" }}>
                  info@solmint.space <span>→</span>
                </a>
                <div className="flex gap-4 mt-6">
                  <a href="/privacy" className="text-xs transition-colors" style={{ color: "rgba(255,255,255,0.28)" }}>{t.privacy}</a>
                  <a href="/terms" className="text-xs transition-colors" style={{ color: "rgba(255,255,255,0.28)" }}>{t.terms}</a>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: "rgba(255,255,255,0.16)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <span>© 2026 SolMint Space. {t.rights}</span>
              <span>{t.built}</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}