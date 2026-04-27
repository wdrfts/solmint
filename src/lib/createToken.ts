import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createSetAuthorityInstruction,
  getAssociatedTokenAddress,
  AuthorityType,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";

export interface TokenConfig {
  name: string;
  symbol: string;
  decimals: number;
  supply: number;
  metadataUri: string;
  revokeMint: boolean;
  revokeFreeze: boolean;
  revokeUpdate: boolean;
}

const METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

function createMetadataInstruction(
  metadataPDA: PublicKey,
  mint: PublicKey,
  payer: PublicKey,
  name: string,
  symbol: string,
  uri: string,
  isMutable: boolean
) {
  const data = Buffer.alloc(1000);
  let offset = 0;

  // Instruction discriminator: CreateMetadataAccountV3 = 33
  data.writeUInt8(33, offset++);

  // name
  const nameBytes = Buffer.from(name, "utf8");
  data.writeUInt32LE(nameBytes.length, offset); offset += 4;
  nameBytes.copy(data, offset); offset += nameBytes.length;

  // symbol
  const symbolBytes = Buffer.from(symbol, "utf8");
  data.writeUInt32LE(symbolBytes.length, offset); offset += 4;
  symbolBytes.copy(data, offset); offset += symbolBytes.length;

  // uri
  const uriBytes = Buffer.from(uri, "utf8");
  data.writeUInt32LE(uriBytes.length, offset); offset += 4;
  uriBytes.copy(data, offset); offset += uriBytes.length;

  // seller_fee_basis_points
  data.writeUInt16LE(0, offset); offset += 2;

  // creators: None
  data.writeUInt8(0, offset++);

  // collection: None
  data.writeUInt8(0, offset++);

  // uses: None
  data.writeUInt8(0, offset++);

  // is_mutable
  data.writeUInt8(isMutable ? 1 : 0, offset++);

  // collection_details: None
  data.writeUInt8(0, offset++);

  const { TransactionInstruction, AccountMeta } = require("@solana/web3.js");

  return new TransactionInstruction({
    programId: METADATA_PROGRAM_ID,
    keys: [
      { pubkey: metadataPDA, isSigner: false, isWritable: true },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: payer, isSigner: true, isWritable: false },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data: data.slice(0, offset),
  });
}

export async function createToken(
  connection: Connection,
  payer: PublicKey,
  config: TokenConfig,
  signTransaction: (tx: Transaction) => Promise<Transaction>
): Promise<string> {
  const mintKeypair = Keypair.generate();
  const lamports = await getMinimumBalanceForRentExemptMint(connection);
  const ata = await getAssociatedTokenAddress(mintKeypair.publicKey, payer);

  const [metadataPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      METADATA_PROGRAM_ID.toBuffer(),
      mintKeypair.publicKey.toBuffer(),
    ],
    METADATA_PROGRAM_ID
  );

  const tx = new Transaction();

  tx.add(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    })
  );

  tx.add(
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      config.decimals,
      payer,
      payer,
      TOKEN_PROGRAM_ID
    )
  );

  tx.add(
    createAssociatedTokenAccountInstruction(
      payer, ata, payer, mintKeypair.publicKey
    )
  );

  tx.add(
    createMintToInstruction(
      mintKeypair.publicKey,
      ata,
      payer,
      BigInt(config.supply) * BigInt(10 ** config.decimals)
    )
  );

  tx.add(
    createMetadataInstruction(
      metadataPDA,
      mintKeypair.publicKey,
      payer,
      config.name,
      config.symbol,
      config.metadataUri,
      !config.revokeUpdate
    )
  );

  if (config.revokeFreeze) {
    tx.add(
      createSetAuthorityInstruction(
        mintKeypair.publicKey, payer, AuthorityType.FreezeAccount, null
      )
    );
  }

  if (config.revokeMint) {
    tx.add(
      createSetAuthorityInstruction(
        mintKeypair.publicKey, payer, AuthorityType.MintTokens, null
      )
    );
  }

  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = payer;
  tx.partialSign(mintKeypair);

  const signed = await signTransaction(tx);
  const sig = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(sig, "confirmed");

  return mintKeypair.publicKey.toString();
}