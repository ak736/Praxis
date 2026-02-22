import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
  Shield,
  Search,
  ShieldCheck,
  Bot,
  Terminal,
  ScrollText,
  Database,
} from "lucide-react";
import { useIsMobile } from "./ui/use-mobile";
import type { LucideIcon } from "lucide-react";

const EASE = [0.22, 0.9, 0.28, 1] as const;

// ─── Data Model ──────────────────────────────────────────

interface ArchNode {
  id: string;
  label: string;
  subtitle: string;
  tooltipDescription: string;
  detailTitle: string;
  detailBullets: string[];
  detailExample: string;
  accentColor: string;
  icon: LucideIcon;
  x: number;
  y: number;
  w: number;
  h: number;
  tooltipPosition: "top" | "bottom" | "left" | "right";
}

const NODES: ArchNode[] = [
  {
    id: "agent",
    label: "AI Agent",
    subtitle: "LangChain · AutoGPT · Custom",
    tooltipDescription:
      "Any LLM-powered runtime — LangChain, AutoGPT, or custom agents.",
    detailTitle: "AI Agent Runtime",
    detailBullets: [
      "Instrumented via lightweight SDK or transparent proxy layer",
      "Zero code changes required to existing agent logic",
      "Supports LangChain, AutoGPT, CrewAI, and custom frameworks",
    ],
    detailExample: `agent.invoke("transaction.create", {
  amount: 4200,
  currency: "USD"
})
// → Intercepted by PRAXIS before execution`,
    accentColor: "#FFFFFF",
    icon: Bot,
    x: 300,
    y: 20,
    w: 200,
    h: 56,
    tooltipPosition: "top",
  },
  {
    id: "intercept",
    label: "Intercept",
    subtitle: "action capture",
    tooltipDescription:
      "Captures every outbound agent action before it reaches any downstream system.",
    detailTitle: "Intercept — Action Capture",
    detailBullets: [
      "All tool calls, API requests, and data writes are intercepted inline",
      "Sub-millisecond capture latency (~0.4ms average)",
      "Action metadata extracted: type, parameters, agent context, scope",
    ],
    detailExample: `{
  action: "transaction.create",
  params: { amount: 4200, currency: "USD" },
  agent: "agent_prod_007",
  timestamp: "2025-02-22T14:32:11.041Z"
}`,
    accentColor: "#D9532B",
    icon: Shield,
    x: 168,
    y: 172,
    w: 140,
    h: 72,
    tooltipPosition: "bottom",
  },
  {
    id: "verify",
    label: "Verify",
    subtitle: "policy eval",
    tooltipDescription:
      "Evaluates the action against your versioned policy ruleset in real time.",
    detailTitle: "Verify — Policy Evaluation",
    detailBullets: [
      "Deterministic evaluation: scope, context, rate limits, compliance",
      "100% policy coverage — every action is checked, zero sampling",
      "Evaluation latency: <2ms P99",
    ],
    detailExample: `evaluate {
  rules_checked: 3,
  matched: "allow_verified_agents",
  policy_version: "2.1.0",
  latency: "1.2ms"
}`,
    accentColor: "#6CE1FF",
    icon: Search,
    x: 330,
    y: 172,
    w: 140,
    h: 72,
    tooltipPosition: "bottom",
  },
  {
    id: "enforce",
    label: "Enforce",
    subtitle: "allow · block",
    tooltipDescription:
      "Allows compliant actions, blocks violations, or escalates edge cases.",
    detailTitle: "Enforce — Decision Gate",
    detailBullets: [
      "Three outcomes: ALLOW (proceed), BLOCK (reject + error), ESCALATE (human review)",
      "Blocked actions return machine-readable context to the agent",
      "Decisions are cryptographically signed and immutable",
    ],
    detailExample: `decision {
  effect: "ALLOW" | "BLOCK" | "ESCALATE",
  reason: "PII exfiltration policy violation",
  alert: "security-team@corp.com"
}`,
    accentColor: "#2BC37B",
    icon: ShieldCheck,
    x: 492,
    y: 172,
    w: 140,
    h: 72,
    tooltipPosition: "bottom",
  },
  {
    id: "audit",
    label: "Audit Log",
    subtitle: "immutable · SIEM",
    tooltipDescription:
      "Immutable, tamper-evident log of every enforcement decision.",
    detailTitle: "Immutable Audit Log",
    detailBullets: [
      "Every decision — allow, block, escalate — written to structured log",
      "SIEM-compatible export (Splunk, Datadog, Elastic)",
      "Cryptographic integrity for compliance evidence",
    ],
    detailExample: `[ALLOW] req_9f3a2b1c
  agent  = agent_prod_007
  rule   = allow_verified_agents
  latency = 1.2ms
  audit  = written`,
    accentColor: "#1AC8D2",
    icon: ScrollText,
    x: 20,
    y: 300,
    w: 160,
    h: 68,
    tooltipPosition: "left",
  },
  {
    id: "policy",
    label: "Policy Store",
    subtitle: "versioned · git-native",
    tooltipDescription:
      "Versioned, declarative ruleset authored in PRAXIS DSL or imported from OPA.",
    detailTitle: "Policy Store",
    detailBullets: [
      "Git-native versioning with branch-per-environment support",
      "Authored in PRAXIS DSL or imported from OPA / Rego",
      "Live policy reload with zero downtime",
    ],
    detailExample: `policy "financial.data.write" {
  version: "2.1.0",
  env: ["prod", "staging"],
  rule allow_verified_agents { ... }
}`,
    accentColor: "#1AC8D2",
    icon: Database,
    x: 620,
    y: 300,
    w: 160,
    h: 68,
    tooltipPosition: "right",
  },
  {
    id: "tools",
    label: "Tool Execution",
    subtitle: "APIs · DBs · Services",
    tooltipDescription:
      "Verified actions reach downstream APIs, databases, and services.",
    detailTitle: "Tool Execution Layer",
    detailBullets: [
      "Only ALLOW-ed actions reach downstream systems",
      "Blocked actions return structured error context for agent self-correction",
      "Full request/response tracing for post-hoc analysis",
    ],
    detailExample: `execute {
  target: "payments-api.internal",
  action: "transaction.create",
  status: "completed",
  trace_id: "tr_9f3a2b1c"
}`,
    accentColor: "#FFFFFF",
    icon: Terminal,
    x: 290,
    y: 420,
    w: 220,
    h: 56,
    tooltipPosition: "bottom",
  },
];

// ─── Helpers ─────────────────────────────────────────────

function glowId(color: string): string {
  if (color === "#D9532B") return "glow-orange";
  if (color === "#6CE1FF") return "glow-teal";
  if (color === "#2BC37B") return "glow-green";
  if (color === "#1AC8D2") return "glow-cyan";
  return "glow-white";
}

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ─── Pulse Timeline ──────────────────────────────────────

const PULSE_CONFIG = (() => {
  const raw = [
    { x: 400, y: 48, travel: 0, pause: 0.5, nodeId: "agent", color: "#FFFFFF" },
    { x: 400, y: 140, travel: 0.4, pause: 0, nodeId: "", color: "#FFFFFF" },
    { x: 238, y: 208, travel: 0.45, pause: 0.4, nodeId: "intercept", color: "#D9532B" },
    { x: 400, y: 208, travel: 0.35, pause: 0.4, nodeId: "verify", color: "#6CE1FF" },
    { x: 562, y: 208, travel: 0.35, pause: 0.4, nodeId: "enforce", color: "#2BC37B" },
    { x: 400, y: 260, travel: 0.3, pause: 0, nodeId: "", color: "#2BC37B" },
    { x: 400, y: 448, travel: 0.6, pause: 0.5, nodeId: "tools", color: "#FFFFFF" },
  ];

  const totalTime = raw.reduce((s, w) => s + w.travel + w.pause, 0) + 0.5;

  let t = 0;
  const waypoints = raw.map((w) => {
    const arrive = (t + w.travel) / totalTime;
    const depart = (t + w.travel + w.pause) / totalTime;
    t += w.travel + w.pause;
    return { ...w, arrive, depart };
  });

  return { waypoints, duration: totalTime };
})();

function getPulseState(progress: number) {
  const { waypoints } = PULSE_CONFIG;
  const last = waypoints[waypoints.length - 1];

  if (progress > last.depart) {
    const r = (progress - last.depart) / (1 - last.depart);
    return {
      x: last.x + (waypoints[0].x - last.x) * r,
      y: last.y + (waypoints[0].y - last.y) * r,
      nodeId: "",
      color: "#FFFFFF",
      opacity: Math.max(0, 1 - r * 3),
    };
  }

  for (let i = 0; i < waypoints.length; i++) {
    const wp = waypoints[i];
    if (progress >= wp.arrive && progress <= wp.depart) {
      return { x: wp.x, y: wp.y, nodeId: wp.nodeId, color: wp.color, opacity: 1 };
    }
    if (i < waypoints.length - 1) {
      const next = waypoints[i + 1];
      if (progress > wp.depart && progress < next.arrive) {
        const seg = easeInOut((progress - wp.depart) / (next.arrive - wp.depart));
        return {
          x: wp.x + (next.x - wp.x) * seg,
          y: wp.y + (next.y - wp.y) * seg,
          nodeId: "",
          color: wp.color,
          opacity: 1,
        };
      }
    }
  }
  return { x: waypoints[0].x, y: waypoints[0].y, nodeId: "", color: "#FFFFFF", opacity: 0 };
}

// ─── Main Export ─────────────────────────────────────────

export function ArchitectureSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-10%" });
  const isMobile = useIsMobile();

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [pulseActiveNode, setPulseActiveNode] = useState("");

  const pulseRef = useRef<SVGCircleElement>(null);
  const pulseGlowRef = useRef<SVGCircleElement>(null);
  const activeNodeRef = useRef("");
  const progressRef = useRef(0);

  useEffect(() => {
    const el = diagramRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Pulse animation (direct DOM for performance)
  const isPaused = !!hoveredId || !!selectedId;
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  useEffect(() => {
    if (!inView || isMobile) return;
    const circle = pulseRef.current;
    const glow = pulseGlowRef.current;
    if (!circle || !glow) return;

    let frame: number;
    let lastTime = performance.now();

    function tick(now: number) {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!isPausedRef.current) {
        progressRef.current = (progressRef.current + dt / PULSE_CONFIG.duration) % 1;
      }

      const s = getPulseState(progressRef.current);
      circle.setAttribute("cx", String(s.x));
      circle.setAttribute("cy", String(s.y));
      circle.style.opacity = String(s.opacity);
      circle.style.fill = s.color;
      glow.setAttribute("cx", String(s.x));
      glow.setAttribute("cy", String(s.y));
      glow.style.opacity = String(s.opacity * 0.15);
      glow.style.fill = s.color;

      if (s.nodeId !== activeNodeRef.current) {
        activeNodeRef.current = s.nodeId;
        setPulseActiveNode(s.nodeId);
      }

      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, isMobile]);

  const handleHover = useCallback((id: string) => setHoveredId(id), []);
  const handleLeave = useCallback(() => setHoveredId(null), []);
  const handleClick = useCallback(
    (id: string) => {
      setSelectedId((prev) => (prev === id ? null : id));
    },
    []
  );
  const handleBgClick = useCallback(() => setSelectedId(null), []);

  const nodeOpacity = (id: string) => {
    if (selectedId) return id === selectedId ? 1 : 0.25;
    if (hoveredId) return id === hoveredId ? 1 : 0.35;
    if (pulseActiveNode === id) return 0.85;
    return 0.5;
  };

  const connectorOpacity = (fromId: string, toId: string) => {
    if (selectedId)
      return fromId === selectedId || toId === selectedId ? 0.5 : 0.06;
    if (hoveredId)
      return fromId === hoveredId || toId === hoveredId ? 0.4 : 0.1;
    return 0.2;
  };

  const isLit = (id: string) =>
    id === selectedId || id === hoveredId || id === pulseActiveNode;

  const selectedNode = selectedId
    ? NODES.find((n) => n.id === selectedId)!
    : null;

  return (
    <section
      id="architecture"
      ref={sectionRef}
      style={{
        background: "#0F1114",
        padding: "clamp(5rem, 10vw, 9rem) 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ marginBottom: "3.5rem" }}
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
            Architecture
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
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
              Inline enforcement.
              <br />
              <em style={{ color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
                Zero agent rewrites.
              </em>
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.35)",
                maxWidth: 320,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Watch the data flow. Click any node to inspect the enforcement
              pipeline.
            </p>
          </div>
        </motion.div>

        {/* ── Diagram ── */}
        <motion.div
          ref={diagramRef}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          style={{
            position: "relative",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: selectedId ? "4px 4px 0 0" : 4,
            background: "#0D0F12",
            overflow: "hidden",
            transition: "border-radius 0.3s ease",
          }}
        >
          {/* Grid background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              pointerEvents: "none",
            }}
          />

          {isMobile ? (
            <MobileDiagram
              nodes={NODES}
              selectedId={selectedId}
              onNodeClick={handleClick}
              nodeOpacity={nodeOpacity}
              inView={inView}
            />
          ) : (
            <svg
              viewBox="0 0 800 500"
              style={{ width: "100%", height: "auto", display: "block" }}
              preserveAspectRatio="xMidYMid meet"
              onClick={handleBgClick}
            >
              <defs>
                <filter id="glow-white" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ffffff" floodOpacity="0.15" />
                </filter>
                <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#D9532B" floodOpacity="0.4" />
                </filter>
                <filter id="glow-teal" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#6CE1FF" floodOpacity="0.4" />
                </filter>
                <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#2BC37B" floodOpacity="0.35" />
                </filter>
                <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#1AC8D2" floodOpacity="0.4" />
                </filter>
                <filter id="glow-pulse" x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <style>{`
                  .march { animation: marchFlow 1.2s linear infinite; }
                  @keyframes marchFlow { to { stroke-dashoffset: -10; } }
                `}</style>
              </defs>

              {/* ── Connectors (marching ants) ── */}

              {/* Agent → Enforcement */}
              <g opacity={connectorOpacity("agent", "intercept")} style={{ transition: "opacity 0.35s ease" }}>
                <line x1="400" y1="76" x2="400" y2="132" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeDasharray="6,4" className="march" />
                <polygon points="395,130 400,140 405,130" fill="rgba(255,255,255,0.5)" />
              </g>
              <text x="415" y="110" fill="rgba(255,255,255,0.18)" fontFamily="JetBrains Mono, monospace" fontSize="8">action()</text>

              {/* Enforcement → Audit */}
              <g opacity={connectorOpacity("intercept", "audit")} style={{ transition: "opacity 0.35s ease" }}>
                <line x1="168" y1="244" x2="100" y2="300" stroke="rgba(26,200,210,0.45)" strokeWidth="1" strokeDasharray="6,4" className="march" />
              </g>

              {/* Enforcement → Policy */}
              <g opacity={connectorOpacity("verify", "policy")} style={{ transition: "opacity 0.35s ease" }}>
                <line x1="632" y1="244" x2="700" y2="300" stroke="rgba(26,200,210,0.45)" strokeWidth="1" strokeDasharray="6,4" className="march" />
              </g>

              {/* Enforcement → Tools */}
              <g opacity={connectorOpacity("enforce", "tools")} style={{ transition: "opacity 0.35s ease" }}>
                <line x1="400" y1="260" x2="400" y2="410" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeDasharray="6,4" className="march" />
                <polygon points="395,408 400,418 405,408" fill="rgba(255,255,255,0.5)" />
              </g>
              <text x="415" y="350" fill="rgba(255,255,255,0.18)" fontFamily="JetBrains Mono, monospace" fontSize="8">verified</text>

              {/* Inner connectors: Intercept → Verify → Enforce */}
              <g opacity={hoveredId || selectedId ? 0.25 : 0.2} style={{ transition: "opacity 0.35s ease" }}>
                <line x1={308} y1={208} x2={330} y2={208} stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="6,4" className="march" />
                <polygon points="327,205 335,208 327,211" fill="rgba(255,255,255,0.3)" />
                <line x1={470} y1={208} x2={492} y2={208} stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="6,4" className="march" />
                <polygon points="489,205 497,208 489,211" fill="rgba(255,255,255,0.3)" />
              </g>

              {/* ── AI Agent ── */}
              <g
                opacity={nodeOpacity("agent")}
                style={{ transition: "opacity 0.35s ease", cursor: "pointer" }}
                onMouseEnter={() => handleHover("agent")}
                onMouseLeave={handleLeave}
                onClick={(e) => { e.stopPropagation(); handleClick("agent"); }}
              >
                <rect x={300} y={20} width={200} height={56} rx={3}
                  fill={isLit("agent") ? "#1F2227" : "#161819"}
                  stroke={isLit("agent") ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.1)"}
                  strokeWidth={isLit("agent") ? 1.5 : 1}
                  filter={isLit("agent") ? "url(#glow-white)" : undefined}
                  style={{ transition: "fill 0.25s ease, stroke 0.25s ease" }}
                />
                <foreignObject x={316} y={33} width={24} height={24}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24 }}>
                    <Bot size={15} color={isLit("agent") ? "#fff" : "rgba(255,255,255,0.35)"} />
                  </div>
                </foreignObject>
                <text x={400} y={46} textAnchor="middle" fill={isLit("agent") ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.65)"} fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600" style={{ transition: "fill 0.25s ease" }}>AI Agent</text>
                <text x={400} y={62} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontFamily="JetBrains Mono, monospace" fontSize="8.5">LangChain · AutoGPT · Custom</text>
                <rect x={290} y={10} width={220} height={76} fill="transparent" />
              </g>

              {/* ── PRAXIS Enforcement Layer container ── */}
              <rect x={150} y={140} width={500} height={116} rx={3}
                fill="#131517"
                stroke={isLit("intercept") || isLit("verify") || isLit("enforce") ? "rgba(217,83,43,0.5)" : "rgba(217,83,43,0.18)"}
                strokeWidth={1}
                opacity={selectedId && selectedId !== "intercept" && selectedId !== "verify" && selectedId !== "enforce" ? 0.25 : 0.9}
                style={{ transition: "opacity 0.35s ease, stroke 0.35s ease" }}
              />
              <rect x={150} y={140} width={500} height={22} rx={3} fill="rgba(217,83,43,0.1)" />
              <text x={400} y={155} textAnchor="middle" fill="#D9532B" fontFamily="Inter, sans-serif" fontSize="9.5" fontWeight="700" letterSpacing="0.12em"
                opacity={selectedId && selectedId !== "intercept" && selectedId !== "verify" && selectedId !== "enforce" ? 0.25 : 0.85}
                style={{ transition: "opacity 0.35s ease" }}
              >PRAXIS ENFORCEMENT LAYER</text>

              {/* ── Intercept ── */}
              <g
                opacity={nodeOpacity("intercept")}
                style={{ transition: "opacity 0.35s ease", cursor: "pointer" }}
                onMouseEnter={() => handleHover("intercept")}
                onMouseLeave={handleLeave}
                onClick={(e) => { e.stopPropagation(); handleClick("intercept"); }}
              >
                <rect x={168} y={172} width={140} height={72} rx={3}
                  fill={isLit("intercept") ? "#1C1614" : "#111214"}
                  stroke={isLit("intercept") ? "#D9532B" : "rgba(217,83,43,0.15)"}
                  strokeWidth={isLit("intercept") ? 1.5 : 1}
                  filter={isLit("intercept") ? "url(#glow-orange)" : undefined}
                  style={{ transition: "fill 0.25s ease, stroke 0.25s ease" }}
                />
                <foreignObject x={183} y={185} width={22} height={22}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22 }}>
                    <Shield size={13} color={isLit("intercept") ? "#D9532B" : "rgba(217,83,43,0.4)"} />
                  </div>
                </foreignObject>
                <text x={238} y={202} textAnchor="middle" fill={isLit("intercept") ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)"} fontFamily="Inter, sans-serif" fontSize="11.5" fontWeight="600" style={{ transition: "fill 0.25s ease" }}>Intercept</text>
                <text x={238} y={220} textAnchor="middle" fill="rgba(255,255,255,0.22)" fontFamily="JetBrains Mono, monospace" fontSize="7.5">action capture</text>
                <rect x={158} y={162} width={160} height={92} fill="transparent" />
              </g>

              {/* ── Verify ── */}
              <g
                opacity={nodeOpacity("verify")}
                style={{ transition: "opacity 0.35s ease", cursor: "pointer" }}
                onMouseEnter={() => handleHover("verify")}
                onMouseLeave={handleLeave}
                onClick={(e) => { e.stopPropagation(); handleClick("verify"); }}
              >
                <rect x={330} y={172} width={140} height={72} rx={3}
                  fill={isLit("verify") ? "#121A1E" : "#111214"}
                  stroke={isLit("verify") ? "#6CE1FF" : "rgba(108,225,255,0.12)"}
                  strokeWidth={isLit("verify") ? 1.5 : 1}
                  filter={isLit("verify") ? "url(#glow-teal)" : undefined}
                  style={{ transition: "fill 0.25s ease, stroke 0.25s ease" }}
                />
                <foreignObject x={345} y={185} width={22} height={22}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22 }}>
                    <Search size={13} color={isLit("verify") ? "#6CE1FF" : "rgba(108,225,255,0.35)"} />
                  </div>
                </foreignObject>
                <text x={400} y={202} textAnchor="middle" fill={isLit("verify") ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)"} fontFamily="Inter, sans-serif" fontSize="11.5" fontWeight="600" style={{ transition: "fill 0.25s ease" }}>Verify</text>
                <text x={400} y={220} textAnchor="middle" fill="rgba(255,255,255,0.22)" fontFamily="JetBrains Mono, monospace" fontSize="7.5">policy eval</text>
                <rect x={320} y={162} width={160} height={92} fill="transparent" />
              </g>

              {/* ── Enforce ── */}
              <g
                opacity={nodeOpacity("enforce")}
                style={{ transition: "opacity 0.35s ease", cursor: "pointer" }}
                onMouseEnter={() => handleHover("enforce")}
                onMouseLeave={handleLeave}
                onClick={(e) => { e.stopPropagation(); handleClick("enforce"); }}
              >
                <rect x={492} y={172} width={140} height={72} rx={3}
                  fill={isLit("enforce") ? "#121C16" : "#111214"}
                  stroke={isLit("enforce") ? "#2BC37B" : "rgba(43,195,123,0.12)"}
                  strokeWidth={isLit("enforce") ? 1.5 : 1}
                  filter={isLit("enforce") ? "url(#glow-green)" : undefined}
                  style={{ transition: "fill 0.25s ease, stroke 0.25s ease" }}
                />
                <foreignObject x={507} y={185} width={22} height={22}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22 }}>
                    <ShieldCheck size={13} color={isLit("enforce") ? "#2BC37B" : "rgba(43,195,123,0.35)"} />
                  </div>
                </foreignObject>
                <text x={562} y={202} textAnchor="middle" fill={isLit("enforce") ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)"} fontFamily="Inter, sans-serif" fontSize="11.5" fontWeight="600" style={{ transition: "fill 0.25s ease" }}>Enforce</text>
                <text x={562} y={220} textAnchor="middle" fill="rgba(255,255,255,0.22)" fontFamily="JetBrains Mono, monospace" fontSize="7.5">allow · block</text>
                <rect x={482} y={162} width={160} height={92} fill="transparent" />
              </g>

              {/* ── Audit Log ── */}
              <g
                opacity={nodeOpacity("audit")}
                style={{ transition: "opacity 0.35s ease", cursor: "pointer" }}
                onMouseEnter={() => handleHover("audit")}
                onMouseLeave={handleLeave}
                onClick={(e) => { e.stopPropagation(); handleClick("audit"); }}
              >
                <rect x={20} y={300} width={160} height={68} rx={3}
                  fill={isLit("audit") ? "#121A1D" : "#161819"}
                  stroke={isLit("audit") ? "#1AC8D2" : "rgba(26,200,210,0.12)"}
                  strokeWidth={isLit("audit") ? 1.5 : 1}
                  filter={isLit("audit") ? "url(#glow-cyan)" : undefined}
                  style={{ transition: "fill 0.25s ease, stroke 0.25s ease" }}
                />
                <foreignObject x={38} y={318} width={22} height={22}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22 }}>
                    <ScrollText size={13} color={isLit("audit") ? "#1AC8D2" : "rgba(26,200,210,0.35)"} />
                  </div>
                </foreignObject>
                <text x={100} y={330} textAnchor="middle" fill={isLit("audit") ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)"} fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600" style={{ transition: "fill 0.25s ease" }}>Audit Log</text>
                <text x={100} y={348} textAnchor="middle" fill="rgba(26,200,210,0.35)" fontFamily="JetBrains Mono, monospace" fontSize="7.5">immutable · SIEM</text>
                <rect x={10} y={290} width={180} height={88} fill="transparent" />
              </g>

              {/* ── Policy Store ── */}
              <g
                opacity={nodeOpacity("policy")}
                style={{ transition: "opacity 0.35s ease", cursor: "pointer" }}
                onMouseEnter={() => handleHover("policy")}
                onMouseLeave={handleLeave}
                onClick={(e) => { e.stopPropagation(); handleClick("policy"); }}
              >
                <rect x={620} y={300} width={160} height={68} rx={3}
                  fill={isLit("policy") ? "#121A1D" : "#161819"}
                  stroke={isLit("policy") ? "#1AC8D2" : "rgba(26,200,210,0.12)"}
                  strokeWidth={isLit("policy") ? 1.5 : 1}
                  filter={isLit("policy") ? "url(#glow-cyan)" : undefined}
                  style={{ transition: "fill 0.25s ease, stroke 0.25s ease" }}
                />
                <foreignObject x={638} y={318} width={22} height={22}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22 }}>
                    <Database size={13} color={isLit("policy") ? "#1AC8D2" : "rgba(26,200,210,0.35)"} />
                  </div>
                </foreignObject>
                <text x={700} y={330} textAnchor="middle" fill={isLit("policy") ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)"} fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600" style={{ transition: "fill 0.25s ease" }}>Policy Store</text>
                <text x={700} y={348} textAnchor="middle" fill="rgba(26,200,210,0.35)" fontFamily="JetBrains Mono, monospace" fontSize="7.5">versioned · git-native</text>
                <rect x={610} y={290} width={180} height={88} fill="transparent" />
              </g>

              {/* ── Tool Execution ── */}
              <g
                opacity={nodeOpacity("tools")}
                style={{ transition: "opacity 0.35s ease", cursor: "pointer" }}
                onMouseEnter={() => handleHover("tools")}
                onMouseLeave={handleLeave}
                onClick={(e) => { e.stopPropagation(); handleClick("tools"); }}
              >
                <rect x={290} y={420} width={220} height={56} rx={3}
                  fill={isLit("tools") ? "#1F2227" : "#161819"}
                  stroke={isLit("tools") ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.07)"}
                  strokeWidth={isLit("tools") ? 1.5 : 1}
                  filter={isLit("tools") ? "url(#glow-white)" : undefined}
                  style={{ transition: "fill 0.25s ease, stroke 0.25s ease" }}
                />
                <foreignObject x={306} y={435} width={22} height={22}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22 }}>
                    <Terminal size={14} color={isLit("tools") ? "#fff" : "rgba(255,255,255,0.3)"} />
                  </div>
                </foreignObject>
                <text x={400} y={448} textAnchor="middle" fill={isLit("tools") ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)"} fontFamily="Inter, sans-serif" fontSize="12" fontWeight="600" style={{ transition: "fill 0.25s ease" }}>Tool Execution</text>
                <text x={400} y={464} textAnchor="middle" fill="rgba(255,255,255,0.18)" fontFamily="JetBrains Mono, monospace" fontSize="8">APIs · DBs · Services</text>
                <rect x={280} y={410} width={240} height={76} fill="transparent" />
              </g>

              {/* ── Data Pulse ── */}
              <circle
                ref={pulseGlowRef}
                cx="400" cy="48" r="14"
                fill="#FFFFFF"
                opacity="0"
                style={{ pointerEvents: "none" }}
              />
              <circle
                ref={pulseRef}
                cx="400" cy="48" r="3.5"
                fill="#FFFFFF"
                opacity="0"
                filter="url(#glow-pulse)"
                style={{ pointerEvents: "none" }}
              />
            </svg>
          )}

          {/* ── Hover Tooltip (desktop) ── */}
          {!isMobile && (
            <AnimatePresence>
              {hoveredId && hoveredId !== selectedId && (
                <HoverTooltip
                  node={NODES.find((n) => n.id === hoveredId)!}
                  containerWidth={containerWidth}
                />
              )}
            </AnimatePresence>
          )}
        </motion.div>

        {/* ── Inline Expansion (below diagram, desktop) ── */}
        <AnimatePresence>
          {selectedNode && !isMobile && (
            <InlineExpansion node={selectedNode} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Hover Tooltip (simplified) ──────────────────────────

function HoverTooltip({
  node,
  containerWidth,
}: {
  node: ArchNode;
  containerWidth: number;
}) {
  const svgH = containerWidth * (500 / 800);
  const pxX = ((node.x + node.w / 2) / 800) * containerWidth;
  const pxY = ((node.y + node.h / 2) / 500) * svgH;

  let style: React.CSSProperties = {};
  switch (node.tooltipPosition) {
    case "top":
      style = { left: pxX, top: (node.y / 500) * svgH - 10, transform: "translate(-50%, -100%)" };
      break;
    case "bottom":
      style = { left: pxX, top: ((node.y + node.h) / 500) * svgH + 10, transform: "translate(-50%, 0)" };
      break;
    case "left":
      style = { left: (node.x / 800) * containerWidth - 10, top: pxY, transform: "translate(-100%, -50%)" };
      break;
    case "right":
      style = { left: ((node.x + node.w) / 800) * containerWidth + 10, top: pxY, transform: "translate(0, -50%)" };
      break;
  }

  const isNeutral = node.accentColor === "#FFFFFF";

  return (
    <motion.div
      key={`tooltip-${node.id}`}
      initial={{ opacity: 0, y: 4, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: EASE }}
      style={{
        position: "absolute",
        ...style,
        background: "rgba(13,15,18,0.92)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${isNeutral ? "rgba(255,255,255,0.12)" : node.accentColor + "30"}`,
        borderRadius: 5,
        padding: "8px 12px",
        maxWidth: 200,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          lineHeight: 1.45,
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {node.tooltipDescription}
      </div>
    </motion.div>
  );
}

// ─── Inline Expansion ────────────────────────────────────

function InlineExpansion({ node }: { node: ArchNode }) {
  const isNeutral = node.accentColor === "#FFFFFF";
  const accent = isNeutral ? "rgba(255,255,255,0.4)" : node.accentColor;
  const Icon = node.icon;

  return (
    <motion.div
      key={`expand-${node.id}`}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      style={{ overflow: "hidden" }}
    >
      <div
        style={{
          background: "#0A0C0F",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "0 0 4px 4px",
        }}
      >
        {/* Accent bar */}
        <div style={{ height: 2, background: accent, opacity: 0.8 }} />

        <div style={{ padding: "14px 20px 16px" }}>
          {/* Title row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Icon size={13} color={accent} />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11.5,
                fontWeight: 600,
                color: accent,
              }}
            >
              {node.detailTitle}
            </span>
          </div>

          {/* Code snippet */}
          <pre
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.5)",
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              background: "rgba(0,0,0,0.35)",
              borderRadius: 4,
              padding: "12px 14px",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            {node.detailExample}
          </pre>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Mobile Components ───────────────────────────────────

function MobileDiagram({
  nodes,
  selectedId,
  onNodeClick,
  nodeOpacity,
  inView,
}: {
  nodes: ArchNode[];
  selectedId: string | null;
  onNodeClick: (id: string) => void;
  nodeOpacity: (id: string) => number;
  inView: boolean;
}) {
  const agent = nodes.find((n) => n.id === "agent")!;
  const intercept = nodes.find((n) => n.id === "intercept")!;
  const verify = nodes.find((n) => n.id === "verify")!;
  const enforce = nodes.find((n) => n.id === "enforce")!;
  const tools = nodes.find((n) => n.id === "tools")!;
  const audit = nodes.find((n) => n.id === "audit")!;
  const policy = nodes.find((n) => n.id === "policy")!;

  return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      <MobileCard node={agent} isSelected={selectedId === "agent"} onClick={() => onNodeClick("agent")} opacity={nodeOpacity("agent")} delay={0} inView={inView} />
      <MobileArrow />

      {/* Enforcement Layer */}
      <div
        style={{
          width: "100%",
          border: "1px solid rgba(217,83,43,0.2)",
          borderRadius: 6,
          padding: "10px 10px 14px",
          background: "rgba(217,83,43,0.03)",
        }}
      >
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#D9532B",
            textAlign: "center",
            marginBottom: 10,
            opacity: 0.7,
          }}
        >
          PRAXIS ENFORCEMENT LAYER
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <MobileCard node={intercept} isSelected={selectedId === "intercept"} onClick={() => onNodeClick("intercept")} opacity={nodeOpacity("intercept")} delay={0.08} inView={inView} />
          <MobileArrow />
          <MobileCard node={verify} isSelected={selectedId === "verify"} onClick={() => onNodeClick("verify")} opacity={nodeOpacity("verify")} delay={0.16} inView={inView} />
          <MobileArrow />
          <MobileCard node={enforce} isSelected={selectedId === "enforce"} onClick={() => onNodeClick("enforce")} opacity={nodeOpacity("enforce")} delay={0.24} inView={inView} />
        </div>
      </div>

      <MobileArrow />
      <MobileCard node={tools} isSelected={selectedId === "tools"} onClick={() => onNodeClick("tools")} opacity={nodeOpacity("tools")} delay={0.32} inView={inView} />

      <div style={{ display: "flex", gap: 8, width: "100%", marginTop: 16 }}>
        <div style={{ flex: 1 }}>
          <MobileCard node={audit} isSelected={selectedId === "audit"} onClick={() => onNodeClick("audit")} opacity={nodeOpacity("audit")} delay={0.38} inView={inView} />
        </div>
        <div style={{ flex: 1 }}>
          <MobileCard node={policy} isSelected={selectedId === "policy"} onClick={() => onNodeClick("policy")} opacity={nodeOpacity("policy")} delay={0.44} inView={inView} />
        </div>
      </div>
    </div>
  );
}

function MobileCard({
  node,
  isSelected,
  onClick,
  opacity,
  delay,
  inView,
}: {
  node: ArchNode;
  isSelected: boolean;
  onClick: () => void;
  opacity: number;
  delay: number;
  inView: boolean;
}) {
  const Icon = node.icon;
  const isNeutral = node.accentColor === "#FFFFFF";
  const accent = isNeutral ? "rgba(255,255,255,0.4)" : node.accentColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: opacity, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: EASE }}
      style={{ width: "100%" }}
    >
      <div
        onClick={onClick}
        style={{
          width: "100%",
          background: isSelected ? "#1A1D22" : "#131517",
          border: `1px solid ${isSelected ? accent : isNeutral ? "rgba(255,255,255,0.06)" : node.accentColor + "20"}`,
          borderRadius: isSelected ? "6px 6px 0 0" : 6,
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          transition: "background 0.25s ease, border-color 0.25s ease, border-radius 0.2s ease",
        }}
      >
        <Icon size={15} color={accent} style={{ flexShrink: 0 }} />
        <div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12.5,
              fontWeight: 600,
              color: isSelected ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
            }}
          >
            {node.label}
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              color: "rgba(255,255,255,0.2)",
              marginTop: 2,
            }}
          >
            {node.subtitle}
          </div>
        </div>
      </div>

      {/* Inline expansion for mobile */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                background: "#0A0C0F",
                border: `1px solid ${isNeutral ? "rgba(255,255,255,0.06)" : node.accentColor + "25"}`,
                borderTop: `2px solid ${accent}`,
                borderRadius: "0 0 6px 6px",
                padding: "12px",
              }}
            >
              <pre
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  lineHeight: 1.5,
                  color: "rgba(255,255,255,0.5)",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {node.detailExample}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MobileArrow() {
  return (
    <div
      style={{
        height: 22,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.12)" }} />
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "3px solid transparent",
          borderRight: "3px solid transparent",
          borderTop: "4px solid rgba(255,255,255,0.12)",
        }}
      />
    </div>
  );
}
