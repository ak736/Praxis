import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { AlertTriangle, Scale, Terminal } from "lucide-react";

const EASE = [0.22, 0.9, 0.28, 1] as const;

const problems = [
  {
    icon: AlertTriangle,
    tag: "01",
    title: "AI agents are probabilistic by nature.",
    body: "Large language models generate outputs through statistical inference. No two identical prompts guarantee identical actions. In enterprise workflows, this unpredictability compounds at scale — a single unverified action can cascade across systems.",
    highlight: "probabilistic",
  },
  {
    icon: Scale,
    tag: "02",
    title: "Enterprises require deterministic guarantees.",
    body: "Regulated industries operate under strict SLAs, audit trails, and policy mandates. An AI agent that might comply is not the same as an AI agent that must comply. The gap between these two is where liability lives.",
    highlight: "deterministic",
  },
  {
    icon: Terminal,
    tag: "03",
    title: "Compliance requires runtime enforcement.",
    body: "Training-time alignment is necessary but insufficient. Post-deployment, agents operate in dynamic environments where novel inputs can bypass safeguards. Compliance must be enforced at runtime — not assumed from training.",
    highlight: "runtime enforcement",
  },
];

export function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      id="problem"
      ref={ref}
      style={{
        background: "#0F1114",
        padding: "clamp(5rem, 10vw, 9rem) 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle top divider */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 900,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.08) 60%, transparent)",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 600, marginBottom: "4rem" }}
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
            The Problem
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
            Autonomy without governance
            <br />
            <em style={{ color: "rgba(255,255,255,0.55)", fontStyle: "italic" }}>
              is a liability.
            </em>
          </h2>
        </motion.div>

        {/* Problem cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 2,
            overflow: "hidden",
          }}
          className="problem-grid"
        >
          {problems.map((p, i) => (
            <ProblemCard key={p.tag} problem={p} index={i} inView={inView} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .problem-card {
            border-right: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function ProblemCard({
  problem,
  index,
  inView,
}: {
  problem: (typeof problems)[0];
  index: number;
  inView: boolean;
}) {
  const Icon = problem.icon;
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 + index * 0.08, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="problem-card"
      style={{
        background: hovered ? "#151618" : "#0F1114",
        padding: "clamp(1.5rem, 5vw, 2.5rem)",
        borderRight: index < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "background 0.25s ease",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Hover accent border bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: hovered
            ? "linear-gradient(90deg, transparent, #D9532B 50%, transparent)"
            : "transparent",
          transition: "all 0.35s ease",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 2,
            background: "rgba(217,83,43,0.1)",
            border: "1px solid rgba(217,83,43,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.25s ease",
            ...(hovered ? { background: "rgba(217,83,43,0.18)", borderColor: "rgba(217,83,43,0.4)" } : {}),
          }}
        >
          <Icon size={16} color={hovered ? "#D9532B" : "rgba(217,83,43,0.7)"} />
        </div>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            fontWeight: 500,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.1em",
            paddingTop: 10,
          }}
        >
          {problem.tag}
        </span>
      </div>

      <h3
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "1rem",
          fontWeight: 600,
          lineHeight: 1.4,
          color: "#FFFFFF",
          marginBottom: "0.875rem",
        }}
      >
        {problem.title}
      </h3>

      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.875rem",
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.45)",
          margin: 0,
        }}
      >
        {problem.body}
      </p>
    </motion.div>
  );
}
