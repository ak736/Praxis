import React, { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Copy, Check, ChevronRight } from "lucide-react";

const EASE = [0.22, 0.9, 0.28, 1] as const;

const CODE = `// PRAXIS Policy DSL — v2.1
policy "financial.data.write" {
  version: "2.1.0"
  environment: ["prod", "staging"]

  rule allow_verified_agents {
    when {
      agent.tier == "enterprise"
      agent.mfa_verified == true
      action.scope in ["account.read", "transaction.create"]
    }
    effect: ALLOW
    audit: required
  }

  rule block_pii_exfiltration {
    when {
      action.output matches pii_pattern
      context.destination not in approved_endpoints
    }
    effect: BLOCK
    reason: "PII exfiltration policy violation"
    alert: "security-team@corp.com"
  }

  rule escalate_high_value {
    when {
      action.type == "transaction.create"
      action.params.amount > 50000
    }
    effect: ESCALATE
    to: "compliance-review"
    sla: "4h"
  }
}`;

type TabKey = "policy" | "decision" | "audit";

const tabs: { key: TabKey; label: string }[] = [
  { key: "policy", label: "policy.prx" },
  { key: "decision", label: "decision.json" },
  { key: "audit", label: "audit.log" },
];

const DECISION_CODE = `{
  "request_id": "req_9f3a2b1c",
  "timestamp": "2025-02-22T14:32:11.042Z",
  "agent_id": "agent_prod_007",
  "action": {
    "type": "transaction.create",
    "params": { "amount": 12500, "currency": "USD" }
  },
  "policy_version": "2.1.0",
  "evaluation": {
    "rules_evaluated": 3,
    "latency_ms": 1.2,
    "matched_rule": "allow_verified_agents",
    "effect": "ALLOW"
  },
  "audit_required": true
}`;

const AUDIT_CODE = `2025-02-22T14:32:11.043Z [ALLOW] req_9f3a2b1c
  agent=agent_prod_007  rule=allow_verified_agents
  action=transaction.create  amount=$12,500
  policy=financial.data.write@2.1.0
  decision_latency=1.2ms  audit=written

2025-02-22T14:32:09.871Z [BLOCK] req_8e2c1a09
  agent=agent_staging_03  rule=block_pii_exfiltration
  action=data.export  pattern=ssn_detected
  policy=financial.data.write@2.1.0
  reason="PII exfiltration policy violation"
  alert=dispatched`;

const codeMap: Record<TabKey, string> = {
  policy: CODE,
  decision: DECISION_CODE,
  audit: AUDIT_CODE,
};

export function PolicySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15%" });
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("policy");

  const handleCopy = () => {
    navigator.clipboard.writeText(codeMap[activeTab]).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section
      id="policy"
      ref={sectionRef}
      style={{
        background: "#151618",
        padding: "clamp(5rem, 10vw, 9rem) 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: "5rem",
            alignItems: "center",
          }}
          className="policy-grid"
        >
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
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
              Policy Authoring
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
              Rules that read
              <br />
              <em style={{ color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
                like language.
              </em>
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.45)",
                margin: "0 0 2rem 0",
                maxWidth: 400,
              }}
            >
              PRAXIS policies are authored in a declarative DSL designed for compliance teams and engineers alike. No Rego. No YAML sprawl. Just explicit, auditable rules that map directly to regulatory requirements.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "2.5rem" }}>
              {[
                "Git-native versioning with branch-per-environment",
                "Import from existing OPA / Rego policies",
                "Live policy reload — zero downtime",
                "Full decision trace per evaluation",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <ChevronRight
                    size={14}
                    color="#D9532B"
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.5,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 4,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(255,255,255,0.7)",
                padding: "10px 18px",
                transition: "all 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              }}
            >
              Read Policy Docs
              <ChevronRight size={13} />
            </button>
          </motion.div>

          {/* Right: Code block */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              position: "relative",
              border: `1px solid ${hovered ? "rgba(217,83,43,0.35)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 4,
              overflow: "hidden",
              transition: "border-color 0.3s ease",
              boxShadow: hovered ? "0 0 40px rgba(217,83,43,0.08)" : "none",
            }}
          >
            {/* Glow border */}
            {hovered && (
              <div
                style={{
                  position: "absolute",
                  inset: -1,
                  borderRadius: 4,
                  background: "linear-gradient(135deg, rgba(217,83,43,0.15), transparent 60%)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
            )}

            {/* Tab bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#0D0F12",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                padding: "0 16px",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div style={{ display: "flex" }}>
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      background: "none",
                      border: "none",
                      borderBottom: activeTab === tab.key ? "1.5px solid #D9532B" : "1.5px solid transparent",
                      cursor: "pointer",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      fontWeight: 500,
                      color: activeTab === tab.key ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)",
                      padding: "10px 14px",
                      transition: "all 0.18s ease",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopy}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  color: copied ? "#1AC8D2" : "rgba(255,255,255,0.35)",
                  padding: "6px 8px",
                  borderRadius: 2,
                  transition: "color 0.2s ease",
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {/* Code content */}
            <div
              style={{
                background: "#0D0F12",
                padding: "1.25rem 1.5rem",
                overflowX: "auto",
                position: "relative",
                zIndex: 1,
                maxHeight: 420,
                overflowY: "auto",
              }}
            >
              <pre
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.78rem",
                  lineHeight: 1.7,
                  margin: 0,
                  color: "rgba(255,255,255,0.7)",
                  whiteSpace: "pre",
                }}
              >
                <ColorizedCode code={codeMap[activeTab]} tabKey={activeTab} />
              </pre>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .policy-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}

function ColorizedCode({ code, tabKey }: { code: string; tabKey: TabKey }) {
  if (tabKey === "policy") {
    return (
      <>
        {code.split("\n").map((line, i) => {
          const isComment = line.trim().startsWith("//");
          const isKeyword = /^(policy|rule|when|effect|version|environment|reason|alert|to|sla|audit):?\s/.test(line.trim());
          const isValue = /:\s"/.test(line) || /:\s\[/.test(line) || /==|!=|>|<|in\s/.test(line);

          let color = "rgba(255,255,255,0.65)";
          if (isComment) color = "rgba(255,255,255,0.22)";
          else if (isKeyword) color = "rgba(26,200,210,0.85)";
          else if (line.includes("ALLOW") || line.includes("BLOCK") || line.includes("ESCALATE")) color = "#D9532B";

          return (
            <span key={i} style={{ display: "block", color }}>
              {line}
            </span>
          );
        })}
      </>
    );
  }

  if (tabKey === "decision") {
    return (
      <>
        {code.split("\n").map((line, i) => {
          const isKey = /"[^"]+":/.test(line);
          const isAllow = line.includes('"ALLOW"');
          const isBlock = line.includes('"BLOCK"');
          let color = "rgba(255,255,255,0.6)";
          if (isAllow) color = "#1AC8D2";
          if (isBlock) color = "#D9532B";
          if (isKey && !isAllow && !isBlock) color = "rgba(255,255,255,0.5)";

          return (
            <span key={i} style={{ display: "block", color }}>
              {line}
            </span>
          );
        })}
      </>
    );
  }

  return (
    <>
      {code.split("\n").map((line, i) => {
        const isAllow = line.includes("[ALLOW]");
        const isBlock = line.includes("[BLOCK]");
        const isIndented = line.startsWith("  ");
        let color = "rgba(255,255,255,0.5)";
        if (isAllow) color = "#1AC8D2";
        if (isBlock) color = "#D9532B";
        if (isIndented) color = "rgba(255,255,255,0.3)";

        return (
          <span key={i} style={{ display: "block", color }}>
            {line}
          </span>
        );
      })}
    </>
  );
}
