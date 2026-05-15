import { supabase } from "@/lib/supabase";

export default async function GeneratedSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data } = await supabase
    .from("generated_sites")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!data) {
    return (
      <main className="min-h-screen bg-black text-white grid place-items-center">
        <h1 className="text-4xl font-black">Site not found</h1>
      </main>
    );
  }

  const c = data.content || {};
  const p = c.palette || {};
  const hero = c.hero || {};
  const about = c.about || {};
  const community = c.community || {};
  const primary = p.primary || data.theme?.primary || "#14F195";
  const secondary = p.secondary || data.theme?.secondary || "#9945FF";
  const accent = p.accent || "#FF4ECD";
  const bg =
    p.background ||
    data.theme?.background ||
    "radial-gradient(circle at 20% 0%, rgba(153,69,255,.45), transparent 35%), radial-gradient(circle at 80% 10%, rgba(20,241,149,.28), transparent 34%), linear-gradient(135deg,#050509,#13051f)";

  const stats = Array.isArray(c.liveStats) ? c.liveStats : [];
  const tokenomics = Array.isArray(c.tokenomics) ? c.tokenomics : [];
  const security = Array.isArray(c.security) ? c.security : [];
  const roadmap = Array.isArray(c.roadmap) ? c.roadmap : [];
  const liveBuys = Array.isArray(c.liveBuys) ? c.liveBuys : [];
  const howToBuy = Array.isArray(c.howToBuy) ? c.howToBuy : [];

  return (
    <main className="min-h-screen text-white overflow-hidden" style={{ background: bg }}>
      <style>{`
        @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes pulseGlow { 0%,100%{opacity:.55} 50%{opacity:1} }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .glass{background:rgba(5,5,12,.68);border:1px solid rgba(255,255,255,.13);backdrop-filter:blur(18px);box-shadow:0 30px 100px rgba(0,0,0,.38)}
        .neon-title{text-shadow:0 0 35px ${primary}55,0 0 70px ${secondary}33}
      `}</style>

      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div
          className="absolute -top-40 left-1/2 w-[700px] h-[700px] rounded-full blur-[130px]"
          style={{ background: primary, opacity: 0.18 }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full blur-[120px]"
          style={{ background: secondary, opacity: 0.16 }}
        />
      </div>

      <nav className="relative z-10 px-5 py-4 border-b border-white/10 bg-black/35 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            {data.logo_url ? (
              <img src={data.logo_url} alt="" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/15" />
            ) : (
              <div className="w-12 h-12 rounded-2xl grid place-items-center text-2xl" style={{ background: primary }}>
                🚀
              </div>
            )}
            <div>
              <div className="font-black text-xl leading-none">{data.token_name}</div>
              <div className="text-xs font-black opacity-55">${data.symbol}</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm font-black opacity-80">
            {(c.nav || ["About", "Chart", "Tokenomics", "Roadmap"]).map((n: string) => (
              <a key={n} href={`#${String(n).toLowerCase()}`} className="hover:opacity-100">
                {n}
              </a>
            ))}
          </div>

          <a
            href={data.mint ? `https://dexscreener.com/solana/${data.mint}` : "#"}
            target="_blank"
            className="px-5 py-3 rounded-2xl font-black text-black"
            style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
          >
            BUY ${data.symbol}
          </a>
        </div>
      </nav>

      <section className="relative z-10 max-w-7xl mx-auto px-5 py-10 lg:py-14 grid lg:grid-cols-[1.05fr_.95fr] gap-6 items-stretch">
        <div className="glass rounded-[34px] p-6 lg:p-9 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 70% 30%, ${primary}, transparent 35%)` }} />

          <div className="relative z-10">
            <div
              className="inline-flex px-4 py-2 rounded-full border text-xs font-black mb-6"
              style={{ borderColor: `${primary}66`, color: primary, background: `${primary}18` }}
            >
              ⚡ {hero.badge || "COMMUNITY POWERED"}
            </div>

            <h1 className="neon-title text-[54px] sm:text-[78px] lg:text-[94px] leading-[.88] tracking-[-.08em] font-black mb-6">
              {hero.titleLine1 || data.token_name}
              <br />
              <span style={{ color: primary }}>{hero.titleLine2 || "HAS ARRIVED"}</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/72 leading-relaxed max-w-2xl mb-7">
              {hero.subtitle || data.description}
            </p>

            <div className="flex flex-wrap gap-3 mb-7">
              <a
                href={data.mint ? `https://dexscreener.com/solana/${data.mint}` : "#"}
                target="_blank"
                className="px-6 py-4 rounded-2xl font-black text-black"
                style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
              >
                ⚡ BUY ${data.symbol}
              </a>
              <a className="px-6 py-4 rounded-2xl font-black bg-white/10 border border-white/15">
                JOIN COMMUNITY
              </a>
            </div>

            {data.mint && (
              <div className="inline-flex max-w-full px-4 py-3 rounded-2xl bg-black/35 border border-white/12 text-white/60 text-sm break-all">
                CA: {data.mint}
              </div>
            )}
          </div>

          <div className="absolute right-6 bottom-2 hidden md:block" style={{ animation: "floaty 4s ease-in-out infinite" }}>
            {data.logo_url ? (
              <img src={data.logo_url} alt="" className="w-72 h-72 object-cover rounded-[42px] opacity-95 shadow-2xl" />
            ) : (
              <div className="text-[180px]">🚀</div>
            )}
          </div>
        </div>

        <div className="grid gap-5">
          <div className="grid grid-cols-2 gap-4">
            {stats.slice(0, 4).map((s: any) => (
              <div key={s.label} className="glass rounded-3xl p-5">
                <div className="text-xs uppercase tracking-widest text-white/45 font-black">{s.label}</div>
                <div className="text-2xl sm:text-3xl font-black mt-1">{s.value}</div>
                <div className="text-xs font-black mt-1" style={{ color: primary }}>
                  {s.change}
                </div>
              </div>
            ))}
          </div>

          <div id="chart" className="glass rounded-[30px] p-5 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xl font-black">${data.symbol} / SOL</div>
                <div className="text-sm text-white/50">Live chart · Dexscreener</div>
              </div>
              <div className="flex items-center gap-2 text-sm font-black" style={{ color: primary }}>
                <span className="w-2 h-2 rounded-full" style={{ background: primary, animation: "pulseGlow 1.4s infinite" }} />
                LIVE
              </div>
            </div>

            {data.mint ? (
              <iframe
                src={`https://dexscreener.com/solana/${data.mint}?embed=1&theme=dark`}
                className="w-full h-[360px] rounded-2xl bg-black"
              />
            ) : (
              <div className="h-[360px] rounded-2xl bg-black/50 grid place-items-center text-white/45 font-black">
                Add mint address to show live chart
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-5 pb-10">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/70 py-4">
          <div className="flex gap-12 whitespace-nowrap font-black text-3xl" style={{ animation: "ticker 18s linear infinite", color: primary }}>
            {[...Array(16)].map((_, i) => (
              <span key={i}>${data.symbol} TO THE MOON</span>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 max-w-7xl mx-auto px-5 pb-10 grid lg:grid-cols-[.9fr_1.1fr] gap-5">
        <div className="glass rounded-[30px] p-7">
          <div className="text-sm font-black mb-3" style={{ color: primary }}>LIVE BUYS</div>
          <div className="grid gap-3">
            {liveBuys.map((b: any, i: number) => (
              <div key={i} className="flex items-center justify-between rounded-2xl bg-white/7 border border-white/10 px-4 py-3">
                <span className="font-bold text-white/80">🟢 {b.name} bought</span>
                <span className="font-black" style={{ color: primary }}>{b.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-[30px] p-7">
          <div className="text-sm font-black mb-3" style={{ color: accent }}>ABOUT</div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-[-.05em] mb-4">
            {about.title || `The ${data.token_name} Lore`}
          </h2>
          <p className="text-white/68 text-lg leading-relaxed">{about.text || data.description}</p>
        </div>
      </section>

      <section id="tokenomics" className="relative z-10 max-w-7xl mx-auto px-5 pb-10 grid lg:grid-cols-[1fr_.9fr] gap-5">
        <div className="glass rounded-[30px] p-7">
          <h2 className="text-4xl font-black tracking-[-.05em] mb-6">TOKENOMICS</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {tokenomics.map((t: any, i: number) => (
              <div key={i} className="rounded-2xl p-5 bg-white/7 border border-white/10">
                <div className="text-white/45 text-xs font-black uppercase tracking-widest">{t.label}</div>
                <div className="text-3xl font-black mt-2" style={{ color: i % 2 ? accent : primary }}>{t.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-[30px] p-7">
          <h2 className="text-4xl font-black tracking-[-.05em] mb-6">SECURITY</h2>
          <div className="grid gap-3">
            {security.map((s: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-black/30 border border-white/10">
                <span className="text-white/55 font-black">{s.label}</span>
                <span className="font-black text-xl" style={{ color: primary }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roadmap" className="relative z-10 max-w-7xl mx-auto px-5 pb-10">
        <div className="glass rounded-[34px] p-7">
          <h2 className="text-5xl font-black tracking-[-.06em] mb-8">ROADMAP</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {roadmap.map((r: any, i: number) => (
              <div key={i} className="rounded-3xl p-6 bg-white/7 border border-white/10 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-8xl opacity-10 font-black">{i + 1}</div>
                <div className="w-12 h-12 rounded-2xl grid place-items-center font-black mb-5 text-black" style={{ background: i % 2 ? accent : primary }}>
                  {i + 1}
                </div>
                <div className="text-xs font-black uppercase tracking-widest text-white/40">{r.phase}</div>
                <h3 className="text-2xl font-black mt-2 mb-3">{r.title}</h3>
                <p className="text-white/60 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="community" className="relative z-10 max-w-7xl mx-auto px-5 pb-14 grid lg:grid-cols-[1fr_.9fr] gap-5">
        <div className="glass rounded-[34px] p-8">
          <h2 className="text-5xl font-black tracking-[-.06em] mb-4">
            {community.title || `JOIN ${data.symbol} ARMY`}
          </h2>
          <p className="text-white/65 text-lg leading-relaxed mb-8">{community.text || "Memes, raids, holders and pure community energy."}</p>
          <div className="flex gap-3">
            <button className="px-5 py-3 rounded-2xl bg-white/10 border border-white/15 font-black">X</button>
            <button className="px-5 py-3 rounded-2xl bg-white/10 border border-white/15 font-black">Telegram</button>
            <button className="px-5 py-3 rounded-2xl bg-white/10 border border-white/15 font-black">Discord</button>
          </div>
        </div>

        <div className="glass rounded-[34px] p-8">
          <h2 className="text-3xl font-black mb-6">HOW TO BUY</h2>
          <div className="grid gap-4">
            {howToBuy.map((step: string, i: number) => (
              <div key={step} className="flex gap-4 items-center">
                <div className="w-11 h-11 rounded-full grid place-items-center font-black text-black" style={{ background: i % 2 ? accent : primary }}>
                  {i + 1}
                </div>
                <div className="font-black">{step}</div>
              </div>
            ))}
          </div>

          <a
            href={data.mint ? `https://dexscreener.com/solana/${data.mint}` : "#"}
            target="_blank"
            className="mt-8 block text-center px-6 py-5 rounded-2xl font-black text-black"
            style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
          >
            BUY ${data.symbol} NOW
          </a>
        </div>
      </section>
    </main>
  );
}