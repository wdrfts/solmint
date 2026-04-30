"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";

const FEE_TIERS = [
  { label: "0.01%", value: 100, desc: "Stablecoin" },
  { label: "0.25%", value: 2500, desc: "Standard" },
  { label: "1%", value: 10000, desc: "Exotic" },
];

export default function LiquidityPool() {
  const { connection } = useConnection();
  const { publicKey, signAllTransactions } = useWallet();

  const [mintAddress, setMintAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(9);
  const [amountToken, setAmountToken] = useState("");
  const [amountSol, setAmountSol] = useState("");
  const [feeTier, setFeeTier] = useState(2500);
  const [removePoolId, setRemovePoolId] = useState("");
  const [removePct, setRemovePct] = useState(100);
  const [activeTab, setActiveTab] = useState("create");
  const [checking, setChecking] = useState(false);
  const [tokenFound, setTokenFound] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [poolTx, setPoolTx] = useState("");

  const checkToken = async () => {
    if (!publicKey || !mintAddress) return;
    setChecking(true);
    setError("");
    setTokenFound(false);
    setTokenName("");
    setTokenSymbol("");
    setTokenBalance(null);
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

  const handleCreatePool = async () => {
    if (!publicKey || !signAllTransactions) { setError("Connetti il wallet!"); return; }
    if (!mintAddress || !amountToken || !amountSol) { setError("Compila tutti i campi!"); return; }
    setLoading(true);
    setError("");
    setStatus("");
    try {
      setStatus("Preparazione transazione...");
      const res = await fetch("/api/pool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mintAddress, amountToken, amountSol, decimals: tokenDecimals, feeTier, owner: publicKey.toString() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore server");
      setStatus("Firma con Phantom...");
      const txs = (data.transactions as string[]).map((t: string) => Transaction.from(Buffer.from(t, "base64")));
      const signed = await signAllTransactions(txs);
      setStatus("Invio alla blockchain...");
      let lastSig = "";
      for (const tx of signed) {
        const sig = await connection.sendRawTransaction(tx.serialize());
        await connection.confirmTransaction(sig, "confirmed");
        lastSig = sig;
      }
      setPoolTx(lastSig);
      setStatus("Pool creata!");
    } catch (e: any) {
      setError(e.message || "Errore");
    } finally {
      setLoading(false);
    }
  };

  const initialPrice = amountToken && amountSol && Number(amountToken) > 0
    ? (Number(amountSol) / Number(amountToken)).toExponential(4)
    : null;

  const card = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: 28 };
  const input = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "12px 16px", color: "white", fontSize: 14, width: "100%", outline: "none", fontFamily: "inherit" };
  const label = { fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 8, display: "block" };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px 48px" }}>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 4, marginBottom: 24 }}>
        {["create", "remove"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: "10px 0", borderRadius: 12, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.15s", background: activeTab === t ? "linear-gradient(135deg, #9945FF, #14F195)" : "transparent", color: activeTab === t ? "white" : "rgba(255,255,255,0.4)" }}>
            {t === "create" ? "Crea Pool" : "Rimuovi Liquidità"}
          </button>
        ))}
      </div>

      {activeTab === "create" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Token */}
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Token</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                style={{ ...input, flex: 1, fontFamily: "monospace" }}
                placeholder="Mint address del tuo token..."
                value={mintAddress}
                onChange={e => { setMintAddress(e.target.value); setTokenFound(false); setTokenBalance(null); }}
              />
              <button onClick={checkToken} disabled={checking || !mintAddress || !publicKey} style={{ padding: "12px 18px", borderRadius: 14, background: "rgba(153,69,255,0.15)", border: "1px solid rgba(153,69,255,0.3)", color: "#9945FF", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", opacity: checking || !mintAddress ? 0.5 : 1 }}>
                {checking ? "..." : "Verifica"}
              </button>
            </div>
            {tokenFound && (
              <div style={{ marginTop: 16, padding: 16, background: "rgba(20,241,149,0.05)", border: "1px solid rgba(20,241,149,0.15)", borderRadius: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#14F195", boxShadow: "0 0 8px #14F195" }} />
                  <span style={{ color: "#14F195", fontSize: 12, fontWeight: 700 }}>Token trovato</span>
                  {tokenBalance !== null && <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginLeft: "auto" }}>Balance: {(tokenBalance / 10 ** tokenDecimals).toLocaleString()}</span>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <span style={label}>Nome</span>
                    <input style={input} value={tokenName} onChange={e => setTokenName(e.target.value)} placeholder="Token name" />
                  </div>
                  <div>
                    <span style={label}>Simbolo</span>
                    <input style={input} value={tokenSymbol} onChange={e => setTokenSymbol(e.target.value)} placeholder="SYMBOL" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Liquidità iniziale */}
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Liquidità iniziale</div>

            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Base token</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(153,69,255,0.15)", border: "1px solid rgba(153,69,255,0.25)", borderRadius: 12, padding: "8px 14px" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #9945FF, #14F195)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "white" }}>
                    {tokenSymbol ? tokenSymbol[0] : "T"}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{tokenSymbol || "TOKEN"}</span>
                </div>
                <input style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: 24, fontWeight: 700, textAlign: "right", fontFamily: "inherit" }} placeholder="0" value={amountToken} onChange={e => setAmountToken(e.target.value)} />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", fontSize: 18, fontWeight: 700 }}>+</div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Quote token</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(20,241,149,0.1)", border: "1px solid rgba(20,241,149,0.2)", borderRadius: 12, padding: "8px 14px" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #9945FF, #14F195)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "white" }}>S</div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>SOL</span>
                </div>
                <input style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: 24, fontWeight: 700, textAlign: "right", fontFamily: "inherit" }} placeholder="0" value={amountSol} onChange={e => setAmountSol(e.target.value)} />
              </div>
            </div>

            {initialPrice && (
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, padding: "10px 4px" }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Prezzo iniziale</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#14F195" }}>1 {tokenSymbol || "TOKEN"} = {initialPrice} SOL</span>
              </div>
            )}
          </div>

          {/* Fee Tier */}
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Fee Tier</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {FEE_TIERS.map(tier => (
                <button key={tier.value} onClick={() => setFeeTier(tier.value)} style={{ padding: "14px 10px", borderRadius: 14, border: feeTier === tier.value ? "1.5px solid #9945FF" : "1px solid rgba(255,255,255,0.08)", background: feeTier === tier.value ? "rgba(153,69,255,0.12)" : "rgba(255,255,255,0.03)", cursor: "pointer", transition: "all 0.15s", textAlign: "left" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: feeTier === tier.value ? "#9945FF" : "white", marginBottom: 4 }}>{tier.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{tier.desc}</div>
                  {feeTier === tier.value && <div style={{ fontSize: 10, color: "#9945FF", marginTop: 4, fontWeight: 700 }}>Selezionato</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Fee creazione pool</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>~0.2 SOL</span>
          </div>

          {error && <div style={{ padding: "14px 18px", background: "rgba(255,60,60,0.08)", border: "1px solid rgba(255,60,60,0.2)", borderRadius: 14, color: "#ff6b6b", fontSize: 13 }}>{error}</div>}
          {status && !error && <div style={{ padding: "14px 18px", background: "rgba(153,69,255,0.08)", border: "1px solid rgba(153,69,255,0.2)", borderRadius: 14, color: "#b57bff", fontSize: 13 }}>{status}</div>}

          {poolTx && (
            <div style={{ padding: "18px", background: "rgba(20,241,149,0.06)", border: "1px solid rgba(20,241,149,0.2)", borderRadius: 16 }}>
              <div style={{ color: "#14F195", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Pool creata con successo!</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, wordBreak: "break-all", marginBottom: 8 }}>{poolTx}</div>
              <a href={"https://solscan.io/tx/" + poolTx} target="_blank" style={{ color: "#9945FF", fontSize: 12, fontWeight: 600 }}>Vedi su Solscan</a>
            </div>
          )}

          <button onClick={handleCreatePool} disabled={loading || !publicKey} style={{ width: "100%", padding: "18px", borderRadius: 18, border: "none", background: loading ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #9945FF, #14F195)", color: "white", fontSize: 15, fontWeight: 800, cursor: loading || !publicKey ? "not-allowed" : "pointer", opacity: !publicKey ? 0.5 : 1, boxShadow: loading ? "none" : "0 0 40px rgba(153,69,255,0.3)", transition: "all 0.2s" }}>
            {loading ? status || "Caricamento..." : !publicKey ? "Connetti Wallet" : "Initialize Liquidity Pool"}
          </button>
        </div>
      )}

      {activeTab === "remove" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Pool ID</div>
            <input style={{ ...input, fontFamily: "monospace" }} placeholder="Incolla il Pool ID..." value={removePoolId} onChange={e => setRemovePoolId(e.target.value)} />
          </div>

          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Percentuale da rimuovere</div>
              <div style={{ fontSize: 28, fontWeight: 900, background: "linear-gradient(135deg, #9945FF, #14F195)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{removePct}%</div>
            </div>
            <input type="range" min={1} max={100} value={removePct} onChange={e => setRemovePct(Number(e.target.value))} style={{ width: "100%", accentColor: "#9945FF", marginBottom: 14 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
              {[25, 50, 75, 100].map(pct => (
                <button key={pct} onClick={() => setRemovePct(pct)} style={{ padding: "10px 0", borderRadius: 12, border: removePct === pct ? "1.5px solid #9945FF" : "1px solid rgba(255,255,255,0.08)", background: removePct === pct ? "rgba(153,69,255,0.15)" : "rgba(255,255,255,0.03)", color: removePct === pct ? "#9945FF" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: "16px 20px", background: "rgba(255,200,0,0.05)", border: "1px solid rgba(255,200,0,0.15)", borderRadius: 14 }}>
            <p style={{ fontSize: 12, color: "rgba(255,200,0,0.8)" }}>I tuoi SOL e token torneranno nel wallet dopo la rimozione.</p>
          </div>

          <button disabled={!removePoolId || !publicKey} style={{ width: "100%", padding: "18px", borderRadius: 18, border: "none", background: !removePoolId || !publicKey ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #FF4444, #FF8800)", color: "white", fontSize: 15, fontWeight: 800, cursor: !removePoolId || !publicKey ? "not-allowed" : "pointer", opacity: !removePoolId || !publicKey ? 0.4 : 1 }}>
            {!publicKey ? "Connetti Wallet" : `Rimuovi ${removePct}% Liquidità`}
          </button>
        </div>
      )}
    </div>
  );
}