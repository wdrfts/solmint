"use client";

import { useEffect, useState } from "react";

type Lang = "IT" | "EN";
type NavLink = [string, string];

const NAV_LINKS: Record<Lang, NavLink[]> = {
  IT: [
    ["Features", "/#features"],
    ["Come funziona", "/#come-funziona"],
    ["Prezzi", "/#prezzi"],
    ["FAQ", "/#faq"],
    ["Trending", "/trending"],
    ["Guide", "/guides"],
    ["AI Meme", "/ai-meme"],
  ],
  EN: [
    ["Features", "/#features"],
    ["How it works", "/#come-funziona"],
    ["Pricing", "/#prezzi"],
    ["FAQ", "/#faq"],
    ["Trending", "/trending"],
    ["Guides", "/guides"],
    ["AI Meme", "/ai-meme"],
  ],
};

const TEXT = {
  IT: {
    brandSub: "Solana Token Launcher",
    launchApp: "Lancia App",
  },
  EN: {
    brandSub: "Solana Token Launcher",
    launchApp: "Launch App",
  },
};

function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="url(#siteNavLogo)" />
      <circle cx="16" cy="16" r="6" stroke="white" strokeWidth="2" fill="none" />
      <path
        d="M16 10V8M16 24v-2M10 16H8M24 16h-2"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="siteNavLogo" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#9945FF" />
          <stop offset="1" stopColor="#14F195" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("IT");

  const t = TEXT[lang];
  const navLinks = NAV_LINKS[lang];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    fn();

    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 transition-all duration-300"
      style={{
        background: scrolled || mobileMenuOpen ? "rgba(7,7,15,0.82)" : "transparent",
        backdropFilter: scrolled || mobileMenuOpen ? "blur(26px)" : "none",
        WebkitBackdropFilter: scrolled || mobileMenuOpen ? "blur(26px)" : "none",
        borderBottom:
          scrolled || mobileMenuOpen
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid transparent",
      }}
    >
      <div
        className="max-w-6xl mx-auto flex items-center justify-between gap-3 rounded-2xl lg:rounded-full transition-all duration-300"
        style={{
          padding: scrolled || mobileMenuOpen ? "10px 12px" : "0px",
          background: scrolled || mobileMenuOpen ? "rgba(255,255,255,0.035)" : "transparent",
          border:
            scrolled || mobileMenuOpen
              ? "1px solid rgba(255,255,255,0.07)"
              : "1px solid transparent",
        }}
      >
        <a href="/" className="flex items-center gap-3 min-w-0">
          <Logo size={34} />
          <div className="leading-tight min-w-0">
            <span className="block font-black text-lg sm:text-xl tracking-tight truncate text-white">
              SolMint Space
            </span>
            <span
              className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.22em]"
              style={{ color: "rgba(255,255,255,0.28)" }}
            >
              {t.brandSub}
            </span>
          </div>
        </a>

        <div
          className="hidden lg:flex items-center gap-1 px-2 py-2 rounded-full"
          style={{
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {navLinks.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="px-3 py-2 rounded-full text-sm font-semibold transition-all"
              style={{ color: "rgba(255,255,255,0.52)" }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "white";
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "rgba(255,255,255,0.52)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "IT" ? "EN" : "IT")}
            className="flex items-center gap-1 p-1 rounded-full text-xs font-black"
            style={{
              background: "rgba(255,255,255,0.055)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {(["IT", "EN"] as Lang[]).map(code => (
              <span
                key={code}
                className="px-3 py-1.5 rounded-full transition-all"
                style={{
                  color: lang === code ? "white" : "rgba(255,255,255,0.35)",
                  background:
                    lang === code
                      ? "linear-gradient(135deg, #9945FF, #14F195)"
                      : "transparent",
                }}
              >
                {code}
              </span>
            ))}
          </button>

          <a
            href="/?app=true"
            className="px-5 py-2.5 rounded-full text-sm font-black text-white transition-all hover:opacity-90 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #9945FF, #14F195)",
              boxShadow: "0 12px 35px rgba(153,69,255,0.26)",
            }}
          >
            {t.launchApp}
          </a>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden w-11 h-11 rounded-2xl flex items-center justify-center transition-all"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          aria-label="Apri menu"
        >
          <span className="relative w-5 h-4 block">
            <span
              className="absolute left-0 top-0 w-5 h-0.5 bg-white transition-all duration-300"
              style={{
                transform: mobileMenuOpen ? "translateY(7px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="absolute left-0 top-2 w-5 h-0.5 bg-white transition-all duration-300"
              style={{ opacity: mobileMenuOpen ? 0 : 1 }}
            />
            <span
              className="absolute left-0 bottom-0 w-5 h-0.5 bg-white transition-all duration-300"
              style={{
                transform: mobileMenuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
              }}
            />
          </span>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden max-w-6xl mx-auto pt-4">
          <div
            className="rounded-[28px] p-4"
            style={{
              background: "rgba(10,10,22,0.96)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 28px 90px rgba(0,0,0,0.55)",
            }}
          >
            <div className="grid gap-2">
              {navLinks.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-bold transition-all"
                  style={{
                    color: "rgba(255,255,255,0.84)",
                    background: "rgba(255,255,255,0.035)",
                    border: "1px solid rgba(255,255,255,0.055)",
                  }}
                >
                  {label}
                  <span style={{ color: "rgba(255,255,255,0.24)" }}>→</span>
                </a>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => setLang(lang === "IT" ? "EN" : "IT")}
                className="rounded-2xl p-1 text-xs font-black"
                style={{
                  background: "rgba(255,255,255,0.055)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <span className="grid grid-cols-2 gap-1">
                  {(["IT", "EN"] as Lang[]).map(code => (
                    <span
                      key={code}
                      className="py-2 rounded-xl"
                      style={{
                        color: lang === code ? "white" : "rgba(255,255,255,0.35)",
                        background:
                          lang === code
                            ? "linear-gradient(135deg, #9945FF, #14F195)"
                            : "transparent",
                      }}
                    >
                      {code}
                    </span>
                  ))}
                </span>
              </button>

              <a
                href="/?app=true"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-3 rounded-2xl text-sm font-black text-white"
                style={{
                  background: "linear-gradient(135deg, #9945FF, #14F195)",
                  boxShadow: "0 18px 45px rgba(153,69,255,0.26)",
                }}
              >
                {t.launchApp}
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}