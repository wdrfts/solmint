import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateSiteAI } from "@/lib/aiText";
import { generateSiteImages } from "@/lib/aiImages";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const tokenName = body.tokenName || "Token";
    const symbol = body.symbol || "TOKEN";
    const mint = body.mint || "";
    const description = body.description || "A Solana memecoin.";
    const logoUrl = body.logoUrl || "";
    const inputTheme = body.theme || {};

    const slug = slugify(tokenName);

    const aiContent = await generateSiteAI({
      tokenName,
      symbol,
      description,
    });

    const images = await generateSiteImages({
      tokenName,
      symbol,
      description,
      vibe: aiContent?.vibe,
      heroPrompt: aiContent?.imagePrompts?.hero,
      communityPrompt: aiContent?.imagePrompts?.community,
    });

    const theme = {
      background:
        aiContent?.palette?.background ||
        inputTheme?.bg ||
        "radial-gradient(circle at 25% -10%, rgba(153,69,255,.42), transparent 35%), radial-gradient(circle at 82% 12%, rgba(20,241,149,.22), transparent 34%), linear-gradient(135deg, #060611, #12051f)",
      primary:
        aiContent?.palette?.primary ||
        inputTheme?.accent ||
        "#14F195",
      secondary:
        aiContent?.palette?.secondary ||
        inputTheme?.second ||
        "#9945FF",
      accent:
        aiContent?.palette?.accent ||
        "#FF4ECD",
      emoji:
        inputTheme?.emoji ||
        "🚀",
      label:
        inputTheme?.label ||
        aiContent?.vibe ||
        "AI Meme",
    };

    const { error } = await supabase.from("generated_sites").upsert(
      {
        slug,
        token_name: tokenName,
        symbol,
        mint,
        description,
        logo_url: logoUrl,
        theme,
        content: aiContent,
        images,
      },
      { onConflict: "slug" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      slug,
      url:
        process.env.NODE_ENV === "development"
          ? `/site/${slug}`
          : `https://${slug}.solmint.space`,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Errore durante la generazione." },
      { status: 500 }
    );
  }
}