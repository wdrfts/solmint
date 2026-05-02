"use client";

import { useState } from "react";
import Link from "next/link";
import PremiumBackground from "@/components/PremiumBackground";

const GUIDES = [
  {
    id: "cos-e-token-spl",
    category: "Basics",
    title: "Cos'è un token SPL su Solana",
    desc: "Tutto quello che devi sapere sui token nativi di Solana",
    time: "7 min",
    icon: "◎",
    content: `
## Cos'è un token SPL?

SPL sta per **Solana Program Library**. È lo standard nativo di Solana per creare token digitali, simile agli ERC-20 su Ethereum ma con fee molto più basse e transazioni più rapide.

Un token SPL può essere un memecoin, un token utility, un token di governance, un reward token o un asset interno a una community.

Ogni token SPL ha:
- Un **Mint Address** — l'indirizzo unico del token sulla blockchain
- Una **Supply** — quanti token esistono in totale
- I **Decimali** — quante cifre decimali usa, spesso 9 come SOL
- Le **Authority** — permessi speciali che controllano alcune funzioni del token

## Mint Address

Il mint address è l'identità reale del token.

Nome e simbolo possono essere copiati, ma il mint address è unico. Per questo, quando lanci un token, devi sempre condividere il mint address ufficiale.

Serve per:
- Cercare il token su Solscan
- Verificare che non sia un fake
- Creare una liquidity pool
- Aggiungerlo manualmente su wallet o DEX

## Perché Solana?

Solana è molto usata per creare token perché è veloce, economica e ha un ecosistema molto attivo.

Rispetto ad altre blockchain, creare e scambiare token costa pochissimo. Questo rende Solana ideale per memecoin, community token e lanci rapidi.

## Cosa puoi fare con un token SPL?

- Creare un memecoin
- Distribuirlo alla community
- Creare una liquidity pool su Raydium
- Farlo apparire su Dexscreener
- Usarlo come token di reward
- Costruire un brand o una community attorno al token

## Associated Token Account

Per ricevere un token SPL, ogni wallet usa un account collegato chiamato Associated Token Account.

Non devi crearlo manualmente: wallet come Phantom lo gestiscono automaticamente quando ricevi o usi un token.
    `
  },
  {
    id: "come-creare-token",
    category: "Tutorial",
    title: "Come creare un token Solana",
    desc: "Guida completa step by step con SolMint",
    time: "9 min",
    icon: "🚀",
    content: `
## Creare un token Solana

Con SolMint puoi creare un token Solana senza scrivere codice. La parte tecnica è semplice, ma le scelte iniziali sono importanti perché alcune diventano definitive.

## Prima di iniziare

Hai bisogno di:
1. **Phantom Wallet** installato
2. **SOL nel wallet** per servizio e fee di rete
3. **Nome e simbolo** del token
4. **Logo** in PNG o JPG
5. Una decisione chiara su supply e authority

## Step 1 — Connetti Phantom

Apri SolMint, clicca su Lancia App e collega Phantom.

Collegare il wallet non dà accesso automatico ai tuoi fondi. Serve per identificare il wallet e firmare le transazioni.

Controlla sempre che il dominio sia corretto prima di approvare.

## Step 2 — Inserisci i dati

Compila i dati principali:

**Nome**: il nome completo, ad esempio Pizza Coin  
**Simbolo**: il ticker, ad esempio PIZZA  
**Decimali**: 9 è la scelta più comune  
**Supply**: la quantità totale di token creati  
**Logo**: l'immagine che apparirà su wallet, DEX e scanner

Per un memecoin spesso si usa una supply alta, come 1 miliardo, ma non esiste una regola obbligatoria.

## Step 3 — Metadata

I metadata rendono il token riconoscibile.

Puoi aggiungere:
- Logo
- Descrizione
- Website
- Twitter/X
- Telegram

Questi dettagli aiutano gli utenti a capire se il progetto è curato o improvvisato.

## Step 4 — Authority

Le authority sono permessi speciali.

- **Mint Authority**: permette di creare nuovi token
- **Freeze Authority**: permette di congelare token nei wallet
- **Update Authority**: permette di modificare metadata

Per un memecoin serio, revocarle aumenta molto la fiducia.

## Step 5 — Crea il token

Quando tutto è corretto, clicca Crea Token e approva la transazione in Phantom.

Dopo la conferma:
- Il token esiste on-chain
- Ricevi il mint address
- Puoi verificarlo su Solscan
- Puoi creare una pool su Raydium

## Dopo la creazione

Creare il token è solo il primo passo.

Per renderlo tradabile serve liquidità. Per renderlo credibile servono community, branding, trasparenza e authority gestite bene.
    `
  },
  {
    id: "revoke-authority",
    category: "Sicurezza",
    title: "Cosa sono le Revoke Authority",
    desc: "Mint, Freeze e Update spiegate semplice",
    time: "7 min",
    icon: "🔒",
    content: `
## Cosa sono le authority?

Quando crei un token SPL, alcuni permessi speciali possono restare sotto il controllo del creator.

Questi permessi si chiamano **authority**.

Revocarli significa rinunciare per sempre a quei poteri. È una scelta importante perché aumenta la fiducia, ma non si può annullare.

## Mint Authority

La Mint Authority permette di creare nuovi token dopo il lancio.

Se resta attiva, il creator può aumentare la supply in futuro. Questo può diluire gli holder e viene visto come un rischio enorme, soprattutto nei memecoin.

Se viene revocata:
- La supply diventa fissa
- Nessuno può stampare nuovi token
- Su Solscan appare come null o disabled

## Freeze Authority

La Freeze Authority permette di bloccare i token dentro specifici wallet.

Se resta attiva, un creator malevolo potrebbe impedire ad alcuni holder di vendere o trasferire.

Se viene revocata:
- Nessuno può congelare i wallet
- Gli holder possono muovere liberamente i token
- Il token risulta più sicuro agli occhi della community

## Update Authority

La Update Authority permette di modificare i metadata del token, come logo, nome, descrizione e link.

Se resta attiva, il creator può cambiare l’identità del token dopo il lancio.

Se viene revocata:
- Logo e metadata diventano immutabili
- Il token non può essere modificato in modo sospetto
- La community ha più garanzie

## Conviene revocare tutto?

Per un memecoin o un token community, spesso sì.

La community crypto è molto diffidente. Vedere Mint, Freeze e Update revocate è uno dei segnali più forti di trasparenza.

Per progetti più complessi può avere senso mantenere qualche authority, ma va spiegato chiaramente.
    `
  },
  {
    id: "liquidity-pool-raydium",
    category: "Tutorial",
    title: "Come aggiungere liquidità su Raydium",
    desc: "Guida completa per creare una pool e andare live",
    time: "10 min",
    icon: "💧",
    content: `
## Cos'è una Liquidity Pool?

Una liquidity pool è una coppia di asset depositati in uno smart contract.

Per un token Solana, la coppia più comune è **TOKEN/SOL**.

Senza pool, il token esiste ma non è facilmente comprabile o vendibile. Con una pool, gli utenti possono fare swap direttamente.

## Come funziona il prezzo iniziale

Il prezzo iniziale dipende dal rapporto tra token e SOL che depositi.

Esempio:
- Depositi 500.000.000 token
- Depositi 1 SOL

Il prezzo iniziale sarà 1 SOL diviso 500.000.000 token.

Se metti più SOL rispetto ai token, il prezzo iniziale sale. Se metti più token rispetto ai SOL, il prezzo iniziale scende.

## Cosa ti serve

Prima di creare la pool devi avere:
- Mint address del token
- Token nel tuo wallet
- SOL da usare come liquidità
- SOL extra per fee
- Una strategia chiara sulla supply

## Creare la pool

Su Raydium:
1. Vai su Liquidity
2. Seleziona Create Pool
3. Incolla il mint address del token
4. Scegli SOL come secondo asset
5. Inserisci quantità token e SOL
6. Conferma in Phantom

Dopo la creazione, il token può iniziare ad apparire su Dexscreener, Raydium e Jupiter.

## Attenzione alla liquidità

La liquidità influenza molto il prezzo.

Con poca liquidità, anche piccoli acquisti o vendite possono muovere molto il grafico. Questo può creare hype, ma rende anche il token instabile.

Con più liquidità, il prezzo è più stabile e il progetto appare più serio.

## Rimuovere liquidità

Puoi rimuovere liquidità quando vuoi, ma attenzione: se rimuovi tutta la liquidità, il token diventa praticamente non tradabile.

La community può interpretarlo come rug pull, anche se tecnicamente non sempre lo è.
    `
  },
  {
    id: "dexscreener-listing",
    category: "Marketing",
    title: "Come apparire su Dexscreener",
    desc: "Cosa serve, tempi e requisiti",
    time: "5 min",
    icon: "📈",
    content: `
## Come funziona Dexscreener

Dexscreener mostra automaticamente token che hanno una liquidity pool su un DEX supportato.

Non devi fare una richiesta manuale per apparire. La cosa più importante è creare una pool valida e avere metadata curati.

## Tempi medi

Dopo aver creato la pool:
- Dexscreener può apparire in 1-5 minuti
- Jupiter può indicizzare rapidamente
- Raydium swap funziona quasi subito
- Altri scanner possono richiedere più tempo

Nei primi minuti è normale vedere dati incompleti.

## Come avere un profilo migliore

Dexscreener e gli utenti guardano subito questi elementi:

- Logo
- Nome
- Simbolo
- Liquidità
- Volume
- Link social
- Distribuzione holder

Un token senza logo o senza social sembra meno affidabile.

## Branding

Il logo deve essere chiaro anche piccolo. Su Dexscreener molti utenti vedono il token per la prima volta in una lista piena di altri token.

Se il logo è confuso, il nome è generico o il profilo è vuoto, perdi attenzione.

## Errori da evitare

- Logo copiato da altri token
- Nome troppo simile a progetti famosi
- Link mancanti
- Telegram vuoto
- Promesse tipo “100x garantito”
- Mint address non condiviso ufficialmente

## Token Boost

Dexscreener offre boost a pagamento per aumentare visibilità.

Può aiutare, ma non sostituisce community, liquidità, branding e fiducia.
    `
  },
  {
    id: "impermanent-loss",
    category: "Educazione",
    title: "Cos'è l'Impermanent Loss",
    desc: "Spiegato semplice per chi non è esperto",
    time: "6 min",
    icon: "📊",
    content: `
## Cos'è l'Impermanent Loss?

L'impermanent loss è il rischio principale quando fornisci liquidità in una pool.

Succede quando il prezzo degli asset nella pool cambia rispetto al momento in cui li hai depositati.

In pratica, potresti guadagnare meno rispetto a tenere semplicemente i token nel wallet.

## Perché succede?

Le pool si ribilanciano automaticamente.

Quando un asset sale di prezzo, la pool tende ad averne meno. Quando scende, tende ad averne di più.

Questo meccanismo permette gli swap, ma crea una differenza rispetto all’holding.

## Esempio semplice

Depositi:
- 1 SOL che vale $100
- 1.000 token che valgono $100

Totale: $200

Se il token raddoppia, chi teneva tutto nel wallet avrebbe più valore rispetto a chi ha fornito liquidità, perché la pool si è ribilanciata.

Quella differenza è l'impermanent loss.

## Perché “impermanent”?

Si chiama impermanent perché se il prezzo torna al rapporto iniziale, la perdita teorica può ridursi o sparire.

Diventa reale quando ritiri la liquidità mentre il prezzo è cambiato.

## Le fee aiutano

Chi fornisce liquidità riceve una parte delle fee generate dagli swap.

Se il volume è alto, le fee possono compensare l'impermanent loss.

Per questo non conta solo il prezzo: conta anche quanto viene tradato il token.
    `
  },
  {
    id: "token-di-successo",
    category: "Strategia",
    title: "Come fare un token meme di successo",
    desc: "Tips pratici da chi studia il mercato",
    time: "8 min",
    icon: "🏆",
    content: `
## Creare il token non basta

La parte tecnica è facile. La parte difficile è creare attenzione, fiducia e community.

Un memecoin non vende solo tecnologia. Vende identità, cultura, meme e senso di appartenenza.

## Il concept deve essere semplice

Un buon memecoin si capisce in pochi secondi.

Se devi spiegare troppo il progetto, probabilmente è troppo complicato.

Funzionano bene:
- Animali
- Mascotte
- Meme virali
- Cultura internet
- Community già esistenti
- Riferimenti locali o assurdi

## Il logo è fondamentale

Il logo è la prima cosa che gli utenti vedono su wallet, Dexscreener e Telegram.

Deve essere:
- Riconoscibile anche piccolo
- Colorato
- Memorabile
- Coerente con il nome
- Diverso dagli altri token

## Community prima della pool

Uno degli errori più comuni è lanciare senza nessuno pronto.

Anche 30-50 persone reali su Telegram possono fare più differenza di un lancio completamente vuoto.

Prima della pool prepara:
- Telegram
- Meme
- Logo
- Messaggi fissati
- Mint address ufficiale
- Spiegazione della supply

## Fiducia

Nel mondo memecoin tutti temono rug pull.

Per questo devi rimuovere dubbi:
- Revoca le authority
- Comunica la supply
- Non promettere guadagni
- Non nascondere wallet importanti
- Non sparire dopo il lancio

## Cosa non fare

- Non promettere 100x garantiti
- Non fare presale poco chiare
- Non tenerti metà supply senza dirlo
- Non copiare token famosi
- Non abbandonare Telegram dopo il lancio
- Non rimuovere liquidità senza spiegare
    `
  },
  {
    id: "scam-vs-legit",
    category: "Sicurezza",
    title: "Token legit vs Scam — come riconoscerli",
    desc: "I segnali da controllare prima di investire",
    time: "7 min",
    icon: "🛡",
    content: `
## Prima regola: controlla sempre

Su Solana nascono moltissimi token ogni giorno. Alcuni sono progetti reali, altri esperimenti, altri scam.

Prima di comprare, controlla sempre i dati base.

## Segnali rossi

Scappa se vedi più segnali insieme:

- Mint Authority attiva
- Freeze Authority attiva
- Pochi wallet controllano troppa supply
- Liquidità bassissima
- Social appena creati e pieni di hype finto
- Promesse di guadagni garantiti
- Team che evita domande tecniche

## Mint Authority attiva

Se la Mint Authority è attiva, il creator può creare nuovi token.

Questo può diluire gli holder e distruggere il prezzo.

Per un memecoin, è un rischio molto importante.

## Freeze Authority attiva

Se la Freeze Authority è attiva, il creator può congelare wallet.

Questo significa che alcuni utenti potrebbero non riuscire a vendere.

È uno dei segnali più pericolosi.

## Distribuzione della supply

Controlla sempre i top holder.

Se uno o pochi wallet hanno una percentuale enorme, possono vendere e far crollare il prezzo.

Non sempre è scam, ma è un rischio.

## Tool utili

Puoi controllare con:
- Solscan
- Dexscreener
- Rugcheck
- Birdeye

Nessun tool è perfetto, ma insieme aiutano a capire il rischio.

## Promesse finanziarie

Diffida da chi promette:
- 10x sicuro
- 100x garantito
- Rendimenti fissi
- “Non può scendere”

Nessuno può garantire il prezzo futuro di un token.
    `
  },
  {
    id: "phantom-wallet-guida",
    category: "Basics",
    title: "Phantom Wallet — Guida completa",
    desc: "Setup, sicurezza e funzioni principali",
    time: "8 min",
    icon: "👻",
    content: `
## Cos'è Phantom Wallet

Phantom è uno dei wallet più usati su Solana.

Ti permette di:
- Ricevere SOL
- Gestire token SPL
- Collegarti alle dApp
- Firmare transazioni
- Vedere asset e NFT

È non-custodial: significa che il controllo del wallet è tuo.

## Installazione sicura

Scarica Phantom solo dal sito ufficiale:

**phantom.app**

Attenzione ai siti fake. Molti copiano il design per rubare seed phrase.

## Seed Phrase

La seed phrase è la cosa più importante.

Chiunque la conosca può controllare il tuo wallet.

Regole:
- Non fotografarla
- Non salvarla su cloud
- Non mandarla in chat
- Non inserirla in siti web
- Scrivila su carta e conservala offline

## Collegare il wallet

Quando colleghi Phantom a una dApp, stai dando al sito il permesso di vedere il tuo indirizzo pubblico.

Non significa che il sito può prendere fondi automaticamente.

Però devi comunque controllare sempre cosa firmi.

## Firmare transazioni

Prima di approvare:
- Controlla il sito
- Controlla importi e token
- Leggi cosa Phantom mostra
- Non firmare cose che non capisci

Molte truffe funzionano convincendo l’utente a firmare una transazione dannosa.

## Ricevere token

Per ricevere SOL o token SPL puoi condividere il tuo indirizzo pubblico.

Se un token non appare subito in Phantom, puoi controllarlo su Solscan usando il tuo wallet address.
    `
  },
  {
    id: "glossario",
    category: "Basics",
    title: "Glossario Crypto — Termini essenziali",
    desc: "Tutti i termini che devi conoscere spiegati semplice",
    time: "10 min",
    icon: "📖",
    content: `
## Termini base

**Blockchain**: registro pubblico e immutabile di transazioni.

**SOL**: moneta nativa di Solana. Serve anche per pagare le fee.

**Token SPL**: standard dei token su Solana.

**Wallet**: app che gestisce chiavi e transazioni.

**Seed Phrase**: parole segrete che controllano il wallet.

**Mint Address**: indirizzo unico del token.

## Termini DeFi

**DEX**: exchange decentralizzato senza intermediario centrale.

**Liquidity Pool**: coppia di asset usata per permettere gli swap.

**LP Token**: ricevuta che rappresenta la tua quota nella pool.

**Slippage**: differenza tra prezzo previsto e prezzo finale dello swap.

**Market Cap**: prezzo del token moltiplicato per la supply.

**Volume**: quantità scambiata in un certo periodo.

## Termini sicurezza

**Mint Authority**: permesso di creare nuovi token.

**Freeze Authority**: permesso di congelare token in wallet specifici.

**Update Authority**: permesso di modificare i metadata.

**Rug Pull**: quando chi controlla il progetto svuota liquidità o vende in modo distruttivo.

**Non-custodial**: servizio che non controlla i tuoi fondi.

**On-chain**: dati registrati pubblicamente sulla blockchain.

## Termini community

**FOMO**: paura di perdere un’occasione.

**FUD**: paura, incertezza e dubbio diffusi nella community.

**DYOR**: fai le tue ricerche prima di investire.

**ATH**: prezzo massimo storico.

**Holder**: persona che detiene un token.

**Whale**: wallet con una quantità molto grande di token.
    `
  },
];

const CATEGORIES = ["Tutti", "Basics", "Tutorial", "Sicurezza", "Marketing", "Strategia", "Educazione"];

export default function GuidesPage() {
  const [selectedGuide, setSelectedGuide] = useState<typeof GUIDES[0] | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tutti");

  const filtered = GUIDES.filter(g => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase()) || g.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Tutti" || g.category === category;
    return matchSearch && matchCat;
  });

  const catColors: Record<string, string> = {
    Basics: "#9945FF",
    Tutorial: "#14F195",
    Sicurezza: "#ff6b6b",
    Marketing: "#FFD700",
    Strategia: "#00D4AA",
    Educazione: "#b57bff",
  };

  if (selectedGuide) {
    return (
      <main style={{ minHeight: "100vh", background: "#07070f", color: "white" }}>
        <PremiumBackground />
        <nav style={{ position: "sticky", top: 0, zIndex: 50, padding: "16px 24px", background: "rgba(7,7,15,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => setSelectedGuide(null)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
              ← Guide
            </button>
            <Link href="/" style={{ fontWeight: 900, fontSize: 18, color: "white", textDecoration: "none" }}>SolMint</Link>
          </div>
        </nav>

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: 32 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: catColors[selectedGuide.category] || "#9945FF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, display: "block" }}>
              {selectedGuide.category}
            </span>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 16 }}>
              {selectedGuide.icon} {selectedGuide.title}
            </h1>
            <div style={{ display: "flex", gap: 16, color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
              <span>⏱ {selectedGuide.time} di lettura</span>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 32 }}>
            {selectedGuide.content.trim().split("\n").map((line, i) => {
  const color = catColors[selectedGuide.category] || "#9945FF";

  const renderText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong
            key={index}
            style={{
              color: "white",
              fontWeight: 850,
              letterSpacing: "-0.01em",
            }}
          >
            {part.replace(/\*\*/g, "")}
          </strong>
        );
      }

      return part;
    });
  };

  if (line.startsWith("## ")) {
    return (
      <div key={i} style={{ marginTop: 54, marginBottom: 22 }}>
        <div
          style={{
            width: 34,
            height: 3,
            borderRadius: 99,
            background: `linear-gradient(90deg, ${color}, transparent)`,
            marginBottom: 14,
            boxShadow: `0 0 22px ${color}55`,
          }}
        />
        <h2
          style={{
            fontSize: "clamp(24px, 3vw, 30px)",
            fontWeight: 950,
            color: "white",
            letterSpacing: "-0.04em",
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          {line.replace("## ", "")}
        </h2>
      </div>
    );
  }

  if (line.match(/^\d+\./)) {
    return (
      <div
        key={i}
        style={{
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
          marginBottom: 12,
          padding: "10px 14px",
          borderRadius: 16,
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.045)",
        }}
      >
        <span
          style={{
            color,
            fontWeight: 950,
            minWidth: 24,
            lineHeight: 1.75,
            fontSize: 15,
          }}
        >
          {line.match(/^\d+/)?.[0]}.
        </span>
        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,0.72)",
            fontSize: 16,
            lineHeight: 1.75,
            letterSpacing: "-0.006em",
          }}
        >
          {renderText(line.replace(/^\d+\.\s*/, ""))}
        </p>
      </div>
    );
  }

  if (line.startsWith("-")) {
    return (
      <div
        key={i}
        style={{
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
          marginBottom: 12,
          padding: "10px 14px",
          borderRadius: 16,
          background: "rgba(255,255,255,0.022)",
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: color,
            flexShrink: 0,
            marginTop: 10,
            boxShadow: `0 0 18px ${color}`,
          }}
        />
        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,0.72)",
            fontSize: 16,
            lineHeight: 1.75,
            letterSpacing: "-0.006em",
          }}
        >
          {renderText(line.slice(1).trim())}
        </p>
      </div>
    );
  }

  if (line.trim() === "") {
    return <div key={i} style={{ height: 8 }} />;
  }

  return (
    <p
      key={i}
      style={{
        color: "rgba(255,255,255,0.64)",
        fontSize: 16,
        lineHeight: 1.9,
        marginBottom: 16,
        letterSpacing: "-0.008em",
      }}
    >
      {renderText(line)}
    </p>
  );
})}
          </div>

          <div style={{ marginTop: 64, padding: 32, background: "linear-gradient(135deg, rgba(153,69,255,0.1), rgba(20,241,149,0.05))", border: "1px solid rgba(153,69,255,0.2)", borderRadius: 24, textAlign: "center" }}>
            <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Pronto a creare il tuo token?</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Metti in pratica quello che hai imparato. Ci vogliono 60 secondi.</p>
            <Link href="/?app=true" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 16, background: "linear-gradient(135deg, #9945FF, #14F195)", color: "white", fontWeight: 800, textDecoration: "none", fontSize: 15 }}>
              Lancia il tuo token
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#07070f", color: "white" }}>
      <PremiumBackground />
      

      <nav style={{ position: "sticky", top: 0, zIndex: 50, padding: "16px 24px", background: "rgba(7,7,15,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="url(#gLg)" />
              <circle cx="16" cy="16" r="6" stroke="white" strokeWidth="2" fill="none" />
              <path d="M16 10V8M16 24v-2M10 16H8M24 16h-2" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <defs><linearGradient id="gLg" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#9945FF" /><stop offset="1" stopColor="#14F195" /></linearGradient></defs>
            </svg>
            <span style={{ fontWeight: 900, fontSize: 18, color: "white" }}>SolMint</span>
          </Link>
          <div style={{ display: "flex", gap: 24 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Home</Link>
            <Link href="/trending" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Trending</Link>
            <Link href="/guides" style={{ color: "white", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>Guide</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#14F195", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Guide</p>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 16 }}>
            Impara tutto su
            <span style={{ background: "linear-gradient(90deg, #9945FF, #14F195)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> Solana</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 18, maxWidth: 500 }}>Guide complete per creare, lanciare e gestire token su Solana. Scritte semplice, senza bugie.</p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <input
            placeholder="Cerca una guida..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", maxWidth: 500, padding: "14px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, color: "white", fontSize: 15, outline: "none", fontFamily: "inherit" }}
          />
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{ padding: "8px 18px", borderRadius: 100, cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "all 0.15s", background: category === cat ? "linear-gradient(135deg, #9945FF, #14F195)" : "rgba(255,255,255,0.05)", color: category === cat ? "white" : "rgba(255,255,255,0.5)", border: category === cat ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {filtered.map(guide => (
            <div
              key={guide.id}
              onClick={() => setSelectedGuide(guide)}
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 28, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(153,69,255,0.4)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 60px rgba(153,69,255,0.1)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <span style={{ fontSize: 32 }}>{guide.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100, background: `rgba(${catColors[guide.category] === "#9945FF" ? "153,69,255" : catColors[guide.category] === "#14F195" ? "20,241,149" : "255,107,107"},0.12)`, color: catColors[guide.category] || "#9945FF", border: `1px solid rgba(${catColors[guide.category] === "#9945FF" ? "153,69,255" : catColors[guide.category] === "#14F195" ? "20,241,149" : "255,107,107"},0.25)` }}>
                  {guide.category}
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 10, letterSpacing: "-0.02em" }}>{guide.title}</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: 20 }}>{guide.desc}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>⏱ {guide.time}</span>
                <span style={{ fontSize: 13, color: "#9945FF", fontWeight: 700 }}>Leggi →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}