"use client";

import { useEffect, useState } from "react";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

const NICHES = [
  "Animali",
  "Politica",
  "Gaming",
  "Crypto/AI",
  "Sport",
  "Cibo",
  "Musica",
  "Film/TV",
  "Meme classici",
  "Sorpresa",
];

const TONES = [
  "Divertente",
  "Aggressivo",
  "Wholesome",
  "Ironico",
  "Epico",
  "Cringe",
];

const MARKETS = ["Globale", "Italiano", "Americano", "Asiatico"];

interface AIResult {
  name: string;
  symbol: string;
  description: string;
  imagePrompt: string;
  imageBase64?: string | null;
  why?: string;
  strategy?: string;
  twist?: string;
}

function PillButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-4 py-2 text-sm font-bold transition-all hover:scale-105"
      style={{
        border: active ? "1px solid rgba(20,241,149,0.35)" : "1px solid rgba(255,255,255,0.1)",
        background: active
          ? "linear-gradient(135deg, rgba(153,69,255,0.95), rgba(20,241,149,0.95))"
          : "rgba(255,255,255,0.045)",
        color: active ? "white" : "rgba(255,255,255,0.62)",
        boxShadow: active ? "0 14px 35px rgba(153,69,255,0.22)" : "none",
      }}
    >
      {children}
    </button>
  );
}

function ResultCard({ result, onUse }: { result: AIResult; onUse: () => void }) {
  const copyTicker = async () => {
    await navigator.clipboard.writeText(`$${result.symbol}`);
  };

  return (
    <div
      className="relative overflow-hidden rounded-[34px] p-6 sm:p-8"
      style={{
        background: "linear-gradient(135deg, rgba(153,69,255,0.12), rgba(20,241,149,0.055))",
        border: "1px solid rgba(153,69,255,0.28)",
        boxShadow: "0 0 80px rgba(153,69,255,0.15)",
      }}
    >
      <div
        className="absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
        style={{ background: "rgba(153,69,255,0.22)" }}
      />

      <div className="relative z-10">
        <div className="mb-7 flex flex-col gap-6 sm:flex-row">
          {result.imageBase64 ? (
            <img
              src={result.imageBase64}
              alt={result.name}
              className="h-36 w-36 rounded-[32px] object-cover"
              style={{
                border: "3px solid rgba(153,69,255,0.4)",
                boxShadow: "0 22px 60px rgba(0,0,0,0.35)",
              }}
            />
          ) : (
            <div
              className="flex h-36 w-36 items-center justify-center rounded-[32px] text-5xl font-black text-white"
              style={{
                background: "linear-gradient(135deg, #9945FF, #14F195)",
                boxShadow: "0 22px 60px rgba(153,69,255,0.30)",
              }}
            >
              {result.symbol?.[0] || "?"}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="mb-2 text-xs font-black uppercase tracking-widest" style={{ color: "#14F195" }}>
              AI Token Concept
            </p>

            <h2 className="mb-2 text-4xl font-black leading-tight text-white">
              {result.name}
            </h2>

            <button
              onClick={copyTicker}
              className="mb-4 rounded-full px-4 py-2 text-sm font-black transition-all hover:scale-105"
              style={{
                color: "#9945FF",
                background: "rgba(153,69,255,0.09)",
                border: "1px solid rgba(153,69,255,0.2)",
              }}
            >
              ${result.symbol} · copia ticker
            </button>

            <p className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.62)" }}>
              {result.description}
            </p>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          {(result.why || result.twist) && (
            <div
              className="rounded-3xl p-5"
              style={{
                background: "rgba(20,241,149,0.055)",
                border: "1px solid rgba(20,241,149,0.16)",
              }}
            >
              <p className="mb-3 text-xs font-black uppercase tracking-widest" style={{ color: "#14F195" }}>
                Viral angle
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.62)" }}>
                {result.why || result.twist}
              </p>
            </div>
          )}

          {result.strategy && (
            <div
              className="rounded-3xl p-5"
              style={{
                background: "rgba(153,69,255,0.06)",
                border: "1px solid rgba(153,69,255,0.18)",
              }}
            >
              <p className="mb-3 text-xs font-black uppercase tracking-widest" style={{ color: "#9945FF" }}>
                Launch strategy
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.62)" }}>
                {result.strategy}
              </p>
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={onUse}
            className="rounded-2xl border-0 p-4 font-black text-white transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #9945FF, #14F195)",
              boxShadow: "0 20px 50px rgba(153,69,255,0.28)",
            }}
          >
            Usa questo token — Apri SolMint
          </button>

          <a
            href="/trending"
            className="rounded-2xl p-4 text-center font-black no-underline transition-all hover:scale-[1.02]"
            style={{
              color: "rgba(255,255,255,0.75)",
              background: "rgba(255,255,255,0.055)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            Torna ai trend
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AIMeme() {
  const [mounted, setMounted] = useState(false);
  const [answers, setAnswers] = useState({
    niche: "",
    tone: "",
    market: "",
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState("");
  const [loadingMsg, setLoadingMsg] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const msgs = [
    "Analizzo i trend attuali...",
    "Studio narrativa e momentum...",
    "Creo nome e ticker...",
    "Genero il logo AI...",
    "Preparo la strategia...",
  ];

  const isDisabled =
    !Boolean(answers.niche) ||
    !Boolean(answers.tone) ||
    !Boolean(answers.market) ||
    loading;

  const generate = async () => {
    if (isDisabled) return;

    setLoading(true);
    setError("");
    setResult(null);

    let i = 0;
    setLoadingMsg(msgs[0]);

    const msgInterval = setInterval(() => {
      i = (i + 1) % msgs.length;
      setLoadingMsg(msgs[i]);
    }, 3500);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "meme-idea",
          answers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Errore AI");
      }

      setResult(data);
    } catch (e: any) {
      setError(e?.message || "Errore durante la generazione");
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
    }
  };

  const useToken = () => {
    if (!result) return;

    sessionStorage.setItem(
      "aiTokenDraft",
      JSON.stringify({
        name: result.name || "",
        symbol: result.symbol || "",
        description: result.description || "",
        imageBase64: result.imageBase64 || null,
      })
    );

    window.location.href = "/?app=true";
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: "#07070f", color: "white" }}>
      <SiteNavbar />

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

      <section className="relative z-10 px-4 sm:px-6 pt-36 pb-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest"
              style={{
                background: "rgba(153,69,255,0.1)",
                border: "1px solid rgba(153,69,255,0.22)",
                color: "#9945FF",
              }}
            >
              🤖 AI Meme Generator
            </div>

            <h1
              className="mx-auto mb-5 max-w-4xl font-black leading-[0.95]"
              style={{
                fontSize: "clamp(44px, 8vw, 86px)",
                letterSpacing: "-0.055em",
              }}
            >
              Crea una meme coin
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #9945FF, #14F195)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                partendo dai trend.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.43)" }}>
              L’AI analizza i token Solana più caldi e genera nome, ticker, descrizione, logo e strategia di lancio.
            </p>
          </div>

          {!loading && !result && (
            <div className="grid gap-6 lg:grid-cols-[1fr_0.72fr]">
              <div
                className="rounded-[34px] p-5 sm:p-7"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.24)",
                }}
              >
                <div className="mb-6">
                  <p className="mb-2 text-xs font-black uppercase tracking-widest" style={{ color: "#14F195" }}>
                    Configura idea
                  </p>
                  <h2 className="text-2xl font-black text-white">Scegli il DNA del token</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="mb-3 text-xs font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.34)" }}>
                      Che nicchia vuoi?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {NICHES.map(n => (
                        <PillButton
                          key={n}
                          active={answers.niche === n}
                          onClick={() => setAnswers(a => ({ ...a, niche: n }))}
                        >
                          {n}
                        </PillButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.34)" }}>
                      Che tono?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TONES.map(t => (
                        <PillButton
                          key={t}
                          active={answers.tone === t}
                          onClick={() => setAnswers(a => ({ ...a, tone: t }))}
                        >
                          {t}
                        </PillButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.34)" }}>
                      Mercato target?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {MARKETS.map(m => (
                        <PillButton
                          key={m}
                          active={answers.market === m}
                          onClick={() => setAnswers(a => ({ ...a, market: m }))}
                        >
                          {m}
                        </PillButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.34)" }}>
                      Hai un nome in mente? opzionale
                    </p>
                    <input
                      placeholder="es. PizzaCoin, DogeMario..."
                      value={answers.name}
                      onChange={e => setAnswers(a => ({ ...a, name: e.target.value }))}
                      className="w-full rounded-2xl px-4 py-4 text-sm outline-none"
                      style={{
                        background: "rgba(255,255,255,0.055)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "white",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>

                  {error && (
                    <div
                      className="rounded-2xl p-4 text-sm"
                      style={{
                        background: "rgba(255,60,60,0.08)",
                        border: "1px solid rgba(255,60,60,0.2)",
                        color: "#ff6b6b",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <button
                    onClick={generate}
                    disabled={isDisabled}
                    className="w-full rounded-2xl border-0 p-5 text-base font-black text-white transition-all hover:scale-[1.01]"
                    style={{
                      background: isDisabled
                        ? "rgba(255,255,255,0.06)"
                        : "linear-gradient(135deg, #9945FF, #14F195)",
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      boxShadow: !isDisabled ? "0 0 55px rgba(153,69,255,0.28)" : "none",
                      opacity: isDisabled ? 0.45 : 1,
                    }}
                  >
                    Genera token con AI
                  </button>
                </div>
              </div>

              <aside
                className="rounded-[34px] p-6"
                style={{
                  background: "linear-gradient(135deg, rgba(153,69,255,0.10), rgba(20,241,149,0.045))",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p className="mb-3 text-xs font-black uppercase tracking-widest" style={{ color: "#9945FF" }}>
                  Come funziona
                </p>

                <div className="space-y-4">
                  {[
                    ["01", "Legge i trend Solana live"],
                    ["02", "Trova una narrativa non satura"],
                    ["03", "Crea nome, ticker e lore"],
                    ["04", "Genera logo e strategia"],
                  ].map(([n, text]) => (
                    <div key={n} className="flex items-center gap-4 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black"
                        style={{ background: "linear-gradient(135deg, #9945FF, #14F195)" }}
                      >
                        {n}
                      </span>
                      <span className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.72)" }}>
                        {text}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
                  Dopo la generazione puoi mandare il concept direttamente al launcher e creare il token.
                </p>
              </aside>
            </div>
          )}

          {loading && (
            <div className="mx-auto max-w-xl py-20 text-center">
              <div
                className="mx-auto mb-8 h-24 w-24 rounded-full"
                style={{
                  border: "3px solid rgba(153,69,255,0.2)",
                  borderTop: "3px solid #9945FF",
                  animation: "spin 1s linear infinite",
                }}
              />

              <p className="mb-2 text-xl font-black text-white">{loadingMsg}</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                L’AI sta creando un concept pronto per il lancio.
              </p>

              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {result && !loading && (
            <div className="mx-auto max-w-4xl">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black text-white">Il tuo token AI</h2>

                <button
                  onClick={() => {
                    setResult(null);
                    setError("");
                  }}
                  className="rounded-2xl px-4 py-2 text-sm font-black transition-all hover:scale-105"
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.055)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Rigenera
                </button>
              </div>

              <ResultCard result={result} onUse={useToken} />
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}