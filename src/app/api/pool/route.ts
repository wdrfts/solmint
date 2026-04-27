import { NextRequest, NextResponse } from "next/server";
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createSyncNativeInstruction,
  NATIVE_MINT,
} from "@solana/spl-token";

const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com",
  "confirmed"
);

const CPMM_PROGRAM_ID = new PublicKey("CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C");
const CPMM_CONFIG_ID = new PublicKey("ARwi1S4DaiTG5DX7S4M4ZkL8Dgzh8pA4cnNt3eAFXzFw");
const FEE_RECEIVER = new PublicKey("G11FKBRaAkHAKuLCgLM6K4TBN4yMSBzXjMDrCZe7ykr");
const ASSOCIATED_TOKEN_PROGRAM = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe1bq7");

function findPDA(seeds: Buffer[], programId: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(seeds, programId);
  return pda;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mintAddress, amountToken, amountSol, decimals, owner } = body;

    if (!mintAddress || !amountToken || !amountSol || !owner) {
      return NextResponse.json({ error: "Parametri mancanti" }, { status: 400 });
    }

    const ownerPubkey = new PublicKey(owner);
    const mintA = new PublicKey(mintAddress);
    const mintB = NATIVE_MINT;
    const tokenDecimals = decimals || 9;

    const [token0, token1] = mintA.toBuffer().compare(mintB.toBuffer()) < 0
      ? [mintA, mintB]
      : [mintB, mintA];

    const poolId = findPDA(
      [Buffer.from("pool"), CPMM_CONFIG_ID.toBuffer(), token0.toBuffer(), token1.toBuffer()],
      CPMM_PROGRAM_ID
    );

    const authority = findPDA(
      [Buffer.from("vault_and_lp_mint_auth_seed")],
      CPMM_PROGRAM_ID
    );

    const lpMint = findPDA(
      [Buffer.from("pool_lp_mint"), poolId.toBuffer()],
      CPMM_PROGRAM_ID
    );

    const vault0 = findPDA(
      [Buffer.from("pool_vault"), poolId.toBuffer(), token0.toBuffer()],
      CPMM_PROGRAM_ID
    );

    const vault1 = findPDA(
      [Buffer.from("pool_vault"), poolId.toBuffer(), token1.toBuffer()],
      CPMM_PROGRAM_ID
    );

    const observationState = findPDA(
      [Buffer.from("observation"), poolId.toBuffer()],
      CPMM_PROGRAM_ID
    );

    const ownerToken0 = await getAssociatedTokenAddress(token0, ownerPubkey);
    const ownerToken1 = await getAssociatedTokenAddress(token1, ownerPubkey);
    const ownerLpToken = await getAssociatedTokenAddress(lpMint, ownerPubkey);

    const tx = new Transaction();
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = ownerPubkey;

    const wsolAta = await getAssociatedTokenAddress(NATIVE_MINT, ownerPubkey);
    tx.add(createAssociatedTokenAccountInstruction(ownerPubkey, wsolAta, ownerPubkey, NATIVE_MINT));

    const solAmount = Math.floor(Number(amountSol) * LAMPORTS_PER_SOL);
    tx.add(SystemProgram.transfer({ fromPubkey: ownerPubkey, toPubkey: wsolAta, lamports: solAmount }));
    tx.add(createSyncNativeInstruction(wsolAta));
    tx.add(createAssociatedTokenAccountInstruction(ownerPubkey, ownerLpToken, ownerPubkey, lpMint));

    const tokenAmount = Math.floor(Number(amountToken) * 10 ** tokenDecimals);
    const initData = Buffer.alloc(25);
    initData.writeUInt8(0, 0);
    initData.writeBigUInt64LE(BigInt(0), 1);
    const amount0 = token0.equals(mintA) ? BigInt(tokenAmount) : BigInt(solAmount);
    const amount1 = token0.equals(mintA) ? BigInt(solAmount) : BigInt(tokenAmount);
    initData.writeBigUInt64LE(amount0, 9);
    initData.writeBigUInt64LE(amount1, 17);

    const initIx = new TransactionInstruction({
      programId: CPMM_PROGRAM_ID,
      keys: [
        { pubkey: ownerPubkey, isSigner: true, isWritable: true },
        { pubkey: CPMM_CONFIG_ID, isSigner: false, isWritable: false },
        { pubkey: authority, isSigner: false, isWritable: false },
        { pubkey: poolId, isSigner: false, isWritable: true },
        { pubkey: token0, isSigner: false, isWritable: false },
        { pubkey: token1, isSigner: false, isWritable: false },
        { pubkey: lpMint, isSigner: false, isWritable: true },
        { pubkey: ownerToken0, isSigner: false, isWritable: true },
        { pubkey: ownerToken1, isSigner: false, isWritable: true },
        { pubkey: ownerLpToken, isSigner: false, isWritable: true },
        { pubkey: vault0, isSigner: false, isWritable: true },
        { pubkey: vault1, isSigner: false, isWritable: true },
        { pubkey: FEE_RECEIVER, isSigner: false, isWritable: true },
        { pubkey: observationState, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: ASSOCIATED_TOKEN_PROGRAM, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      data: initData,
    });

    tx.add(initIx);

    const serialized = Buffer.from(tx.serialize({ requireAllSignatures: false })).toString("base64");
    return NextResponse.json({ transactions: [serialized] });

} catch (e: any) {
    console.error("POOL ERROR:", JSON.stringify(e, Object.getOwnPropertyNames(e)));
    return NextResponse.json({ error: e.message || "Errore server" }, { status: 500 });
  }
}