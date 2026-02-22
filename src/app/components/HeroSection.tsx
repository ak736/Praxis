import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ParticleField } from "./ParticleField";
import { ArrowRight, ChevronDown } from "lucide-react";

const EASE = [0.22, 0.9, 0.28, 1] as const;

export function HeroSection() {
  const scanRef = useRef<HTMLDivElement>(null);
  const [particleCount, setParticleCount] = useState(80);

  useEffect(() => {
    // Reduce particles on mobile
    const check = () => {
      setParticleCount(window.innerWidth < 768 ? 35 : 80);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleScroll = () => {
    const next = document.querySelector("#problem");
    if (next) next.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: "#0F1114",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Particle field */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <ParticleField count={particleCount} />
      </div>

      {/* Radial glow - center */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "radial-gradient(ellipse 65% 55% at 50% 45%, rgba(217,83,43,0.07) 0%, rgba(26,200,210,0.04) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Geometric enforcement frame */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0 }}
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Corner brackets */}
          <g stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none">
            <path d="M 60 60 L 60 110 M 60 60 L 110 60" />
            <path d="M calc(100% - 60px) 60 L calc(100% - 60px) 110 M calc(100% - 60px) 60 L calc(100% - 110px) 60" />
            <path d="M 60 calc(100% - 60px) L 60 calc(100% - 110px) M 60 calc(100% - 60px) L 110 calc(100% - 60px)" />
            <path d="M calc(100% - 60px) calc(100% - 60px) L calc(100% - 60px) calc(100% - 110px) M calc(100% - 60px) calc(100% - 60px) L calc(100% - 110px) calc(100% - 60px)" />
          </g>
          {/* Horizontal rule lines */}
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          {/* Center target ring */}
          <circle cx="50%" cy="46%" r="160" stroke="rgba(255,255,255,0.04)" strokeWidth="0.7" fill="none" />
          <circle cx="50%" cy="46%" r="260" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" fill="none" />
          <circle cx="50%" cy="46%" r="360" stroke="rgba(255,255,255,0.015)" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      {/* Scan line */}
      <ScanLine />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          maxWidth: 820,
          padding: "0 1.5rem",
          paddingTop: 80,
        }}
      >
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(217,83,43,0.1)",
            border: "1px solid rgba(217,83,43,0.25)",
            borderRadius: 2,
            padding: "5px 12px",
            marginBottom: "2rem",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#D9532B",
              display: "inline-block",
              animation: "pulse-dot 2s ease infinite",
            }}
          />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              color: "#D9532B",
              textTransform: "uppercase",
            }}
          >
            AI Infrastructure · Policy Enforcement Layer
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
            fontWeight: 500,
            lineHeight: 1.12,
            color: "#FFFFFF",
            margin: "0 0 1.5rem 0",
            letterSpacing: "-0.01em",
          }}
        >
          Deterministic Enforcement
          <br />
          <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.75)" }}>
            for AI Agents.
          </em>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            fontWeight: 400,
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.5)",
            maxWidth: 580,
            margin: "0 auto 2.5rem auto",
          }}
        >
          Let AI act — safely. Intercept, verify, and enforce every action with
          a versioned policy layer built for enterprise compliance.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          style={{
            display: "flex",
            gap: "0.875rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <PrimaryButton label="Request a Pilot" />
          <SecondaryButton label="See Architecture" href="#architecture" />
        </motion.div>

        {/* Metrics strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9, ease: EASE }}
          style={{
            display: "flex",
            gap: "2.5rem",
            justifyContent: "center",
            marginTop: "4rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { value: "<2ms", label: "Intercept Latency" },
            { value: "100%", label: "Action Coverage" },
            { value: "SOC 2", label: "Type II Ready" },
          ].map((m) => (
            <div key={m.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1.35rem",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  letterSpacing: "-0.02em",
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop: 4,
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        onClick={handleScroll}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(255,255,255,0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          zIndex: 10,
          animation: "float-up 2.5s ease infinite",
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Explore
        </span>
        <ChevronDown size={14} />
      </motion.button>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes float-up {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-6px); }
        }
      `}</style>
    </section>
  );
}

function ScanLine() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 3,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(217,83,43,0.0) 15%, rgba(217,83,43,0.35) 40%, rgba(217,83,43,0.5) 50%, rgba(217,83,43,0.35) 60%, rgba(217,83,43,0.0) 85%, transparent 100%)",
          boxShadow: "0 0 12px 2px rgba(217,83,43,0.2)",
          animation: "scan-sweep 6s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes scan-sweep {
          0% { top: -2px; opacity: 0; }
          3% { opacity: 1; }
          47% { opacity: 1; }
          50% { top: 100%; opacity: 0; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function PrimaryButton({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
        padding: "13px 26px",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 32px rgba(217,83,43,0.45)" : "0 2px 8px rgba(217,83,43,0.2)",
        transition: "all 0.18s ease",
      }}
    >
      {label}
      <ArrowRight size={14} style={{ transform: hovered ? "translateX(3px)" : "translateX(0)", transition: "transform 0.18s ease" }} />
    </button>
  );
}

function SecondaryButton({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false);
  const handleClick = () => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 4,
        cursor: "pointer",
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: "0.03em",
        color: "rgba(255,255,255,0.8)",
        padding: "13px 26px",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.3)" : "none",
        borderColor: hovered ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)",
        transition: "all 0.18s ease",
      }}
    >
      {label}
    </button>
  );
}
