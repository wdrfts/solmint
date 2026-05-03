"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

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
  return `$${n.toFixed(0)}`;
}

function timeAgo(ts: number | null): string {
  if (!ts) return "—";
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}g`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
}

function TokenCard({ token, index }: { token: Token; index: number }) {
  const [visible, setVisible] = useState(false);
  const [highlight, setHighlight] = useState(token.isNew || false);
  const isPositive = token.priceChange24h >= 0;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 60);
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (token.isNew) {
      setHighlight(true);
      const t = setTimeout(() => setHighlight(false), 3000);
      return () => clearTimeout(t);
    }
  }, [token.isNew]);

  return (
    <div
      className={visible ? "animate-token-reveal" : ""}
      style={{
        opacity: visible ? 1 : 0,
        background: highlight
          ? "linear-gradient(135deg, rgba(153,69,255,0.15), rgba(20,241,149,0.08))"
          : "rgba(255,255,255,0.03)",
        border: highlight
          ? "1px solid rgba(153,69,255,0.5)"
          : "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20,
        padding: 20,
        transition: "all 0.5s",
        cursor: "default",
        boxShadow: highlight ? "0 0 30px rgba(153,69,255,0.2)" : "none",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(153,69,255,0.4)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = highlight ? "rgba(153,69,255,0.5)" : "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* NEW badge */}
      {highlight && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 100, background: "linear-gradient(135deg, #9945FF, #14F195)", color: "white", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            NEW
          </span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
            {token.icon && (
              <img
                src={token.icon}
                alt={token.name}
                style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", position: "absolute", inset: 0, zIndex: 2 }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            )}
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #9945FF, #14F195)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "white" }}>
              {token.symbol?.[0] || "?"}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "white", marginBottom: 2 }}>
              {token.name?.length > 18 ? token.name.slice(0, 18) + "..." : token.name}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>${token.symbol}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>Market Cap</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#14F195" }}>{formatNum(token.marketCap)}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 10px" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>24h</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: isPositive ? "#14F195" : "#ff6b6b" }}>
            {isPositive ? "+" : ""}{token.priceChange24h?.toFixed(1)}%
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 10px" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>Volume</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{formatNum(token.volume24h)}</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 10px" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>Età</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{timeAgo(token.age)}</div>
        </div>
      </div>

      {/* Description */}
      {token.description && (
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.5, marginBottom: 12 }}>
          {token.description.length > 80 ? token.description.slice(0, 80) + "..." : token.description}
        </p>
      )}

      {/* Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        {token.links?.filter((l: any) => l.url).slice(0, 3).map((link: any, i: number) => (
          <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
            style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
            {link.label === "twitter" ? "𝕏" : link.label === "telegram" ? "✈" : "🌐"}
          </a>
        ))}
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginLeft: "auto" }}>
          {token.address.slice(0, 6)}...{token.address.slice(-4)}
        </span>
      </div>

      {/* Button */}
      <a
        href={token.dexUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "block", width: "100%", padding: "12px 0", borderRadius: 14, background: "linear-gradient(135deg, #9945FF, #14F195)", color: "white", fontSize: 13, fontWeight: 800, textAlign: "center", textDecoration: "none", letterSpacing: "0.02em" }}
      >
        Vedi su Dexscreener
      </a>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 20 }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div className="skeleton" style={{ width: 48, height: 48, borderRadius: "50%", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 16, width: "60%", marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 12, width: "30%" }} />
        </div>
        <div style={{ width: 80 }}>
          <div className="skeleton" style={{ height: 12, marginBottom: 6 }} />
          <div className="skeleton" style={{ height: 20 }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[0, 1, 2].map(i => <div key={i} className="skeleton" style={{ height: 50, borderRadius: 10 }} />)}
      </div>
      <div className="skeleton" style={{ height: 42, borderRadius: 14 }} />
    </div>
  );
}

export default function TrendingPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [filter, setFilter] = useState<"trending" | "gainers" | "new">("trending");
  const [autoRefresh, setAutoRefresh] = useState(true);

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
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchTokens, 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchTokens]);

  const filtered = [...tokens].sort((a, b) => {
    if (filter === "gainers") return b.priceChange24h - a.priceChange24h;
    if (filter === "new") return (b.age || 0) - (a.age || 0);
    return b.marketCap - a.marketCap;
  });

  return (
    <main style={{ minHeight: "100vh", background: "#07070f", color: "white" }}>

      {/* Gradient bg */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", width: 700, height: 700, top: -300, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle, rgba(153,69,255,0.1) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", width: 500, height: 500, bottom: "10%", right: "-150px", background: "radial-gradient(circle, rgba(20,241,149,0.06) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, padding: "16px 24px", background: "rgba(7,7,15,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="url(#tLg)" />
              <circle cx="16" cy="16" r="6" stroke="white" strokeWidth="2" fill="none" />
              <path d="M16 10V8M16 24v-2M10 16H8M24 16h-2" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <defs><linearGradient id="tLg" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#9945FF" /><stop offset="1" stopColor="#14F195" /></linearGradient></defs>
            </svg>
            <span style={{ fontWeight: 900, fontSize: 18, color: "white" }}>SolMint</span>
          </Link>
          <div style={{ display: "flex", gap: 24 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Home</Link>
            <Link href="/trending" style={{ color: "white", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>Trending</Link>
            <Link href="/guides" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Guide</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#14F195", boxShadow: "0 0 12px #14F195" }} className="animate-pulse-glow" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#14F195", textTransform: "uppercase", letterSpacing: "0.1em" }}>Live</span>
            {lastUpdate && (
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                Aggiornato {lastUpdate.toLocaleTimeString("it-IT")}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 12 }}>
            Trending
            <span style={{ background: "linear-gradient(90deg, #9945FF, #14F195)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> Solana</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>
            I token Solana più caldi in questo momento. Dati live da DexScreener.
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 4 }}>
            {(["trending", "gainers", "new"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "all 0.15s", background: filter === f ? "linear-gradient(135deg, #9945FF, #14F195)" : "transparent", color: filter === f ? "white" : "rgba(255,255,255,0.4)" }}>
                {f === "trending" ? "🔥 Trending" : f === "gainers" ? "📈 Gainers" : "🆕 New"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Auto-refresh</span>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: autoRefresh ? "#9945FF" : "rgba(255,255,255,0.1)", position: "relative", transition: "background 0.2s" }}
            >
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: autoRefresh ? 23 : 3, transition: "left 0.2s" }} />
            </button>
            <button
              onClick={fetchTokens}
              style={{ padding: "6px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
            >
              Aggiorna
            </button>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((token, i) => (
                <TokenCard key={token.address} token={token} index={i} />
              ))
          }
        </div>

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p>Nessun token trovato. Riprova tra qualche secondo.</p>
          </div>
        )}
      </div>
    </main>
  );
}