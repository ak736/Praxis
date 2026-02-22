import React, { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { TrendingUp, Heart, GitBranch, Building2, ArrowRight } from "lucide-react";

const EASE = [0.22, 0.9, 0.28, 1] as const;

const cases = [
  {
    icon: TrendingUp,
    sector: "FinTech",
    title: "AI-Driven Trading & Compliance",
    description:
      "Enforce trade limits, flag regulatory violations, and block unauthorized data access in real-time. PRAXIS sits inline between your LLM trading assistant and execution layer.",
    tags: ["MiFID II", "SOX", "Trade Surveillance"],
    accent: "#D9532B",
  },
  {
    icon: Heart,
    sector: "Healthcare",
    title: "Clinical AI Governance",
    description:
      "Prevent PHI exposure, enforce HIPAA data handling rules, and audit every clinical recommendation made by AI agents across your care workflows.",
    tags: ["HIPAA", "PHI Protection", "Clinical Audit"],
    accent: "#1AC8D2",
  },
  {
    icon: GitBranch,
    sector: "DevOps",
    title: "Autonomous CI/CD Guardrails",
    description:
      "Control what your AI coding assistants and pipeline agents can modify, deploy, or delete. Enforce infra policies without slowing velocity.",
    tags: ["IaC Policy", "Blast Radius", "GitOps"],
    accent: "#D9532B",
  },
  {
    icon: Building2,
    sector: "Enterprise SaaS",
    title: "Multi-Tenant Agent Control",
    description:
      "Define per-tenant policy namespaces that govern what agents can access, modify, or communicate across your platform's data boundaries.",
    tags: ["RBAC", "Data Isolation", "Tenant Policy"],
    accent: "#1AC8D2",
  },
];

export function UseCasesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15%" });

  return (
    <section
      id="use-cases"
      ref={sectionRef}
      style={{
        background: "#0F1114",
        padding: "clamp(5rem, 10vw, 9rem) 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ marginBottom: "3.5rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}
        >
          <div>
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
              Use Cases
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
              Built for regulated
              <br />
              <em style={{ color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
                industries.
              </em>
            </h2>
          </div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.35)",
              maxWidth: 300,
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            PRAXIS adapts to the compliance requirements of any industry with configurable policy primitives.
          </p>
        </motion.div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 4,
            overflow: "hidden",
          }}
          className="use-cases-grid"
        >
          {cases.map((c, i) => (
            <UseCaseCard key={c.sector} item={c} index={i} inView={inView} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .use-cases-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function UseCaseCard({
  item,
  index,
  inView,
}: {
  item: (typeof cases)[0];
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.08 * index, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#151618" : "#0F1114",
        padding: "2.5rem",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transform: hovered ? "scale(1.005)" : "scale(1)",
        transition: "all 0.25s ease",
      }}
    >
      {/* Hover accent top line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: hovered
            ? `linear-gradient(90deg, transparent, ${item.accent} 50%, transparent)`
            : "transparent",
          transition: "all 0.35s ease",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 2,
            background: hovered ? `rgba(${item.accent === "#D9532B" ? "217,83,43" : "26,200,210"},0.12)` : "rgba(255,255,255,0.04)",
            border: `1px solid ${hovered ? item.accent + "44" : "rgba(255,255,255,0.07)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.25s ease",
          }}
        >
          <Icon size={18} color={hovered ? item.accent : "rgba(255,255,255,0.4)"} />
        </div>

        <div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: hovered ? item.accent : "rgba(255,255,255,0.25)",
              marginBottom: 4,
              transition: "color 0.25s ease",
            }}
          >
            {item.sector}
          </div>
          <h3
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#FFFFFF",
              margin: 0,
              lineHeight: 1.35,
            }}
          >
            {item.title}
          </h3>
        </div>
      </div>

      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.875rem",
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.42)",
          margin: "0 0 1.5rem 0",
        }}
      >
        {item.description}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {item.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 2,
                padding: "3px 8px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight size={14} color={item.accent} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
