"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import TokenForm from "@/components/TokenForm";
import LiquidityPool from "@/components/LiquidityPool";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then(m => m.WalletMultiButton),
  { ssr: false }
);

const features = [
  { icon: "◎", title: "Token SPL reali", desc: "Token creati direttamente on-chain con metadata IPFS. Appaiono su Dexscreener, Axiom, Jupiter e tutti i DEX principali." },
  { icon: "🔒", title: "Revoke authorities", desc: "Revoca Mint, Freeze e Update authority per rendere il tuo token completamente decentralizzato e trustless." },
  { icon: "💧", title: "Liquidity Pool", desc: "Crea pool su Raydium CPMM con fee tier personalizzabili. Aggiungi e rimuovi liquidita direttamente dal sito." },
  { icon: "🖼", title: "Metadata su IPFS", desc: "Logo, nome, simbolo, website, Twitter e Telegram salvati permanentemente su IPFS tramite Pinata." },
  { icon: "⚡", title: "Un click tutto fatto", desc: "Connetti Phantom, compila il form, firma la transazione. Il tuo token e live in meno di 60 secondi." },
  { icon: "🛡", title: "100% legit", desc: "Nessun wallet privato custodito, nessun database, nessuna truffa. Tutto open source e verificabile." },
];

const steps = [
  { step: "01", title: "Connetti Phantom", desc: "Collega il tuo wallet Phantom o Solflare. Nessuna registrazione, nessun email." },
  { step: "02", title: "Configura il token", desc: "Inserisci nome, simbolo, supply, decimali, carica il logo e aggiungi i link social. Scegli quali authority revocare." },
  { step: "03", title: "Firma e lancia", desc: "Paga la piccola fee in SOL, firma la transazione con Phantom. Il token appare subito su Solscan e tutti i DEX." },
];

const plans = [
  {
    name: "Starter",
    price: "0.1",
    sub: "solo fee di rete",
    features: ["Token SPL base", "Metadata su IPFS", "Logo e link social"],
    featured: false,
  },
  {
    name: "Standard",
    price: "0.2",
    sub: "SOL + fee di rete",
    features: ["Tutto di Starter", "1 revoke a scelta", "Priorita di elaborazione"],
    featured: true,
  },
  {
    name: "Pro",
    price: "0.4",
    sub: "SOL + fee di rete",
    features: ["Tutto di Starter", "Tutte e 3 le revoke incluse", "Supporto prioritario"],
    featured: false,
  },
];

const stats = [
  { value: "0.1 SOL", label: "Piano base" },
  { value: "60s", label: "Tempo medio" },
  { value: "100%", label: "On-chain" },
  { value: "3", label: "Click per lanciare" },
];

export default function Home() {
  const [tab, setTab] = useState("create");
  const [showApp, setShowApp] = useState(false);

  if (showApp) {
    return (
      <main className="min-h-screen bg-gray-950">
        <header className="border-b border-gray-800 px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowApp(false)}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)" }}>S</div>
              <span className="font-medium text-white">SolMint</span>
              <span className="text-xs px-2 py-0.5 bg-purple-900/40 text-purple-400 border border-purple-800 rounded-full">Mainnet</span>
            </div>
            <WalletMultiButton style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", borderRadius: "12px", fontSize: "13px", padding: "8px 16px", height: "auto" }} />
          </div>
        </header>
        <div className="max-w-2xl mx-auto px-6 pt-8 pb-2">
          <div className="flex gap-2 bg-gray-900 p-1 rounded-xl mb-6">
            <button onClick={() => setTab("create")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "create" ? "bg-gray-700 text-white" : "text-gray-400"}`}>Crea Token</button>
            <button onClick={() => setTab("pool")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "pool" ? "bg-gray-700 text-white" : "text-gray-400"}`}>Liquidity Pool</button>
          </div>
        </div>
        {tab === "create" ? <TokenForm /> : <LiquidityPool />}
        <footer className="text-center py-8 text-xs text-gray-600">SolMint — Powered by Solana and Metaplex</footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50 backdrop-blur-md bg-gray-950/80 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)" }}>S</div>
            <span className="font-semibold text-white text-lg">SolMint</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#how" className="text-sm text-gray-400 hover:text-white transition-colors">Come funziona</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Prezzi</a>
          </div>
          <button onClick={() => setShowApp(true)} className="px-5 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)" }}>
            Lancia App
          </button>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 text-center relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #9945FF, transparent)" }} />
        </div>
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-800/50 bg-purple-900/20 text-purple-300 text-sm mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            100% non-custodial
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Crea il tuo
            <span className="block" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Token Solana
            </span>
            in 60 secondi
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Nessun codice. Nessun intermediario. Crea, lancia e gestisci il tuo token SPL direttamente on-chain con Phantom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowApp(true)} className="px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all hover:scale-105 hover:opacity-90" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)" }}>
              Inizia ora
            </button>
            <a href="#how" className="px-8 py-4 rounded-2xl text-base font-medium text-gray-300 border border-gray-700 hover:border-gray-500 transition-all">
              Come funziona
            </a>
          </div>
          <p className="text-xs text-gray-600 mt-6">Connetti Phantom e sei pronto. Nessuna registrazione richiesta.</p>
        </div>
      </section>

      <section className="py-12 px-6 border-y border-gray-800/50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-3xl font-bold mb-1" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tutto quello che ti serve</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Una piattaforma completa per creare e gestire token Solana professionali.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-colors">
                <div className="text-2xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="py-24 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Come funziona</h2>
            <p className="text-gray-400">Tre step e il tuo token e live su Solana.</p>
          </div>
          <div className="space-y-6">
            {steps.map(s => (
              <div key={s.step} className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: "linear-gradient(135deg, #9945FF20, #14F19520)", border: "1px solid #9945FF40", color: "#9945FF" }}>
                  {s.step}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-semibold text-white mb-1">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Prezzi trasparenti</h2>
            <p className="text-gray-400">Paghi solo quello che usi. Nessun abbonamento.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map(p => (
              <div key={p.name} className={`rounded-2xl p-6 ${p.featured ? "border-2 border-purple-500 bg-purple-900/10" : "border border-gray-800 bg-gray-900"}`}>
                {p.featured && <div className="text-xs text-purple-400 font-medium mb-3">Piu scelto</div>}
                <div className="text-lg font-semibold mb-1">{p.name}</div>
                <div className="text-3xl font-bold mb-1" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{p.price} SOL</div>
                <div className="text-xs text-gray-500 mb-6">{p.sub}</div>
                <div className="space-y-3">
                  {p.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-4 h-4 rounded-full bg-green-900/40 border border-green-800 flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowApp(true)}
                  className={`w-full mt-6 py-3 rounded-xl text-sm font-medium transition-all ${p.featured ? "text-white hover:opacity-90" : "text-gray-300 border border-gray-700 hover:border-gray-500"}`}
                  style={p.featured ? { background: "linear-gradient(135deg, #9945FF, #14F195)" } : {}}
                >
                  Inizia ora
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto a lanciare?</h2>
          <p className="text-gray-400 mb-8">Connetti il wallet e crea il tuo token in meno di 60 secondi.</p>
          <button onClick={() => setShowApp(true)} className="px-10 py-4 rounded-2xl text-base font-semibold text-white transition-all hover:scale-105 hover:opacity-90" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)" }}>
            Lancia il tuo token
          </button>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8 px-6">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)" }}>S</div>
      <span className="text-sm text-gray-500">SolMint — Powered by Solana and Metaplex</span>
    </div>
    <div className="flex items-center gap-6">
      <a href="/privacy" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Privacy Policy</a>
      <a href="/terms" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Termini e Condizioni</a>
      <span className="text-xs text-gray-600"><a href="mailto:info@solmint.space">info@solmint.space</a></span>
    </div>
  </div>
</footer>

    </main>
  );
}