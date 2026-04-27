"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";

const FEE_TIERS = [
  { label: "0.01%", value: 100, description: "Stablecoin" },
  { label: "0.25%", value: 2500, description: "Standard" },
  { label: "1%", value: 10000, description: "Exotic" },
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
  const [startTime, setStartTime] = useState<"now" | "custom">("now");
  const [customTime, setCustomTime] = useState("");
  const [removePoolId, setRemovePoolId] = useState("");
  const [removePct, setRemovePct] = useState(100);
  const [activeTab, setActiveTab] = useState("create");
  const [checking, setChecking] = useState(false);
  const [tokenFound, setTokenFound] = useState(false);
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
    try {
      const mint = new PublicKey(mintAddress);
      const ata = await getAssociatedTokenAddress(mint, publicKey);
      const account = await getAccount(connection, ata);
      setTokenFound(true);
      // Prova a caricare metadata
      try {
        const META_PROGRAM = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
        const [metaPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("metadata"), META_PROGRAM.toBuffer(), mint.toBuffer()],
          META_PROGRAM
        );
        const metaInfo = await connection.getAccountInfo(metaPDA);
        if (metaInfo) {
          const data = metaInfo.data;
          // Parse nome (offset 65, lunghezza 4 bytes + stringa)
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
        body: JSON.stringify({
          mintAddress,
          amountToken,
          amountSol,
          decimals: tokenDecimals,
          feeTier,
          owner: publicKey.toString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore server");

      setStatus("Firma con Phantom...");
      const txs = (data.transactions as string[]).map((t: string) =>
        Transaction.from(Buffer.from(t, "base64"))
      );
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
    ? Number(amountSol) / Number(amountToken)
    : null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex gap-2 bg-gray-900 p-1 rounded-xl">
        <button onClick={() => setActiveTab("create")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "create" ? "bg-gray-700 text-white" : "text-gray-400"}`}>
          Crea Pool
        </button>
        <button onClick={() => setActiveTab("remove")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "remove" ? "bg-gray-700 text-white" : "text-gray-400"}`}>
          Rimuovi Liquidita
        </button>
      </div>

      {activeTab === "create" && (
        <div className="space-y-4">

          {/* Token Input */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Token</h2>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 font-mono"
                placeholder="Mint address del tuo token..."
                value={mintAddress}
                onChange={e => { setMintAddress(e.target.value); setTokenFound(false); }}
              />
              <button
                onClick={checkToken}
                disabled={checking || !mintAddress || !publicKey}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-xl text-sm text-white disabled:opacity-50 transition-colors"
              >
                {checking ? "..." : "Verifica"}
              </button>
            </div>

            {tokenFound && (
              <div className="bg-gray-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm font-medium">Token trovato</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Nome token</label>
                    <input
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                      value={tokenName}
                      onChange={e => setTokenName(e.target.value)}
                      placeholder="MyToken"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Simbolo</label>
                    <input
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                      value={tokenSymbol}
                      onChange={e => setTokenSymbol(e.target.value)}
                      placeholder="MTK"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Liquidita iniziale */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Liquidita iniziale</h2>

            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">Base token</span>
                <span className="text-xs text-gray-400">Balance: {tokenFound ? "OK" : "—"}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2 min-w-24">
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    {tokenSymbol ? tokenSymbol[0] : "T"}
                  </div>
                  <span className="text-white text-sm font-medium">{tokenSymbol || "TOKEN"}</span>
                </div>
                <input
                  className="flex-1 bg-transparent text-right text-white text-lg focus:outline-none"
                  placeholder="0"
                  value={amountToken}
                  onChange={e => setAmountToken(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400">+</div>
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">Quote token</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2 min-w-24">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-green-400 flex items-center justify-center text-xs font-bold text-white">S</div>
                  <span className="text-white text-sm font-medium">SOL</span>
                </div>
                <input
                  className="flex-1 bg-transparent text-right text-white text-lg focus:outline-none"
                  placeholder="0"
                  value={amountSol}
                  onChange={e => setAmountSol(e.target.value)}
                />
              </div>
            </div>

            {initialPrice && (
              <div className="flex justify-between text-sm px-1">
                <span className="text-gray-400">Prezzo iniziale</span>
                <span className="text-white">1 {tokenSymbol || "TOKEN"} = {initialPrice.toExponential(4)} SOL</span>
              </div>
            )}
          </div>

          {/* Fee Tier */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Fee Tier</h2>
            <div className="grid grid-cols-3 gap-3">
              {FEE_TIERS.map(tier => (
                <button
                  key={tier.value}
                  onClick={() => setFeeTier(tier.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${feeTier === tier.value ? "border-purple-500 bg-purple-900/20" : "border-gray-700 bg-gray-800"}`}
                >
                  <div className="text-white font-medium text-sm">{tier.label}</div>
                  <div className="text-gray-400 text-xs mt-1">{tier.description}</div>
                  {feeTier === tier.value && <div className="text-purple-400 text-xs mt-1">Selezionato</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Start time */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Start time</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setStartTime("now")}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${startTime === "now" ? "bg-purple-700 text-white" : "bg-gray-800 text-gray-400"}`}
              >
                Start Now
              </button>
              <button
                onClick={() => setStartTime("custom")}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${startTime === "custom" ? "bg-purple-700 text-white" : "bg-gray-800 text-gray-400"}`}
              >
                Custom
              </button>
            </div>
            {startTime === "custom" && (
              <input
                type="datetime-local"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
                value={customTime}
                onChange={e => setCustomTime(e.target.value)}
              />
            )}
          </div>

          {/* Fee info */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Fee creazione pool</span>
              <span className="text-white">~0.2 SOL</span>
            </div>
          </div>

          {error && <div className="bg-red-900/30 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}
          {status && !error && <div className="bg-purple-900/30 border border-purple-800 rounded-xl px-4 py-3 text-purple-300 text-sm">{status}</div>}

          {poolTx && (
            <div className="bg-green-900/30 border border-green-800 rounded-xl px-4 py-3 space-y-2">
              <div className="text-green-400 text-sm font-medium">Pool creata!</div>
              <div className="text-xs text-gray-400 break-all">{poolTx}</div>
              <a href={"https://solscan.io/tx/" + poolTx} target="_blank" className="text-xs text-purple-400 hover:underline block">Vedi su Solscan</a>
            </div>
          )}

          <button
            onClick={handleCreatePool}
            disabled={loading || !publicKey || !mintAddress}
            className="w-full py-4 rounded-xl font-medium text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: loading ? "#4B5563" : "linear-gradient(135deg, #9945FF, #14F195)" }}
          >
            {loading ? status || "Caricamento..." : !publicKey ? "Connetti Wallet" : "Initialize Liquidity Pool"}
          </button>
        </div>
      )}

      {activeTab === "remove" && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Rimuovi Liquidita</h2>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Pool ID</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 font-mono"
              placeholder="Incolla il Pool ID..."
              value={removePoolId}
              onChange={e => setRemovePoolId(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Percentuale da rimuovere: <span className="text-white font-medium">{removePct}%</span>
            </label>
            <input
              type="range" min={1} max={100} value={removePct}
              onChange={e => setRemovePct(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="flex gap-2 mt-2">
              {[25, 50, 75, 100].map(pct => (
                <button
                  key={pct}
                  onClick={() => setRemovePct(pct)}
                  className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors ${removePct === pct ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-400"}`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-xl px-4 py-3">
            <p className="text-xs text-yellow-400">I tuoi SOL e token torneranno nel wallet dopo la rimozione.</p>
          </div>
          <button
            disabled={!removePoolId || !publicKey}
            className="w-full py-4 rounded-xl font-medium text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #FF4444, #FF8800)" }}
          >
            {!publicKey ? "Connetti Wallet" : "Rimuovi " + removePct + "% Liquidita"}
          </button>
        </div>
      )}
    </div>
  );
}