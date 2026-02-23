import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { Zap, ShieldCheck, BookOpen } from "lucide-react";
import { useIsMobile } from "./ui/use-mobile";

const EASE = [0.22, 0.9, 0.28, 1] as const;

const steps = [
  {
    number: "01",
    icon: Zap,
    title: "Intercept",
    subtitle: "Action capture before execution",
    description:
      "Every AI agent action — tool calls, API requests, data writes — is intercepted by the PRAXIS layer before reaching any downstream system. Zero changes to agent code required.",
    detail: "~0.4ms average intercept latency",
    color: "#D9532B",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Verify",
    subtitle: "Formal policy evaluation",
    description:
      "The action is evaluated against your versioned policy ruleset. PRAXIS runs deterministic checks: scope validation, context matching, rate limits, and compliance assertions.",
    detail: "100% policy coverage, no sampling",
    color: "#1AC8D2",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Enforce + Audit",
    subtitle: "Allow, block, or escalate",
    description:
      "Actions that pass are executed. Those that fail are blocked or escalated — with full structured logs, decision traces, and an immutable audit trail for compliance reporting.",
    detail: "Immutable audit log, SIEM-compatible",
    color: "#D9532B",
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15%" });
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const isMobile = useIsMobile();

  // Auto-cycle through steps
  useEffect(() => {
    if (!inView) return;
    let step = 0;
    const interval = setInterval(() => {
      setActiveStep(step % 3);
      step++;
    }, 1800);
    // Stop after one cycle
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setActiveStep(null);
    }, 6500);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [inView]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      style={{
        background: "#151618",
        padding: "clamp(5rem, 10vw, 9rem) 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#D9532B",
              marginBottom: "1rem",
            }}
          >
            How It Works
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: 500,
              lineHeight: 1.2,
              color: "#FFFFFF",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Three operations.
            <br />
            <em style={{ color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
              One enforcement contract.
            </em>
          </h2>
        </motion.div>

        {/* Steps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0,
            position: "relative",
          }}
          className="how-it-works-grid"
        >
          {/* Connector line (desktop) */}
          <div
            style={{
              position: "absolute",
              top: 56,
              left: "calc(100%/6 + 16px)",
              right: "calc(100%/6 + 16px)",
              height: 1,
              background: "rgba(255,255,255,0.07)",
              zIndex: 0,
              display: "none",
            }}
            className="connector-line"
          />

          {steps.map((step, i) => (
            <StepCard
              key={step.number}
              step={step}
              index={i}
              inView={inView}
              isActive={activeStep === i}
              isLast={i === steps.length - 1}
            />
          ))}
        </div>

        {/* Animated connector SVG — desktop only */}
        {!isMobile && <ConnectorLine inView={inView} />}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .how-it-works-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function ConnectorLine({ inView }: { inView: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        marginTop: "3rem",
        padding: "0 1rem",
      }}
    >
      <svg
        viewBox="0 0 900 60"
        style={{ width: "100%", maxWidth: 900, margin: "0 auto", display: "block" }}
        preserveAspectRatio="none"
      >
        {/* Base line */}
        <line x1="0" y1="30" x2="900" y2="30" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* Animated highlight */}
        {inView && (
          <motion.line
            x1="0"
            y1="30"
            x2="900"
            y2="30"
            stroke="#D9532B"
            strokeWidth="1.5"
            strokeOpacity="0.6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, delay: 0.8, ease: "easeInOut" }}
          />
        )}

        {/* Step dots */}
        {[150, 450, 750].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={30} r={5} fill="#151618" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            {inView && (
              <motion.circle
                cx={x}
                cy={30}
                r={5}
                fill="#D9532B"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.8, ease: [0.22, 0.9, 0.28, 1] }}
              />
            )}
          </g>
        ))}
      </svg>

      {/* Step labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          maxWidth: 900,
          margin: "0.5rem auto 0",
        }}
      >
        {steps.map((s) => (
          <span
            key={s.number}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {s.title}
          </span>
        ))}
      </div>
    </div>
  );
}

function StepCard({
  step,
  index,
  inView,
  isActive,
  isLast,
}: {
  step: (typeof steps)[0];
  index: number;
  inView: boolean;
  isActive: boolean;
  isLast: boolean;
}) {
  const Icon = step.icon;
  const [hovered, setHovered] = useState(false);
  const active = isActive || hovered;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.15 + index * 0.12, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "2.5rem 2rem",
        borderRight: !isLast ? "1px solid rgba(255,255,255,0.06)" : "none",
        position: "relative",
        transition: "background 0.25s ease",
        background: active ? "rgba(255,255,255,0.02)" : "transparent",
        cursor: "default",
        transform: active ? "scale(1.01)" : "scale(1)",
      }}
    >
      {/* Active highlight border left */}
      {active && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 2,
            height: "100%",
            background: `linear-gradient(180deg, transparent, ${step.color} 50%, transparent)`,
          }}
        />
      )}

      {/* Icon */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 2,
          background: active ? "rgba(217,83,43,0.14)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${active ? "rgba(217,83,43,0.35)" : "rgba(255,255,255,0.08)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
          transition: "all 0.25s ease",
        }}
      >
        <Icon size={20} color={active ? step.color : "rgba(255,255,255,0.45)"} />
      </div>

      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.1em",
          color: active ? step.color : "rgba(255,255,255,0.2)",
          marginBottom: "0.5rem",
          transition: "color 0.25s ease",
        }}
      >
        {step.number}
      </div>

      <h3
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "1.15rem",
          fontWeight: 600,
          color: "#FFFFFF",
          marginBottom: "0.4rem",
        }}
      >
        {step.title}
      </h3>

      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.78rem",
          fontWeight: 500,
          color: active ? step.color : "rgba(255,255,255,0.3)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          marginBottom: "1rem",
          transition: "color 0.25s ease",
        }}
      >
        {step.subtitle}
      </div>

      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.875rem",
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.45)",
          margin: "0 0 1.25rem 0",
        }}
      >
        {step.description}
      </p>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 2,
          padding: "5px 10px",
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.05em",
          }}
        >
          {step.detail}
        </span>
      </div>
    </motion.div>
  );
}
