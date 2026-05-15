import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateSiteAI } from "@/lib/aiText";

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
    const inputTheme = body.theme;

    const slug = slugify(tokenName);

    const aiContent = await generateSiteAI({
      tokenName,
      symbol,
      description,
    });

    const theme = {
      background:
        inputTheme?.bg ||
        "linear-gradient(135deg, #07070f, #130b2a)",
      primary: inputTheme?.accent || "#14F195",
      secondary: inputTheme?.second || "#9945FF",
      emoji: inputTheme?.emoji || "🚀",
      label: inputTheme?.label || "AI Meme",
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