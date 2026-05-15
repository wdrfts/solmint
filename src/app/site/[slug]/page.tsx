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
      <main style={{ minHeight: "100vh", background: "#050509", color: "white", display: "grid", placeItems: "center" }}>
        <h1>Site not found</h1>
      </main>
    );
  }

  const content = data.content || {};
  const theme = data.theme || {};

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "white",
        background:
          theme.background ||
          "radial-gradient(circle at 50% -10%, rgba(153,69,255,0.35), transparent 35%), linear-gradient(135deg, #050509, #12051f)",
        padding: 32,
      }}
    >
      <section style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          {data.logo_url && (
            <img
              src={data.logo_url}
              alt={data.token_name}
              style={{ width: 74, height: 74, borderRadius: 24, objectFit: "cover" }}
            />
          )}
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 950, margin: 0 }}>{data.token_name}</h1>
            <p style={{ opacity: 0.55, margin: 0 }}>${data.symbol}</p>
          </div>
        </div>

        <h2 style={{ fontSize: "clamp(56px, 9vw, 118px)", lineHeight: 0.92, letterSpacing: "-0.07em", fontWeight: 950, marginBottom: 26 }}>
          {content?.hero?.titleLine1 || data.token_name}
          <br />
          <span style={{ color: theme.primary || "#14F195" }}>
            {content?.hero?.titleLine2 || "goes live"}
          </span>
        </h2>

        <p style={{ fontSize: 20, lineHeight: 1.7, maxWidth: 760, opacity: 0.72 }}>
          {content?.hero?.subtitle || data.description}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginTop: 46 }}>
          {(content.liveStats || []).map((s: any) => (
            <div key={s.label} style={{ padding: 22, borderRadius: 24, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <div style={{ opacity: 0.55, fontSize: 12, fontWeight: 900 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 950 }}>{s.value}</div>
              <div style={{ color: theme.primary || "#14F195", fontSize: 12, fontWeight: 900 }}>{s.change}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}