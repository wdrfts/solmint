import { NextRequest, NextResponse } from "next/server";

// ============================================================
// KEY ROTATION SYSTEM
// ============================================================

const GROQ_KEYS = [
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
].filter(Boolean) as string[];

const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
  process.env.GEMINI_API_KEY_6,
  process.env.GEMINI_API_KEY_7,
  process.env.GEMINI_API_KEY_8,
  process.env.GEMINI_API_KEY_9,
  process.env.GEMINI_API_KEY_10,
].filter(Boolean) as string[];

// ============================================================
// UTILS
// ============================================================

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function shouldTryNextProvider(e: any) {
  const msg = String(e?.message || "").toLowerCase();

  return (
    e?.status === 400 ||
    e?.status === 401 ||
    e?.status === 403 ||
    e?.status === 404 ||
    e?.status === 408 ||
    e?.status === 429 ||
    e?.status === 500 ||
    e?.status === 502 ||
    e?.status === 503 ||
    e?.status === 504 ||
    msg.includes("decommissioned") ||
    msg.includes("no longer supported") ||
    msg.includes("model") ||
    msg.includes("quota") ||
    msg.includes("rate limit") ||
    msg.includes("api key") ||
    msg.includes("timeout")
  );
}

// ============================================================
// GROQ
// ============================================================

async function callGroq(prompt: string, key: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a JSON-only generator. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.85,
      max_completion_tokens: 1000,
      response_format: { type: "json_object" },
    }),
    signal: AbortSignal.timeout(30000),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data?.error?.message || "Groq error") as any;
    err.status = res.status;
    throw err;
  }

  return data.choices?.[0]?.message?.content || "";
}

// ============================================================
// GEMINI
// ============================================================

async function callGemini(prompt: string, key: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 1000,
          responseMimeType: "application/json",
        },
      }),
      signal: AbortSignal.timeout(30000),
    }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data?.error?.message || "Gemini error") as any;
    err.status = res.status;
    throw err;
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ============================================================
// ROTATION — GROQ PRIMA, POI GEMINI
// ============================================================

async function generateAI(prompt: string): Promise<string> {
  const groqKeys = shuffle(GROQ_KEYS);
  const geminiKeys = shuffle(GEMINI_KEYS);

  for (let i = 0; i < groqKeys.length; i++) {
    try {
      const result = await callGroq(prompt, groqKeys[i]);
      console.log(`✅ Groq key ${i + 1} OK`);
      return result;
    } catch (e: any) {
      console.warn(`⚠️ Groq key ${i + 1} failed: ${e.message}`);

      if (shouldTryNextProvider(e)) continue;
      throw e;
    }
  }

  for (let i = 0; i < geminiKeys.length; i++) {
    try {
      const result = await callGemini(prompt, geminiKeys[i]);
      console.log(`✅ Gemini key ${i + 1} OK`);
      return result;
    } catch (e: any) {
      console.warn(`⚠️ Gemini key ${i + 1} failed: ${e.message}`);

      if (shouldTryNextProvider(e)) continue;
      throw e;
    }
  }

  throw new Error("Tutte le API key AI sono esaurite, non valide o in rate limit.");
}

// ============================================================
// PARSE RISPOSTA
// ============================================================

function cleanSymbol(s: string) {
  return String(s || "MEME")
    .replace(/[^A-Z0-9]/gi, "")
    .toUpperCase()
    .slice(0, 8);
}

function parseResponse(text: string) {
  try {
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match?.[0] || cleaned);

    return {
      name: parsed.name || "Meme Token",
      symbol: cleanSymbol(parsed.symbol || "MEME"),
      description: parsed.description || "",
      imagePrompt:
        parsed.imagePrompt ||
        parsed.image_prompt ||
        "funny crypto meme mascot cartoon logo vibrant",
      why: parsed.why || "",
      strategy: parsed.strategy || "",
      twist: parsed.twist || "",
    };
  } catch {}

  const get = (key: string) => {
    const r = new RegExp(`${key}[:\\s]+([\\s\\S]*?)(?=\\n[A-Z_]+[:\\s]|$)`, "i");
    return text.match(r)?.[1]?.trim().replace(/^["']|["']$/g, "") || "";
  };

  return {
    name: get("NAME") || "Meme Token",
    symbol: cleanSymbol(get("SYMBOL") || "MEME"),
    description: get("DESCRIPTION") || "",
    imagePrompt:
      get("IMAGE_PROMPT") ||
      "funny crypto meme mascot cartoon logo vibrant",
    why: get("WHY") || "",
    strategy: get("STRATEGY") || "",
    twist: get("TWIST") || "",
  };
}

// ============================================================
// IMMAGINE — HUGGINGFACE
// ============================================================

async function generateImage(prompt: string): Promise<string | null> {
  const HF_TOKEN = process.env.HF_TOKEN;
  if (!HF_TOKEN) return null;

  try {
    const res = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "image/png",
        },
        body: JSON.stringify({
          inputs: `${prompt}, crypto meme coin logo, circular icon, centered character, clean background, vibrant cartoon style`,
          parameters: {
            width: 512,
            height: 512,
            num_inference_steps: 4,
          },
        }),
        signal: AbortSignal.timeout(60000),
      }
    );

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "image/png";
    if (!contentType.includes("image")) return null;

    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

// ============================================================
// TRENDING
// ============================================================

async function getTrendingTokens() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://solmint.space");

    const res = await fetch(`${baseUrl}/api/trending`, {
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) return [];

    const data = await res.json();

    return (data.tokens || []).slice(0, 8).map((t: any) => ({
      name: t.name,
      symbol: t.symbol,
      marketCap: t.marketCap,
      volume24h: t.volume24h,
      priceChange24h: t.priceChange24h,
      description: t.description,
    }));
  } catch {
    return [];
  }
}

// ============================================================
// ENDPOINT
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, tokenData, answers } = body;

    const trends = await getTrendingTokens();

    const trendsStr =
      trends.length > 0
        ? trends
            .map(
              (t: any) =>
                `- ${t.name} ($${t.symbol}): MC $${Math.floor(
                  t.marketCap || 0
                ).toLocaleString()}, Vol $${Math.floor(
                  t.volume24h || 0
                ).toLocaleString()}, ${Number(t.priceChange24h || 0).toFixed(1)}%`
            )
            .join("\n")
        : "Nessun dato disponibile";

    if (type === "meme-idea") {
      const prompt = `Sei un esperto di memecoin virali su Solana. Analizza i token trending REALI di oggi e crea un'idea originale e virale.

TOKEN TRENDING SU SOLANA ADESSO:
${trendsStr}

PREFERENZE UTENTE:
- Nicchia: ${answers?.niche || "qualsiasi"}
- Tono: ${answers?.tone || "divertente"}
- Mercato: ${answers?.market || "globale"}
- Nome idea: ${answers?.name || "nessuno"}

Analizza i pattern vincenti, identifica angoli non saturi, crea qualcosa che sfrutta il momento.

Rispondi SOLO con JSON valido:
{
  "name": "nome token originale",
  "symbol": "SIMBOLO MAX 8 CARATTERI",
  "description": "2 frasi accattivanti",
  "imagePrompt": "detailed english prompt for cartoon crypto meme logo",
  "why": "perché può esplodere basandoti sui trend reali",
  "strategy": "strategia di lancio concreta"
}`;

      const text = await generateAI(prompt);
      const parsed = parseResponse(text);
      const imageBase64 = await generateImage(parsed.imagePrompt);

      return NextResponse.json({
        ...parsed,
        imageBase64,
      });
    }

    if (type === "recreate") {
      const prompt = `Sei un esperto di memecoin virali su Solana. Analizza questo token e crea una variante originale.

TOKEN ORIGINALE:
- Nome: ${tokenData?.name}
- Simbolo: ${tokenData?.symbol}
- Descrizione: ${tokenData?.description}
- Market Cap: $${Math.floor(tokenData?.marketCap || 0).toLocaleString()}
- Volume 24h: $${Math.floor(tokenData?.volume24h || 0).toLocaleString()}
- Variazione 24h: ${Number(tokenData?.priceChange24h || 0).toFixed(1)}%

ALTRI TOKEN TRENDING ORA:
${trendsStr}

Analizza perché funziona, crea variante con twist creativo unico. NON copiare nome o simbolo.

Rispondi SOLO con JSON valido:
{
  "name": "nome nuovo originale",
  "symbol": "SIMBOLO MAX 8 CARATTERI",
  "description": "2 frasi accattivanti",
  "imagePrompt": "detailed english prompt for cartoon crypto meme logo",
  "why": "perché il token originale sta funzionando",
  "twist": "cosa rende questa variante unica",
  "strategy": "come lanciarla per sfruttare il momento"
}`;

      const text = await generateAI(prompt);
      const parsed = parseResponse(text);
      const imageBase64 = await generateImage(parsed.imagePrompt);

      return NextResponse.json({
        ...parsed,
        imageBase64,
      });
    }

    return NextResponse.json({ error: "Tipo non valido" }, { status: 400 });
  } catch (e: any) {
    console.error("AI API error:", e.message);

    return NextResponse.json(
      {
        error: e.message || "Errore interno AI",
      },
      {
        status: 500,
      }
    );
  }
}