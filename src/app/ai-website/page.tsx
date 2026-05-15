"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Vibe =
  | "auto"
  | "meme"
  | "degen"
  | "premium"
  | "cute"
  | "cyber"
  | "retro"
  | "cosmic";

type Theme = {
  label: string;
  accent: string;
  second: string;
  bg: string;
  emoji: string;
  headline: string;
};

const THEMES: Record<Exclude<Vibe, "auto">, Theme> = {
  meme: {
    label: "Meme Viral",
    accent: "#14F195",
    second: "#9945FF",
    emoji: "🚀",
    headline: "chaotic viral meme universe",
    bg: "radial-gradient(circle at 20% 10%, rgba(20,241,149,0.35), transparent 28%), radial-gradient(circle at 80% 0%, rgba(153,69,255,0.32), transparent 32%), linear-gradient(135deg, #130b2a, #06120f)",
  },
  degen: {
    label: "Degen Launch",
    accent: "#ff5f57",
    second: "#9945FF",
    emoji: "🔥",
    headline: "high-energy degen launch arena",
    bg: "radial-gradient(circle at 20% 10%, rgba(255,95,87,0.32), transparent 30%), radial-gradient(circle at 80% 20%, rgba(153,69,255,0.35), transparent 34%), linear-gradient(135deg, #170708, #07070f)",
  },
  premium: {
    label: "Premium Coin",
    accent: "#6FA8FF",
    second: "#14F195",
    emoji: "💎",
    headline: "premium crypto brand landing page",
    bg: "radial-gradient(circle at 30% 0%, rgba(111,168,255,0.36), transparent 30%), radial-gradient(circle at 80% 20%, rgba(20,241,149,0.16), transparent 32%), linear-gradient(135deg, #06111f, #050509)",
  },
  cute: {
    label: "Cute Animal",
    accent: "#FF4ECD",
    second: "#FFD43B",
    emoji: "🐶",
    headline: "cute playful character world",
    bg: "radial-gradient(circle at 20% 0%, rgba(255,78,205,0.38), transparent 32%), radial-gradient(circle at 85% 20%, rgba(255,212,59,0.22), transparent 34%), linear-gradient(135deg, #23071d, #07070f)",
  },
  cyber: {
    label: "Cyber AI",
    accent: "#00E7FF",
    second: "#9945FF",
    emoji: "🤖",
    headline: "futuristic cyber AI protocol",
    bg: "radial-gradient(circle at 25% 0%, rgba(0,231,255,0.34), transparent 30%), radial-gradient(circle at 85% 15%, rgba(153,69,255,0.34), transparent 34%), linear-gradient(135deg, #02151a, #050509)",
  },
  retro: {
    label: "Retro Arcade",
    accent: "#FFD43B",
    second: "#FF4ECD",
    emoji: "🕹️",
    headline: "retro arcade meme site",
    bg: "radial-gradient(circle at 20% 0%, rgba(255,212,59,0.32), transparent 30%), radial-gradient(circle at 85% 20%, rgba(255,78,205,0.28), transparent 34%), linear-gradient(135deg, #201506, #12071c)",
  },
  cosmic: {
    label: "Cosmic AI",
    accent: "#2F7BFF",
    second: "#00E7FF",
    emoji: "🪐",
    headline: "space empire crypto website",
    bg: "radial-gradient(circle at 35% -10%, rgba(47,123,255,0.36), transparent 32%), radial-gradient(circle at 80% 15%, rgba(0,231,255,0.16), transparent 36%), linear-gradient(135deg, #01040b, #050509)",
  },
};

function detectTheme(name: string, desc: string): Exclude<Vibe, "auto"> {
  const txt = `${name} ${desc}`.toLowerCase();

  if (/(ai|bot|cyber|gpt|agent|neural|tech)/.test(txt)) return "cyber";
  if (/(space|moon|mars|rocket|orbit|galaxy|xai|star)/.test(txt)) return "cosmic";
  if (/(dog|cat|frog|peng|pup|animal|cute|baby)/.test(txt)) return "cute";
  if (/(lux|gold|premium|diamond|elite|capital)/.test(txt)) return "premium";
  if (/(casino|degen|ape|pump|fire|100x)/.test(txt)) return "degen";
  if (/(retro|arcade|game|pixel|8bit)/.test(txt)) return "retro";

  return "meme";
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

export default function AIWebsitePage() {
  const [tokenName, setTokenName] = useState("MoonPup");
  const [symbol, setSymbol] = useState("PUP");
  const [mint, setMint] = useState("");
  const [description, setDescription] = useState(
    "A community-powered Solana memecoin built around a tiny dog mascot, moon missions, memes and holder energy."
  );
  const [vibe, setVibe] = useState<Vibe>("auto");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const detected = detectTheme(tokenName, description);
  const finalVibe = vibe === "auto" ? detected : vibe;
  const theme = THEMES[finalVibe];

  const siteBrief = useMemo(() => {
    const cleanName = tokenName || "Your Coin";
    const cleanSymbol = symbol || "COIN";

    return {
      hero: `${cleanName} is not another generic token. It needs a website shaped around its own story: ${description}`,
      artDirection: `Create a ${theme.headline}. Use ${theme.accent} as the main accent, ${theme.second} as the secondary color, and make the logo/mascot the visual center of the site.`,
      sections: [
        `Hero section: big custom headline for ${cleanName}, token logo/mascot, mint address badge, buy/community buttons.`,
        `Story section: explain why ${cleanName} exists and what emotional/meme narrative drives the community.`,
        `Visual world section: AI-generated scenes that match the token identity, not generic crypto cards.`,
        `Tokenomics section: clean ${cleanSymbol} supply, liquidity, revoke authority and launch info blocks.`,
        `Community section: X, Telegram, meme raids, creator content and holder culture.`,
        `Final CTA: join the ${cleanName} movement and buy ${cleanSymbol}.`,
      ],
      imagePrompts: [
        `Hero background for ${cleanName}: ${theme.headline}, centered mascot/logo inspiration, cinematic website header, high detail, no text.`,
        `Mascot scene for ${cleanName}: based on token logo and narrative "${description}", expressive memecoin character, website illustration, high quality.`,
        `Community artwork for ${cleanName}: holders, memes, social energy, matching colors ${theme.accent} and ${theme.second}, no text.`,
      ],
    };
  }, [tokenName, symbol, description, theme]);

  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);
    const dataUrl = await fileToDataUrl(file);

    setLogoPreview(preview);
    setLogoDataUrl(dataUrl);
  };

  async function handleGenerate() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/ai-website/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenName,
          symbol,
          mint,
          description,
          vibe: finalVibe,
          logoUrl: logoDataUrl,
          theme: {
            label: theme.label,
            accent: theme.accent,
            second: theme.second,
            bg: theme.bg,
            emoji: theme.emoji,
            headline: theme.headline,
          },
          brief: siteBrief,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Errore durante la generazione.");
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      if (data?.slug) {
        window.location.href = `/site/${data.slug}`;
      }
    } catch (err) {
      console.log(err);
      setError("Errore durante la generazione.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: "#050509", color: "white" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0" style={{ background: theme.bg }} />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(circle at center, black 0%, transparent 76%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 0%, transparent 76%)",
          }}
        />
      </div>

      <nav
        className="relative z-10 px-4 sm:px-6 py-5"
        style={{
          background: "rgba(5,5,9,0.72)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(22px)",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-black text-white text-xl no-underline">
            SolMint Space
          </Link>

          <div className="flex gap-4">
            <Link href="/?app=true" style={{ color: "#14F195", textDecoration: "none", fontWeight: 900 }}>
              Crea token
            </Link>

            <Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontWeight: 800 }}>
              ← Home
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative z-10 px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-start">
          <div>
            <div
              style={{
                display: "inline-flex",
                padding: "8px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: theme.accent,
                fontSize: 12,
                fontWeight: 950,
                marginBottom: 24,
              }}
            >
              ✦ AI Coin Website Generator
            </div>

            <h1
              style={{
                fontSize: "clamp(42px, 7vw, 82px)",
                fontWeight: 950,
                letterSpacing: "-0.06em",
                lineHeight: 1,
                marginBottom: 22,
              }}
            >
              Genera siti
              <br />
              <span
                style={{
                  background: `linear-gradient(90deg, ${theme.accent}, ${theme.second})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                unici per coin.
              </span>
            </h1>

            <p style={{ color: "rgba(255,255,255,0.56)", fontSize: 17, lineHeight: 1.8, marginBottom: 28 }}>
              L’AI non deve cambiare solo due testi: deve capire logo, narrativa, vibe, colori e creare un sito su misura come un vero launch site memecoin.
            </p>

            <div
              className="rounded-3xl p-5 sm:p-6 space-y-4"
              style={{
                background: "rgba(255,255,255,0.045)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 24px 90px rgba(0,0,0,0.3)",
              }}
            >
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Mint address token</label>
                <input
                  value={mint}
                  onChange={(e) => setMint(e.target.value)}
                  placeholder="Incolla mint address Solana..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Nome token</label>
                  <input
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Simbolo</label>
                  <input
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Logo token</label>
                <label
                  className="cursor-pointer rounded-2xl p-4 flex items-center gap-4"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px dashed rgba(255,255,255,0.18)",
                  }}
                >
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 18,
                      overflow: "hidden",
                      display: "grid",
                      placeItems: "center",
                      background: `linear-gradient(135deg, ${theme.accent}, ${theme.second})`,
                    }}
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      "🖼️"
                    )}
                  </div>

                  <div>
                    <div style={{ fontWeight: 900 }}>Carica logo / mascot</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>L’AI userà questo come base visuale.</div>
                  </div>

                  <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                </label>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Descrizione / narrativa</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-2 block">Stile sito</label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(["auto", "meme", "degen", "premium", "cute", "cyber", "retro", "cosmic"] as Vibe[]).map((key) => {
                    const active = vibe === key;
                    const label = key === "auto" ? `Auto AI (${THEMES[detected].label})` : THEMES[key].label;

                    return (
                      <button
                        key={key}
                        onClick={() => setVibe(key)}
                        type="button"
                        style={{
                          padding: "11px 12px",
                          borderRadius: 14,
                          border: active ? `1px solid ${theme.accent}` : "1px solid rgba(255,255,255,0.1)",
                          background: active ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
                          color: "white",
                          fontWeight: 850,
                          fontSize: 13,
                        }}
                      >
                        {key === "auto" ? "✨" : THEMES[key].emoji} {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && (
                <div
                  style={{
                    padding: 14,
                    borderRadius: 16,
                    background: "rgba(255,80,80,0.12)",
                    border: "1px solid rgba(255,80,80,0.28)",
                    color: "#ff8b8b",
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading}
                type="button"
                style={{
                  width: "100%",
                  padding: "16px 24px",
                  borderRadius: 18,
                  background: loading ? "rgba(255,255,255,0.12)" : `linear-gradient(135deg, ${theme.second}, ${theme.accent})`,
                  color: "white",
                  fontWeight: 950,
                  border: "none",
                  boxShadow: "0 18px 60px rgba(153,69,255,0.32)",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Generazione sito AI..." : "Genera sito AI completo — FREE"}
              </button>
            </div>
          </div>

          <div
            className="rounded-[34px] overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.045)",
              border: "1px solid rgba(255,255,255,0.11)",
              boxShadow: "0 30px 120px rgba(0,0,0,0.38)",
            }}
          >
            <div style={{ padding: 24, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ color: theme.accent, fontSize: 12, fontWeight: 950, marginBottom: 8 }}>
                GENERATED AI BRIEF
              </div>

              <h2 style={{ fontSize: 34, fontWeight: 950, letterSpacing: "-0.04em", margin: 0 }}>
                {tokenName || "Your Coin"} website direction
              </h2>
            </div>

            <div style={{ padding: 24 }}>
              <div
                style={{
                  borderRadius: 28,
                  padding: 26,
                  background: theme.bg,
                  border: "1px solid rgba(255,255,255,0.1)",
                  marginBottom: 20,
                }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 24,
                      display: "grid",
                      placeItems: "center",
                      overflow: "hidden",
                      background: `linear-gradient(135deg, ${theme.accent}, ${theme.second})`,
                      fontSize: 34,
                    }}
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      theme.emoji
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: 24, fontWeight: 950 }}>{tokenName}</div>
                    <div style={{ color: "rgba(255,255,255,0.55)" }}>${symbol}</div>
                  </div>
                </div>

                <h3 style={{ fontSize: 46, lineHeight: 0.98, letterSpacing: "-0.055em", fontWeight: 950, marginBottom: 18 }}>
                  {tokenName}
                  <br />
                  <span style={{ color: theme.accent }}>gets its own world.</span>
                </h3>

                <p style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.75 }}>{siteBrief.hero}</p>

                {mint && (
                  <div
                    style={{
                      marginTop: 18,
                      padding: 13,
                      borderRadius: 16,
                      background: "rgba(0,0,0,0.28)",
                      color: "rgba(255,255,255,0.58)",
                      fontSize: 12,
                      wordBreak: "break-all",
                    }}
                  >
                    Mint: {mint}
                  </div>
                )}
              </div>

              <div className="grid gap-4">
                <div
                  style={{
                    padding: 18,
                    borderRadius: 22,
                    background: "rgba(255,255,255,0.055)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div style={{ color: theme.accent, fontSize: 12, fontWeight: 950, marginBottom: 8 }}>
                    ART DIRECTION
                  </div>

                  <p style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.7 }}>{siteBrief.artDirection}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {siteBrief.sections.map((s, i) => (
                    <div
                      key={s}
                      style={{
                        padding: 16,
                        borderRadius: 18,
                        background: "rgba(255,255,255,0.045)",
                        border: "1px solid rgba(255,255,255,0.075)",
                      }}
                    >
                      <div style={{ color: theme.accent, fontSize: 12, fontWeight: 950, marginBottom: 7 }}>
                        SECTION {i + 1}
                      </div>

                      <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 13, lineHeight: 1.65 }}>{s}</p>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    padding: 18,
                    borderRadius: 22,
                    background: "rgba(0,0,0,0.22)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div style={{ color: theme.accent, fontSize: 12, fontWeight: 950, marginBottom: 10 }}>
                    AI IMAGE PROMPTS
                  </div>

                  <div className="grid gap-2">
                    {siteBrief.imagePrompts.map((p) => (
                      <p key={p} style={{ color: "rgba(255,255,255,0.56)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                        • {p}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}