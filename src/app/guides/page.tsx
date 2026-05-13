"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PremiumBackground from "@/components/PremiumBackground";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import { GUIDES, type Guide } from "@/data/guides";



const CATEGORIES = ["Tutti", "Basics", "Tutorial", "Sicurezza", "Marketing", "Strategia", "Educazione"];

export default function GuidesPage() {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tutti");

  const catColors: Record<string, string> = {
    Basics: "#9945FF",
    Tutorial: "#14F195",
    Sicurezza: "#ff6b6b",
    Marketing: "#FFD700",
    Strategia: "#00D4AA",
    Educazione: "#b57bff",
  };

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return GUIDES.filter(g => {
      const matchSearch =
        !query ||
        g.title.toLowerCase().includes(query) ||
        g.desc.toLowerCase().includes(query) ||
        g.category.toLowerCase().includes(query);

      const matchCat = category === "Tutti" || g.category === category;

      return matchSearch && matchCat;
    });
  }, [search, category]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "SolMint Space Guides",
    description: "Guide professionali per creare, lanciare e gestire token SPL su Solana.",
    url: "https://solmint.space/guides",
    hasPart: GUIDES.map(g => ({
      "@type": "Article",
      headline: g.title,
      description: g.desc,
      articleSection: g.category,
      url: `https://solmint.space/guides#${g.id}`,
    })),
  };

  const renderText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} style={{ color: "white", fontWeight: 850 }}>
            {part.replace(/\*\*/g, "")}
          </strong>
        );
      }

      return part;
    });
  };

  const renderContent = (guide: Guide) => {
    const color = catColors[guide.category] || "#9945FF";

    return guide.content.trim().split("\n").map((line, i) => {
      if (line.startsWith("## ") || line.startsWith("### ") || line.startsWith("#### ")) {
        const level = line.startsWith("#### ") ? 4 : line.startsWith("### ") ? 3 : 2;
        const title = line.replace(/^#### /, "").replace(/^### /, "").replace(/^## /, "");

        return (
          <div key={i} style={{ marginTop: level === 2 ? 54 : 34, marginBottom: level === 2 ? 22 : 16 }}>
            <div
              style={{
                width: level === 2 ? 34 : 22,
                height: 3,
                borderRadius: 99,
                background: `linear-gradient(90deg, ${color}, transparent)`,
                marginBottom: 12,
                boxShadow: `0 0 22px ${color}55`,
                opacity: level === 2 ? 1 : 0.75,
              }}
            />

            {level === 2 ? (
              <h2 style={{ fontSize: "clamp(24px, 3vw, 30px)", fontWeight: 950, color: "white", letterSpacing: "-0.04em", lineHeight: 1.15, margin: 0 }}>
                {title}
              </h2>
            ) : level === 3 ? (
              <h3 style={{ fontSize: 22, fontWeight: 900, color: "white", letterSpacing: "-0.03em", lineHeight: 1.2, margin: 0 }}>
                {title}
              </h3>
            ) : (
              <h4 style={{ fontSize: 18, fontWeight: 850, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.02em", lineHeight: 1.25, margin: 0 }}>
                {title}
              </h4>
            )}
          </div>
        );
      }

      if (line.match(/^\d+\./)) {
        return (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 12, padding: "10px 14px", borderRadius: 16, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.045)" }}>
            <span style={{ color, fontWeight: 950, minWidth: 24, lineHeight: 1.75, fontSize: 15 }}>
              {line.match(/^\d+/)?.[0]}.
            </span>

            <p style={{ margin: 0, color: "rgba(255,255,255,0.72)", fontSize: 16, lineHeight: 1.75 }}>
              {renderText(line.replace(/^\d+\.\s*/, ""))}
            </p>
          </div>
        );
      }

      if (line.startsWith("-")) {
        return (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 12, padding: "10px 14px", borderRadius: 16, background: "rgba(255,255,255,0.022)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 10, boxShadow: `0 0 18px ${color}` }} />

            <p style={{ margin: 0, color: "rgba(255,255,255,0.72)", fontSize: 16, lineHeight: 1.75 }}>
              {renderText(line.slice(1).trim())}
            </p>
          </div>
        );
      }

      if (line.trim() === "") {
        return <div key={i} style={{ height: 8 }} />;
      }

      return (
        <p key={i} style={{ color: "rgba(255,255,255,0.64)", fontSize: 16, lineHeight: 1.9, marginBottom: 16 }}>
          {renderText(line)}
        </p>
      );
    });
  };

  if (selectedGuide) {
    return (
      <main style={{ minHeight: "100vh", background: "#07070f", color: "white" }}>
        <PremiumBackground />
        <SiteNavbar />

        <div style={{ maxWidth: 820, margin: "0 auto", padding: "140px 24px 48px", position: "relative", zIndex: 1 }}>
          <button
            onClick={() => setSelectedGuide(null)}
            style={{
              marginBottom: 28,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.035)",
              color: "rgba(255,255,255,0.62)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            ← Torna alle guide
          </button>

          <article>
            <header style={{ marginBottom: 32 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: catColors[selectedGuide.category] || "#9945FF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, display: "block" }}>
                {selectedGuide.category}
              </span>

              <h1 style={{ fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 950, letterSpacing: "-0.045em", marginBottom: 16, lineHeight: 1.05 }}>
                {selectedGuide.icon} {selectedGuide.title}
              </h1>

              <p style={{ color: "rgba(255,255,255,0.48)", fontSize: 17, lineHeight: 1.7, marginBottom: 16 }}>
                {selectedGuide.desc}
              </p>

              <div style={{ display: "flex", gap: 16, color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
                <span>⏱ {selectedGuide.time} di lettura</span>
              </div>
            </header>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 32 }}>
              {renderContent(selectedGuide)}
            </div>
          </article>

          <div style={{ marginTop: 64, padding: 32, background: "linear-gradient(135deg, rgba(153,69,255,0.1), rgba(20,241,149,0.05))", border: "1px solid rgba(153,69,255,0.2)", borderRadius: 24, textAlign: "center" }}>
            <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Pronto a creare il tuo token?</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Metti in pratica quello che hai imparato. Crea il token, cura i metadata e prepara il lancio.</p>
            <Link href="/?app=true" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 16, background: "linear-gradient(135deg, #9945FF, #14F195)", color: "white", fontWeight: 800, textDecoration: "none", fontSize: 15 }}>
              Lancia il tuo token
            </Link>
          </div>
        </div>

        <SiteFooter />
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#07070f", color: "white" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PremiumBackground />
      <SiteNavbar />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "140px 24px 48px", position: "relative", zIndex: 1 }}>
        <section style={{ marginBottom: 56, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 999, marginBottom: 24, background: "rgba(153,69,255,0.10)", border: "1px solid rgba(153,69,255,0.22)", boxShadow: "0 0 30px rgba(153,69,255,0.12)" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#14F195", boxShadow: "0 0 14px #14F195" }} />
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", background: "linear-gradient(90deg, #9945FF, #14F195)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Solana Guides
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 950, letterSpacing: "-0.05em", marginBottom: 16, lineHeight: 1 }}>
            Impara tutto su
            <span style={{ background: "linear-gradient(90deg, #9945FF, #14F195)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> Solana</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 18, maxWidth: 980, lineHeight: 1.7, textAlign: "center", margin: "0 auto" }}>
            Guide pratiche per creare token SPL, gestire authority, preparare liquidità, leggere i trend e lanciare in modo più sicuro e professionale.
          </p>
        </section>

        <div style={{ marginBottom: 36, display: "flex", justifyContent: "center", width: "100%" }}>
          <input
            placeholder="Cerca una guida..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              maxWidth: 640,
              height: 58,
              padding: "14px 20px",
              background: "rgba(255,255,255,0.045)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 18,
              color: "white",
              fontSize: 16,
              outline: "none",
              fontFamily: "inherit",
              boxShadow: "0 0 30px rgba(153,69,255,0.08)",
              backdropFilter: "blur(10px)",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40, justifyContent: "center" }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: "8px 18px",
                borderRadius: 100,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 800,
                transition: "all 0.15s",
                background: category === cat ? "linear-gradient(135deg, #9945FF, #14F195)" : "rgba(255,255,255,0.05)",
                color: category === cat ? "white" : "rgba(255,255,255,0.5)",
                border: category === cat ? "none" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {filtered.map(guide => (
            <Link
              key={guide.id}
              href={`/guides/${guide.id}`}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 24,
                padding: 32,
                minHeight: 250,
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={e => {
                const style = (e.currentTarget as HTMLElement).style;
                style.borderColor = "rgba(153,69,255,0.4)";
                style.transform = "translateY(-4px)";
                style.boxShadow = "0 30px 80px rgba(153,69,255,0.18)";
                style.background = "rgba(255,255,255,0.045)";
              }}
              onMouseLeave={e => {
                const style = (e.currentTarget as HTMLElement).style;
                style.borderColor = "rgba(255,255,255,0.07)";
                style.transform = "translateY(0)";
                style.boxShadow = "none";
                style.background = "rgba(255,255,255,0.03)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <span style={{ fontSize: 32 }}>{guide.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 100, background: "rgba(153,69,255,0.12)", color: catColors[guide.category] || "#9945FF", border: "1px solid rgba(153,69,255,0.22)" }}>
                  {guide.category}
                </span>
              </div>

              <h3 style={{ fontSize: 19, fontWeight: 900, color: "white", marginBottom: 10, letterSpacing: "-0.025em", lineHeight: 1.25 }}>
                {guide.title}
              </h3>

              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.65, marginBottom: 22 }}>
                {guide.desc}
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>⏱ {guide.time}</span>
                <span style={{ fontSize: 13, color: "#9945FF", fontWeight: 800 }}>Leggi →</span>
              </div>
            </Link>
          ))}
        </section>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.35)" }}>
            Nessuna guida trovata.
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}