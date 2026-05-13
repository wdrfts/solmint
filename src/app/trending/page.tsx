"use client";

import { useState, useEffect, useCallback } from "react";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

interface Token {
  address: string;
  name: string;
  symbol: string;
  icon: string | null;
  description: string;
  links: { label: string; url: string }[];
  marketCap: number;
  price: string;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  age: number | null;
  dexUrl: string;
  isNew?: boolean;
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${Number(n || 0).toFixed(0)}`;
}

function timeAgo(ts: number | null): string {
  if (!ts) return "—";
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}g`;
  if (hours > 0) return `${hours}h`;
  return `${Math.max(mins, 0)}m`;
}

function TokenCard({
  token,
  index,
  onRecreate,
}: {
  token: Token;
  index: number;
  onRecreate: (token: Token) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [highlight, setHighlight] = useState(token.isNew || false);
  const isPositive = token.priceChange24h >= 0;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 45);
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (token.isNew) {
      setHighlight(true);
      const t = setTimeout(() => setHighlight(false), 3800);
      return () => clearTimeout(t);
    }
  }, [token.isNew]);

  return (
    <div
  className={`group relative overflow-hidden rounded-[28px] p-5 transition-all duration-500 hover:-translate-y-1 ${
    highlight ? "token-new" : ""
  }`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.98)",
        background: highlight
          ? "linear-gradient(135deg, rgba(153,69,255,0.18), rgba(20,241,149,0.10))"
          : "rgba(255,255,255,0.035)",
        border: highlight
          ? "1px solid rgba(20,241,149,0.45)"
          : "1px solid rgba(255,255,255,0.08)",
        boxShadow: highlight
          ? "0 0 55px rgba(20,241,149,0.20), 0 24px 70px rgba(0,0,0,0.35)"
          : "0 20px 60px rgba(0,0,0,0.20)",
      }}
    >
      {highlight && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute left-0 right-0 top-0 h-[2px]"
            style={{
              background: "linear-gradient(90deg, transparent, #14F195, #9945FF, transparent)",
              animation: "scanLine 1.8s ease-in-out infinite",
            }}
          />
        </div>
      )}

      <div
        className="absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-100"
        style={{ background: "rgba(153,69,255,0.22)" }}
      />

      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-14 w-14 shrink-0">
              <div
                className="absolute inset-0 rounded-full blur-md"
                style={{ background: "linear-gradient(135deg, rgba(153,69,255,0.65), rgba(20,241,149,0.35))" }}
              />

              {token.icon && (
                <img
                  src={token.icon}
                  alt={token.name}
                  className="absolute inset-0 z-20 h-14 w-14 rounded-full object-cover"
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              )}

              <div
                className="absolute inset-0 z-10 flex items-center justify-center rounded-full text-lg font-black text-white"
                style={{ background: "linear-gradient(135deg, #9945FF, #14F195)" }}
              >
                {token.symbol?.[0] || "?"}
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-black text-white">
                  {token.name?.length > 19 ? token.name.slice(0, 19) + "..." : token.name}
                </h3>

                {highlight && (
                  <span
                    className="token-new-badge rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white"
                    style={{ background: "linear-gradient(135deg, #9945FF, #14F195)" }}
                  >
                    New
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm font-bold" style={{ color: "rgba(255,255,255,0.38)" }}>
                ${token.symbol}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.26)" }}>
              Market Cap
            </p>
            <p className="text-lg font-black" style={{ color: "#14F195" }}>
              {formatNum(token.marketCap)}
            </p>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="mb-1 text-[10px] font-bold uppercase" style={{ color: "rgba(255,255,255,0.28)" }}>24h</p>
            <p className="text-sm font-black" style={{ color: isPositive ? "#14F195" : "#ff6b6b" }}>
              {isPositive ? "+" : ""}
              {Number(token.priceChange24h || 0).toFixed(1)}%
            </p>
          </div>

          <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="mb-1 text-[10px] font-bold uppercase" style={{ color: "rgba(255,255,255,0.28)" }}>Volume</p>
            <p className="text-sm font-black text-white">{formatNum(token.volume24h)}</p>
          </div>

          <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="mb-1 text-[10px] font-bold uppercase" style={{ color: "rgba(255,255,255,0.28)" }}>Età</p>
            <p className="text-sm font-black text-white">{timeAgo(token.age)}</p>
          </div>
        </div>

        {token.description && (
          <p className="mb-4 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
            {token.description.length > 92 ? token.description.slice(0, 92) + "..." : token.description}
          </p>
        )}

        <div className="mb-4 flex items-center gap-2">
          {token.links
            ?.filter((l: any) => l.url)
            .slice(0, 3)
            .map((link: any, i: number) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black no-underline transition-all hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.58)",
                }}
              >
                {link.label === "twitter" ? "𝕏" : link.label === "telegram" ? "✈" : "🌐"}
              </a>
            ))}

          <span className="ml-auto text-xs font-semibold" style={{ color: "rgba(255,255,255,0.22)" }}>
            {token.address.slice(0, 6)}...{token.address.slice(-4)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={token.dexUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl py-3 text-center text-sm font-black text-white no-underline transition-all hover:scale-[1.02]"
            style={{
              background: "rgba(255,255,255,0.065)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            DexScreener
          </a>

          <button
            onClick={() => onRecreate(token)}
            className="rounded-2xl border-0 py-3 text-sm font-black text-white transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #9945FF, #14F195)",
              boxShadow: "0 16px 35px rgba(153,69,255,0.22)",
            }}
          >
            🤖 Ricrea AI
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-[28px] p-5"
      style={{
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="mb-4 h-14 rounded-2xl" style={{ background: "rgba(255,255,255,0.06)" }} />
      <div className="mb-3 h-20 rounded-2xl" style={{ background: "rgba(255,255,255,0.045)" }} />
      <div className="h-12 rounded-2xl" style={{ background: "rgba(255,255,255,0.045)" }} />
    </div>
  );
}

export default function TrendingPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [filter, setFilter] = useState<"trending" | "gainers" | "new">("trending");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const fetchTokens = useCallback(async () => {
    try {
      const res = await fetch(`/api/trending?t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      const newTokens: Token[] = data.tokens || [];

      setTokens(prev => {
        const prevAddresses = new Set(prev.map((t: Token) => t.address));
        return newTokens.map((t: Token) => ({
          ...t,
          isNew: prevAddresses.size > 0 && !prevAddresses.has(t.address),
        }));
      });

      setLastUpdate(new Date());
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchTokens, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchTokens]);

  const recreateWithAI = async (token: Token) => {
    setSelectedToken(token);
    setAiResult(null);
    setAiError("");
    setAiLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "recreate",
          tokenData: token,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Errore AI");
      }

      setAiResult(data);
    } catch (e: any) {
      setAiError(e?.message || "Errore durante la ricreazione AI");
    } finally {
      setAiLoading(false);
    }
  };

  const useAIToken = () => {
    if (!aiResult) return;

    sessionStorage.setItem(
      "aiTokenDraft",
      JSON.stringify({
        name: aiResult.name || "",
        symbol: aiResult.symbol || "",
        description: aiResult.description || "",
        imageBase64: aiResult.imageBase64 || null,
      })
    );

    window.location.href = "/?app=true";
  };

  const filtered = [...tokens].sort((a, b) => {
    if (filter === "gainers") return b.priceChange24h - a.priceChange24h;
    if (filter === "new") return (b.age || 0) - (a.age || 0);
    return b.marketCap - a.marketCap;
  });

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: "#07070f", color: "white" }}>
      <SiteNavbar />

      <style jsx global>{`
  @keyframes scanLine {
    0% {
      transform: translateX(-120%);
      opacity: 0;
    }

    30% {
      opacity: 1;
    }

    100% {
      transform: translateX(120%);
      opacity: 0;
    }
  }

  @keyframes tokenPop {
    0% {
      opacity: 0;
      transform: translateY(40px) scale(0.92);
      filter: blur(10px);
    }

    40% {
      opacity: 1;
      transform: translateY(-6px) scale(1.02);
      filter: blur(0px);
    }

    60% {
      transform: translateY(2px) scale(0.995);
    }

    100% {
      opacity: 1;
      transform: translateY(0px) scale(1);
      filter: blur(0px);
    }
  }

  @keyframes newGlow {
    0% {
      box-shadow:
        0 0 0 rgba(20,241,149,0),
        0 0 0 rgba(153,69,255,0);
    }

    50% {
      box-shadow:
        0 0 40px rgba(20,241,149,0.28),
        0 0 80px rgba(153,69,255,0.22);
    }

    100% {
      box-shadow:
        0 0 0 rgba(20,241,149,0),
        0 0 0 rgba(153,69,255,0);
    }
  }

  @keyframes badgePulse {
    0% {
      transform: scale(0.95);
      opacity: 0.7;
    }

    50% {
      transform: scale(1.08);
      opacity: 1;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .token-new {
    animation:
      tokenPop 0.8s cubic-bezier(.22,1,.36,1),
      newGlow 2.5s ease-in-out;
  }

  .token-new-badge {
    animation: badgePulse 1s ease-in-out infinite;
  }
`}</style>

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

      <section className="relative z-10 px-4 sm:px-6 pt-36 pb-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest"
              style={{
                background: "rgba(20,241,149,0.08)",
                border: "1px solid rgba(20,241,149,0.18)",
                color: "#14F195",
              }}
            >
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ background: "#14F195", boxShadow: "0 0 10px #14F195" }}
              />
              Live Solana Radar
              {lastUpdate && (
                <span className="normal-case tracking-normal font-semibold" style={{ color: "rgba(255,255,255,0.35)" }}>
                  · {lastUpdate.toLocaleTimeString("it-IT")}
                </span>
              )}
            </div>

            <h1
              className="mx-auto mb-5 max-w-4xl font-black leading-[0.95]"
              style={{
                fontSize: "clamp(44px, 8vw, 86px)",
                letterSpacing: "-0.055em",
              }}
            >
              Token che stanno
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #9945FF, #14F195)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                pompando ora.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.43)" }}>
              Scopri i token Solana live da DexScreener, studia narrativa e momentum, poi usa AI per ricreare una variante originale.
            </p>
          </div>

          <div
            className="mb-8 flex flex-col gap-4 rounded-[28px] p-4 sm:flex-row sm:items-center sm:justify-between"
            style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              className="grid grid-cols-3 gap-1 rounded-2xl p-1"
              style={{
                background: "rgba(255,255,255,0.045)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {(["trending", "gainers", "new"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="rounded-xl px-3 py-3 text-xs sm:text-sm font-black transition-all"
                  style={{
                    border: "none",
                    cursor: "pointer",
                    background: filter === f ? "linear-gradient(135deg, #9945FF, #14F195)" : "transparent",
                    color: filter === f ? "white" : "rgba(255,255,255,0.42)",
                  }}
                >
                  {f === "trending" ? "🔥 Trending" : f === "gainers" ? "📈 Gainers" : "🆕 New"}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.42)" }}>
                Auto-refresh
              </span>

              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="relative h-7 w-12 rounded-full border-0 transition-all"
                style={{
                  cursor: "pointer",
                  background: autoRefresh ? "linear-gradient(135deg, #9945FF, #14F195)" : "rgba(255,255,255,0.1)",
                }}
              >
                <span
                  className="absolute top-1 h-5 w-5 rounded-full bg-white transition-all"
                  style={{ left: autoRefresh ? 25 : 4 }}
                />
              </button>

              <button
                onClick={fetchTokens}
                className="rounded-2xl px-4 py-2 text-sm font-black transition-all hover:scale-105"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.055)",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Aggiorna
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
              : filtered.map((token, i) => (
                  <TokenCard key={token.address} token={token} index={i} onRecreate={recreateWithAI} />
                ))}
          </div>

          {!loading && filtered.length === 0 && (
            <div className="py-24 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
              <div className="mb-4 text-5xl">🔍</div>
              <p>Nessun token trovato. Riprova tra qualche secondo.</p>
            </div>
          )}
        </div>
      </section>

      {selectedToken && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(12px)",
          }}
          onClick={() => {
            if (!aiLoading) {
              setSelectedToken(null);
              setAiResult(null);
              setAiError("");
            }
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-2xl rounded-[30px] p-5 sm:p-7"
            style={{
              background: "#0b0b16",
              border: "1px solid rgba(153,69,255,0.3)",
              boxShadow: "0 0 90px rgba(153,69,255,0.28)",
            }}
          >
            <div className="mb-6 flex justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-widest" style={{ color: "#14F195" }}>
                  Ricrea con AI
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Ispirato a {selectedToken.name}
                </h2>
              </div>

              <button
                disabled={aiLoading}
                onClick={() => {
                  setSelectedToken(null);
                  setAiResult(null);
                  setAiError("");
                }}
                className="h-10 w-10 rounded-2xl text-2xl text-white"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)",
                  cursor: aiLoading ? "not-allowed" : "pointer",
                }}
              >
                ×
              </button>
            </div>

            {aiLoading && (
              <div className="py-14 text-center">
                <div className="mb-4 text-5xl">🤖</div>
                <p className="mb-2 font-black text-white">Analizzo trend, metriche e viralità...</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Creo una variante originale ispirata al token.
                </p>
              </div>
            )}

            {aiError && (
              <div
                className="rounded-2xl p-4 text-sm"
                style={{
                  background: "rgba(255,60,60,0.08)",
                  border: "1px solid rgba(255,60,60,0.2)",
                  color: "#ff6b6b",
                }}
              >
                {aiError}
              </div>
            )}

            {aiResult && !aiLoading && (
              <div>
                <div className="mb-5 flex flex-wrap gap-5">
                  {aiResult.imageBase64 ? (
                    <img
                      src={aiResult.imageBase64}
                      alt={aiResult.name}
                      className="h-24 w-24 rounded-full object-cover"
                      style={{ border: "3px solid rgba(153,69,255,0.4)" }}
                    />
                  ) : (
                    <div
                      className="flex h-24 w-24 items-center justify-center rounded-full text-4xl font-black"
                      style={{ background: "linear-gradient(135deg, #9945FF, #14F195)" }}
                    >
                      {aiResult.symbol?.[0] || "?"}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-3xl font-black text-white">{aiResult.name}</h3>
                    <p className="mb-3 font-black" style={{ color: "#9945FF" }}>
                      ${aiResult.symbol}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {aiResult.description}
                    </p>
                  </div>
                </div>

                {(aiResult.why || aiResult.twist) && (
                  <div
                    className="mb-4 rounded-2xl p-4"
                    style={{
                      background: "rgba(20,241,149,0.05)",
                      border: "1px solid rgba(20,241,149,0.15)",
                    }}
                  >
                    <p className="mb-2 text-xs font-black uppercase tracking-widest" style={{ color: "#14F195" }}>
                      Perché può diventare virale
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {aiResult.why || aiResult.twist}
                    </p>
                  </div>
                )}

                {aiResult.strategy && (
                  <div
                    className="mb-6 rounded-2xl p-4"
                    style={{
                      background: "rgba(153,69,255,0.05)",
                      border: "1px solid rgba(153,69,255,0.15)",
                    }}
                  >
                    <p className="mb-2 text-xs font-black uppercase tracking-widest" style={{ color: "#9945FF" }}>
                      Strategia
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {aiResult.strategy}
                    </p>
                  </div>
                )}

                <button
                  onClick={useAIToken}
                  className="w-full rounded-2xl border-0 p-4 font-black text-white transition-all hover:scale-[1.01]"
                  style={{ background: "linear-gradient(135deg, #9945FF, #14F195)" }}
                >
                  Usa questo token — Apri SolMint
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <SiteFooter />
    </main>
  );
}