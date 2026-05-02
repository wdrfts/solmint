"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";

export default function LiquidityPool() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [mintAddress, setMintAddress] = useState("");
  const [checking, setChecking] = useState(false);
  const [tokenFound, setTokenFound] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("create");
  const [removePoolId, setRemovePoolId] = useState("");
  const [removePct, setRemovePct] = useState(100);

  const checkToken = async () => {
    if (!publicKey || !mintAddress) return;
    setChecking(true);
    setError("");
    setTokenFound(false);
    try {
      const mint = new PublicKey(mintAddress);
      const ata = await getAssociatedTokenAddress(mint, publicKey);
      const account = await getAccount(connection, ata);
      setTokenFound(true);
      setTokenBalance(Number(account.amount));
      try {
        const META_PROGRAM = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
        const [metaPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("metadata"), META_PROGRAM.toBuffer(), mint.toBuffer()],
          META_PROGRAM
        );
        const metaInfo = await connection.getAccountInfo(metaPDA);
        if (metaInfo) {
          const data = metaInfo.data;
          const nameLen = data.readUInt32LE(65);
          const name = data.slice(69, 69 + nameLen).toString("utf8").replace(/\0/g, "").trim();
          const symbolLen = data.readUInt32LE(69 + nameLen);
          const symbol = data.slice(73 + nameLen, 73 + nameLen + symbolLen).toString("utf8").replace(/\0/g, "").trim();
          setTokenName(name);
          setTokenSymbol(symbol);
        }
      } catch {}
    } catch {
      setError("Token non trovato nel wallet — verifica il mint address");
    } finally {
      setChecking(false);
    }
  };

  const openRaydiumCreate = () => {
    const base = mintAddress
      ? `https://raydium.io/liquidity/create-pool/?inputMint=${mintAddress}&outputMint=So11111111111111111111111111111111111111112`
      : "https://raydium.io/liquidity/create-pool/";
    window.open(base, "_blank");
  };

  const openRaydiumManage = () => {
    if (removePoolId) {
      window.open(`https://raydium.io/liquidity/remove/?ammId=${removePoolId}`, "_blank");
    } else {
      window.open("https://raydium.io/portfolio/", "_blank");
    }
  };

  const s = {
    card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: 28 } as React.CSSProperties,
    input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "12px 16px", color: "white", fontSize: 14, width: "100%", outline: "none", fontFamily: "inherit" } as React.CSSProperties,
    label: { fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 8, display: "block" },
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px 48px" }}>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 4, marginBottom: 24 }}>
        {[["create", "Crea Pool"], ["remove", "Rimuovi Liquidità"]].map(([t, label]) => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: "10px 0", borderRadius: 12, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.15s", background: activeTab === t ? "linear-gradient(135deg, #9945FF, #14F195)" : "transparent", color: activeTab === t ? "white" : "rgba(255,255,255,0.4)" }}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === "create" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Info box */}
          <div style={{ padding: "20px 24px", background: "linear-gradient(135deg, rgba(153,69,255,0.08), rgba(20,241,149,0.04))", border: "1px solid rgba(153,69,255,0.2)", borderRadius: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "white", marginBottom: 8 }}>Come funziona</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              La pool di liquidità viene creata direttamente su Raydium — il DEX principale di Solana. Inserisci il mint address del tuo token, verifica e poi clicca per creare la pool su Raydium. Appena aggiunta la liquidità il token apparirà su Dexscreener, Photon e Axiom.
            </p>
          </div>

          {/* Token input */}
          <div style={s.card}>
            <span style={s.label}>Mint Address del tuo Token</span>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                style={{ ...s.input, flex: 1, fontFamily: "monospace", fontSize: 13 }}
                placeholder="Incolla il mint address..."
                value={mintAddress}
                onChange={e => { setMintAddress(e.target.value); setTokenFound(false); setTokenBalance(null); setTokenName(""); setTokenSymbol(""); }}
              />
              <button
                onClick={checkToken}
                disabled={checking || !mintAddress || !publicKey}
                style={{ padding: "12px 18px", borderRadius: 14, background: "rgba(153,69,255,0.15)", border: "1px solid rgba(153,69,255,0.3)", color: "#9945FF", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", opacity: checking || !mintAddress ? 0.5 : 1 }}
              >
                {checking ? "..." : "Verifica"}
              </button>
            </div>

            {error && <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 10 }}>{error}</p>}

            {tokenFound && (
              <div style={{ marginTop: 16, padding: 16, background: "rgba(20,241,149,0.05)", border: "1px solid rgba(20,241,149,0.15)", borderRadius: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#14F195", boxShadow: "0 0 8px #14F195" }} />
                  <span style={{ color: "#14F195", fontSize: 12, fontWeight: 700 }}>Token verificato</span>
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                  {tokenName && <span><strong style={{ color: "white" }}>{tokenName}</strong></span>}
                  {tokenSymbol && <span>$ {tokenSymbol}</span>}
                  {tokenBalance !== null && <span>Balance: {(tokenBalance / 1e9).toLocaleString()}</span>}
                </div>
              </div>
            )}
          </div>

          {/* Steps */}
          <div style={s.card}>
            <span style={s.label}>Passi da seguire su Raydium</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { n: "1", text: "Clicca il bottone qui sotto per aprire Raydium" },
                { n: "2", text: "Connetti il tuo wallet Phantom su Raydium" },
                { n: "3", text: "Seleziona il tuo token e SOL come coppia" },
                { n: "4", text: "Inserisci le quantità e scegli la fee (0.25% consigliato)" },
                { n: "5", text: "Clicca Initialize e approva in Phantom" },
              ].map(step => (
                <div key={step.n} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #9945FF, #14F195)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "white", flexShrink: 0 }}>{step.n}</div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, paddingTop: 3 }}>{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fee info */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Fee creazione pool Raydium</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>~0.2 SOL</span>
          </div>

          {/* CTA Button */}
          <button
            onClick={openRaydiumCreate}
            style={{ width: "100%", padding: "18px", borderRadius: 18, border: "none", background: "linear-gradient(135deg, #9945FF, #14F195)", color: "white", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 0 40px rgba(153,69,255,0.3)", transition: "all 0.2s", letterSpacing: "0.01em" }}
          >
            Apri Raydium e Crea Pool
          </button>

          <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
            Verrai reindirizzato su raydium.io — il DEX ufficiale di Solana
          </p>
        </div>
      )}

      {activeTab === "remove" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Info box */}
          <div style={{ padding: "20px 24px", background: "linear-gradient(135deg, rgba(255,165,0,0.06), rgba(255,100,0,0.03))", border: "1px solid rgba(255,165,0,0.15)", borderRadius: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "white", marginBottom: 8 }}>Rimuovi liquidità</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              Puoi rimuovere tutta o parte della liquidità in qualsiasi momento. I tuoi SOL e token torneranno immediatamente nel wallet. Se rimuovi tutta la liquidità il token non sarà più tradabile.
            </p>
          </div>

          {/* Pool ID */}
          <div style={s.card}>
            <span style={s.label}>Pool ID (opzionale)</span>
            <input
              style={{ ...s.input, fontFamily: "monospace", fontSize: 13 }}
              placeholder="Incolla il Pool ID per andare diretto..."
              value={removePoolId}
              onChange={e => setRemovePoolId(e.target.value)}
            />
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 8 }}>
              Se non hai il Pool ID, clicca il bottone sotto per trovarlo nel tuo portfolio su Raydium
            </p>
          </div>

          {/* Percentuale */}
          <div style={s.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={s.label}>Percentuale da rimuovere</span>
              <span style={{ fontSize: 28, fontWeight: 900, background: "linear-gradient(135deg, #9945FF, #14F195)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{removePct}%</span>
            </div>
            <input
              type="range" min={1} max={100} value={removePct}
              onChange={e => setRemovePct(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#9945FF", marginBottom: 14 }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
              {[25, 50, 75, 100].map(pct => (
                <button key={pct} onClick={() => setRemovePct(pct)} style={{ padding: "10px 0", borderRadius: 12, border: removePct === pct ? "1.5px solid #9945FF" : "1px solid rgba(255,255,255,0.08)", background: removePct === pct ? "rgba(153,69,255,0.15)" : "rgba(255,255,255,0.03)", color: removePct === pct ? "#9945FF" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div style={{ padding: "14px 20px", background: "rgba(255,200,0,0.05)", border: "1px solid rgba(255,200,0,0.15)", borderRadius: 14, display: "flex", gap: 10 }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <p style={{ fontSize: 12, color: "rgba(255,200,0,0.8)", lineHeight: 1.6 }}>
              Rimuovere il 100% della liquidità renderà il token non tradabile. Comunicalo sempre alla community prima.
            </p>
          </div>

          {/* Button */}
          <button
            onClick={openRaydiumManage}
            style={{ width: "100%", padding: "18px", borderRadius: 18, border: "none", background: "linear-gradient(135deg, #FF4444, #FF8800)", color: "white", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 0 40px rgba(255,68,68,0.2)", transition: "all 0.2s" }}
          >
            {removePoolId ? `Rimuovi ${removePct}% su Raydium` : "Apri Portfolio su Raydium"}
          </button>

          <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
            Verrai reindirizzato su raydium.io per completare la rimozione
          </p>
        </div>
      )}
    </div>
  );
}