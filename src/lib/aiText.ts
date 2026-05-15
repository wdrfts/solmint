type SiteAIInput = {
  tokenName: string;
  symbol: string;
  description: string;
};

const geminiKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
].filter(Boolean) as string[];

const groqKeys = [
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2,
].filter(Boolean) as string[];

export async function generateSiteAI(input: SiteAIInput) {
  const prompt = `
Create a unique memecoin website JSON for this token.

Token name: ${input.tokenName}
Symbol: ${input.symbol}
Description: ${input.description}

Return ONLY valid JSON:
{
  "vibe": "string",
  "heroTitle": "string",
  "heroSubtitle": "string",
  "storyTitle": "string",
  "storyText": "string",
  "sections": [
    { "title": "string", "text": "string" },
    { "title": "string", "text": "string" },
    { "title": "string", "text": "string" }
  ],
  "ctaTitle": "string",
  "ctaText": "string"
}
`;

  for (const key of geminiKeys) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!res.ok) continue;

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      const json = extractJson(text);

      if (json) return json;
    } catch {}
  }

  for (const key of groqKeys) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.9,
        }),
      });

      if (!res.ok) continue;

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      const json = extractJson(text);

      if (json) return json;
    } catch {}
  }

  return {
    vibe: "fallback",
    heroTitle: `${input.tokenName} is live.`,
    heroSubtitle: input.description,
    storyTitle: `The ${input.symbol} movement`,
    storyText: `${input.tokenName} is a community-driven Solana memecoin built for memes, momentum and holders.`,
    sections: [
      { title: "Community", text: "Built for raids, memes and viral energy." },
      { title: "Speed", text: "Powered by Solana for fast transactions." },
      { title: "Culture", text: "A token identity made to spread." },
    ],
    ctaTitle: `Join ${input.tokenName}`,
    ctaText: `Hold ${input.symbol}, share the meme, grow the movement.`,
  };
}

function extractJson(text?: string) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {}

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}