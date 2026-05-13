export type Guide = {
  id: string;
  category: string;
  title: string;
  desc: string;
  time: string;
  icon: string;
  content: string;
};

export const GUIDES: Guide[] = [
{
    id: "cos-e-token-spl",
    category: "Basics",
    title: "Cos'è un token SPL su Solana",
    desc: "Mint address, supply, metadata e authority spiegati senza fuffa.",
    time: "9 min",
    icon: "◎",
    content: `
## Perché devi capirlo prima di creare un token

Su Solana quasi tutti i token che vedi nei wallet, sui DEX e su DexScreener sono token SPL.

Creare un token è semplice. Capire cosa stai creando è la parte importante.

Un token non è solo un nome con un logo. È un asset registrato on-chain, con un mint address, una supply, metadata e permessi che possono influenzare la fiducia degli utenti.

Molti lanci falliscono non perché il token sia difficile da creare, ma perché viene lanciato senza capire bene questi elementi.

## Cos'è un token SPL

SPL significa Solana Program Library. È lo standard usato su Solana per creare e gestire token.

Un token SPL può essere:

- una memecoin
- un token community
- un token reward
- un token utility
- un asset usato dentro una dApp
- un token collegato a un brand

Solana fornisce l'infrastruttura tecnica. Il valore, invece, dipende da progetto, liquidità, community, fiducia e narrativa.

## Mint address: l'identità reale

Il mint address è l'indirizzo unico del token sulla blockchain.

Nome, simbolo e logo possono essere copiati. Il mint address no.

Due token possono chiamarsi entrambi DOGE, ma avranno mint address diversi. Solo uno sarà quello ufficiale del progetto.

Quando lanci un token, il mint address deve essere visibile ovunque:

- sito ufficiale
- Telegram
- X/Twitter
- DexScreener
- post di lancio
- documentazione o guide

Se la community non trova facilmente il mint address ufficiale, aumentano confusione e rischio di fake token.

## Supply e decimali

La supply è la quantità totale di token creata.

I decimali indicano in quante parti può essere diviso un token. Su Solana è comune usare 9 decimali, ma non è obbligatorio.

Per una memecoin spesso si scelgono supply alte, come 1 miliardo o 1 trilione. Non perché siano migliori, ma perché rendono il prezzo unitario più piccolo e familiare al mercato meme.

La supply non rende un token automaticamente più prezioso. Conta come viene distribuita, quanta liquidità viene aggiunta e quanta fiducia ha il mercato.

## Metadata: la prima impressione

I metadata sono le informazioni che wallet, scanner e DEX mostrano agli utenti.

Di solito includono:

- nome
- simbolo
- logo
- descrizione
- website
- link social

Un token senza logo, senza descrizione e senza link ufficiali sembra improvvisato. Anche se tecnicamente funziona, la percezione sarà debole.

Un buon token dovrebbe avere:

- logo leggibile anche piccolo
- nome facile da ricordare
- ticker semplice
- descrizione breve e chiara
- link ufficiali funzionanti

## Authority

Quando crei un token SPL, alcune authority possono restare attive.

Le più importanti sono:

- **Mint Authority**: permette di creare altri token dopo il lancio
- **Freeze Authority**: permette di bloccare token in specifici wallet
- **Update Authority**: permette di modificare i metadata

Per una memecoin queste authority sono molto sensibili.

Se la Mint Authority resta attiva, gli utenti possono temere che la supply venga aumentata.  
Se la Freeze Authority resta attiva, possono temere che alcuni wallet vengano bloccati.  
Se la Update Authority resta attiva, possono temere che logo o metadata cambino dopo il lancio.

Non sempre mantenere una authority è sbagliato, ma deve esserci una ragione chiara.

## Token creato non significa token lanciato

Creare un token significa che il token esiste on-chain.

Non significa che abbia:

- prezzo
- volume
- mercato
- liquidità
- community
- visibilità

Per renderlo scambiabile serve una liquidity pool, di solito TOKEN/SOL.

La pool permette agli utenti di comprare e vendere. Solo dopo la creazione della pool il token può iniziare ad apparire su strumenti come Raydium, Jupiter e DexScreener.

## Checklist prima di pubblicare

Prima di annunciare il token, controlla:

- nome definitivo
- simbolo definitivo
- logo corretto
- link social funzionanti
- supply scelta
- authority configurate
- mint address salvato
- messaggio ufficiale pronto

Molti errori diventano difficili o impossibili da correggere dopo il lancio.

## Conclusione

Un token SPL è semplice da creare, ma non va trattato come un dettaglio tecnico.

È la base del tuo lancio.

Se mint address, supply, metadata e authority sono gestiti bene, parti con più credibilità. Se sono gestiti male, anche una buona idea può sembrare poco affidabile.
`,
  },
  {
    id: "come-creare-token",
    category: "Tutorial",
    title: "Come creare un token Solana",
    desc: "La checklist pratica per creare un token SPL pronto al lancio.",
    time: "11 min",
    icon: "🚀",
    content: `
## Creare il token è facile. Lanciarlo bene no.

Oggi creare un token Solana richiede pochi minuti.

Il problema non è la parte tecnica. Il problema è che molti token nascono senza preparazione:

- logo improvvisato
- supply scelta a caso
- authority lasciate attive senza motivo
- metadata incompleti
- nessuna strategia per liquidità o community

Il risultato è che il token sembra poco affidabile ancora prima del primo acquisto.

## Cosa preparare prima

Prima di creare il token, prepara tutto.

Ti servono:

1. wallet Phantom o Solflare
2. SOL per fee e operazioni
3. nome del token
4. ticker simbolo
5. logo definitivo
6. supply totale
7. link social
8. decisione sulle authority
9. messaggio di lancio
10. piano per la liquidity pool

Molti creator fanno l'errore di creare il token e pensare al resto dopo. Su Solana i primi minuti contano molto.

## Nome e ticker

Il nome deve essere facile da ricordare.

Il ticker deve:

- essere corto
- essere leggibile
- funzionare bene su DexScreener
- essere facile da scrivere
- non sembrare copiato

Esempi migliori:

- BONK
- WIF
- POPCAT
- PIZZA

Esempi deboli:

- SUPERDOGEMEME2025
- TOKEN123
- ticker troppo lunghi
- nomi confusi o difficili da scrivere

Per le memecoin, il ticker è parte del branding.

## Supply

La supply non crea valore da sola.

Una supply enorme non rende il token economico. Rende solo il prezzo unitario più piccolo.

Le memecoin spesso usano supply alte perché il mercato meme è abituato a numeri grandi. Ma la cosa importante è essere coerenti con:

- narrativa
- liquidità iniziale
- distribuzione
- market cap percepita
- comunicazione alla community

Non scegliere la supply a caso.

## Decimali

Su Solana la scelta più comune è 9 decimali.

Per la maggior parte dei token è la scelta più semplice e compatibile con wallet e DEX.

Cambiare decimali raramente porta vantaggi reali a un creator normale.

## Logo e metadata

Il logo è una delle parti più importanti del lancio.

Appare su:

- wallet
- DexScreener
- Raydium
- Jupiter
- Telegram
- X/Twitter

Un buon logo deve essere:

- leggibile piccolo
- riconoscibile
- coerente con il nome
- non copiato
- adatto a sfondo scuro
- memorabile

I metadata devono essere completi. Un token senza descrizione, logo o link ufficiali sembra abbandonato.

## Authority

Quando crei un token puoi mantenere o revocare alcune authority.

Le principali sono:

- **Mint Authority**
- **Freeze Authority**
- **Update Authority**

Queste authority influenzano la fiducia.

### Mint Authority

Permette di creare nuovi token dopo il lancio.

Se resta attiva, la community può temere inflazione futura.

### Freeze Authority

Permette di bloccare wallet specifici.

Per le memecoin è spesso vista come un rischio forte.

### Update Authority

Permette di modificare metadata e logo.

Può essere utile prima del lancio, ma molti creator la revocano quando vogliono rendere il token più trustless.

## Creazione del token

Con SolMint il processo è:

1. collega il wallet
2. inserisci nome e ticker
3. scegli supply e decimali
4. carica logo e metadata
5. configura authority
6. conferma la transazione
7. salva il mint address

Dopo la conferma, il token esiste on-chain.

## Dopo la creazione

Il token appena creato non ha automaticamente mercato.

Per renderlo tradabile serve una liquidity pool.

La pool più comune è:

TOKEN / SOL

Solo dopo la pool il token può iniziare ad apparire su:

- Raydium
- Jupiter
- DexScreener
- Birdeye

## Errori comuni

Evita:

- creare senza community
- logo copiato
- supply scelta a caso
- social vuoti
- authority attive senza spiegazione
- mint address difficile da trovare
- liquidità troppo bassa
- creator che vende subito
- promesse di guadagni garantiti

Il problema non è creare il token. Il problema è farlo sembrare credibile nei primi minuti.

## Conclusione

Creare un token Solana è semplice.

La vera differenza sta in:

- branding
- fiducia
- liquidità
- community
- qualità del lancio

Se prepari bene questi elementi, il token parte con una percezione molto più forte.
`,
  },
  {
    id: "revoke-authority",
    category: "Sicurezza",
    title: "Cosa sono le Revoke Authority",
    desc: "Mint, Freeze e Update spiegate come le valuta davvero il mercato.",
    time: "9 min",
    icon: "🔒",
    content: `
## Perché le authority contano

Quando un token viene creato, alcune funzioni possono restare sotto il controllo del creator.

Queste funzioni si chiamano authority.

Per un utente inesperto sembrano dettagli tecnici. Per chi guarda un token con attenzione, invece, sono uno dei primi segnali di rischio o fiducia.

Le authority non decidono da sole se un progetto è buono o cattivo, ma influenzano molto la percezione del mercato.

## Mint Authority

La Mint Authority permette di creare nuovi token dopo il lancio.

Se resta attiva, il creator può aumentare la supply.

Questo è un punto molto sensibile. Se gli utenti vedono che la Mint Authority è ancora attiva, possono pensare:

- la supply può cambiare
- potrei essere diluito
- il creator ha troppo controllo
- il token non è realmente fixed supply

Per una memecoin, mantenere la Mint Authority attiva è quasi sempre un problema di fiducia.

## Freeze Authority

La Freeze Authority permette di congelare token in specifici wallet.

Questo significa che alcuni holder potrebbero non riuscire a trasferire o vendere.

Anche se il creator non ha cattive intenzioni, la sola presenza di questa authority può spaventare gli utenti.

Per un token community o memecoin, la Freeze Authority attiva viene spesso vista come un segnale negativo.

## Update Authority

La Update Authority permette di modificare i metadata.

Con questa authority attiva si possono cambiare:

- logo
- descrizione
- link
- alcuni dati collegati al token

In alcuni casi può essere utile mantenerla per correggere errori prima del lancio definitivo.

Ma dopo il lancio, molti creator preferiscono revocarla per dimostrare che l'identità del token non verrà cambiata.

## Revocare significa perdere controllo

Revocare una authority significa rinunciare a quel potere.

È una scelta forte.

Vantaggi:

- aumenta la fiducia
- riduce dubbi sulla supply
- riduce rischio percepito
- rende il token più trasparente

Svantaggi:

- non puoi più correggere certe cose
- non puoi cambiare metadata se hai revocato Update
- non puoi mintare altri token se hai revocato Mint
- non puoi intervenire su wallet se hai revocato Freeze

Devi decidere prima cosa vuoi ottenere.

## Quando revocare

Per una memecoin classica, spesso ha senso revocare tutto.

Per un progetto utility, gaming o dApp, può avere senso mantenere qualche authority per motivi tecnici.

Ma la regola è semplice:

Se mantieni una authority, devi spiegare chiaramente perché.

Senza spiegazione, il mercato interpreta il controllo come rischio.

## Come comunicarlo

Se revochi le authority, comunicalo bene.

Esempio:

- Mint Authority revoked
- Freeze Authority revoked
- Metadata locked
- Supply fixed
- Mint address ufficiale pubblicato

Questi messaggi aiutano gli utenti a verificare.

## Errore comune

L'errore comune è pensare che la community non controlli.

Su Solana molti utenti controllano subito:

- mint authority
- freeze authority
- update authority
- holder
- liquidity
- volume

Se qualcosa sembra sospetto, passano oltre.

## Conclusione

Le revoke non garantiscono il successo di un token.

Però rimuovono molti dubbi.

In un mercato pieno di token improvvisati, avere authority gestite bene è un vantaggio concreto.
`,
  },
  {
    id: "liquidity-pool-raydium",
    category: "Tutorial",
    title: "Come aggiungere liquidità su Raydium",
    desc: "Come rendere tradabile un token e scegliere una pool sensata.",
    time: "11 min",
    icon: "💧",
    content: `
## Perché serve liquidità

Un token appena creato esiste on-chain, ma non ha automaticamente un mercato.

Per permettere agli utenti di comprarlo e venderlo serve una liquidity pool.

La pool più comune su Solana è:

TOKEN / SOL

Senza pool, il token può essere inviato tra wallet, ma non è facilmente scambiabile.

## Cos'è una liquidity pool

Una liquidity pool è una riserva di due asset depositati in uno smart contract.

Nel caso TOKEN/SOL, depositi:

- una quantità del tuo token
- una quantità di SOL

Il rapporto tra questi due asset crea il prezzo iniziale.

## Prezzo iniziale

Il prezzo iniziale dipende da quanto token e quanto SOL depositi.

Esempio semplice:

- 500.000.000 token
- 1 SOL

Quel rapporto determina il prezzo iniziale teorico.

Se depositi più SOL rispetto ai token, il prezzo iniziale sarà più alto.  
Se depositi molti token e poco SOL, il prezzo iniziale sarà più basso.

Non esiste un prezzo iniziale perfetto. Dipende dalla supply, dalla narrativa, dalla liquidità e dal tipo di lancio.

## Cosa preparare prima

Prima di creare la pool, assicurati di avere:

- mint address corretto
- token nel wallet
- SOL per liquidità
- SOL extra per fee
- logo e metadata già sistemati
- link ufficiali pubblici
- messaggio per la community
- piano per comunicare la pool

Non creare la pool se il token non è pronto a essere visto.

## Creare la pool

Il processo generale è:

1. apri Raydium
2. vai nella sezione liquidity
3. scegli create pool
4. incolla il mint address
5. scegli SOL come secondo asset
6. inserisci quantità token
7. inserisci quantità SOL
8. controlla il rapporto
9. conferma con Phantom

Dopo la conferma, il token può iniziare a comparire su DEX e scanner.

## Liquidità bassa

Con liquidità bassa:

- il prezzo si muove molto facilmente
- lo slippage può essere alto
- piccoli acquisti possono pompare il grafico
- piccole vendite possono distruggerlo
- il rischio percepito è alto

Può sembrare interessante per il meme, ma è fragile.

## Liquidità più alta

Con più liquidità:

- il prezzo è più stabile
- il token sembra più serio
- gli utenti hanno più fiducia
- è più facile reggere volume
- lo slippage è più gestibile

Non significa che il token salirà, ma riduce alcuni problemi tecnici e psicologici.

## Rimuovere liquidità

Rimuovere liquidità è possibile, ma è una delle azioni più delicate.

Se la community vede sparire la liquidità, può interpretarlo come rug pull.

Anche se hai una ragione legittima, devi comunicarla prima e in modo chiaro.

## Dopo la pool

Dopo la creazione della pool, controlla:

- DexScreener
- Raydium
- Jupiter
- Solscan
- holder
- volume
- link e metadata

I primi minuti sono importanti. Se qualcosa è rotto, gli utenti lo noteranno subito.

## Conclusione

La liquidity pool è il momento in cui il token passa da asset creato a token tradabile.

È uno dei passaggi più importanti del lancio.

Preparala con attenzione, perché influenza prezzo, fiducia, volume e percezione del progetto.
`,
  },
  {
    id: "dexscreener-listing",
    category: "Marketing",
    title: "Come apparire su DexScreener",
    desc: "Cosa serve per essere indicizzati e sembrare affidabili.",
    time: "8 min",
    icon: "📈",
    content: `
## DexScreener non è magia

DexScreener mostra token che hanno attività su DEX supportati.

Non basta creare un token. Serve una pool, attività reale e dati leggibili.

Molti creator pensano: “Appena creo il token, apparirà ovunque.”

Non funziona così.

## Cosa serve davvero

Per apparire bene servono:

- pool attiva
- liquidità
- volume
- metadata leggibili
- logo
- nome e simbolo chiari
- link social
- mint address corretto

Il listing tecnico è solo una parte. La presentazione conta molto.

## Tempi

Dopo la creazione della pool, i tempi possono variare.

Spesso:

- Raydium funziona quasi subito
- DexScreener può indicizzare in pochi minuti
- Jupiter può richiedere più tempo
- altri scanner possono aggiornarsi lentamente

Nei primi minuti è normale vedere dati incompleti.

## Cosa guardano gli utenti

Quando un token appare su DexScreener, gli utenti guardano subito:

- market cap
- volume
- liquidità
- variazione prezzo
- età della pool
- transazioni recenti
- logo
- social
- holder
- authority

Un token senza logo o social può essere ignorato anche se sta facendo volume.

## Profilo migliore

Per migliorare la percezione:

- usa un logo chiaro
- pubblica link ufficiali
- tieni Telegram attivo
- comunica il mint address
- evita nomi copiati
- prepara un messaggio fissato
- spiega supply e authority

DexScreener porta attenzione. Poi il progetto deve reggere quella attenzione.

## Errori da evitare

Evita:

- social vuoti
- link rotti
- logo mancante
- descrizione assente
- promesse tipo 100x garantito
- nomi troppo simili a token famosi
- mint address non pubblicato
- creator wallet sospetto

## Boost

DexScreener offre strumenti promozionali.

Possono aumentare visibilità, ma non sostituiscono:

- community
- liquidità
- branding
- volume reale
- fiducia

Un boost senza progetto dietro dura poco.

## Conclusione

Apparire su DexScreener è utile, ma non basta.

La domanda vera è: quando gli utenti arrivano sulla chart, trovano un progetto curato o un token improvvisato?

Quella differenza decide spesso se restano o passano al prossimo.
`,
  },
  {
    id: "token-di-successo",
    category: "Strategia",
    title: "Come fare un token meme di successo",
    desc: "Branding, community, timing e fiducia spiegati senza hype.",
    time: "10 min",
    icon: "🏆",
    content: `
## La parte tecnica non basta

Creare un token è facile. Creare attenzione è difficile.

Una memecoin non vende solo tecnologia. Vende:

- identità
- meme
- appartenenza
- timing
- energia community
- fiducia minima

Se il token non comunica nulla, morirà anche se tecnicamente è perfetto.

## Il concept

Un buon meme token si capisce in pochi secondi.

Se devi spiegare troppo, il concept è debole.

Funzionano bene:

- mascotte semplici
- nomi memorabili
- riferimenti culturali chiari
- humor immediato
- visual forte
- narrativa facile da ripetere

Un buon test è questo: una persona può capirlo da una card su DexScreener senza leggere un whitepaper?

## Il logo

Il logo è più importante di quanto molti pensano.

Appare ovunque:

- wallet
- DexScreener
- Telegram
- X
- Raydium
- Jupiter

Deve funzionare piccolo, su sfondo scuro e in mezzo a decine di altri token.

Un logo debole riduce i click.

## Community prima della pool

Lanciare senza nessuno pronto è uno degli errori più comuni.

Prima della pool dovresti avere:

- Telegram
- X/Twitter
- primi meme
- messaggio fissato
- mint address ufficiale
- supply spiegata
- regole base della community
- almeno un piccolo gruppo reale

Anche 30 persone vere valgono più di numeri finti.

## Timing

Il timing conta.

Un token può essere tecnicamente buono ma lanciato nel momento sbagliato.

Prima di lanciare guarda:

- cosa sta trendando
- quali narrative sono sature
- quali meme stanno girando
- che tipo di token sta facendo volume
- che mood ha il mercato

Non copiare. Usa il contesto.

## Fiducia

Nel mercato meme nessuno si fida subito.

Per ridurre dubbi:

- revoca authority quando ha senso
- comunica supply
- pubblica mint address
- non promettere guadagni
- non nascondere wallet importanti
- spiega la liquidità
- resta presente dopo il lancio

La fiducia non garantisce successo, ma riduce attrito.

## Errori che uccidono un lancio

Evita:

- logo copiato
- presale confuse
- social vuoti
- creator che vende subito
- mint address non chiaro
- freeze authority attiva
- promesse aggressive
- Telegram abbandonato
- liquidità rimossa senza spiegazione

## Conclusione

Un token meme di successo nasce dall'incontro tra idea semplice, community attiva, timing giusto e fiducia sufficiente.

Non serve sembrare una multinazionale.

Serve sembrare vivo, chiaro e non sospetto.
`,
  },
  {
    id: "scam-vs-legit",
    category: "Sicurezza",
    title: "Token legit vs scam — come riconoscerli",
    desc: "Controlli pratici da fare prima di comprare o lanciare.",
    time: "9 min",
    icon: "🛡",
    content: `
## Non esiste un controllo perfetto

Su Solana nascono moltissimi token ogni giorno.

Alcuni sono progetti reali. Alcuni sono esperimenti. Altri sono scam.

Non esiste un singolo controllo che ti protegga sempre. Devi guardare più segnali insieme.

## Authority

Controlla sempre:

- Mint Authority
- Freeze Authority
- Update Authority

Mint attiva significa che possono essere creati nuovi token.

Freeze attiva significa che alcuni wallet potrebbero essere bloccati.

Update attiva significa che metadata e logo potrebbero cambiare.

Per una memecoin, Mint e Freeze attive sono segnali molto delicati.

## Holder

Guarda la distribuzione.

Se pochi wallet controllano una grande parte della supply, il rischio è più alto.

Non significa automaticamente scam, ma significa che quei wallet possono influenzare molto il prezzo.

Controlla:

- top holder
- wallet creator
- percentuale detenuta
- movimenti recenti
- eventuali cluster sospetti

## Liquidità

La liquidità dice quanto è facile comprare e vendere.

Liquidità molto bassa significa:

- prezzo fragile
- slippage alto
- vendite pesanti più pericolose
- mercato facile da manipolare

Se la liquidità sparisce improvvisamente, il token può diventare quasi intradabile.

## Social

I social non provano che un progetto sia legittimo, ma aiutano a capire se è curato.

Guarda:

- Telegram attivo
- X/Twitter aggiornato
- messaggi chiari
- mint address pubblicato
- community reale
- risposte del team

Diffida di community piene solo di bot e messaggi tipo “to the moon”.

## Promesse

Le promesse aggressive sono un segnale rosso.

Attenzione a frasi come:

- 100x garantito
- non può scendere
- whale sicure
- insider call
- rendimento fisso
- buyback garantito

Nessuno può garantire il prezzo futuro di una memecoin.

## Metadata e branding

Un token con logo copiato, descrizione vuota o link rotti sembra improvvisato.

Non è sempre scam, ma è un segnale di bassa qualità.

Un progetto serio cura almeno le basi:

- logo
- descrizione
- link
- mint address
- comunicazione chiara

## Tool utili

Puoi controllare con:

- Solscan
- DexScreener
- RugCheck
- Birdeye
- Raydium
- Jupiter

Nessun tool basta da solo. Confronta più fonti.

## Conclusione

Un token legit non è semplicemente un token che sale.

Un token più affidabile di solito ha:

- authority spiegate o revocate
- liquidità visibile
- holder meno concentrati
- social reali
- metadata curati
- comunicazione chiara

Se troppe cose non tornano, meglio passare oltre.
`,
  },
  {
    id: "phantom-wallet-guida",
    category: "Basics",
    title: "Phantom Wallet — guida completa",
    desc: "Setup, sicurezza e buone pratiche per usare Solana.",
    time: "8 min",
    icon: "👻",
    content: `
## Cos'è Phantom

Phantom è uno dei wallet più usati su Solana.

Permette di:

- ricevere SOL
- gestire token SPL
- collegarsi alle dApp
- firmare transazioni
- vedere NFT e asset
- usare DeFi e DEX

È non-custodial. Significa che il controllo del wallet è tuo.

## Installazione sicura

Scarica Phantom solo dal sito ufficiale o dagli store ufficiali.

Evita:

- link ricevuti in DM
- annunci sospetti
- siti copiati
- estensioni con nomi simili
- download da pagine casuali

Molti scam imitano wallet e dApp per rubare seed phrase.

## Seed phrase

La seed phrase controlla il wallet.

Chi ha la seed phrase può controllare i fondi.

Regole:

- non fotografarla
- non salvarla su cloud
- non inviarla in chat
- non inserirla in siti web
- conservala offline
- non condividerla mai

Nessun servizio serio ti chiederà la seed phrase.

## Collegare il wallet

Quando colleghi Phantom a una dApp, il sito può vedere il tuo indirizzo pubblico.

Non può prendere fondi senza una firma, ma devi comunque controllare cosa approvi.

Collegare il wallet non è la stessa cosa che firmare una transazione.

## Firmare transazioni

Prima di firmare:

- controlla il dominio
- leggi cosa mostra Phantom
- verifica importi e token
- non firmare messaggi che non capisci
- evita fretta e pressione

Molte truffe funzionano perché l'utente firma senza leggere.

## Ricevere token

Puoi condividere il tuo indirizzo pubblico per ricevere SOL o token SPL.

Se un token non appare subito in Phantom, puoi controllarlo su Solscan usando il wallet address.

Non tutti i token ricevuti sono sicuri o utili. Alcuni possono essere spam.

## Buone pratiche

Per usare Phantom meglio:

- tieni un wallet principale separato da wallet di test
- non collegare il wallet principale a siti dubbi
- controlla sempre l'URL
- usa poco SOL sui wallet rischiosi
- revoca connessioni inutili
- non firmare quando sei di fretta

## Conclusione

Phantom è semplice da usare, ma la sicurezza dipende molto da te.

La regola principale è: non condividere mai la seed phrase e non firmare transazioni che non capisci.
`,
  },
  {
    id: "impermanent-loss",
    category: "Educazione",
    title: "Cos'è l'impermanent loss",
    desc: "Il rischio principale quando fornisci liquidità.",
    time: "8 min",
    icon: "📊",
    content: `
## Perché devi conoscerlo

Se fornisci liquidità a una pool, non stai semplicemente tenendo token nel wallet.

Stai depositando due asset in un meccanismo che si ribilancia continuamente.

Questo può generare fee, ma può anche creare una perdita relativa chiamata impermanent loss.

## Cos'è

L'impermanent loss è la differenza tra:

- tenere gli asset nel wallet
- fornirli come liquidità in una pool

Succede quando il prezzo degli asset cambia rispetto al momento del deposito.

## Esempio semplice

Depositi in una pool:

- SOL
- il tuo token

Se il prezzo del token sale molto, la pool si ribilancia.

Quando ritiri, potresti avere meno token rispetto a quelli che avresti avuto semplicemente tenendoli nel wallet.

La differenza è l'impermanent loss.

## Perché succede

Le pool AMM mantengono un rapporto matematico tra i due asset.

Quando gli utenti comprano un token, la pool vende quel token e riceve l'altro asset.

Questo cambia la composizione della tua posizione.

Non è un bug. È il modo in cui funziona il mercato automatico.

## Perché si chiama impermanent

Si chiama impermanent perché se il prezzo torna al rapporto iniziale, la perdita teorica può ridursi.

Diventa reale quando ritiri liquidità mentre il prezzo è cambiato.

## Le fee possono compensare

Chi fornisce liquidità riceve una parte delle fee generate dagli swap.

Se il volume è alto, le fee possono compensare parte dell'impermanent loss.

Per questo non devi guardare solo il prezzo. Devi guardare anche volume, fee e durata della posizione.

## Per le memecoin

Nelle memecoin la volatilità è spesso alta.

Questo significa che l'impermanent loss può essere più importante.

Fornire liquidità può essere utile per il progetto, ma è comunque un rischio finanziario.

## Conclusione

La liquidità è fondamentale per rendere un token tradabile, ma non è gratis.

Prima di depositare liquidità devi capire:

- quanto puoi rischiare
- quanto è volatile il token
- quanto volume ti aspetti
- quando potresti ritirare
- come comunicherai eventuali modifiche

Fornire liquidità senza capire questo rischio è un errore.
`,
  },
  {
    id: "glossario",
    category: "Basics",
    title: "Glossario crypto — termini essenziali",
    desc: "Le parole più importanti per capire token, DEX e lanci.",
    time: "10 min",
    icon: "📖",
    content: `
## Blockchain

Registro pubblico di transazioni.

Su Solana, le transazioni vengono registrate on-chain e possono essere consultate da strumenti come Solscan.

## SOL

La moneta nativa di Solana.

Serve per pagare fee di rete, fare swap, creare pool e interagire con dApp.

## Token SPL

Standard dei token su Solana.

È il formato usato da wallet, DEX e applicazioni per riconoscere e gestire token.

## Wallet

Applicazione che gestisce chiavi, asset e transazioni.

Phantom e Solflare sono due esempi popolari su Solana.

## Seed phrase

Frase segreta che controlla il wallet.

Non va mai condivisa.

## Mint address

Indirizzo unico del token.

È l'identità reale del token on-chain.

## Supply

Quantità totale di token creata.

Non indica da sola il valore del progetto.

## Decimali

Indicano in quante parti può essere diviso un token.

Su Solana spesso si usano 9 decimali.

## Metadata

Informazioni visibili del token:

- nome
- simbolo
- logo
- descrizione
- link

## DEX

Exchange decentralizzato.

Permette di scambiare token senza un exchange centralizzato.

## Liquidity pool

Riserva di due asset usata per permettere swap.

Esempio: TOKEN/SOL.

## LP token

Token che rappresenta la tua quota in una liquidity pool.

## Slippage

Differenza tra prezzo previsto e prezzo finale dello swap.

Aumenta quando la liquidità è bassa o l'ordine è grande.

## Market cap

Prezzo del token moltiplicato per la supply considerata.

È una metrica utile, ma va letta insieme a liquidità e volume.

## Volume

Valore scambiato in un certo periodo.

Volume reale indica attività di mercato.

## Mint Authority

Permesso di creare nuovi token.

Se attiva, la supply può essere aumentata.

## Freeze Authority

Permesso di congelare token in wallet specifici.

Per memecoin è spesso un segnale delicato.

## Update Authority

Permesso di modificare metadata.

Può essere utile, ma dopo il lancio può creare dubbi.

## Rug pull

Quando chi controlla il progetto rimuove liquidità o vende in modo distruttivo.

## Non-custodial

Servizio che non controlla i fondi degli utenti.

L'utente firma le transazioni dal proprio wallet.

## FOMO

Paura di perdere un'occasione.

Spesso porta a comprare senza analisi.

## FUD

Paura, incertezza e dubbio.

Può nascere da problemi reali o da panico della community.

## DYOR

Do Your Own Research.

Significa fare le proprie verifiche prima di comprare o lanciare.
`,
  },
  {
    id: "pumpfun-vs-solmint",
    category: "Strategia",
    title: "Pump.fun vs SolMint — differenze reali",
    desc: "Quando usare un launch veloce e quando serve più controllo.",
    time: "9 min",
    icon: "⚔️",
    content: `
## Due strumenti diversi

Pump.fun e SolMint non sono la stessa cosa.

Pump.fun è pensato per lanciare token in modo estremamente rapido dentro un feed virale.

SolMint è pensato per creator che vogliono più controllo su branding, metadata, authority e preparazione del lancio.

La scelta dipende dall'obiettivo.

## Pump.fun

Pump.fun funziona bene se vuoi testare un meme velocemente.

Punti forti:

- lancio immediato
- traffico organico
- feed molto attivo
- cultura memecoin forte
- esperienza semplice

Limiti:

- branding più limitato
- competizione enorme
- molti token sembrano simili
- vita media spesso breve
- difficile costruire fiducia fuori dal feed

## SolMint

SolMint è più adatto se vuoi preparare un token con identità più curata.

Punti forti:

- metadata completi
- logo e link curati
- authority gestibili
- AI per trovare narrativa
- strumenti per trend e launch
- maggiore controllo sul token

Limiti:

- richiede più preparazione
- non sostituisce community e marketing
- non offre automaticamente traffico come un feed virale

## Quale scegliere

Usa un launch ultra veloce se vuoi:

- testare meme
- cavalcare hype immediato
- fare esperimenti rapidi
- puntare tutto sul feed

Usa un approccio più curato se vuoi:

- costruire brand
- creare community
- comunicare meglio la supply
- gestire authority
- preparare liquidità
- sembrare più credibile

## La verità

La piattaforma non salva un lancio debole.

Un token ha bisogno di:

- idea chiara
- community reale
- timing
- liquidità
- fiducia
- comunicazione costante

La tecnologia aiuta. L'attenzione va costruita.
`,
  },
  {
    id: "come-diventare-trending",
    category: "Marketing",
    title: "Come andare trending su DexScreener",
    desc: "Le metriche che attirano attenzione nei primi minuti.",
    time: "10 min",
    icon: "🔥",
    content: `
## Andare trending non è casuale

DexScreener mostra token che stanno generando attività.

Non basta creare un token. Servono volume, transazioni, liquidità, attenzione e una narrativa che faccia cliccare.

## Metriche osservate

Gli utenti guardano:

- volume 24h
- variazione prezzo
- liquidità
- numero di transazioni
- acquisti recenti
- market cap
- età della pool

Questi dati aiutano a capire se un token è vivo o fermo.

## I primi minuti

Molti token muoiono perché vengono lanciati senza nessuno pronto.

Prima della pool dovresti avere:

- community attiva
- logo pronto
- Telegram o X attivi
- mint address ufficiale
- messaggi già preparati
- primi meme
- spiegazione della supply

Un lancio senza attenzione iniziale è difficile da recuperare.

## Branding nel feed

Nel feed gli utenti decidono in pochi secondi.

Per aumentare i click servono:

- nome leggibile
- logo forte
- ticker memorabile
- narrativa semplice
- social funzionanti

Il token deve essere comprensibile prima ancora di aprire il grafico.

## Volume reale

Il volume attira attenzione, ma deve essere credibile.

Volume finto o artificiale può creare sospetti.

Meglio avere attività reale da community reale, anche più piccola.

## Cosa rovina un lancio

Errori comuni:

- social vuoti
- logo mancante
- freeze authority attiva
- creator che vende subito
- liquidità troppo bassa
- community finta
- promesse aggressive
- mint address non verificabile

## Non esiste trucco sicuro

Non esiste un metodo garantito per andare trending.

I lanci migliori combinano:

- preparazione
- timing
- volume reale
- community
- branding
- fiducia

Tutto il resto è rumore.
`,
  },
  {
    id: "ai-memecoin-future",
    category: "Educazione",
    title: "AI memecoin — il futuro dei token virali?",
    desc: "Come usare AI senza creare token tutti uguali.",
    time: "8 min",
    icon: "🤖",
    content: `
## L'AI sta cambiando i memecoin

L'intelligenza artificiale sta entrando nel mondo dei token virali.

Oggi può aiutare a creare:

- nomi
- ticker
- logo
- descrizioni
- meme
- strategie di lancio
- varianti di narrativa

Questo accelera molto il lavoro dei creator.

## Perché è utile

I memecoin vivono di attenzione.

L'AI può aiutare a:

- analizzare trend
- generare molte idee
- trovare angoli creativi
- creare branding iniziale
- produrre contenuti velocemente
- trasformare un trend in concept

Usata bene, è un acceleratore.

## Il rischio

Se tutti usano AI nello stesso modo, i token diventano simili.

Il risultato può sembrare generico, freddo o finto.

Per evitarlo devi aggiungere:

- gusto umano
- cultura internet
- timing
- community
- ironia reale
- riferimenti specifici

## AI più dati live

La combinazione più interessante è AI + trend live.

Guardare cosa sta performando ora e generare idee ispirate al momento può essere più efficace rispetto a inventare token a caso.

Non significa copiare. Significa capire il contesto.

## Cosa può fare bene l'AI

L'AI è utile per:

- brainstorming
- naming
- descrizioni
- prompt immagine
- analisi narrative
- varianti di concept
- idee per meme

## Cosa non può sostituire

L'AI non sostituisce:

- community reale
- timing
- gusto
- fiducia
- gestione del lancio
- presenza del creator

Un token generato bene ma gestito male resta debole.

## Conclusione

L'AI renderà i lanci più veloci.

Ma la differenza resterà umana: capire cosa fa ridere, cosa crea identità e cosa spinge una community a partecipare.
`,
  },
];