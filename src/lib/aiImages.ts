type ImageInput = {
  tokenName: string;
  symbol: string;
  description: string;
  vibe?: string;
  heroPrompt?: string;
  communityPrompt?: string;
};

const HF_KEY = process.env.HUGGINGFACE_API_KEY;

async function generateHFImage(prompt: string) {
  if (!HF_KEY) return "";

  try {
    const res = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt:
              "bad quality, blurry, ugly, distorted text, watermark, logo text, misspelled text",
          },
        }),
      }
    );

    if (!res.ok) return "";

    const blob = await res.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch {
    return "";
  }
}

export async function generateSiteImages(input: ImageInput) {
  const baseStyle =
    input.vibe === "cute"
      ? "cute colorful memecoin website illustration, playful, soft shapes, fun mascot world"
      : input.vibe === "cyber"
      ? "futuristic cyberpunk crypto website hero art, neon, AI protocol, cinematic"
      : input.vibe === "cosmic"
      ? "space empire crypto website hero art, stars, planets, cinematic sci-fi"
      : input.vibe === "retro"
      ? "retro arcade memecoin website art, pixel vibes, neon arcade, playful"
      : input.vibe === "premium"
      ? "premium luxury crypto website art, sleek, high-end, cinematic, glossy"
      : "viral degen memecoin website art, neon, chaotic, funny, high energy";

  const heroPrompt =
    input.heroPrompt ||
    `${baseStyle}. Token name ${input.tokenName}, symbol ${input.symbol}. Story: ${input.description}. Huge website hero background, mascot-centered composition, no text.`;

  const communityPrompt =
    input.communityPrompt ||
    `${baseStyle}. Community section artwork for ${input.tokenName}, meme holders, social energy, stickers, crypto culture, no text.`;

  const [heroImage, communityImage] = await Promise.all([
    generateHFImage(heroPrompt),
    generateHFImage(communityPrompt),
  ]);

  return {
    hero: heroImage,
    community: communityImage,
  };
}