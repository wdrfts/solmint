"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  "Cringe (in senso buono)",
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

function ResultCard({
  result,
  onUse,
}: {
  result: AIResult;
  onUse: () => void;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(153,69,255,0.3)",
        borderRadius: 24,
        padding: 32,
        boxShadow: "0 0 60px rgba(153,69,255,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 24,
          marginBottom: 28,
          flexWrap: "wrap",
        }}
      >
        {result.imageBase64 ? (
          <img
            src={result.imageBase64}
            alt={result.name}
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid rgba(153,69,255,0.4)",
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #9945FF, #14F195)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 900,
              color: "white",
              flexShrink: 0,
            }}
          >
            {result.symbol?.[0] || "?"}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: "white",
              marginBottom: 4,
              letterSpacing: "-0.02em",
            }}
          >
            {result.name}
          </div>

          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#9945FF",
              marginBottom: 12,
            }}
          >
            ${result.symbol}
          </div>

          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
            }}
          >
            {result.description}
          </p>
        </div>
      </div>

      {(result.why || result.twist) && (
        <div
          style={{
            padding: "16px 20px",
            background: "rgba(20,241,149,0.05)",
            border: "1px solid rgba(20,241,149,0.15)",
            borderRadius: 16,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#14F195",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 6,
            }}
          >
            {result.why ? "Perché può diventare virale" : "Il twist unico"}
          </div>

          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.6,
            }}
          >
            {result.why || result.twist}
          </p>
        </div>
      )}

      {result.strategy && (
        <div
          style={{
            padding: "16px 20px",
            background: "rgba(153,69,255,0.05)",
            border: "1px solid rgba(153,69,255,0.15)",
            borderRadius: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9945FF",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 6,
            }}
          >
            Strategia di lancio
          </div>

          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.6,
            }}
          >
            {result.strategy}
          </p>
        </div>
      )}

      <button
        onClick={onUse}
        style={{
          width: "100%",
          padding: "18px",
          borderRadius: 16,
          border: "none",
          background: "linear-gradient(135deg, #9945FF, #14F195)",
          color: "white",
          fontSize: 15,
          fontWeight: 800,
          cursor: "pointer",
          boxShadow: "0 0 40px rgba(153,69,255,0.3)",
        }}
      >
        Usa questo token — Apri SolMint
      </button>
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
    "Cerco l'idea perfetta...",
    "Scrivo la descrizione...",
    "Genero il logo con AI...",
    "Quasi pronto...",
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
    }, 4000);

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

  const s = {
    card: {
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 24,
      padding: 32,
    } as React.CSSProperties,
  };

  if (!mounted) {
    return null;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07070f",
        color: "white",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            top: -300,
            left: "50%",
            transform: "translateX(-50%)",
            background:
              "radial-gradient(circle, rgba(153,69,255,0.1) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "16px 24px",
          background: "rgba(7,7,15,0.96)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="url(#aiLg)" />
              <circle
                cx="16"
                cy="16"
                r="6"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M16 10V8M16 24v-2M10 16H8M24 16h-2"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="aiLg" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#9945FF" />
                  <stop offset="1" stopColor="#14F195" />
                </linearGradient>
              </defs>
            </svg>

            <span
              style={{
                fontWeight: 900,
                fontSize: 18,
                color: "white",
              }}
            >
              SolMint
            </span>
          </Link>

          <div style={{ display: "flex", gap: 20 }}>
            <Link
              href="/"
              style={{
                color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Home
            </Link>

            <Link
              href="/trending"
              style={{
                color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Trending
            </Link>

            <Link
              href="/guides"
              style={{
                color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Guide
            </Link>
          </div>
        </div>
      </nav>

      <div
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "56px 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 48,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>

          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#9945FF",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 12,
            }}
          >
            AI Meme Creator
          </p>

          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              marginBottom: 12,
            }}
          >
            Crea il tuo
            <span
              style={{
                background: "linear-gradient(90deg, #9945FF, #14F195)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {" "}
              token virale
            </span>
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 16,
              lineHeight: 1.6,
            }}
          >
            La nostra AI genera per te nome, descrizione e logo perfetti.
          </p>
        </div>

        {!loading && !result && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div style={s.card}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 16,
                }}
              >
                Che nicchia vuoi?
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {NICHES.map((n) => (
                  <button
                    key={n}
                    onClick={() =>
                      setAnswers((a) => ({
                        ...a,
                        niche: n,
                      }))
                    }
                    style={{
                      padding: "8px 16px",
                      borderRadius: 100,
                      border:
                        answers.niche === n
                          ? "none"
                          : "1px solid rgba(255,255,255,0.1)",
                      background:
                        answers.niche === n
                          ? "linear-gradient(135deg, #9945FF, #14F195)"
                          : "rgba(255,255,255,0.04)",
                      color:
                        answers.niche === n
                          ? "white"
                          : "rgba(255,255,255,0.6)",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div style={s.card}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 16,
                }}
              >
                Che tono?
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {TONES.map((t) => (
                  <button
                    key={t}
                    onClick={() =>
                      setAnswers((a) => ({
                        ...a,
                        tone: t,
                      }))
                    }
                    style={{
                      padding: "8px 16px",
                      borderRadius: 100,
                      border:
                        answers.tone === t
                          ? "none"
                          : "1px solid rgba(255,255,255,0.1)",
                      background:
                        answers.tone === t
                          ? "linear-gradient(135deg, #9945FF, #14F195)"
                          : "rgba(255,255,255,0.04)",
                      color:
                        answers.tone === t
                          ? "white"
                          : "rgba(255,255,255,0.6)",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={s.card}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 16,
                }}
              >
                Mercato target?
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {MARKETS.map((m) => (
                  <button
                    key={m}
                    onClick={() =>
                      setAnswers((a) => ({
                        ...a,
                        market: m,
                      }))
                    }
                    style={{
                      padding: "8px 16px",
                      borderRadius: 100,
                      border:
                        answers.market === m
                          ? "none"
                          : "1px solid rgba(255,255,255,0.1)",
                      background:
                        answers.market === m
                          ? "linear-gradient(135deg, #9945FF, #14F195)"
                          : "rgba(255,255,255,0.04)",
                      color:
                        answers.market === m
                          ? "white"
                          : "rgba(255,255,255,0.6)",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div style={s.card}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 12,
                }}
              >
                Hai un nome in mente? (opzionale)
              </div>

              <input
                placeholder="es. PizzaCoin, DogeMario..."
                value={answers.name}
                onChange={(e) =>
                  setAnswers((a) => ({
                    ...a,
                    name: e.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  color: "white",
                  fontSize: 14,
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  padding: "14px 18px",
                  background: "rgba(255,60,60,0.08)",
                  border: "1px solid rgba(255,60,60,0.2)",
                  borderRadius: 14,
                  color: "#ff6b6b",
                  fontSize: 13,
                }}
              >
                {error}
              </div>
            )}

            <button
              onClick={generate}
              disabled={isDisabled}
              style={{
                width: "100%",
                padding: "20px",
                borderRadius: 18,
                border: "none",
                background: isDisabled
                  ? "rgba(255,255,255,0.06)"
                  : "linear-gradient(135deg, #9945FF, #14F195)",
                color: "white",
                fontSize: 16,
                fontWeight: 900,
                cursor: isDisabled ? "not-allowed" : "pointer",
                boxShadow: !isDisabled
                  ? "0 0 50px rgba(153,69,255,0.3)"
                  : "none",
                opacity: isDisabled ? 0.4 : 1,
              }}
            >
              Genera Token con AI
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "rgba(255,255,255,0.2)",
              }}
            >
              La generazione può richiedere qualche secondo.
            </p>
          </div>
        )}

        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                border: "3px solid rgba(153,69,255,0.2)",
                borderTop: "3px solid #9945FF",
                margin: "0 auto 32px",
                animation: "spin 1s linear infinite",
              }}
            />

            <p
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "white",
                marginBottom: 8,
              }}
            >
              {loadingMsg}
            </p>

            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              L'AI sta lavorando per te...
            </p>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {result && !loading && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                }}
              >
                Il tuo token AI
              </h2>

              <button
                onClick={() => {
                  setResult(null);
                  setError("");
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Rigenera
              </button>
            </div>

            <ResultCard result={result} onUse={useToken} />
          </div>
        )}
      </div>
    </main>
  );
}