export default function GeneratedSitePage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07070f",
        color: "white",
        display: "grid",
        placeItems: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: 48 }}>
        {params.slug}.solmint.space 🚀
      </h1>
    </main>
  );
}