export default function Terms() {
  return (
    <main className="min-h-screen text-white px-6 py-24" style={{ background: "transparent" }}>
      <div className="max-w-3xl mx-auto">
        <a href="/" className="text-sm text-purple-400 mb-8 block">Torna alla home</a>
        <h1 className="text-4xl font-bold mb-2">Termini e Condizioni</h1>
        <p className="text-gray-500 text-sm mb-12">Ultimo aggiornamento: Aprile 2026</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Accettazione dei termini</h2>
            <p>Utilizzando SolMint accetti integralmente questi termini. Se non li accetti, non utilizzare il servizio. SolMint è uno strumento tecnico per la creazione di token SPL su Solana.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Natura del servizio</h2>
            <p>SolMint è uno strumento tecnico non-custodial. Non siamo un exchange, non gestiamo fondi e non offriamo consulenza finanziaria. Le fee pagate sono per il servizio tecnico di creazione token e non costituiscono investimento.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Responsabilita dell utente</h2>
            <p>Sei il solo responsabile dei token che crei tramite SolMint. E vietato creare token con finalita fraudolente, di truffa, pump and dump, o che violino leggi locali. SolMint non e responsabile per l uso che gli utenti fanno dei token creati.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Fee e transazioni</h2>
            <p>Le fee addebitate sono chiaramente indicate prima di ogni transazione. Tutte le transazioni blockchain sono irreversibili. SolMint non puo rimborsare fee gia pagate on-chain. Verifica sempre i dettagli prima di firmare con il tuo wallet.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Rischi blockchain</h2>
            <p>Le transazioni su blockchain comportano rischi intrinseci inclusi ma non limitati a: volatilita del prezzo di SOL, congestione della rete, bug nei contratti. Usa SolMint consapevolmente e solo con fondi che puoi permetterti di perdere.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Limitazione di responsabilita</h2>
            <p>SolMint e fornito "as is" senza garanzie di alcun tipo. Non siamo responsabili per perdite dirette o indirette derivanti dall uso del servizio, malfunzionamenti della blockchain Solana o di servizi terzi.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Modifiche</h2>
            <p>Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. Le modifiche saranno effettive dalla data di pubblicazione sul sito.</p>
          </section>
        </div>
      </div>
      <footer className="border-t py-8 px-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
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