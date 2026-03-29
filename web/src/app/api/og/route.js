import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract parameters from query string
    const title = searchParams.get("title") || "CodeAssess";
    const subtitle = searchParams.get("subtitle") || "";
    const category = searchParams.get("category") || "";
    const accentColor = searchParams.get("accentColor") || "#4d7cff";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#0a0d14",
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(77, 124, 255, 0.15), transparent 40%), radial-gradient(circle at 80% 70%, rgba(15, 240, 200, 0.1), transparent 35%)",
            padding: "60px 80px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {/* Header with Logo and Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {/* Logo - Recreated from logo.svg */}
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, rgba(26, 32, 53, 0.8) 0%, rgba(10, 13, 20, 0.9) 100%)",
                border: "2px solid #263050",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                padding: "8px",
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 512 512"
                style={{
                  display: "block",
                }}
              >
                {/* Right-facing Chevron (Code) - Blue gradient */}
                <path
                  d="M 121 141 L 231 251 L 121 361"
                  stroke="#4D7CFF"
                  strokeWidth="72"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {/* Checkmark (Assessment) - Cyan gradient */}
                <path
                  d="M 191 291 L 271 371 L 391 161"
                  stroke="#0FF0C8"
                  strokeWidth="72"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  letterSpacing: "0.08em",
                  display: "flex",
                }}
              >
                <span style={{ color: "#ffffffff" }}>Code</span>
                <span style={{ color: "#0ff0c8" }}>Assess</span>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  color: "#4a5878",
                  textTransform: "uppercase",
                }}
              >
                Practice & Secure Coding Exams
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
              marginTop: "40px",
            }}
          >
            {/* Category Badge */}
            {category && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 20px",
                  borderRadius: "999px",
                  backgroundColor: `${accentColor}20`,
                  border: `1px solid ${accentColor}40`,
                  fontSize: "13px",
                  fontWeight: "700",
                  letterSpacing: "0.14em",
                  color: accentColor,
                  textTransform: "uppercase",
                  marginBottom: "24px",
                  maxWidth: "fit-content",
                }}
              >
                {category}
              </div>
            )}

            {/* Title */}
            <div
              style={{
                fontSize: "72px",
                fontWeight: "800",
                lineHeight: "1.1",
                color: "#e8edf8",
                maxWidth: "900px",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {title}
            </div>

            {/* Subtitle */}
            {subtitle && (
              <div
                style={{
                  fontSize: "24px",
                  lineHeight: "1.5",
                  color: "#8a9bc2",
                  marginTop: "20px",
                  maxWidth: "800px",
                  display: "flex",
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {/* Footer Accent Line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "auto",
            }}
          >
            <div
              style={{
                height: "3px",
                width: "120px",
                background: `linear-gradient(90deg, ${accentColor}, transparent)`,
                borderRadius: "2px",
              }}
            />
            <div
              style={{
                fontSize: "13px",
                color: "#4a5878",
                letterSpacing: "0.08em",
              }}
            >
              Built for modern coding assessments
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error("OG Image generation error:", e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
