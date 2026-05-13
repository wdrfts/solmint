"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import TokenForm from "@/components/TokenForm";
import LiquidityPool from "@/components/LiquidityPool";
import { GUIDES } from "@/data/guides";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((m) => m.WalletMultiButton),
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
    ["AI Website", "/ai-website"],
  ],
  EN: [
    ["Features", "#features"],
    ["How it works", "#come-funziona"],
    ["Pricing", "#prezzi"],
    ["FAQ", "#faq"],
    ["Trending", "/trending"],
    ["Guides", "/guides"],
    ["AI Website", "/ai-website"],
  ],
};

const TEXT: Record<Lang, Record<string, string>> = {
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
      "Crea token SPL professionali in 60 secondi. Usa trend, AI e strumenti launch-ready per trasformare una narrativa in un progetto reale.",
    createToken: "Crea il tuo token",
    howItWorks: "Come funziona",
    generateAI: "Genera idea AI",
    generateWebsite: "Genera sito coin",
    heroNote: "Nessuna registrazione. Connetti Phantom, configura e lancia.",

    trusted: "Trusted by creators",
    statTokens: "Token creati",
    statCreators: "Creator attivi",
    statSolana: "Blockchain",
    statUptime: "Uptime",

    aiBadge: "Trending + AI Meme",
    aiTitle1: "Non lanciare a caso.",
    aiTitle2: "Lancia sulla narrativa giusta.",
    aiDesc:
      "SolMint ti aiuta a trovare trend, generare idee memecoin e passare da concept a token live nello stesso ecosistema.",

    websiteBadge: "Nuova feature",
    websiteTitle1: "Crea anche il sito",
    websiteTitle2: "per la tua coin.",
    websiteDesc:
      "Dopo il token, genera una landing page professionale per la tua memecoin: hero, tokenomics, roadmap, community, FAQ e social link. Preview immediata, pronta da pubblicare.",
    websitePrice: "0.2 SOL",
    websiteCta: "Crea sito AI",

    builtOn: "Costruito sul migliore ecosistema",
    featuresBadge: "Features",
    featuresTitle1: "Tutto quello",
    featuresTitle2: "che ti serve.",
    featuresDesc:
      "Una piattaforma completa per creare token professionali su Solana. Nessun compromesso.",

    howBadge: "Come funziona",
    howTitle1: "Quattro step.",
    howTitle2: "Token live.",

    guidesBadge: "Guides",
    guidesTitle: "Impara Solana senza perdere settimane",
    guidesDesc:
      "Guide pratiche su token SPL, liquidity pool, branding, authority, DexScreener e lanci memecoin.",
    guidesAll: "Vai a tutte le guide",

    compareBadge: "Comparison",
    compareTitle: "Perché usare SolMint?",
    compareDesc: "Token creation professionale senza codice, senza caos e senza tool sparsi.",
    compareCta: "Inizia ora",

    pricingBadge: "Prezzi",
    pricingTitle1: "Trasparenti.",
    pricingTitle2: "Definitivi.",
    pricingDesc: "Paghi una volta. Nessun abbonamento. Nessuna sorpresa.",
    fee: "+ fee di rete (~0.01 SOL)",
    startNow: "Inizia ora",

    reviewsBadge: "Reviews",
    reviewsTitle: "Creato per chi vuole lanciare seriamente.",
    reviewsDesc: "Un flow più chiaro per creator, builder e community founder.",

    faqBadge: "FAQ",
    faqTitle: "Hai domande?",

    ctaTitle1: "Pronto",
    ctaTitle2: "a lanciare?",
    ctaDesc:
      "Crea il token, genera la narrativa, prepara il sito e porta il progetto live su Solana.",
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
      "Create professional SPL tokens in 60 seconds. Use trends, AI and launch-ready tools to turn a narrative into a real project.",
    createToken: "Create your token",
    howItWorks: "How it works",
    generateAI: "Generate AI idea",
    generateWebsite: "Generate coin website",
    heroNote: "No registration needed. Connect Phantom, configure and launch.",

    trusted: "Trusted by creators",
    statTokens: "Tokens created",
    statCreators: "Active creators",
    statSolana: "Blockchain",
    statUptime: "Uptime",

    aiBadge: "Trending + AI Meme",
    aiTitle1: "Don’t launch randomly.",
    aiTitle2: "Launch with the right narrative.",
    aiDesc:
      "SolMint helps you discover trends, generate meme coin ideas and move from concept to live token in one ecosystem.",

    websiteBadge: "New feature",
    websiteTitle1: "Create the website",
    websiteTitle2: "for your coin too.",
    websiteDesc:
      "After launching your token, generate a professional landing page for your memecoin: hero, tokenomics, roadmap, community, FAQ and social links. Instant preview, ready to publish.",
    websitePrice: "0.2 SOL",
    websiteCta: "Create AI website",

    builtOn: "Built on the best ecosystem",
    featuresBadge: "Features",
    featuresTitle1: "Everything",
    featuresTitle2: "you need.",
    featuresDesc:
      "A complete platform to create professional tokens on Solana. No compromises.",

    howBadge: "How it works",
    howTitle1: "Four steps.",
    howTitle2: "Token live.",

    guidesBadge: "Guides",
    guidesTitle: "Learn Solana without wasting weeks",
    guidesDesc:
      "Practical guides on SPL tokens, liquidity pools, branding, authorities, DexScreener and memecoin launches.",
    guidesAll: "View all guides",

    compareBadge: "Comparison",
    compareTitle: "Why use SolMint?",
    compareDesc: "Professional token creation without code, chaos or scattered tools.",
    compareCta: "Start now",

    pricingBadge: "Pricing",
    pricingTitle1: "Transparent.",
    pricingTitle2: "Final.",
    pricingDesc: "Pay once. No subscriptions. No hidden fees.",
    fee: "+ network fee (~0.01 SOL)",
    startNow: "Get started",

    reviewsBadge: "Reviews",
    reviewsTitle: "Built for serious launches.",
    reviewsDesc: "A cleaner flow for creators, builders and community founders.",

    faqBadge: "FAQ",
    faqTitle: "Questions?",

    ctaTitle1: "Ready",
    ctaTitle2: "to launch?",
    ctaDesc:
      "Create the token, generate the narrative, prepare the website and bring your project live on Solana.",
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

const DATA = {
  IT: {
    stats: [
      { value: 5000, suffix: "+", label: "Token creati" },
      { value: 3200, suffix: "+", label: "Creator attivi" },
      { value: 99.9, suffix: "%", label: "Uptime" },
    ],
    trustBadges: ["Secured by wallet", "5,000+ tokens", "4.8 rating", "99.9% uptime"],
    aiCards: [
      { icon: "🔥", title: "Scopri cosa sta pumpando", desc: "Analizza i trend Solana e capisci quali narrative stanno attirando attenzione.", href: "/trending", cta: "Vedi Trending", color: "#14F195" },
      { icon: "🤖", title: "Genera idee meme con AI", desc: "Crea nome, simbolo, descrizione, strategia e prompt immagine partendo dai trend.", href: "/ai-meme", cta: "Apri AI Meme", color: "#9945FF" },
      { icon: "🌐", title: "Crea il sito della coin", desc: "Genera una landing page completa per rendere il progetto più serio e credibile.", href: "/ai-website", cta: "Crea sito AI", color: "#14F195" },
    ],
    features: [
      { num: "01", icon: "◎", title: "Token SPL nativi", desc: "Token creati direttamente on-chain. Nessun intermediario, nessun database.", tag: "On-chain", color: "#9945FF" },
      { num: "02", icon: "📁", title: "Metadata permanenti", desc: "Logo, nome, simbolo e link salvati su IPFS tramite Pinata.", tag: "IPFS", color: "#14F195" },
      { num: "03", icon: "🔒", title: "Revoke authorities", desc: "Rendi il tuo token trustless revocando Mint, Freeze e Update authority.", tag: "Sicurezza", color: "#9945FF" },
      { num: "04", icon: "⚡", title: "Lancio rapido", desc: "Configura, firma e crea il token SPL in un flow semplice.", tag: "Fast launch", color: "#14F195" },
      { num: "05", icon: "💧", title: "Liquidity Pool", desc: "Crea e gestisci pool su Raydium CPMM con fee tier personalizzabili.", tag: "Raydium", color: "#9945FF" },
      { num: "06", icon: "🌐", title: "AI Website", desc: "Genera una landing page per la tua coin con roadmap, FAQ e tokenomics.", tag: "AI", color: "#14F195" },
    ],
    steps: [
      { n: "1", title: "Connetti il wallet", desc: "Apri Phantom o Solflare. Nessun account, nessuna email.", tag: "Wallet", color: "#9945FF" },
      { n: "2", title: "Configura il token", desc: "Nome, simbolo, supply, decimali, logo e social link.", tag: "60 secondi", color: "#14F195" },
      { n: "3", title: "Firma e ricevi", desc: "Conferma la transazione. Il token arriva direttamente nel wallet.", tag: "On-chain", color: "#9945FF" },
      { n: "4", title: "Prepara il lancio", desc: "Usa AI, guide, sito e liquidity tools per lanciare meglio.", tag: "Launch ready", color: "#14F195" },
    ],
    pricing: [
      { name: "Starter", price: "0.1", badge: "", highlight: false, features: ["Token SPL on-chain", "Metadata su IPFS", "Logo + link social", "Pronto per creare liquidità"] },
      { name: "Standard", price: "0.2", badge: "Più scelto", highlight: true, features: ["Tutto di Starter", "1 revoke a scelta", "Mint / Freeze / Update", "Priorità di elaborazione"] },
      { name: "Pro", price: "0.4", badge: "", highlight: false, features: ["Tutto di Standard", "Tutte e 3 le revoke", "Token 100% trustless", "Supporto prioritario"] },
    ],
    compareRows: [
      ["Costo", "0.1 SOL", "0.02 SOL", "~0.05 SOL", "$50-200+"],
      ["Tempo", "60 sec", "30 sec", "30+ min", "10+ min"],
      ["No code", "Sì", "Sì", "No", "No"],
      ["AI tools", "Sì", "No", "No", "No"],
      ["IPFS", "Sì", "No", "Manuale", "No"],
      ["Authority control", "Sì", "Limitato", "Sì", "Sì"],
    ],
    reviews: [
      ["Interfaccia pulita, veloce e molto più chiara dei soliti tool Solana.", "Alex R.", "Meme creator"],
      ["Token, metadata e launch flow nello stesso posto. Esattamente quello che serve.", "Sarah K.", "Solana builder"],
      ["La parte AI Website rende il progetto molto più completo e professionale.", "Mike T.", "Community founder"],
      ["Ho creato il token e preparato il lancio senza dover saltare tra dieci piattaforme.", "Jordan L.", "Web3 founder"],
      ["Il flow delle authority è chiaro. Per un founder non tecnico è fondamentale.", "Priya S.", "NFT project lead"],
      ["Finalmente un launcher che sembra pensato per creator seri, non solo per fare casino.", "Carlos M.", "Crypto entrepreneur"],
    ],
    faq: [
      ["SolMint è sicuro?", "Sì. SolMint non ha mai accesso alle tue chiavi private. Tutto avviene tramite il tuo wallet."],
      ["Cosa significa revocare le authority?", "Significa rendere il token più trustless: niente mint extra, freeze o modifiche metadata se scegli le revoke."],
      ["Quanto costa creare un token?", "Starter costa 0.1 SOL + fee di rete. Standard 0.2 SOL. Pro 0.4 SOL."],
      ["Posso creare una liquidity pool?", "Sì. Puoi usare la sezione Liquidity Pool per creare e gestire liquidità."],
      ["Posso generare anche il sito?", "Sì. La feature AI Website genera una landing page per la coin a 0.2 SOL."],
      ["Hai bisogno di aiuto?", "Scrivici a info@solmint.space — rispondiamo entro 24 ore."],
    ],
  },
  EN: {
    stats: [
      { value: 5000, suffix: "+", label: "Tokens created" },
      { value: 3200, suffix: "+", label: "Active creators" },
      { value: 99.9, suffix: "%", label: "Uptime" },
    ],
    trustBadges: ["Secured by wallet", "5,000+ tokens", "4.8 rating", "99.9% uptime"],
    aiCards: [
      { icon: "🔥", title: "Discover what is trending", desc: "Analyze Solana trends and understand which narratives are getting attention.", href: "/trending", cta: "View Trending", color: "#14F195" },
      { icon: "🤖", title: "Generate meme ideas", desc: "Create name, symbol, description, strategy and image prompts from real trends.", href: "/ai-meme", cta: "Open AI Meme", color: "#9945FF" },
      { icon: "🌐", title: "Create the coin website", desc: "Generate a full landing page to make your project look more serious.", href: "/ai-website", cta: "Create AI site", color: "#14F195" },
    ],
    features: [
      { num: "01", icon: "◎", title: "Native SPL tokens", desc: "Tokens created directly on-chain. No intermediaries, no database.", tag: "On-chain", color: "#9945FF" },
      { num: "02", icon: "📁", title: "Permanent metadata", desc: "Logo, name, symbol and links stored on IPFS through Pinata.", tag: "IPFS", color: "#14F195" },
      { num: "03", icon: "🔒", title: "Revoke authorities", desc: "Make your token trustless by revoking Mint, Freeze and Update authority.", tag: "Security", color: "#9945FF" },
      { num: "04", icon: "⚡", title: "Fast launch", desc: "Configure, sign and create your SPL token in a simple flow.", tag: "Fast launch", color: "#14F195" },
      { num: "05", icon: "💧", title: "Liquidity Pool", desc: "Create and manage Raydium CPMM pools with customizable fee tiers.", tag: "Raydium", color: "#9945FF" },
      { num: "06", icon: "🌐", title: "AI Website", desc: "Generate a landing page for your coin with roadmap, FAQ and tokenomics.", tag: "AI", color: "#14F195" },
    ],
    steps: [
      { n: "1", title: "Connect wallet", desc: "Open Phantom or Solflare. No account, no email.", tag: "Wallet", color: "#9945FF" },
      { n: "2", title: "Configure token", desc: "Name, symbol, supply, decimals, logo and social links.", tag: "60 seconds", color: "#14F195" },
      { n: "3", title: "Sign and receive", desc: "Confirm the transaction. The token arrives in your wallet.", tag: "On-chain", color: "#9945FF" },
      { n: "4", title: "Prepare launch", desc: "Use AI, guides, website and liquidity tools to launch better.", tag: "Launch ready", color: "#14F195" },
    ],
    pricing: [
      { name: "Starter", price: "0.1", badge: "", highlight: false, features: ["On-chain SPL token", "Metadata on IPFS", "Logo + social links", "Ready for liquidity"] },
      { name: "Standard", price: "0.2", badge: "Most popular", highlight: true, features: ["Everything in Starter", "1 revoke included", "Mint / Freeze / Update", "Priority processing"] },
      { name: "Pro", price: "0.4", badge: "", highlight: false, features: ["Everything in Standard", "All 3 revokes", "100% trustless token", "Priority support"] },
    ],
    compareRows: [
      ["Cost", "0.1 SOL", "0.02 SOL", "~0.05 SOL", "$50-200+"],
      ["Time", "60 sec", "30 sec", "30+ min", "10+ min"],
      ["No code", "Yes", "Yes", "No", "No"],
      ["AI tools", "Yes", "No", "No", "No"],
      ["IPFS", "Yes", "No", "Manual", "No"],
      ["Authority control", "Yes", "Limited", "Yes", "Yes"],
    ],
    reviews: [
      ["Clean, fast and much clearer than the usual Solana tools.", "Alex R.", "Meme creator"],
      ["Token, metadata and launch flow in one place. Exactly what we needed.", "Sarah K.", "Solana builder"],
      ["The AI Website feature makes the whole project feel more complete.", "Mike T.", "Community founder"],
      ["We created the token and prepared the launch without jumping between ten platforms.", "Jordan L.", "Web3 founder"],
      ["The authority flow is clear. For a non-technical founder, that matters.", "Priya S.", "NFT project lead"],
      ["Finally a launcher that feels built for serious creators, not just chaos.", "Carlos M.", "Crypto entrepreneur"],
    ],
    faq: [
      ["Is SolMint safe?", "Yes. SolMint never has access to your private keys. Everything happens through your wallet."],
      ["What does revoking authorities mean?", "It makes the token more trustless: no extra minting, freeze or metadata updates if you choose the revokes."],
      ["How much does it cost?", "Starter costs 0.1 SOL + network fees. Standard 0.2 SOL. Pro 0.4 SOL."],
      ["Can I create a liquidity pool?", "Yes. You can use the Liquidity Pool section to create and manage liquidity."],
      ["Can I generate the website too?", "Yes. AI Website generates a landing page for your coin for 0.2 SOL."],
      ["Need help?", "Contact info@solmint.space — we reply within 24 hours."],
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

function PartnerLogo({ name }: { name: string }) {
  const common = { width: 28, height: 28, viewBox: "0 0 64 64", fill: "none" };

  const logos: Record<string, ReactNode> = {
    Solana: (
      <svg {...common}>
        <path d="M14 18h38l-8 8H6l8-8Z" fill="url(#pSol1)" />
        <path d="M14 38h38l-8 8H6l8-8Z" fill="url(#pSol1)" />
        <path d="M50 28H12l8 8h38l-8-8Z" fill="url(#pSol1)" />
        <defs>
          <linearGradient id="pSol1" x1="6" y1="18" x2="58" y2="46">
            <stop stopColor="#9945FF" />
            <stop offset="1" stopColor="#14F195" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Metaplex: (
      <svg {...common}>
        <rect width="64" height="64" rx="16" fill="url(#pMet)" />
        <path d="M17 45V19h8l7 11 7-11h8v26h-8V32l-7 10-7-10v13h-8Z" fill="white" />
        <defs>
          <linearGradient id="pMet" x1="0" y1="0" x2="64" y2="64">
            <stop stopColor="#FF4ECD" />
            <stop offset="0.5" stopColor="#875CFF" />
            <stop offset="1" stopColor="#00E7FF" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Raydium: (
      <svg {...common}>
        <rect width="64" height="64" rx="16" fill="#10172A" />
        <path d="M18 18h20c8.3 0 14 5.4 14 13.1 0 6-3.4 10.5-8.8 12.2L53 53H40.5l-8.8-9.1H29V53H18V18Zm11 9.6v7.9h8.4c2.5 0 4.1-1.6 4.1-4s-1.6-3.9-4.1-3.9H29Z" fill="#22D3EE" />
      </svg>
    ),
    Pinata: (
      <svg {...common}>
        <rect width="64" height="64" rx="16" fill="#6D28D9" />
        <path d="M32 10c8 0 14 6 14 14 0 10-14 30-14 30S18 34 18 24c0-8 6-14 14-14Z" fill="#FDE047" />
        <circle cx="32" cy="24" r="6" fill="#6D28D9" />
      </svg>
    ),
    Phantom: (
      <svg {...common}>
        <rect width="64" height="64" rx="16" fill="#AB9FF2" />
        <path d="M32 12c13 0 23 9.8 23 22s-10 22-23 22H19c-3.2 0-5-3.7-3-6.1l3.4-4.1C13.6 42.2 10 36.4 10 30c0-10 8.4-18 18.8-18H32Z" fill="#4C43B8" />
        <circle cx="24" cy="31" r="3" fill="white" />
        <circle cx="39" cy="31" r="3" fill="white" />
      </svg>
    ),
    Dexscreener: (
      <svg {...common}>
        <rect width="64" height="64" rx="16" fill="#050505" />
        <path d="M12 45l11-17 9 12 9-22 11 27" stroke="#00D4AA" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="44" cy="26" r="5" fill="#00D4AA" />
      </svg>
    ),
    Axiom: (
      <svg {...common}>
        <rect width="64" height="64" rx="16" fill="#0B0B0F" />
        <path d="M14 49L32 14l18 35H14Z" stroke="white" strokeWidth="4.5" strokeLinejoin="round" />
        <path d="M23 39h18" stroke="#14F195" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    ),
    Photon: (
      <svg {...common}>
        <rect width="64" height="64" rx="16" fill="#111827" />
        <circle cx="32" cy="32" r="10" fill="#FFD700" />
        <circle cx="32" cy="32" r="20" stroke="#FFD700" strokeWidth="3" opacity="0.45" />
        <path d="M32 6v10M32 48v10M6 32h10M48 32h10" stroke="#FFD700" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  };

  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 14,
        display: "grid",
        placeItems: "center",
        background: "rgba(255,255,255,0.045)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {logos[name] ?? <span>{name.slice(0, 1)}</span>}
    </div>
  );
}

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;

        const duration = 1200;
        const start = performance.now();

        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Number((value * eased).toFixed(value % 1 === 0 ? 0 : 1)));

          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  const formatted =
    value % 1 === 0
      ? Math.floor(count).toLocaleString("en-US")
      : count.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

function Avatar({ index }: { index: number }) {
  const gradients = [
    ["#9945FF", "#14F195"],
    ["#FF4ECD", "#875CFF"],
    ["#6FA8FF", "#14F195"],
    ["#FFD43B", "#9945FF"],
    ["#14F195", "#00D4AA"],
    ["#875CFF", "#22D3EE"],
  ];

  const [a, b] = gradients[index % gradients.length];

  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect width="44" height="44" rx="22" fill={`url(#av${index})`} />
      <circle cx="22" cy="17" r="7" fill="rgba(255,255,255,0.88)" />
      <path d="M10 37c2.2-8 7-12 12-12s9.8 4 12 12" fill="rgba(255,255,255,0.84)" />
      <defs>
        <linearGradient id={`av${index}`} x1="0" y1="0" x2="44" y2="44">
          <stop stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
    </svg>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div onClick={() => setOpen(!open)} className="border-b cursor-pointer" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="flex items-center justify-between py-6 gap-4">
        <span className="text-white font-semibold text-base">{q}</span>
        <span style={{ color: open ? "#14F195" : "rgba(255,255,255,0.32)", transform: open ? "rotate(45deg)" : "rotate(0deg)" }} className="text-xl transition-all">
          +
        </span>
      </div>
      {open && (
        <p className="text-sm leading-relaxed pb-6" style={{ color: "rgba(255,255,255,0.52)" }}>
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

  const t = useMemo(() => TEXT[lang], [lang]);
  const data = useMemo(() => DATA[lang], [lang]);
  const navLinks = useMemo(() => NAV_LINKS[lang], [lang]);

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
    if (showApp || window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    const ps = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.25 + 0.25,
      o: Math.random() * 0.28 + 0.04,
    }));

    let id: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ps.forEach((p) => {
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

    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", resize);
    };
  }, [showApp]);

  if (showApp) {
  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "#07070f",
        color: "white",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
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
              "linear-gradient(rgba(255,255,255,0.027) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.027) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(circle at center, black 0%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 0%, transparent 75%)",
          }}
        />
      </div>

     <header
  className="border-b px-4 sm:px-6 py-4 sticky top-0 z-50"
  style={{
    borderColor: "rgba(255,255,255,0.07)",
    background: "rgba(7,7,15,0.82)",
    backdropFilter: "blur(26px)",
    WebkitBackdropFilter: "blur(26px)",
  }}
>
  <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
    <button
      onClick={() => setShowApp(false)}
      className="flex items-center gap-3 min-w-0"
      style={{ background: "transparent", border: 0, cursor: "pointer" }}
    >
      <Logo size={34} />
      <div className="leading-tight text-left min-w-0">
        <span className="block font-black text-lg sm:text-xl tracking-tight truncate text-white">
          SolMint Space
        </span>
        <span
          className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.22em]"
          style={{ color: "rgba(255,255,255,0.28)" }}
        >
          {t.brandSub}
        </span>
      </div>

      <span
        className="hidden sm:inline-flex text-xs px-2.5 py-1 rounded-full font-semibold"
        style={{
          background: "rgba(20,241,149,0.1)",
          color: "#14F195",
          border: "1px solid rgba(20,241,149,0.25)",
        }}
      >
        {t.mainnet}
      </span>
    </button>

    <div className="hidden md:flex items-center gap-2">
      <button
        onClick={() => setShowApp(false)}
        className="px-4 py-2 rounded-full text-sm font-bold"
        style={{
          color: "rgba(255,255,255,0.65)",
          background: "rgba(255,255,255,0.045)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        Home
      </button>

      <a
        href="/ai-website"
        className="px-4 py-2 rounded-full text-sm font-bold"
        style={{
          color: "#c7a6ff",
          background: "rgba(153,69,255,0.08)",
          border: "1px solid rgba(153,69,255,0.18)",
          textDecoration: "none",
        }}
      >
        AI Website
      </a>
    </div>

    <WalletMultiButton
      style={{
        background: "linear-gradient(135deg, #9945FF, #14F195)",
        borderRadius: "14px",
        fontSize: "13px",
        padding: "10px 16px",
        height: "auto",
        fontFamily: "inherit",
      }}
    />
  </div>
</header>

      <div className="relative" style={{ zIndex: 1 }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-4">
          <div
            className="flex gap-1 p-1 rounded-xl mb-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(18px)",
            }}
          >
            <button
              onClick={() => setTab("create")}
              className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
              style={
                tab === "create"
                  ? {
                      background: "linear-gradient(135deg, #9945FF, #14F195)",
                      color: "white",
                    }
                  : { color: "rgba(255,255,255,0.4)" }
              }
            >
              {t.createTab}
            </button>

            <button
              onClick={() => setTab("pool")}
              className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
              style={
                tab === "pool"
                  ? {
                      background: "linear-gradient(135deg, #9945FF, #14F195)",
                      color: "white",
                    }
                  : { color: "rgba(255,255,255,0.4)" }
              }
            >
              {t.poolTab}
            </button>
          </div>
        </div>

        {tab === "create" ? <TokenForm /> : <LiquidityPool />}

        <footer
          className="text-center py-10 text-xs"
          style={{ color: "rgba(255,255,255,0.12)" }}
        >
          {t.appFooter}
        </footer>
      </div>
    </main>
  );
}

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SolMint Space",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: "https://solmint.space",
    offers: {
      "@type": "Offer",
      price: "0.1",
      priceCurrency: "SOL",
    },
    creator: {
      "@type": "Organization",
      name: "SolMint Space",
    },
    description:
      "Create Solana SPL tokens, prepare memecoin launches, manage liquidity and use AI tools for token ideas.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} />

      <main className="min-h-screen overflow-x-hidden" style={{ background: "#07070f", color: "white", paddingBottom: "env(safe-area-inset-bottom)" }}>
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
                "linear-gradient(rgba(255,255,255,0.027) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.027) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              maskImage: "radial-gradient(circle at center, black 0%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(circle at center, black 0%, transparent 75%)",
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  }}
                  onMouseLeave={(e) => {
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
                {(["IT", "EN"] as Lang[]).map((code) => (
                  <span key={code} className="px-3 py-1.5 rounded-full transition-all" style={{ color: lang === code ? "white" : "rgba(255,255,255,0.35)", background: lang === code ? "linear-gradient(135deg, #9945FF, #14F195)" : "transparent" }}>
                    {code}
                  </span>
                ))}
              </button>

              <button onClick={() => setShowApp(true)} className="px-5 py-2.5 rounded-full text-sm font-black text-white transition-all hover:opacity-90 hover:scale-105" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", boxShadow: "0 12px 35px rgba(153,69,255,0.26)" }}>
                {t.launchApp}
              </button>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} aria-label="Apri menu">
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
                    <a key={label} href={href} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-bold" style={{ color: "rgba(255,255,255,0.84)", background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.055)" }}>
                      {label}
                      <span style={{ color: "rgba(255,255,255,0.24)" }}>→</span>
                    </a>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button onClick={() => setLang(lang === "IT" ? "EN" : "IT")} className="rounded-2xl p-1 text-xs font-black" style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <span className="grid grid-cols-2 gap-1">
                      {(["IT", "EN"] as Lang[]).map((code) => (
                        <span key={code} className="py-2 rounded-xl" style={{ color: lang === code ? "white" : "rgba(255,255,255,0.35)", background: lang === code ? "linear-gradient(135deg, #9945FF, #14F195)" : "transparent" }}>
                          {code}
                        </span>
                      ))}
                    </span>
                  </button>

                  <button onClick={() => { setMobileMenuOpen(false); setShowApp(true); }} className="py-3 rounded-2xl text-sm font-black text-white" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)" }}>
                    {t.launchApp}
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>

        <section className="relative pt-36 sm:pt-40 lg:pt-48 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 text-center" style={{ zIndex: 1 }}>
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex flex-wrap justify-center items-center gap-2 px-4 py-2 rounded-full text-[11px] sm:text-xs font-semibold mb-8" style={{ background: "rgba(153,69,255,0.1)", border: "1px solid rgba(153,69,255,0.2)", color: "rgba(255,255,255,0.65)", boxShadow: "0 0 35px rgba(153,69,255,0.1)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#14F195", boxShadow: "0 0 8px #14F195" }} />
              {t.heroBadge}
            </div>

            <h1 className="font-black mb-6 sm:mb-8" style={{ fontSize: "clamp(48px, 9vw, 108px)", letterSpacing: "-0.06em", lineHeight: 1.02 }}>
              <span style={{ display: "block", color: "rgba(255,255,255,0.96)" }}>{t.hero1}</span>
              <span
                style={{
                  display: "block",
                  paddingBottom: 10,
                  background: "linear-gradient(90deg, #9945FF 0%, #6FA8FF 45%, #14F195 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t.hero2}
              </span>
              <span style={{ display: "block", color: "rgba(255,255,255,0.96)" }}>{t.hero3}</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 mx-auto leading-relaxed px-1" style={{ color: "rgba(255,255,255,0.48)", maxWidth: 720 }}>
              {t.heroDesc}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-xl sm:max-w-none mx-auto">
              <button onClick={() => setShowApp(true)} className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-2xl text-base font-black text-white transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", boxShadow: "0 0 55px rgba(153,69,255,0.38)" }}>
                {t.createToken}
              </button>

              <a href="#come-funziona" className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-2xl text-base font-semibold transition-all hover:scale-105" style={{ color: "rgba(255,255,255,0.72)", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.045)" }}>
                {t.howItWorks}
              </a>

              <Link href="/ai-meme" className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-2xl text-base font-semibold transition-all hover:scale-105" style={{ color: "#14F195", border: "1px solid rgba(20,241,149,0.2)", background: "rgba(20,241,149,0.06)", textDecoration: "none" }}>
                {t.generateAI}
              </Link>

              <Link href="/ai-website" className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-2xl text-base font-semibold transition-all hover:scale-105" style={{ color: "#c7a6ff", border: "1px solid rgba(153,69,255,0.24)", background: "rgba(153,69,255,0.08)", textDecoration: "none" }}>
                {t.generateWebsite}
              </Link>
            </div>

            <p className="text-xs mt-6" style={{ color: "rgba(255,255,255,0.22)" }}>
              {t.heroNote}
            </p>
          </div>
        </section>

        <section className="relative px-4 sm:px-6 py-10" style={{ zIndex: 1 }}>
          <div className="max-w-5xl mx-auto rounded-[32px] p-5 sm:p-7" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025))", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 30px 100px rgba(0,0,0,0.24)" }}>
            <div className="flex flex-wrap justify-center gap-2 mb-7">
              {data.trustBadges.map((badge) => (
                <span key={badge} className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ color: "rgba(255,255,255,0.72)", background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {badge}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl" style={{ background: "rgba(255,255,255,0.08)" }}>
              {data.stats.map((stat) => (
                <div key={stat.label} className="text-center py-8 px-4" style={{ background: "rgba(7,7,15,0.86)" }}>
                  <div className="text-3xl sm:text-4xl font-black mb-2" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.42)" }}>
                    {stat.label}
                  </div>
                </div>
              ))}

              <div className="text-center py-8 px-4" style={{ background: "rgba(7,7,15,0.86)" }}>
                <div className="text-3xl sm:text-4xl font-black mb-2" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Solana
                </div>
                <div className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.42)" }}>
                  {t.statSolana}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-4 sm:px-6 py-20" style={{ zIndex: 1 }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: "#14F195" }}>{t.aiBadge}</p>
              <h2 className="font-black leading-tight mb-5" style={{ fontSize: "clamp(34px, 5vw, 58px)", letterSpacing: "-0.04em" }}>
                {t.aiTitle1}
                <br />
                {t.aiTitle2}
              </h2>
              <p className="mx-auto text-base md:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.46)", maxWidth: 720 }}>{t.aiDesc}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {data.aiCards.map((item) => (
                <Link key={item.title} href={item.href} className="group p-8 rounded-3xl transition-all hover:scale-105" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)", textDecoration: "none", boxShadow: "0 20px 80px rgba(0,0,0,0.18)" }}>
                  <div className="text-4xl mb-7">{item.icon}</div>
                  <h3 className="text-xl font-black mb-3 text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed mb-7" style={{ color: "rgba(255,255,255,0.44)" }}>{item.desc}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-black transition-all group-hover:gap-3" style={{ color: item.color }}>
                    {item.cta}
                    <span>→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative px-4 sm:px-6 py-24" style={{ zIndex: 1 }}>
          <div className="max-w-6xl mx-auto rounded-[36px] overflow-hidden relative" style={{ background: "linear-gradient(135deg, rgba(153,69,255,0.14), rgba(20,241,149,0.055))", border: "1px solid rgba(153,69,255,0.24)", boxShadow: "0 30px 120px rgba(0,0,0,0.35)" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 0%, rgba(153,69,255,0.28), transparent 38%), radial-gradient(circle at 90% 40%, rgba(20,241,149,0.14), transparent 36%)", pointerEvents: "none" }} />

            <div className="relative grid lg:grid-cols-[1.05fr_0.95fr] gap-10 p-7 sm:p-10 lg:p-14 items-center">
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#c7a6ff", fontSize: 12, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 22 }}>
                  ✦ {t.websiteBadge}
                </div>

                <h2 style={{ fontSize: "clamp(34px, 5vw, 64px)", fontWeight: 950, letterSpacing: "-0.055em", lineHeight: 0.98, marginBottom: 20 }}>
                  {t.websiteTitle1}
                  <br />
                  <span style={{ background: "linear-gradient(90deg, #9945FF, #14F195)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {t.websiteTitle2}
                  </span>
                </h2>

                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, lineHeight: 1.8, maxWidth: 620, marginBottom: 28 }}>
                  {t.websiteDesc}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/ai-website" style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", gap: 10, padding: "15px 24px", borderRadius: 18, background: "linear-gradient(135deg, #9945FF, #14F195)", color: "white", fontWeight: 900, textDecoration: "none", boxShadow: "0 18px 60px rgba(153,69,255,0.28)" }}>
                    {t.websiteCta} →
                  </Link>

                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "15px 20px", borderRadius: 18, background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.72)", fontWeight: 900 }}>
                    {t.websitePrice}
                  </div>
                </div>
              </div>

              <div style={{ borderRadius: 28, background: "rgba(5,5,12,0.64)", border: "1px solid rgba(255,255,255,0.09)", padding: 18, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}>
                <div style={{ height: 12, display: "flex", gap: 6, marginBottom: 16 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
                </div>

                <div style={{ borderRadius: 22, overflow: "hidden", background: "linear-gradient(180deg, rgba(153,69,255,0.18), rgba(7,7,15,0.9))", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ padding: 22 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 34 }}>
                      <strong style={{ color: "white" }}>MOONPUP</strong>
                      <span style={{ fontSize: 11, color: "#14F195", fontWeight: 900 }}>LIVE PREVIEW</span>
                    </div>

                    <h3 style={{ fontSize: 34, lineHeight: 1, fontWeight: 950, letterSpacing: "-0.05em", marginBottom: 12 }}>
                      The next meme
                      <br />
                      on Solana.
                    </h3>

                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>
                      AI-generated website with tokenomics, roadmap, FAQ and community links.
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {["Tokenomics", "Roadmap", "Community", "FAQ"].map((item) => (
                        <div key={item} style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.72)", fontSize: 12, fontWeight: 800 }}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-4 sm:px-6 py-20" style={{ zIndex: 1 }}>
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-xs font-black mb-12 tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.22)" }}>{t.builtOn}</p>
            <div className="flex flex-wrap justify-center gap-4">
              {PARTNERS.map((name) => (
                <div key={name} className="flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all hover:scale-105" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <PartnerLogo name={name} />
                  <span className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.8)" }}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="relative px-4 sm:px-6 py-28" style={{ zIndex: 1 }}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-16 max-w-xl">
              <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: "#9945FF" }}>{t.featuresBadge}</p>
              <h2 className="font-black leading-tight mb-5" style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.04em" }}>
                {t.featuresTitle1}
                <br />
                {t.featuresTitle2}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.42)", lineHeight: 1.7 }}>{t.featuresDesc}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.features.map((f) => (
                <div key={f.num} className="p-8 rounded-3xl transition-all hover:scale-105" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 18px 70px rgba(0,0,0,0.18)" }}>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-2xl">{f.icon}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black" style={{ color: "rgba(255,255,255,0.12)" }}>{f.num}</span>
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: `rgba(${f.color === "#9945FF" ? "153,69,255" : "20,241,149"},0.1)`, color: f.color, border: `1px solid rgba(${f.color === "#9945FF" ? "153,69,255" : "20,241,149"},0.2)` }}>
                        {f.tag}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="come-funziona" className="relative px-4 sm:px-6 py-28" style={{ zIndex: 1, background: "rgba(255,255,255,0.015)" }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: "#14F195" }}>{t.howBadge}</p>
              <h2 className="font-black leading-tight" style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.04em" }}>
                {t.howTitle1}
                <br />
                {t.howTitle2}
              </h2>
            </div>

            <div className="space-y-5">
              {data.steps.map((s, i) => (
                <div key={s.n} className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-start p-6 sm:p-8 rounded-3xl transition-all hover:scale-[1.01]" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0" style={{ background: `linear-gradient(135deg, ${i % 2 === 0 ? "#9945FF, #7b35d0" : "#0fa872, #14F195"})`, boxShadow: `0 0 30px rgba(${i % 2 === 0 ? "153,69,255" : "20,241,149"},0.25)` }}>
                    {s.n}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold">{s.title}</h3>
                      <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: `rgba(${i % 2 === 0 ? "153,69,255" : "20,241,149"},0.1)`, color: s.color, border: `1px solid rgba(${i % 2 === 0 ? "153,69,255" : "20,241,149"},0.2)` }}>
                        {s.tag}
                      </span>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.44)", lineHeight: 1.7 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative px-4 sm:px-6 py-28" style={{ zIndex: 1 }}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: "#c7a6ff" }}>{t.guidesBadge}</p>
              <h2 style={{ fontSize: "clamp(34px, 5vw, 58px)", fontWeight: 950, letterSpacing: "-0.05em", lineHeight: 1, marginBottom: 16, color: "white" }}>
                {t.guidesTitle}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", maxWidth: 760, fontSize: 18, lineHeight: 1.7 }}>
                {t.guidesDesc}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {GUIDES.slice(0, 6).map((guide) => (
                <article key={guide.id} itemScope itemType="https://schema.org/Article">
                  <Link
                    href={`/guides/${guide.id}`}
                    style={{
                      display: "block",
                      height: "100%",
                      minHeight: 230,
                      padding: 24,
                      borderRadius: 24,
                      background: "rgba(255,255,255,0.035)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      textDecoration: "none",
                      transition: "all 0.2s",
                      boxShadow: "0 18px 70px rgba(0,0,0,0.18)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                      <span style={{ fontSize: 28 }}>{guide.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 800, padding: "5px 10px", borderRadius: 999, background: "rgba(153,69,255,0.12)", color: "#c7a6ff", border: "1px solid rgba(153,69,255,0.2)" }}>
                        {guide.category}
                      </span>
                    </div>

                    <h3 style={{ color: "white", fontSize: 20, fontWeight: 900, marginBottom: 10, lineHeight: 1.2, letterSpacing: "-0.03em" }}>
                      {guide.title}
                    </h3>

                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                      {guide.desc}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>⏱ {guide.time}</span>
                      <span style={{ color: "#9945FF", fontSize: 13, fontWeight: 800 }}>Leggi →</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            <div style={{ marginTop: 28 }}>
              <Link href="/guides" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 20px", borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "white", textDecoration: "none", fontWeight: 800 }}>
                {t.guidesAll} →
              </Link>
            </div>
          </div>
        </section>

        <section className="relative px-4 sm:px-6 py-24" style={{ zIndex: 1 }}>
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: "#14F195" }}>{t.compareBadge}</p>
            <h2 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(34px, 5vw, 58px)", letterSpacing: "-0.04em" }}>{t.compareTitle}</h2>
            <p className="mx-auto mb-12" style={{ color: "rgba(255,255,255,0.46)", maxWidth: 680 }}>{t.compareDesc}</p>

            <div className="overflow-x-auto rounded-3xl" style={{ border: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.025)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
                <thead>
                  <tr>
                    {["Feature", "SolMint", "Pump.fun", "Manual", "Ethereum"].map((h) => (
                      <th key={h} style={{ padding: 20, textAlign: "center", color: h === "SolMint" ? "#14F195" : "white", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.compareRows.map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, i) => (
                        <td key={`${row[0]}-${i}`} style={{ padding: 18, textAlign: i === 0 ? "left" : "center", color: i === 1 ? "white" : "rgba(255,255,255,0.62)", background: i === 1 ? "rgba(153,69,255,0.08)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.055)", fontWeight: i === 1 ? 900 : 500 }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button onClick={() => setShowApp(true)} className="mt-10 px-8 py-4 rounded-2xl font-black text-white" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", boxShadow: "0 18px 60px rgba(153,69,255,0.25)" }}>
              {t.compareCta} →
            </button>
          </div>
        </section>

        <section id="prezzi" className="relative px-4 sm:px-6 py-28" style={{ zIndex: 1 }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: "#9945FF" }}>{t.pricingBadge}</p>
              <h2 className="font-black leading-tight mb-5" style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.04em" }}>
                {t.pricingTitle1}
                <br />
                {t.pricingTitle2}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.4)" }}>{t.pricingDesc}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {data.pricing.map((p) => (
                <div key={p.name} className="rounded-3xl p-8 relative overflow-hidden transition-all hover:scale-105" style={p.highlight ? { background: "linear-gradient(135deg, rgba(153,69,255,0.13), rgba(20,241,149,0.06))", border: "1.5px solid rgba(153,69,255,0.35)", boxShadow: "0 0 70px rgba(153,69,255,0.14)" } : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {p.badge && <div className="absolute top-0 right-0 text-xs font-black px-4 py-2 rounded-bl-2xl rounded-tr-3xl" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", color: "white" }}>{p.badge}</div>}
                  <p className="text-sm font-semibold mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>{p.name}</p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-black" style={{ fontSize: 52, background: p.highlight ? "linear-gradient(135deg, #9945FF, #14F195)" : "white", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{p.price}</span>
                    <span className="text-2xl font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>SOL</span>
                  </div>
                  <p className="text-xs mb-8" style={{ color: "rgba(255,255,255,0.22)" }}>{t.fee}</p>
                  <div className="space-y-3 mb-8">
                    {p.features.map((f) => (
                      <div key={f} className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(20,241,149,0.12)", border: "1px solid rgba(20,241,149,0.25)" }}>✓</div>
                        <span style={{ color: "rgba(255,255,255,0.72)" }}>{f}</span>
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

        <section className="relative px-4 sm:px-6 py-24" style={{ zIndex: 1 }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: "#14F195" }}>{t.reviewsBadge}</p>
              <h2 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(34px, 5vw, 58px)", letterSpacing: "-0.04em" }}>{t.reviewsTitle}</h2>
              <p style={{ color: "rgba(255,255,255,0.44)" }}>{t.reviewsDesc}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {data.reviews.map(([quote, name, role], index) => (
                <div key={name} className="rounded-3xl p-7" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 18px 70px rgba(0,0,0,0.18)" }}>
                  <div style={{ color: "#FFD43B", fontSize: 22, marginBottom: 18 }}>★★★★★</div>
                  <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 24 }}>“{quote}”</p>
                  <div className="flex items-center gap-3">
                    <Avatar index={index} />
                    <div>
                      <p style={{ color: "white", fontWeight: 900, margin: 0 }}>{name}</p>
                      <p style={{ color: "rgba(255,255,255,0.36)", fontSize: 12, margin: 0 }}>{role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="relative px-4 sm:px-6 py-28" style={{ zIndex: 1, background: "rgba(255,255,255,0.015)" }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: "#14F195" }}>{t.faqBadge}</p>
              <h2 className="font-black leading-tight" style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.04em" }}>{t.faqTitle}</h2>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {data.faq.map(([q, a]) => <FAQItem key={q} q={q} a={a} />)}
            </div>
          </div>
        </section>

        <section className="relative px-4 sm:px-6 py-28" style={{ zIndex: 1 }}>
          <div className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(153,69,255,0.14) 0%, rgba(20,241,149,0.07) 100%)", border: "1px solid rgba(153,69,255,0.24)" }}>
            <div className="absolute inset-0 rounded-3xl" style={{ background: "radial-gradient(circle at 50% -20%, rgba(153,69,255,0.22) 0%, transparent 60%)" }} />
            <div className="relative">
              <h2 className="font-black leading-tight mb-6" style={{ fontSize: "clamp(36px, 6vw, 72px)", letterSpacing: "-0.04em" }}>
                {t.ctaTitle1}
                <br />
                {t.ctaTitle2}
              </h2>
              <p className="text-base sm:text-lg mb-10 mx-auto" style={{ color: "rgba(255,255,255,0.45)", maxWidth: 520 }}>{t.ctaDesc}</p>
              <button onClick={() => setShowApp(true)} className="w-full sm:w-auto px-10 sm:px-12 py-5 rounded-2xl text-lg font-black text-white transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", boxShadow: "0 0 70px rgba(153,69,255,0.4)" }}>
                {t.createToken}
              </button>
              <p className="text-xs mt-6" style={{ color: "rgba(255,255,255,0.22)" }}>{t.starterNote}</p>
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
                    {["Non-custodial", "On-chain", "AI-powered"].map((item) => (
                      <span key={item} className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ color: "rgba(255,255,255,0.62)", background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        {item}
                      </span>
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
    </>
  );
}