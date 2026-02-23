import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Play, CheckCircle, XCircle, Clock } from "lucide-react";

const EASE = [0.22, 0.9, 0.28, 1] as const;

interface Decision {
  action: string;
  result: "ALLOW" | "BLOCK" | "ESCALATE";
  latency: string;
  rule: string;
}

const scenarios: Decision[] = [
  {
    action: 'transaction.create({ amount: 4200, currency: "USD" })',
    result: "ALLOW",
    latency: "0.9ms",
    rule: "allow_verified_agents",
  },
  {
    action: 'data.export({ fields: ["ssn", "dob", "email"] })',
    result: "BLOCK",
    latency: "1.1ms",
    rule: "block_pii_exfiltration",
  },
  {
    action: 'transaction.create({ amount: 87500, currency: "USD" })',
    result: "ESCALATE",
    latency: "1.4ms",
    rule: "escalate_high_value",
  },
  {
    action: 'account.read({ user_id: "usr_prod_221", scope: "balance" })',
    result: "ALLOW",
    latency: "0.7ms",
    rule: "allow_verified_agents",
  },
];

export function LiveDemo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15%" });
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<(Decision & { ts: string })[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runDemo = () => {
    if (running) return;
    setLog([]);
    setRunning(true);
    setCurrentIdx(0);
  };

  useEffect(() => {
    if (!running) return;

    let idx = 0;
    const addEntry = () => {
      if (idx >= scenarios.length) {
        setRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      const entry = scenarios[idx];
      const now = new Date();
      const ts = `${now.toISOString().slice(11, 23)}`;
      setLog((prev) => [{ ...entry, ts }, ...prev]);
      setCurrentIdx(idx);
      idx++;
    };

    addEntry();
    intervalRef.current = setInterval(addEntry, 1400);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const resultColor = {
    ALLOW: "#1AC8D2",
    BLOCK: "#D9532B",
    ESCALATE: "#F5A623",
  };

  const ResultIcon = ({ result }: { result: "ALLOW" | "BLOCK" | "ESCALATE" }) => {
    if (result === "ALLOW") return <CheckCircle size={12} color="#1AC8D2" />;
    if (result === "BLOCK") return <XCircle size={12} color="#D9532B" />;
    return <Clock size={12} color="#F5A623" />;
  };

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#0F1114",
        padding: "clamp(5rem, 10vw, 9rem) 1.5rem",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: "5rem",
            alignItems: "center",
          }}
          className="demo-grid"
        >
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
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
              Live Enforcement
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                fontWeight: 500,
                lineHeight: 1.2,
                color: "#FFFFFF",
                margin: "0 0 1.5rem 0",
                letterSpacing: "-0.01em",
              }}
            >
              Every decision.
              <br />
              <em style={{ color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
                Sub-millisecond.
              </em>
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.42)",
                margin: "0 0 2.5rem 0",
                maxWidth: 380,
              }}
            >
              Watch PRAXIS evaluate agent actions in real time — allowing compliant actions, blocking violations, and escalating edge cases — all within your SLA.
            </p>

            <button
              onClick={runDemo}
              disabled={running}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: running ? "rgba(217,83,43,0.2)" : "#D9532B",
                border: "1px solid rgba(217,83,43,0.5)",
                borderRadius: 4,
                cursor: running ? "not-allowed" : "pointer",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                padding: "11px 22px",
                opacity: running ? 0.7 : 1,
                transition: "all 0.18s ease",
              }}
              onMouseEnter={(e) => {
                if (!running) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(217,83,43,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Play size={13} />
              {running ? "Running..." : "Run Demo"}
            </button>
          </motion.div>

          {/* Right: Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 4,
              overflow: "hidden",
              background: "#080A0C",
            }}
          >
            {/* Terminal header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#0D0F12",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                padding: "10px 14px",
              }}
            >
              <div style={{ display: "flex", gap: 5 }}>
                {["#D9532B", "#F5A623", "#1AC8D2"].map((c, i) => (
                  <div
                    key={i}
                    style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.6 }}
                  />
                ))}
              </div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.2)",
                  marginLeft: 4,
                  letterSpacing: "0.06em",
                }}
              >
                praxis-enforcement-log
              </span>
              {running && (
                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#D9532B",
                      animation: "pulse-dot 1s ease infinite",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9,
                      color: "#D9532B",
                      letterSpacing: "0.06em",
                    }}
                  >
                    LIVE
                  </span>
                </div>
              )}
            </div>

            {/* Log area */}
            <div
              style={{
                minHeight: 280,
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                overflow: "hidden",
              }}
            >
              {log.length === 0 && !running && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 240,
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <Play size={18} color="rgba(255,255,255,0.12)" />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: "rgba(255,255,255,0.15)",
                    }}
                  >
                    Press "Run Demo" to start
                  </span>
                </div>
              )}

              <AnimatePresence mode="popLayout">
                {log.map((entry, i) => (
                  <motion.div
                    key={`${entry.ts}-${i}`}
                    initial={{ opacity: 0, x: -16, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    transition={{ duration: 0.35, ease: [0.22, 0.9, 0.28, 1] }}
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      border: `1px solid ${resultColor[entry.result]}20`,
                      borderLeft: `2px solid ${resultColor[entry.result]}`,
                      borderRadius: 2,
                      padding: "8px 10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 4,
                      }}
                    >
                      <ResultIcon result={entry.result} />
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 11,
                          fontWeight: 600,
                          color: resultColor[entry.result],
                          letterSpacing: "0.08em",
                        }}
                      >
                        {entry.result}
                      </span>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 9,
                          color: "rgba(255,255,255,0.2)",
                          marginLeft: "auto",
                        }}
                      >
                        {entry.ts}
                      </span>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 9,
                          color: "rgba(255,255,255,0.25)",
                          background: "rgba(255,255,255,0.05)",
                          padding: "1px 5px",
                          borderRadius: 1,
                        }}
                      >
                        {entry.latency}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        color: "rgba(255,255,255,0.45)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {entry.action}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 10,
                        color: "rgba(255,255,255,0.2)",
                        marginTop: 2,
                      }}
                    >
                      matched: {entry.rule}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @media (max-width: 767px) {
          .demo-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
