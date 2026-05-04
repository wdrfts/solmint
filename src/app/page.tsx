"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef, type ReactNode } from "react";
import TokenForm from "@/components/TokenForm";
import LiquidityPool from "@/components/LiquidityPool";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then(m => m.WalletMultiButton),
  { ssr: false }
);

// Real SVG logos for partners
const PartnerLogos: Record<string, ReactNode> = {
  Solana: (
    <svg width="22" height="18" viewBox="0 0 397 311" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="url(#solanaA)" />
      <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#solanaB)" />
      <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#solanaC)" />
      <defs>
        <linearGradient id="solanaA" x1="360" y1="35" x2="141" y2="335" gradientUnits="userSpaceOnUse"><stop stopColor="#00FFA3"/><stop offset="1" stopColor="#DC1FFF"/></linearGradient>
        <linearGradient id="solanaB" x1="263" y1="-74" x2="44" y2="226" gradientUnits="userSpaceOnUse"><stop stopColor="#00FFA3"/><stop offset="1" stopColor="#DC1FFF"/></linearGradient>
        <linearGradient id="solanaC" x1="311" y1="-19" x2="92" y2="281" gradientUnits="userSpaceOnUse"><stop stopColor="#00FFA3"/><stop offset="1" stopColor="#DC1FFF"/></linearGradient>
      </defs>
    </svg>
  ),
  Metaplex: (
    <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="16" fill="url(#metaplexG)" />
      <path d="M17 45V19h8l7 11 7-11h8v26h-8V32l-7 10-7-10v13h-8z" fill="white"/>
      <defs><linearGradient id="metaplexG" x1="0" y1="0" x2="64" y2="64"><stop stopColor="#FF4ECD"/><stop offset="0.5" stopColor="#875CFF"/><stop offset="1" stopColor="#00E7FF"/></linearGradient></defs>
    </svg>
  ),
  Raydium: (
    <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="16" fill="#10172A"/>
      <path d="M18 18h20c8.3 0 14 5.4 14 13.1 0 6-3.4 10.5-8.8 12.2L53 53H40.5l-8.8-9.1H29V53H18V18zm11 9.6v7.9h8.4c2.5 0 4.1-1.6 4.1-4s-1.6-3.9-4.1-3.9H29z" fill="#22D3EE"/>
      <path d="M45 13l6 6M51 13l-6 6" stroke="#A855F7" strokeWidth="3" strokeLinecap="round"/>
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
      <path d="M51 77c8 6 18 6 26 0" stroke="white" strokeWidth="6" strokeLinecap="round"/>
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

const PARTNERS = ["Solana", "Metaplex", "Raydium", "Pinata", "Phantom", "Dexscreener", "Axiom", "Photon"];

const FEATURES = [
  { num: "01", icon: "◎", title: "Token SPL nativi", desc: "Token creati direttamente on-chain. Nessun intermediario, nessun database. Solo tu e la blockchain.", tag: "On-chain", color: "#9945FF" },
  { num: "02", icon: "📁", title: "Metadata permanenti", desc: "Logo, nome, simbolo e link salvati su IPFS tramite Pinata. Immutabili, decentralizzati, permanenti.", tag: "IPFS", color: "#14F195" },
  { num: "03", icon: "🔒", title: "Revoke authorities", desc: "Rendi il tuo token trustless revocando Mint, Freeze e Update authority in un solo click.", tag: "Sicurezza", color: "#9945FF" },
  { num: "04", icon: "📈", title: "Listing automatico", desc: "Dopo aver aggiunto liquidità su Raydium, il token appare su Dexscreener, Photon e Axiom.", tag: "DEX", color: "#14F195" },
  { num: "05", icon: "💧", title: "Liquidity Pool", desc: "Crea e gestisci pool su Raydium CPMM con fee tier personalizzabili. Rimuovi liquidità quando vuoi.", tag: "Raydium", color: "#9945FF" },
  { num: "06", icon: "🛡", title: "100% non-custodial", desc: "Non custodiamo mai i tuoi fondi. Nessuna chiave privata, nessun rischio controparte. Mai.", tag: "Safe", color: "#14F195" },
];

const STEPS = [
  { n: "1", title: "Connetti il wallet", desc: "Apri Phantom o Solflare. Un click e sei dentro. Nessun account, nessuna email, nessuna verifica.", tag: "Phantom · Solflare", color: "#9945FF" },
  { n: "2", title: "Configura il token", desc: "Nome, simbolo, supply, decimali, logo, link social. Scegli se revocare le authority per renderlo trustless.", tag: "Meno di 60 secondi", color: "#14F195" },
  { n: "3", title: "Firma e ricevi il token", desc: "Conferma la transazione con Phantom. Il token è subito on-chain e appare nel tuo wallet.", tag: "Immediato", color: "#9945FF" },
  { n: "4", title: "Aggiungi liquidità e vai live", desc: "Crea una pool su Raydium. Appena aggiunta la liquidità il token è visibile e tradabile su tutti i DEX.", tag: "Dexscreener · Axiom · Photon", color: "#14F195" },
];

const FAQS = [
  { q: "SolMint è sicuro?", a: "Sì. SolMint non ha mai accesso alle tue chiavi private. Tutto avviene tramite il tuo wallet Phantom. Il codice è open source e verificabile." },
  { q: "Il mio token apparirà su Dexscreener?", a: "Sì, automaticamente. Non appena crei una liquidity pool su Raydium, il tuo token viene listato su Dexscreener, Photon, Axiom e tutti i principali aggregatori." },
  { q: "Cosa significa revocare le authority?", a: "Revocare la Mint Authority significa che nessuno può più creare nuovi token — la supply è fissa. Revocare la Freeze Authority significa che nessuno può congelare i wallet degli holder. Revocare la Update Authority rende i metadata immutabili." },
  { q: "Quanto costa creare un token?", a: "Il piano Starter costa 0.1 SOL + fee di rete. Il piano Standard costa 0.2 SOL e include 1 revoke a scelta. Il piano Pro costa 0.4 SOL con tutte e 3 le revoke incluse." },
  { q: "Posso rimuovere la liquidità dopo?", a: "Sì. Puoi rimuovere tutta o parte della liquidità in qualsiasi momento dalla sezione Liquidity Pool. I SOL e i token tornano immediatamente nel tuo wallet." },
  { q: "Hai bisogno di aiuto?", a: "Scrivici a info@solmint.space — rispondiamo entro 24 ore." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b cursor-pointer group" style={{ borderColor: "rgba(255,255,255,0.08)" }} onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between py-6 gap-4">
        <span className="text-white font-semibold text-base">{q}</span>
        <span className="text-xl flex-shrink-0 transition-all duration-200" style={{ color: open ? "#9945FF" : "rgba(255,255,255,0.3)", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
      </div>
      {open && <p className="text-sm leading-relaxed pb-6" style={{ color: "rgba(255,255,255,0.5)" }}>{a}</p>}
    </div>
  );
}

function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="url(#mainLg)" />
      <circle cx="16" cy="16" r="6" stroke="white" strokeWidth="2" fill="none" />
      <path d="M16 10V8M16 24v-2M10 16H8M24 16h-2" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="mainLg" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#9945FF" /><stop offset="1" stopColor="#14F195" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Home() {
  const [tab, setTab] = useState("create");
  const [showApp, setShowApp] = useState(false);
useEffect(() => {
  if (typeof window !== "undefined" && window.location.search.includes("app=true")) {
    setShowApp(true);
  }
}, []);
  const [scrolled, setScrolled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ps = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.3, o: Math.random() * 0.3 + 0.05,
    }));
    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ps.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(153,69,255,${p.o})`; ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [showApp]);

  if (showApp) {
    return (
      <main className="min-h-screen" style={{ background: "transparent" }}>
        <header className="border-b px-6 py-4 sticky top-0 z-50" style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(7,7,15,0.98)", backdropFilter: "blur(20px)" }}>
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setShowApp(false)}>
              <Logo size={30} />
              <span className="font-black text-white tracking-tight">SolMint</span>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "rgba(20,241,149,0.1)", color: "#14F195", border: "1px solid rgba(20,241,149,0.25)" }}>Mainnet</span>
            </div>
            <WalletMultiButton style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", borderRadius: "10px", fontSize: "13px", padding: "8px 16px", height: "auto", fontFamily: "inherit" }} />
          </div>
        </header>
        <div className="max-w-2xl mx-auto px-6 pt-8 pb-2">
          <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <button onClick={() => setTab("create")} className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all" style={tab === "create" ? { background: "linear-gradient(135deg, #9945FF, #14F195)", color: "white" } : { color: "rgba(255,255,255,0.4)" }}>Crea Token</button>
            <button onClick={() => setTab("pool")} className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all" style={tab === "pool" ? { background: "linear-gradient(135deg, #9945FF, #14F195)", color: "white" } : { color: "rgba(255,255,255,0.4)" }}>Liquidity Pool</button>
          </div>
        </div>
        {tab === "create" ? <TokenForm /> : <LiquidityPool />}
        <footer className="text-center py-10 text-xs" style={{ color: "rgba(255,255,255,0.12)" }}>SolMint — Non-custodial Token Launcher su Solana</footer>
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
  <div
    className="absolute rounded-full"
    style={{
      width: 900,
      height: 900,
      top: -360,
      left: "50%",
      transform: "translateX(-50%)",
      background:
        "radial-gradient(circle, rgba(153,69,255,0.18) 0%, rgba(153,69,255,0.055) 32%, transparent 70%)",
      filter: "blur(70px)",
    }}
  />
  <div
    className="absolute rounded-full"
    style={{
      width: 620,
      height: 620,
      bottom: "8%",
      right: "-190px",
      background:
        "radial-gradient(circle, rgba(20,241,149,0.12) 0%, rgba(20,241,149,0.035) 38%, transparent 72%)",
      filter: "blur(90px)",
    }}
  />
  <div
    className="absolute rounded-full"
    style={{
      width: 460,
      height: 460,
      top: "34%",
      left: "-170px",
      background:
        "radial-gradient(circle, rgba(153,69,255,0.12) 0%, rgba(153,69,255,0.03) 40%, transparent 72%)",
      filter: "blur(80px)",
    }}
  />
</div>
 
      

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300" style={{ background: scrolled ? "rgba(7,7,15,0.96)" : "transparent", backdropFilter: scrolled ? "blur(24px)" : "none", borderBottom: "1px solid transparent" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <span className="font-black text-xl tracking-tight">SolMint</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            {[["Features", "#features"], ["Come funziona", "#come-funziona"], ["Prezzi", "#prezzi"], ["FAQ", "#faq"], ["Trending", "/trending"], ["Guide", "/guides"], ["AI Meme", "/ai-meme"]].map(([label, href]) => (
              <a key={label} href={href} className="text-sm font-medium transition-colors" style={{ color: "rgba(255,255,255,0.45)" }} onMouseEnter={e => (e.currentTarget.style.color = "white")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>{label}</a>
            ))}
          </div>
          <button onClick={() => setShowApp(true)} className="px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90 hover:scale-105" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)" }}>
            Lancia App
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-44 pb-28 px-6 text-center" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-12" style={{ background: "rgba(153,69,255,0.1)", border: "1px solid rgba(153,69,255,0.2)", color: "rgba(255,255,255,0.65)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#14F195", boxShadow: "0 0 8px #14F195" }} />
            Trustless · Non-custodial · Open source
          </div>
          <h1 className="font-black mb-8 leading-none" style={{ fontSize: "clamp(44px, 9vw, 100px)", letterSpacing: "-0.04em" }}>
            <span style={{ color: "rgba(255,255,255,0.95)" }}>Il modo più semplice</span>
            <br />
            <span style={{ background: "linear-gradient(90deg, #9945FF 0%, #14F195 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>per lanciare</span>
            <br />
            <span style={{ color: "rgba(255,255,255,0.95)" }}>su Solana.</span>
          </h1>
          <p className="text-lg md:text-xl mb-12 mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", maxWidth: 520 }}>
            Crea token SPL professionali in 60 secondi. Nessun codice. Nessun intermediario. Solo tu, Phantom e la blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowApp(true)} className="px-10 py-4 rounded-2xl text-base font-black text-white transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", boxShadow: "0 0 50px rgba(153,69,255,0.35)" }}>
              Crea il tuo token
            </button>
            <a href="#come-funziona" className="px-10 py-4 rounded-2xl text-base font-semibold transition-all hover:scale-105" style={{ color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
              Come funziona
            </a>
          </div>
          <p className="text-xs mt-6" style={{ color: "rgba(255,255,255,0.18)" }}>Nessuna registrazione. Connetti Phantom e inizia.</p>
        </div>
      </section>

      {/* Stats — solo 2 */}
      <section className="relative px-6 py-8" style={{ zIndex: 1 }}>
        <div className="max-w-2xl mx-auto grid grid-cols-2 gap-px rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          {[
            { val: "60s", label: "Per creare un token" },
            { val: "100%", label: "On-chain e non-custodial" },
          ].map(s => (
            <div key={s.label} className="text-center py-10 px-4" style={{ background: "#07070f" }}>
              <div className="text-4xl font-black mb-2" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.val}</div>
              <div className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Partners con loghi reali */}
      <section className="relative px-6 py-24" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-black mb-12 tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.18)" }}>Costruito su</p>
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

      {/* Features */}
      <section id="features" className="relative px-6 py-28" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 max-w-xl">
            <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: "#9945FF" }}>Features</p>
            <h2 className="font-black leading-tight mb-5" style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.03em" }}>Tutto quello<br />che ti serve.</h2>
            <p style={{ color: "rgba(255,255,255,0.38)", lineHeight: 1.7 }}>Una piattaforma completa per creare token professionali su Solana. Nessun compromesso.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
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

      {/* How it works */}
      <section id="come-funziona" className="relative px-6 py-28" style={{ zIndex: 1, background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: "#14F195" }}>Come funziona</p>
            <h2 className="font-black leading-tight" style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.03em" }}>Quattro step.<br />Token live.</h2>
          </div>
          <div className="space-y-5">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex gap-6 md:gap-10 items-start p-8 rounded-3xl transition-all hover:scale-101" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
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

      {/* Pricing */}
      <section id="prezzi" className="relative px-6 py-28" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: "#9945FF" }}>Prezzi</p>
            <h2 className="font-black leading-tight mb-5" style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.03em" }}>Trasparenti.<br />Definitivi.</h2>
            <p style={{ color: "rgba(255,255,255,0.35)" }}>Paghi una volta. Nessun abbonamento. Nessuna sorpresa.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Starter", price: "0.1", badge: null, highlight: false, features: ["Token SPL on-chain", "Metadata su IPFS", "Logo + link social", "Visibile su tutti i DEX*"], note: "* dopo aggiunta liquidità" },
              { name: "Standard", price: "0.2", badge: "Più scelto", highlight: true, features: ["Tutto di Starter", "1 revoke a scelta", "Mint / Freeze / Update", "Priorità di elaborazione"], note: null },
              { name: "Pro", price: "0.4", badge: null, highlight: false, features: ["Tutto di Standard", "Tutte e 3 le revoke", "Token 100% trustless", "Supporto prioritario"], note: null },
            ].map(p => (
              <div key={p.name} className="rounded-3xl p-8 relative overflow-hidden transition-all hover:scale-105" style={p.highlight ? { background: "linear-gradient(135deg, rgba(153,69,255,0.12), rgba(20,241,149,0.06))", border: "1.5px solid rgba(153,69,255,0.35)", boxShadow: "0 0 60px rgba(153,69,255,0.12)" } : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {p.badge && <div className="absolute top-0 right-0 text-xs font-black px-4 py-2 rounded-bl-2xl rounded-tr-3xl" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", color: "white" }}>{p.badge}</div>}
                <p className="text-sm font-semibold mb-6" style={{ color: "rgba(255,255,255,0.35)" }}>{p.name}</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-black" style={{ fontSize: 52, background: p.highlight ? "linear-gradient(135deg, #9945FF, #14F195)" : "white", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{p.price}</span>
                  <span className="text-2xl font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>SOL</span>
                </div>
                <p className="text-xs mb-8" style={{ color: "rgba(255,255,255,0.2)" }}>+ fee di rete (~0.01 SOL)</p>
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
                {p.note && <p className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.2)" }}>{p.note}</p>}
                <button onClick={() => setShowApp(true)} className="w-full py-4 rounded-2xl text-sm font-bold transition-all hover:opacity-90" style={p.highlight ? { background: "linear-gradient(135deg, #9945FF, #14F195)", color: "white" } : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  Inizia ora
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative px-6 py-28" style={{ zIndex: 1, background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: "#14F195" }}>FAQ</p>
            <h2 className="font-black leading-tight" style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.03em" }}>Hai domande?</h2>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {FAQS.map(faq => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-28" style={{ zIndex: 1 }}>
        <div className="max-w-4xl mx-auto rounded-3xl p-16 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(153,69,255,0.12) 0%, rgba(20,241,149,0.06) 100%)", border: "1px solid rgba(153,69,255,0.2)" }}>
          <div className="absolute inset-0 rounded-3xl" style={{ background: "radial-gradient(circle at 50% -20%, rgba(153,69,255,0.2) 0%, transparent 60%)" }} />
          <div className="relative">
            <h2 className="font-black leading-tight mb-6" style={{ fontSize: "clamp(36px, 6vw, 72px)", letterSpacing: "-0.03em" }}>Pronto<br />a lanciare?</h2>
            <p className="text-lg mb-10 mx-auto" style={{ color: "rgba(255,255,255,0.4)", maxWidth: 400 }}>Connetti Phantom e crea il tuo token in meno di 60 secondi.</p>
            <button onClick={() => setShowApp(true)} className="px-12 py-5 rounded-2xl text-lg font-black text-white transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", boxShadow: "0 0 70px rgba(153,69,255,0.4)" }}>
              Crea il tuo token
            </button>
            <p className="text-xs mt-6" style={{ color: "rgba(255,255,255,0.18)" }}>Piano Starter da 0.1 SOL + fee di rete</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-14" style={{ zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-3">
              <Logo size={30} />
              <div>
                <div className="font-black text-white">SolMint</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Non-custodial Token Launcher su Solana</div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {[["Features", "#features"], ["Come funziona", "#come-funziona"], ["Prezzi", "#prezzi"], ["FAQ", "#faq"], ["Trending", "/trending"], ["Guide", "/guides"], ["AI Meme", "/ai-meme"]].map(([l, h]) => (
                <a key={l} href={h} className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.3)" }} onMouseEnter={e => (e.currentTarget.style.color = "white")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}>{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="text-xs" style={{ color: "rgba(255,255,255,0.22)" }} onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.22)")}>Privacy</a>
              <a href="/terms" className="text-xs" style={{ color: "rgba(255,255,255,0.22)" }} onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.22)")}>Termini</a>
              <a href="mailto:info@solmint.space" className="text-xs" style={{ color: "rgba(255,255,255,0.22)" }} onMouseEnter={e => (e.currentTarget.style.color = "#14F195")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.22)")}>info@solmint.space</a>
            </div>
          </div>
          <div className="text-center text-xs pt-8" style={{ color: "rgba(255,255,255,0.1)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            © 2026 SolMint. Tutti i diritti riservati. Costruito su Solana.
          </div>
        </div>
      </footer>
    </main>
  );
}