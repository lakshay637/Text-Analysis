import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from "react";

// Updated About component to match TextForm styling. Accepts a `mode` prop: "light" | "dark" (default: "light").
export default function About(props = { mode: "light" }) {
  const mode = props.mode || "light";

  const containerBackground = mode === "dark"
    ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
    : "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)";

  const cardBackground = mode === "dark"
    ? "rgba(15, 23, 42, 0.95)"
    : "rgba(255,255,255,0.95)";

  const textColor = mode === "dark" ? "#f1f5f9" : "#0f172a";
  const mutedColor = mode === "dark" ? "#94a3b8" : "#636e72";
  const panelBg = mode === "dark" ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)" : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)";

  return (
    <div
      className="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center px-2"
      style={{
        background: containerBackground,
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        padding: 0,
      }}
    >
      <div
        className="shadow-lg rounded-5 p-3 p-md-5"
        style={{
          background: cardBackground,
          maxWidth: 1100,
          width: "100%",
          border: `2px solid ${mode === "dark" ? 'rgba(148,163,184,0.06)' : '#e3e3e3'}`,
          backdropFilter: "blur(20px)",
          margin: "32px 0",
          boxShadow: mode === "dark" ? "0 25px 50px -12px rgba(0,0,0,0.6)" : "0 25px 50px -12px rgba(0,0,0,0.15)"
        }}
      >
        <div className="text-center mb-4">
          <h1 style={{ color: "#161dedff", fontSize: "clamp(1.5rem, 4vw, 2.5rem)", margin: "8px 0 0 0", fontWeight: "900" }}>
            About Text Analysis
          </h1>
          <p className="lead" style={{
            color: mutedColor,
            fontWeight: 600,
            fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)",
            marginBottom: 0,
            letterSpacing: 0.5
          }}>
            Your all-in-one tool for text transformation, translation, and a creative whiteboard.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <div className="card shadow-sm" style={{ borderRadius: 22, border: "none" }}>
              <div className="card-body" style={{ background: panelBg, borderRadius: 22 }}>
                <h4 className="mb-3" style={{ fontWeight: 800, color: textColor }}>What can you do with Text Analysis?</h4>
                <ul style={{ fontSize: "1.08rem", lineHeight: 1.7, color: mode === "dark" ? '#cbd5e1' : '#334155' }}>
                  <li>
                    <b>Word & Character Count:</b> Instantly count words and characters in your text.
                  </li>
                  <li>
                    <b>Case Conversion:</b> Convert text to uppercase or lowercase with a click.
                  </li>
                  <li>
                    <b>Remove Extra Spaces:</b> Clean up your text for better readability.
                  </li>
                  <li>
                    <b>Copy & Clear:</b> Copy your text or clear the input area instantly.
                  </li>
                  <li>
                    <b>Translate:</b> Translate your text into multiple languages right on the page.
                  </li>
                  <li>
                    <b>Responsive & Modern:</b> Works beautifully on desktop and mobile devices.
                  </li>
                </ul>

                <div className="mt-4" style={{ color: mutedColor, fontWeight: 600 }}>
                  <b>Made with ❤️ for productivity and accessibility.</b>
                </div>

                {/* Add a small preview / CTA area that matches TextForm's Live Preview */}
                <div style={{ marginTop: 20 }}>
                  <div style={{
                    padding: 16,
                    borderRadius: 16,
                    background: mode === "dark" ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.6)",
                    border: `1px solid ${mode === "dark" ? 'rgba(148,163,184,0.06)' : 'rgba(0,0,0,0.05)'}`
                  }}>
                    <h6 style={{ margin: 0, fontWeight: 800, color: textColor }}>Live Preview</h6>
                    <p style={{ marginTop: 8, color: mode === "dark" ? '#cbd5e1' : '#475569' }}>Type in the Text Analysis screen to see instant previews, stats and translations.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
