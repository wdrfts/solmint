export default async function GeneratedSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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
        {slug}.solmint.space 🚀
      </h1>
    </main>
  );
}