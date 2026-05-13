import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import PremiumBackground from "@/components/PremiumBackground";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import { GUIDES } from "@/data/guides";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const catColors: Record<string, string> = {
  Basics: "#9945FF",
  Tutorial: "#14F195",
  Sicurezza: "#ff6b6b",
  Marketing: "#FFD700",
  Strategia: "#00D4AA",
  Educazione: "#b57bff",
};

function getGuide(slug: string) {
  return GUIDES.find((g) => g.id === slug);
}

export function generateStaticParams() {
  return GUIDES.map((guide) => ({
    slug: guide.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    return {
      title: "Guida non trovata — SolMint Space",
    };
  }

  return {
    title: `${guide.title} — SolMint Space`,
    description: guide.desc,
    alternates: {
      canonical: `/guides/${guide.id}`,
    },
    openGraph: {
      title: `${guide.title} — SolMint Space`,
      description: guide.desc,
      url: `https://solmint.space/guides/${guide.id}`,
      siteName: "SolMint Space",
      images: [
        {
          url: "/og.svg",
          width: 1200,
          height: 630,
          alt: guide.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${guide.title} — SolMint Space`,
      description: guide.desc,
      images: ["/og.svg"],
    },
  };
}

export default async function GuideArticlePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  const color = catColors[guide.category] || "#9945FF";
  const related = GUIDES.filter((g) => g.id !== guide.id && g.category === guide.category).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.desc,
    author: {
      "@type": "Organization",
      name: "SolMint",
    },
    publisher: {
      "@type": "Organization",
      name: "SolMint",
    },
    mainEntityOfPage: `https://solmint.space/guides/${guide.id}`,
    datePublished: "2026-05-07",
    dateModified: "2026-05-07",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <main style={{ minHeight: "100vh", background: "#07070f", color: "white" }}>
        <PremiumBackground />
        <SiteNavbar />

        <div style={{ maxWidth: 820, margin: "0 auto", padding: "140px 24px 48px", position: "relative", zIndex: 1 }}>
          <Link
            href="/guides"
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
              textDecoration: "none",
            }}
          >
            ← Torna alle guide
          </Link>

          <article>
            <header style={{ marginBottom: 32 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 12,
                  display: "block",
                }}
              >
                {guide.category}
              </span>

              <h1
                style={{
                  fontSize: "clamp(30px, 5vw, 52px)",
                  fontWeight: 950,
                  letterSpacing: "-0.045em",
                  marginBottom: 16,
                  lineHeight: 1.05,
                }}
              >
                {guide.icon} {guide.title}
              </h1>

              <p
                style={{
                  color: "rgba(255,255,255,0.48)",
                  fontSize: 17,
                  lineHeight: 1.7,
                  marginBottom: 16,
                }}
              >
                {guide.desc}
              </p>

              <div style={{ display: "flex", gap: 16, color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
                <span>⏱ {guide.time} di lettura</span>
              </div>
            </header>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 32 }}>
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <div style={{ marginTop: 54, marginBottom: 22 }}>
                      <div
                        style={{
                          width: 34,
                          height: 3,
                          borderRadius: 99,
                          background: `linear-gradient(90deg, ${color}, transparent)`,
                          marginBottom: 12,
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
                        {children}
                      </h2>
                    </div>
                  ),

                  h3: ({ children }) => (
                    <div style={{ marginTop: 34, marginBottom: 16 }}>
                      <div
                        style={{
                          width: 22,
                          height: 3,
                          borderRadius: 99,
                          background: `linear-gradient(90deg, ${color}, transparent)`,
                          marginBottom: 12,
                          boxShadow: `0 0 22px ${color}55`,
                          opacity: 0.75,
                        }}
                      />
                      <h3
                        style={{
                          fontSize: 22,
                          fontWeight: 900,
                          color: "white",
                          letterSpacing: "-0.03em",
                          lineHeight: 1.2,
                          margin: 0,
                        }}
                      >
                        {children}
                      </h3>
                    </div>
                  ),

                  h4: ({ children }) => (
                    <h4
                      style={{
                        fontSize: 18,
                        fontWeight: 850,
                        color: "rgba(255,255,255,0.92)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.25,
                        marginTop: 28,
                        marginBottom: 14,
                      }}
                    >
                      {children}
                    </h4>
                  ),

                  p: ({ children }) => (
                    <p
                      style={{
                        color: "rgba(255,255,255,0.64)",
                        fontSize: 16,
                        lineHeight: 1.9,
                        marginBottom: 16,
                      }}
                    >
                      {children}
                    </p>
                  ),

                  strong: ({ children }) => (
                    <strong style={{ color: "white", fontWeight: 850 }}>
                      {children}
                    </strong>
                  ),

                  ul: ({ children }) => (
                    <ul style={{ display: "grid", gap: 12, margin: "0 0 18px", padding: 0, listStyle: "none" }}>
                      {children}
                    </ul>
                  ),

                  ol: ({ children }) => (
                    <ol style={{ display: "grid", gap: 12, margin: "0 0 18px", padding: 0, listStyle: "none", counterReset: "item" }}>
                      {children}
                    </ol>
                  ),

                  li: ({ children }) => (
                    <li
                      style={{
                        color: "rgba(255,255,255,0.72)",
                        fontSize: 16,
                        lineHeight: 1.75,
                        padding: "10px 14px",
                        borderRadius: 16,
                        background: "rgba(255,255,255,0.022)",
                        border: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      {children}
                    </li>
                  ),
                }}
              >
                {guide.content}
              </ReactMarkdown>
            </div>
          </article>

          {related.length > 0 && (
            <section style={{ marginTop: 70 }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 20 }}>
                Guide correlate
              </h2>

              <div style={{ display: "grid", gap: 12 }}>
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/guides/${item.id}`}
                    style={{
                      display: "block",
                      padding: 20,
                      borderRadius: 18,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      textDecoration: "none",
                    }}
                  >
                    <div style={{ color: "white", fontWeight: 900, marginBottom: 6 }}>
                      {item.icon} {item.title}
                    </div>

                    <div style={{ color: "rgba(255,255,255,0.42)", fontSize: 14 }}>
                      {item.desc}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div
            style={{
              marginTop: 64,
              padding: 32,
              background: "linear-gradient(135deg, rgba(153,69,255,0.1), rgba(20,241,149,0.05))",
              border: "1px solid rgba(153,69,255,0.2)",
              borderRadius: 24,
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>
              Pronto a creare il tuo token?
            </h3>

            <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>
              Metti in pratica quello che hai imparato. Crea il token, cura i metadata e prepara il lancio.
            </p>

            <Link
              href="/?app=true"
              style={{
                display: "inline-block",
                padding: "14px 32px",
                borderRadius: 16,
                background: "linear-gradient(135deg, #9945FF, #14F195)",
                color: "white",
                fontWeight: 800,
                textDecoration: "none",
                fontSize: 15,
              }}
            >
              Lancia il tuo token
            </Link>
          </div>
        </div>

        <SiteFooter />
      </main>
    </>
  );
}