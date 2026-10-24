import { ImageResponse } from "next/og";
export const alt = "Staionbar – Shisha, Bar & Lounge in Wohlen";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background: "#101110",
        color: "#f5efe6",
        padding: "64px 76px",
        borderBottom: "12px solid #f16b3b",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 27,
          letterSpacing: 5,
          color: "#f16b3b",
        }}
      >
        SHISHA. DRINKS. GOOD COMPANY.
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 112, fontWeight: 700 }}>staionbar</div>
        <div style={{ fontSize: 44 }}>Lange Nächte. Gute Zeiten.</div>
      </div>
      <div style={{ display: "flex", fontSize: 25, color: "#c2bcb3" }}>
        BAHNHOFPLATZ 1 · 5610 WOHLEN
      </div>
    </div>,
    size,
  );
}
