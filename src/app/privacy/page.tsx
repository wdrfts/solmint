export default function Privacy() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="text-sm text-purple-400 mb-8 block">Torna alla home</a>
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-12">Ultimo aggiornamento: Aprile 2026</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Nessun dato raccolto</h2>
            <p>SolMint non raccoglie, memorizza o elabora dati personali degli utenti. Non esiste alcun database, account utente o sistema di autenticazione. Il sito funziona interamente tramite connessione diretta al tuo wallet Solana.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Wallet e transazioni</h2>
            <p>SolMint non ha mai accesso alle chiavi private del tuo wallet. Tutte le transazioni sono firmate localmente dal tuo wallet (Phantom, Solflare) e trasmesse direttamente alla blockchain Solana. Non conserviamo nessuna informazione sulle transazioni effettuate.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. IPFS e metadata</h2>
            <p>Le immagini e i metadata dei token vengono caricati su IPFS tramite Pinata. Questi dati sono pubblici e immutabili per natura della tecnologia blockchain. Non caricare informazioni personali nei metadata del token.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Cookie e analytics</h2>
            <p>SolMint non utilizza cookie di profilazione, tracker o sistemi di analytics di terze parti. Non viene installato nessun cookie sul tuo browser.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Servizi terzi</h2>
            <p>Il sito si interfaccia con Solana blockchain, Pinata (IPFS), QuickNode (RPC) e Raydium (DEX). Questi servizi hanno le proprie privacy policy indipendenti.</p>
          </section>
        </div>
      </div>
      <footer className="border-t border-gray-800 py-8 px-6">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, #9945FF, #14F195)" }}>S</div>
      <span className="text-sm text-gray-500">SolMint — Powered by Solana and Metaplex</span>
    </div>
    <div className="flex items-center gap-6">
      <a href="/privacy" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Privacy Policy</a>
      <a href="/terms" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Termini e Condizioni</a>
      <span className="text-xs text-gray-600">100% non-custodial</span>
    </div>
  </div>
</footer>
    </main>
  );
}