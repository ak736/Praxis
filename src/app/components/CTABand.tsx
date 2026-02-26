import React, { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";

const EASE = [0.22, 0.9, 0.28, 1] as const;

export function CTABand() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15%" });
  const [primaryHovered, setPrimaryHovered] = useState(false);
  const [secondaryHovered, setSecondaryHovered] = useState(false);

  return (
    <section
      id="cta"
      ref={sectionRef}
      style={{
        background: "#0A0C0F",
        padding: "clamp(5rem, 12vw, 10rem) 1.5rem",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(217,83,43,0.09) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Geometric frame lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
          <circle cx="50%" cy="50%" r="180" stroke="rgba(255,255,255,0.03)" strokeWidth="0.7" fill="none" />
          <circle cx="50%" cy="50%" r="300" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      <div
        style={{
          position: "relative",
          maxWidth: 700,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            background: "rgba(217,83,43,0.1)",
            border: "1px solid rgba(217,83,43,0.2)",
            borderRadius: 2,
            padding: "5px 12px",
            marginBottom: "2rem",
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#D9532B",
              animation: "pulse-dot 2s ease infinite",
            }}
          />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.1em",
              color: "#D9532B",
              textTransform: "uppercase",
            }}
          >
            Now Accepting Enterprise Pilots
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
            fontWeight: 500,
            lineHeight: 1.12,
            color: "#FFFFFF",
            margin: "0 0 1.5rem 0",
            letterSpacing: "-0.015em",
          }}
        >
          Enable
          <br />
          <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.6)" }}>
            Safe Autonomy.
          </em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.42)",
            margin: "0 auto 3rem auto",
            maxWidth: 480,
          }}
        >
          Join forward-looking enterprises deploying AI agents with confidence. PRAXIS pilots ship in 2 weeks with zero infrastructure changes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          style={{
            display: "flex",
            gap: "0.875rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/dashboard"
            onMouseEnter={() => setPrimaryHovered(true)}
            onMouseLeave={() => setPrimaryHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#D9532B",
              border: "1px solid #D9532B",
              borderRadius: 4,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.03em",
              color: "#fff",
              textDecoration: "none",
              padding: "14px 28px",
              transform: primaryHovered ? "translateY(-4px)" : "translateY(0)",
              boxShadow: primaryHovered
                ? "0 10px 36px rgba(217,83,43,0.5)"
                : "0 2px 12px rgba(217,83,43,0.2)",
              transition: "all 0.18s ease",
            }}
          >
            Try Live Demo
            <ArrowRight
              size={14}
              style={{
                transform: primaryHovered ? "translateX(3px)" : "translateX(0)",
                transition: "transform 0.18s ease",
              }}
            />
          </a>

          <button
            onMouseEnter={() => setSecondaryHovered(true)}
            onMouseLeave={() => setSecondaryHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 4,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
              padding: "14px 28px",
              transform: secondaryHovered ? "translateY(-4px)" : "translateY(0)",
              boxShadow: secondaryHovered ? "0 8px 24px rgba(0,0,0,0.4)" : "none",
              borderColor: secondaryHovered ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)",
              transition: "all 0.18s ease",
            }}
          >
            Read Documentation
          </button>
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.2)",
            marginTop: "2rem",
            letterSpacing: "0.03em",
          }}
        >
          No credit card required · Ships in 2 weeks · Enterprise MSA available
        </motion.p>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
