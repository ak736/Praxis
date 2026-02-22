import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ShieldCheck, Lock, FileText, Globe } from "lucide-react";

const EASE = [0.22, 0.9, 0.28, 1] as const;

const badges = [
  { icon: ShieldCheck, label: "SOC 2 Type II", sublabel: "In Progress", color: "#D9532B" },
  { icon: Lock, label: "HIPAA Ready", sublabel: "Healthcare", color: "#1AC8D2" },
  { icon: FileText, label: "GDPR Compliant", sublabel: "EU Ready", color: "#D9532B" },
  { icon: Globe, label: "ISO 27001", sublabel: "Certified", color: "#1AC8D2" },
];

const trustPoints = [
  {
    title: "Zero trust data model",
    body: "PRAXIS does not persist agent inputs or outputs. Every evaluation is ephemeral — only the decision and audit record are written.",
  },
  {
    title: "Air-gapped deployment options",
    body: "Deploy PRAXIS entirely within your VPC. No data leaves your perimeter. Self-hosted, enterprise key management.",
  },
  {
    title: "Immutable audit chain",
    body: "Every enforcement decision is written to a tamper-evident log with cryptographic integrity guarantees. Court-admissible.",
  },
];

export function TrustSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15%" });

  return (
    <section
      id="trust"
      ref={sectionRef}
      style={{
        background: "#151618",
        padding: "clamp(5rem, 10vw, 9rem) 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(26,200,210,0.04) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        {/* Header */}
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
            Trust & Compliance
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: 500,
              lineHeight: 1.2,
              color: "#FFFFFF",
              margin: "0 auto 1.25rem auto",
              maxWidth: 560,
              letterSpacing: "-0.01em",
            }}
          >
            Built for regulated
            <em style={{ color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}> environments.</em>
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.4)",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            PRAXIS is designed from the ground up for regulated industries where security, compliance, and auditability are non-negotiable.
          </p>
        </motion.div>

        {/* Compliance badges */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "5rem",
            flexWrap: "wrap",
          }}
        >
          {badges.map((b, i) => (
            <ComplianceBadge key={b.label} badge={b} delay={i * 0.07} inView={inView} />
          ))}
        </motion.div>

        {/* Trust points */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 2,
            overflow: "hidden",
          }}
          className="trust-grid"
        >
          {trustPoints.map((tp, i) => (
            <motion.div
              key={tp.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25 + i * 0.1, ease: EASE }}
              style={{
                padding: "2rem 2rem",
                background: "#151618",
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <div
                style={{
                  width: 4,
                  height: 24,
                  background: "linear-gradient(180deg, #D9532B, rgba(217,83,43,0.2))",
                  borderRadius: 2,
                  marginBottom: "1.25rem",
                }}
              />
              <h4
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  margin: "0 0 0.75rem 0",
                  lineHeight: 1.4,
                }}
              >
                {tp.title}
              </h4>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.85rem",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.4)",
                  margin: 0,
                }}
              >
                {tp.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Uptime / SLA strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "3rem",
            marginTop: "3rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { value: "99.99%", label: "Uptime SLA" },
            { value: "<2ms", label: "P99 Latency" },
            { value: "∞", label: "Log Retention" },
          ].map((m) => (
            <div key={m.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1.5rem",
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
                  color: "rgba(255,255,255,0.3)",
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

      <style>{`
        @media (max-width: 767px) {
          .trust-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function ComplianceBadge({
  badge,
  delay,
  inView,
}: {
  badge: (typeof badges)[0];
  delay: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = React.useState(false);
  const Icon = badge.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 4,
        padding: "14px 20px",
        cursor: "default",
        transition: "all 0.22s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 2,
          background: `rgba(${badge.color === "#D9532B" ? "217,83,43" : "26,200,210"},0.1)`,
          border: `1px solid ${badge.color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={16} color={badge.color} />
      </div>
      <div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.8)",
            lineHeight: 1.2,
          }}
        >
          {badge.label}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: badge.color,
            letterSpacing: "0.04em",
            marginTop: 2,
          }}
        >
          {badge.sublabel}
        </div>
      </div>
    </motion.div>
  );
}
