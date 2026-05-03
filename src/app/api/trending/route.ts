import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

let lastTokens: string[] = [];
let callCount = 0;
let cacheData: any = null;
let cacheTime = 0;
const CACHE_MS = 10000;

export async function GET() {
  if (cacheData && Date.now() - cacheTime < CACHE_MS) {
    return NextResponse.json(cacheData);
  }
  try {
    callCount++;

    // Ruotiamo gli endpoint per avere sempre token diversi
    const endpoints = [
      "https://api.dexscreener.com/token-profiles/latest/v1",
      "https://api.dexscreener.com/token-boosts/latest/v1",
      "https://api.dexscreener.com/token-boosts/top/v1",
    ];

    // Fetch tutti e 3 gli endpoint sempre
    const [profilesRes, boostsLatestRes, boostsTopRes] = await Promise.all(
      endpoints.map(url =>
        fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" })
      )
    );

    const profiles = profilesRes.ok ? await profilesRes.json() : [];
    const boostsLatest = boostsLatestRes.ok ? await boostsLatestRes.json() : [];
    const boostsTop = boostsTopRes.ok ? await boostsTopRes.json() : [];

    // Combina tutti i token Solana
    const rawTokens = [
      ...(Array.isArray(boostsLatest) ? boostsLatest : []),
      ...(Array.isArray(profiles) ? profiles : []),
      ...(Array.isArray(boostsTop) ? boostsTop : []),
    ].filter((t: any) => t.chainId === "solana" && t.tokenAddress);

    // Deduplica
    const uniqueTokens = rawTokens.filter(
      (t: any, i: number, arr: any[]) =>
        arr.findIndex((x: any) => x.tokenAddress === t.tokenAddress) === i
    );

    // Prendi fino a 50 token
    const tokenAddresses = uniqueTokens.map((t: any) => t.tokenAddress).slice(0, 50);

    // Fetch dati di mercato in batch da 30
    let pairs: any[] = [];
    const batchSize = 30;

    for (let i = 0; i < tokenAddresses.length; i += batchSize) {
      const batch = tokenAddresses.slice(i, i + batchSize);
      try {
        const pairsRes = await fetch(
          `https://api.dexscreener.com/tokens/v1/solana/${batch.join(",")}`,
          { headers: { Accept: "application/json" }, cache: "no-store" }
        );
        if (pairsRes.ok) {
          const data = await pairsRes.json();
          if (Array.isArray(data)) pairs = [...pairs, ...data];
        }
      } catch {}
    }

    // Anche fetch search per token recenti pump.fun
    try {
      const searchRes = await fetch(
        "https://api.dexscreener.com/latest/dex/search?q=pump",
        { headers: { Accept: "application/json" }, cache: "no-store" }
      );
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const searchPairs = (searchData.pairs || []).filter(
          (p: any) => p.chainId === "solana"
        );
        pairs = [...pairs, ...searchPairs];
      }
    } catch {}

    // Mappa migliore pair per ogni token
    const tokenMap = new Map<string, any>();
    pairs.forEach((pair: any) => {
      const addr = pair.baseToken?.address;
      if (!addr) return;
      const old = tokenMap.get(addr);
      if (!old || (pair.volume?.h24 || 0) > (old.volume?.h24 || 0)) {
        tokenMap.set(addr, pair);
      }
    });

    // Aggiungi anche i token dai pairs che non erano nella lista originale
    pairs.forEach((pair: any) => {
      const addr = pair.baseToken?.address;
      if (!addr) return;
      if (!uniqueTokens.find((t: any) => t.tokenAddress === addr)) {
        uniqueTokens.push({
          tokenAddress: addr,
          chainId: "solana",
          icon: pair.info?.imageUrl || null,
          description: pair.info?.description || "",
          links: pair.info?.socials || [],
        });
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
      .filter((t: any) => {
  if (!t.marketCap && !t.volume24h) return false;
  const bad = ["nazi", "hitler", "nigger", "porn", "sex", "rape", "kill", "terror", "isis", "kkk", "christ", "allah", "pedо"];
  const nameCheck = (t.name + " " + t.symbol + " " + t.description).toLowerCase();
  return !bad.some(w => nameCheck.includes(w));
})
      .sort((a: any, b: any) => {
        if (b.isNew !== a.isNew) return Number(b.isNew) - Number(a.isNew);
        return b.volume24h - a.volume24h;
      })
      .slice(0, 60);

    lastTokens = enriched.map((t: any) => t.address);

    const result = { tokens: enriched, updatedAt: Date.now(), total: enriched.length };
    cacheData = result;
    cacheTime = Date.now();
    return NextResponse.json(result);
  } catch (e: any) {
    console.error("Trending API error:", e?.message || e);
    return NextResponse.json({ tokens: [], updatedAt: Date.now(), total: 0 });
  }
}