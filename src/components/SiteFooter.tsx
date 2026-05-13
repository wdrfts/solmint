"use client";

type Lang = "IT" | "EN";

const TEXT = {
  IT: {
    brandSub: "Solana Token Launcher",
    footerDesc:
      "Crea token SPL, prepara il lancio con strumenti AI e gestisci la liquidità in modo non-custodial su Solana.",
    product: "Product",
    resources: "Resources",
    support: "Supporto",
    privacy: "Privacy",
    terms: "Termini",
    rights: "Tutti i diritti riservati.",
    built: "Costruito su Solana.",
  },

  EN: {
    brandSub: "Solana Token Launcher",
    footerDesc:
      "Create SPL tokens, prepare launches with AI tools and manage liquidity in a fully non-custodial way on Solana.",
    product: "Product",
    resources: "Resources",
    support: "Support",
    privacy: "Privacy",
    terms: "Terms",
    rights: "All rights reserved.",
    built: "Built on Solana.",
  },
};

function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="url(#footerLogo)" />
      <circle cx="16" cy="16" r="6" stroke="white" strokeWidth="2" fill="none" />
      <path
        d="M16 10V8M16 24v-2M10 16H8M24 16h-2"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="footerLogo" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#9945FF" />
          <stop offset="1" stopColor="#14F195" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function SiteFooter({ lang = "IT" }: { lang?: Lang }) {
  const t = TEXT[lang];

  return (
    <footer
      className="relative px-4 sm:px-6 py-16"
      style={{
        zIndex: 1,
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className="rounded-[32px] p-6 sm:p-8 lg:p-10"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 90px rgba(0,0,0,0.28)",
          }}
        >
          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <Logo size={34} />

                <div>
                  <div className="font-black text-white text-lg">
                    SolMint Space
                  </div>

                  <div
                    className="text-xs font-bold uppercase tracking-[0.22em]"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    {t.brandSub}
                  </div>
                </div>
              </div>

              <p
                className="text-sm leading-relaxed max-w-sm"
                style={{ color: "rgba(255,255,255,0.42)" }}
              >
                {t.footerDesc}
              </p>

              <div className="flex flex-wrap gap-2 mt-6">
                {["Non-custodial", "On-chain", "AI-powered"].map(item => (
                  <span
                    key={item}
                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{
                      color: "rgba(255,255,255,0.62)",
                      background: "rgba(255,255,255,0.045)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black mb-4 text-white">
                {t.product}
              </h3>

              <div className="grid gap-3">
                <a
                  href="/trending"
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.36)" }}
                >
                  Trending
                </a>

                <a
                  href="/ai-meme"
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.36)" }}
                >
                  AI Meme
                </a>

                <a
                  href="/guides"
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.36)" }}
                >
                  Guides
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black mb-4 text-white">
                {t.resources}
              </h3>

              <div className="grid gap-3">
                <a
                  href="/privacy"
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.36)" }}
                >
                  {t.privacy}
                </a>

                <a
                  href="/terms"
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.36)" }}
                >
                  {t.terms}
                </a>

                <a
                  href="mailto:info@solmint.space"
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.36)" }}
                >
                  {t.support}
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black mb-4 text-white">
                Contact
              </h3>

              <a
                href="mailto:info@solmint.space"
                className="inline-flex items-center gap-2 text-sm font-bold px-4 py-3 rounded-2xl transition-all hover:scale-105"
                style={{
                  color: "#14F195",
                  background: "rgba(20,241,149,0.06)",
                  border: "1px solid rgba(20,241,149,0.16)",
                }}
              >
                info@solmint.space <span>→</span>
              </a>
            </div>
          </div>

          <div
            className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
            style={{
              color: "rgba(255,255,255,0.16)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span>
              © 2026 SolMint Space. {t.rights}
            </span>

            <span>{t.built}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}