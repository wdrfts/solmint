"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createToken, TokenConfig } from "@/lib/createToken";
import { uploadImageToIPFS, uploadMetadataToIPFS } from "@/lib/uploadMetadata";
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";

const TREASURY = process.env.NEXT_PUBLIC_TREASURY_WALLET!;

export default function TokenForm() {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(9);
  const [supply, setSupply] = useState("1000000000");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [revokeMint, setRevokeMint] = useState(false);
  const [revokeFreeze, setRevokeFreeze] = useState(false);
  const [revokeUpdate, setRevokeUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [mintAddress, setMintAddress] = useState("");
  const [error, setError] = useState("");

  const revokeCount = [revokeMint, revokeFreeze, revokeUpdate].filter(Boolean).length;
  const baseFee = 0.1;
  const revokeFee = revokeCount * 0.1;
  const totalFee = baseFee + revokeFee;

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async () => {
    if (!publicKey || !signTransaction) {
      setError("Connetti il wallet prima!");
      return;
    }
    if (!name || !symbol || !image) {
      setError("Nome, simbolo e immagine sono obbligatori!");
      return;
    }

    setLoading(true);
    setError("");
    setMintAddress("");

    try {
      // 1. Paga la fee al treasury
      setStatus("Pagamento fee in corso...");
      const feeTx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(TREASURY),
          lamports: Math.round(totalFee * LAMPORTS_PER_SOL),
        })
      );
      const { blockhash } = await connection.getLatestBlockhash();
      feeTx.recentBlockhash = blockhash;
      feeTx.feePayer = publicKey;
      const signedFee = await signTransaction(feeTx);
      await connection.sendRawTransaction(signedFee.serialize());

      // 2. Upload immagine su IPFS
      setStatus("Upload immagine su IPFS...");
      const imageUrl = await uploadImageToIPFS(image);

      // 3. Upload metadata su IPFS
      setStatus("Upload metadata su IPFS...");
      const metadata = {
        name,
        symbol,
        description,
        image: imageUrl,
        extensions: {
          website: website || undefined,
          twitter: twitter || undefined,
          telegram: telegram || undefined,
        },
      };
      const metadataUri = await uploadMetadataToIPFS(metadata);

      // 4. Crea il token on-chain
      setStatus("Creazione token su Solana...");
      const config: TokenConfig = {
        name,
        symbol,
        decimals,
        supply: Number(supply.replace(/,/g, "")),
        metadataUri,
        revokeMint,
        revokeFreeze,
        revokeUpdate,
      };

      const mint = await createToken(connection, publicKey, config, signTransaction);
      setMintAddress(mint);
      setStatus("Token creato con successo! 🎉");
    } catch (e: any) {
      setError(e.message || "Errore durante la creazione");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">

      {/* Informazioni base */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Informazioni Token</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Nome *</label>
            <input className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500" placeholder="es. MyToken" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Simbolo *</label>
            <input className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500" placeholder="es. MTK" value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Decimali</label>
            <select className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500" value={decimals} onChange={e => setDecimals(Number(e.target.value))}>
              <option value={9}>9 (standard)</option>
              <option value={6}>6</option>
              <option value={0}>0</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Supply</label>
            <input className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500" placeholder="1000000000" value={supply} onChange={e => setSupply(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Descrizione</label>
          <textarea className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 resize-none" rows={3} placeholder="Descrivi il tuo token..." value={description} onChange={e => setDescription(e.target.value)} />
        </div>
      </div>

      {/* Immagine e link */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Immagine & Link</h2>
        <div className="grid grid-cols-2 gap-4">
          <label className="cursor-pointer border-2 border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center hover:border-purple-500 transition-colors">
            {imagePreview ? (
              <img src={imagePreview} className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xl">📷</span>
                </div>
                <span className="text-xs text-gray-400">Carica logo *</span>
                <span className="text-xs text-gray-600 mt-1">PNG, JPG max 5MB</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
          <div className="space-y-3">
            <input className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500" placeholder="Website (https://...)" value={website} onChange={e => setWebsite(e.target.value)} />
            <input className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500" placeholder="Twitter (@username)" value={twitter} onChange={e => setTwitter(e.target.value)} />
            <input className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500" placeholder="Telegram (t.me/...)" value={telegram} onChange={e => setTelegram(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Revoke */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Autorità (+0.1 SOL ciascuna)</h2>
        {[
          { label: "Revoca Mint Authority", desc: "Supply fissa — nessuno può più mintare", value: revokeMint, set: setRevokeMint },
          { label: "Revoca Freeze Authority", desc: "Nessuno può congelare i wallet degli holder", value: revokeFreeze, set: setRevokeFreeze },
          { label: "Revoca Update Authority", desc: "Metadata immutabili per sempre", value: revokeUpdate, set: setRevokeUpdate },
        ].map(({ label, desc, value, set }) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
            <div>
              <div className="text-sm font-medium text-white">{label}</div>
              <div className="text-xs text-gray-500">{desc}</div>
            </div>
            <button onClick={() => set(!value)} className={`w-12 h-6 rounded-full transition-colors relative ${value ? "bg-purple-600" : "bg-gray-700"}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? "left-7" : "left-1"}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Fee e bottone */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-400">Piano base</span><span className="text-white">0.1 SOL</span></div>
          {revokeCount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-400">Revoke ({revokeCount}x)</span><span className="text-white">{(revokeCount * 0.1).toFixed(1)} SOL</span></div>}
          <div className="flex justify-between text-sm font-medium border-t border-gray-800 pt-2"><span className="text-gray-300">Totale</span><span className="text-purple-400">{totalFee.toFixed(1)} SOL</span></div>
        </div>

        {error && <div className="bg-red-900/30 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}
        {status && <div className="bg-purple-900/30 border border-purple-800 rounded-xl px-4 py-3 text-purple-300 text-sm">{status}</div>}
        {mintAddress && (
          <div className="bg-green-900/30 border border-green-800 rounded-xl px-4 py-3 space-y-2">
            <div className="text-green-400 text-sm font-medium">✅ Token creato!</div>
            <div className="text-xs text-gray-400 break-all">{mintAddress}</div>
            <a href={`https://solscan.io/token/${mintAddress}?cluster=devnet`} target="_blank" className="text-xs text-purple-400 hover:underline">Vedi su Solscan →</a>
          </div>
        )}

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full py-4 rounded-xl font-medium text-white text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: loading ? "#4B5563" : "linear-gradient(135deg, #9945FF, #14F195)" }}
        >
          {loading ? status || "Caricamento..." : !publicKey ? "Connetti Wallet" : `◎ Crea Token — ${totalFee.toFixed(1)} SOL`}
        </button>
      </div>
    </div>
  );
}