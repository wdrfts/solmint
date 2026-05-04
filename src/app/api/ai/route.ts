import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const HF_TOKEN = process.env.HF_TOKEN;

function safeJsonParse(text: string) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  const jsonText = jsonMatch?.[0] || cleaned;

  return JSON.parse(jsonText);
}

async function generateWithGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY mancante nel file .env.local");
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Gemini error:", JSON.stringify(data));
    throw new Error("Gemini API error: " + JSON.stringify(data));
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.error("Gemini empty response:", JSON.stringify(data));
    throw new Error("Risposta vuota da Gemini");
  }

  return text;
}

async function generateImage(prompt: string): Promise<string | null> {
  if (!HF_TOKEN) {
    console.warn("HF_TOKEN mancante: salto generazione immagine");
    return null;
  }

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
          inputs: prompt,
          parameters: {
            width: 512,
            height: 512,
            num_inference_steps: 4,
          },
        }),
        signal: AbortSignal.timeout(60000),
      }
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("HF image error:", errText);
      return null;
    }

    const contentType = res.headers.get("content-type") || "image/png";

    if (!contentType.includes("image")) {
      const text = await res.text().catch(() => "");
      console.error("HF did not return image:", text);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch (err) {
    console.error("HF image failed:", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, tokenData, answers } = body;

    if (type === "meme-idea") {
      const prompt = `
Sei un esperto di memecoin su Solana.

Crea un'idea per un token meme virale basata su questi dati:

Risposte dell'utente:
- Nicchia preferita: ${answers?.niche || "qualsiasi"}
- Tono: ${answers?.tone || "divertente"}
- Mercato target: ${answers?.market || "globale"}
- Nome in mente: ${answers?.name || "nessuno"}

Trend crypto/meme attuali: AI, meme animali, gaming, cultura pop, internet culture, meme community.

Rispondi SOLO con JSON valido.
Non usare markdown.
Non usare backtick.
Non tagliare il testo.
Non inserire virgolette non escapate dentro le stringhe.
Il simbolo deve avere massimo 8 caratteri, solo lettere maiuscole e numeri.

Formato esatto:
{
  "name": "nome del token",
  "symbol": "SIMBOLO",
  "description": "descrizione accattivante di 2-3 frasi",
  "imagePrompt": "prompt dettagliato in inglese per generare il logo del token, stile cartoon vibrante, crypto meme logo, centered character, clean background",
  "why": "spiegazione breve del perche questo token puo diventare virale",
  "strategy": "consiglio rapido su come lanciarlo"
}
`;

      const text = await generateWithGemini(prompt);

      let result;

      try {
        result = safeJsonParse(text);
      } catch {
        console.error("Parse error raw Gemini text:", text);
        return NextResponse.json(
          {
            error:
              "Errore parsing AI. Gemini ha restituito un JSON non valido. Riprova.",
          },
          { status: 500 }
        );
      }

      const imageBase64 = await generateImage(
        `${result.imagePrompt}, cryptocurrency token logo, circular logo, professional, vibrant colors, high quality`
      );

      return NextResponse.json({
        name: result.name || "Meme Token",
        symbol: String(result.symbol || "MEME").slice(0, 8).toUpperCase(),
        description: result.description || "",
        imagePrompt: result.imagePrompt || "",
        why: result.why || "",
        strategy: result.strategy || "",
        imageBase64,
      });
    }

    if (type === "recreate") {
      const prompt = `
Sei un esperto di memecoin su Solana.

Analizza questo token esistente e crea una VARIANTE ORIGINALE ispirata ad esso, ma diversa e unica.

Token originale:
- Nome: ${tokenData?.name || "N/A"}
- Simbolo: ${tokenData?.symbol || "N/A"}
- Descrizione: ${tokenData?.description || "N/A"}
- Market Cap: ${tokenData?.marketCap || "N/A"}

Rispondi SOLO con JSON valido.
Non usare markdown.
Non usare backtick.
Non inserire virgolette non escapate dentro le stringhe.
Il simbolo deve avere massimo 8 caratteri, solo lettere maiuscole e numeri.

Formato esatto:
{
  "name": "nome nuovo originale",
  "symbol": "SIMBOLO",
  "description": "descrizione accattivante di 2-3 frasi",
  "imagePrompt": "prompt dettagliato in inglese per il logo con AI, stile cartoon vibrante",
  "twist": "spiega in una frase cosa rende questa variante unica rispetto all originale"
}
`;

      const text = await generateWithGemini(prompt);

      let result;

      try {
        result = safeJsonParse(text);
      } catch {
        console.error("Parse error raw Gemini text:", text);
        return NextResponse.json(
          {
            error:
              "Errore parsing AI. Gemini ha restituito un JSON non valido. Riprova.",
          },
          { status: 500 }
        );
      }

      const imageBase64 = await generateImage(
        `${result.imagePrompt}, cryptocurrency token logo, circular logo, professional, vibrant colors, high quality`
      );

      return NextResponse.json({
        name: result.name || "Meme Token",
        symbol: String(result.symbol || "MEME").slice(0, 8).toUpperCase(),
        description: result.description || "",
        imagePrompt: result.imagePrompt || "",
        twist: result.twist || "",
        imageBase64,
      });
    }

    return NextResponse.json({ error: "Tipo non valido" }, { status: 400 });
  } catch (e: any) {
    console.error("AI API error:", e);
    return NextResponse.json(
      { error: e?.message || "Errore server AI" },
      { status: 500 }
    );
  }
}