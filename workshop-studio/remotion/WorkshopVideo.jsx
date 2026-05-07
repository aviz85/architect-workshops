import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig
} from "remotion";

const colors = {
  ink: "#10201a",
  green: "#22c55e",
  pink: "#ff2f8f",
  blue: "#2f6df6",
  paper: "#f7faf4",
  muted: "#607269",
  charcoal: "#17211d"
};

function formatDate(value) {
  if (!value) return "תאריך בקרוב";
  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    weekday: "short"
  }).format(new Date(`${value}T12:00:00`));
}

export function WorkshopVideo({ workshop, brandDataUri }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEntrance = spring({ frame, fps, config: { damping: 18, stiffness: 90 } });
  const metaEntrance = spring({ frame: frame - 24, fps, config: { damping: 20, stiffness: 80 } });
  const closing = interpolate(frame, [170, 215], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stripe = interpolate(frame, [0, 240], [-20, 120], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        direction: "rtl",
        fontFamily: "'Avenir Next', 'Noto Sans Hebrew', 'Rubik', 'Assistant', sans-serif",
        backgroundColor: colors.paper,
        overflow: "hidden"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(90deg, rgba(16,32,26,.06) 1px, transparent 1px), linear-gradient(0deg, rgba(16,32,26,.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-18%",
          right: `${stripe}%`,
          width: 360,
          height: "140%",
          background: `linear-gradient(180deg, ${colors.green}, ${colors.pink}, ${colors.blue})`,
          opacity: 0.16,
          transform: "rotate(12deg)"
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "40px",
          border: "2px solid rgba(16,32,26,.13)"
        }}
      />

      <div style={{ position: "absolute", top: 58, right: 72, display: "flex", gap: 22, alignItems: "center" }}>
        {brandDataUri ? (
          <Img
            src={brandDataUri}
            style={{
              width: 116,
              height: 116,
              objectFit: "contain",
              borderRadius: "50%",
              border: `6px solid ${colors.green}`,
              background: "white",
              boxShadow: "0 18px 40px rgba(34,197,94,.24)"
            }}
          />
        ) : null}
        <div>
          <div style={{ fontSize: 36, fontWeight: 900, color: colors.ink }}>AVIZ Workshop Studio</div>
          <div style={{ fontSize: 24, color: colors.muted }}>סדנה דינמית מתוך מערכת הסדנאות</div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 74,
          left: 74,
          top: 215,
          transform: `translateY(${(1 - titleEntrance) * 44}px)`,
          opacity: titleEntrance
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 900, color: colors.green, marginBottom: 18 }}>
          {workshop.status === "live" ? "היום בשידור" : "סדנת AVIZ"}
        </div>
        <div
          style={{
            fontSize: workshop.title.length > 44 ? 64 : 82,
            lineHeight: 0.95,
            fontWeight: 950,
            color: colors.ink,
            maxWidth: 980
          }}
        >
          {workshop.title}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 74,
          bottom: 74,
          display: "flex",
          gap: 14,
          opacity: metaEntrance,
          transform: `translateY(${(1 - metaEntrance) * 24}px)`
        }}
      >
        {[formatDate(workshop.date), workshop.time || "20:00", workshop.price || "₪100", "Zoom"].map(item => (
          <div
            key={item}
            style={{
              minWidth: 128,
              height: 58,
              borderRadius: 999,
              background: colors.charcoal,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 25,
              fontWeight: 900,
              padding: "0 22px"
            }}
          >
            {item}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: colors.charcoal,
          color: "white",
          opacity: closing,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          textAlign: "center"
        }}
      >
        <div style={{ color: colors.green, fontSize: 38, fontWeight: 900 }}>להרשמה וחומרים</div>
        <div style={{ fontSize: 54, fontWeight: 950 }}>linktr.ee/aviz85</div>
        <div style={{ color: "rgba(255,255,255,.7)", fontSize: 26 }}>{workshop.slug}</div>
      </div>
    </AbsoluteFill>
  );
}
