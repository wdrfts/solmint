export default function PremiumBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(153,69,255,0.16) 0%, transparent 38%), radial-gradient(circle at 85% 28%, rgba(20,241,149,0.10) 0%, transparent 34%), radial-gradient(circle at 15% 45%, rgba(153,69,255,0.10) 0%, transparent 32%), linear-gradient(180deg, #07070f 0%, #090914 45%, #050509 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(circle at center, black 0%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 0%, transparent 72%)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 900,
          height: 900,
          top: -360,
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(153,69,255,0.18) 0%, rgba(153,69,255,0.055) 32%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 620,
          height: 620,
          bottom: "8%",
          right: "-190px",
          background:
            "radial-gradient(circle, rgba(20,241,149,0.12) 0%, rgba(20,241,149,0.035) 38%, transparent 72%)",
          filter: "blur(90px)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 460,
          height: 460,
          top: "34%",
          left: "-170px",
          background:
            "radial-gradient(circle, rgba(153,69,255,0.12) 0%, rgba(153,69,255,0.03) 40%, transparent 72%)",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}