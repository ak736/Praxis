import React from "react";
import { Logo } from "./Logo";

const footerLinks = {
  Product: ["Architecture", "Policy DSL", "Integrations", "Changelog"],
  Company: ["About", "Blog", "Careers", "Press"],
  Legal: ["Privacy Policy", "Terms of Service", "Security", "DPA"],
  Developers: ["Documentation", "API Reference", "SDKs", "Status"],
};

export function Footer() {
  return (
    <footer
      style={{
        background: "#0A0C0F",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "4rem 1.5rem 2.5rem",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr repeat(4, 1fr)",
            gap: "2rem",
            marginBottom: "3.5rem",
          }}
          className="footer-grid"
        >
          {/* Brand column */}
          <div>
            <div style={{ marginBottom: "1.25rem" }}>
              <Logo size="sm" />
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.825rem",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.3)",
                maxWidth: 220,
                margin: "0 0 1.5rem 0",
              }}
            >
              Deterministic policy enforcement for AI agents. Built for enterprise compliance.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {["GitHub", "Twitter", "LinkedIn"].map((s) => (
                <a
                  key={s}
                  href="#"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    color: "rgba(255,255,255,0.25)",
                    textDecoration: "none",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "1.25rem",
                }}
              >
                {section}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.8rem",
                        color: "rgba(255,255,255,0.3)",
                        textDecoration: "none",
                        transition: "color 0.15s ease",
                        lineHeight: 1,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: "1.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            © 2025 Praxis AI, Inc. All rights reserved.
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: "rgba(255,255,255,0.15)",
                letterSpacing: "0.06em",
              }}
            >
              v2.1.0-enterprise
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(26,200,210,0.08)",
                border: "1px solid rgba(26,200,210,0.15)",
                borderRadius: 2,
                padding: "3px 8px",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#1AC8D2",
                  display: "inline-block",
                  animation: "pulse-teal 2.5s ease infinite",
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  color: "#1AC8D2",
                  letterSpacing: "0.06em",
                }}
              >
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-teal {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 767px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
