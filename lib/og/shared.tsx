import type { ReactElement } from "react";

/** Shared OG image wrapper with ReviewIQ branding. 1200x630 */
export function OGImageLayout({
  children,
  accentColor = "#005fd4",
}: {
  children: ReactElement;
  accentColor?: string;
}) {
  return (
    <div
      style={{
        width: "1200",
        height: "630",
        display: "flex",
        flexDirection: "column",
        background: "white",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 6, background: accentColor, display: "flex" }} />

      {/* Content area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px 64px",
        }}
      >
        {children}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 64px",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 5,
              background: "#005fd4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            RIQ
          </div>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>
            ReviewIQ
          </span>
        </div>
        <span style={{ fontSize: 14, color: "#64748b" }}>
          Real Reviews, Real Intelligence
        </span>
      </div>
    </div>
  );
}

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
