import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

let lastTokens: string[] = [];

export async function GET() {
  try {
    const [profilesRes, boostsLatestRes, boostsTopRes] = await Promise.all([
      fetch("https://api.dexscreener.com/token-profiles/latest/v1", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      }),
      fetch("https://api.dexscreener.com/token-boosts/latest/v1", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      }),
      fetch("https://api.dexscreener.com/token-boosts/top/v1", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      }),
    ]);

    const profiles = profilesRes.ok ? await profilesRes.json() : [];
    const boostsLatest = boostsLatestRes.ok ? await boostsLatestRes.json() : [];
    const boostsTop = boostsTopRes.ok ? await boostsTopRes.json() : [];

    const rawTokens = [
      ...(Array.isArray(boostsLatest) ? boostsLatest : []),
      ...(Array.isArray(profiles) ? profiles : []),
      ...(Array.isArray(boostsTop) ? boostsTop : []),
    ].filter((t: any) => t.chainId === "solana" && t.tokenAddress);

    const uniqueTokens = rawTokens.filter(
      (t: any, i: number, arr: any[]) =>
        arr.findIndex((x: any) => x.tokenAddress === t.tokenAddress) === i
    );

    const tokenAddresses = uniqueTokens.map((t: any) => t.tokenAddress).slice(0, 30);

    let pairs: any[] = [];

    if (tokenAddresses.length > 0) {
      const pairsRes = await fetch(
        `https://api.dexscreener.com/tokens/v1/solana/${tokenAddresses.join(",")}`,
        {
          headers: { Accept: "application/json" },
          cache: "no-store",
        }
      );

      if (pairsRes.ok) {
        const data = await pairsRes.json();
        pairs = Array.isArray(data) ? data : [];
      }
    }

    const tokenMap = new Map<string, any>();

    pairs.forEach((pair: any) => {
      const addr = pair.baseToken?.address;
      if (!addr) return;

      const oldPair = tokenMap.get(addr);
      if (!oldPair || (pair.volume?.h24 || 0) > (oldPair.volume?.h24 || 0)) {
        tokenMap.set(addr, pair);
      }
    });

    const previousSet = new Set(lastTokens);

    const enriched = uniqueTokens
      .map((t: any) => {
        const pair = tokenMap.get(t.tokenAddress);

        return {
          address: t.tokenAddress,
          name: pair?.baseToken?.name || t.description?.split(" ").slice(0, 3).join(" ") || "Unknown",
          symbol: pair?.baseToken?.symbol || "???",
          icon:
  t.icon ||
  t.imageUrl ||
  pair?.info?.imageUrl ||
  pair?.baseToken?.logoURI ||
  `https://dd.dexscreener.com/ds-data/tokens/solana/${t.tokenAddress}.png`,
          description: t.description || pair?.info?.description || "",
          links: t.links || pair?.info?.websites || pair?.info?.socials || [],
          marketCap: pair?.marketCap || pair?.fdv || 0,
          price: pair?.priceUsd || "0",
          priceChange24h: pair?.priceChange?.h24 || 0,
          volume24h: pair?.volume?.h24 || 0,
          liquidity: pair?.liquidity?.usd || 0,
          age: pair?.pairCreatedAt || null,
          dexUrl: pair?.url || `https://dexscreener.com/solana/${t.tokenAddress}`,
          chainId: "solana",
          isNew: lastTokens.length > 0 && !previousSet.has(t.tokenAddress),
        };
      })
      .filter((t: any) => t.marketCap > 0 || t.volume24h > 0 || t.liquidity > 0)
      .sort((a: any, b: any) => {
        if (b.isNew !== a.isNew) return Number(b.isNew) - Number(a.isNew);
        return b.volume24h - a.volume24h;
      })
      .slice(0, 50);

    lastTokens = enriched.map((t: any) => t.address);

    return NextResponse.json({
      tokens: enriched,
      updatedAt: Date.now(),
    });
  } catch (e: any) {
    console.error("Trending API error:", e?.message || e);

    return NextResponse.json({
      tokens: [],
      updatedAt: Date.now(),
    });
  }
}