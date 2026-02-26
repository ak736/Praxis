import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { OutcomeBadge } from './OutcomeBadge';
import type { PolicyDef } from '../data/scenarios';
import type { Outcome } from '../data/scenarios';

function syntaxHighlight(dsl: string): React.ReactNode[] {
  const keywords = ['policy', 'rule', 'when', 'effect', 'applies_to', 'tags', 'reason', 'notify', 'audit', 'version', 'escalate_to', 'sla_minutes', 'block_on_timeout', 'severity', 'log_level', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL', 'NOT NULL', 'CONTAINS'];
  const outcomes = ['ALLOW', 'BLOCK', 'ESCALATE', 'REQUIRED', 'CRITICAL', 'INFO', 'SENIOR'];

  const lines = dsl.split('\n');

  return lines.map((line, i) => {
    // Tokenize line for coloring
    let colored = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Color strings (quoted)
    colored = colored.replace(/"([^"]+)"/g, '<span style="color:#2BC37B">"$1"</span>');

    // Color outcomes
    outcomes.forEach((kw) => {
      colored = colored.replace(new RegExp(`\\b(${kw})\\b`, 'g'), '<span style="color:#F5A623;font-weight:600">$1</span>');
    });
    // Override ALLOW/BLOCK/ESCALATE
    colored = colored.replace(/\bALLOW\b/g, '<span style="color:#1AC8D2;font-weight:600">ALLOW</span>');
    colored = colored.replace(/\bBLOCK\b/g, '<span style="color:#D9532B;font-weight:600">BLOCK</span>');
    colored = colored.replace(/\bESCALATE\b/g, '<span style="color:#F5A623;font-weight:600">ESCALATE</span>');

    // Color keywords
    keywords.forEach((kw) => {
      colored = colored.replace(new RegExp(`\\b(${kw})\\b`, 'g'), '<span style="color:#1AC8D2">$1</span>');
    });

    // Color numbers
    colored = colored.replace(/\b(\d+)\b/g, '<span style="color:#A78BFA">$1</span>');

    return (
      <div key={i} dangerouslySetInnerHTML={{ __html: colored }} />
    );
  });
}

interface PolicyCardProps {
  policy: PolicyDef;
}

export function PolicyCard({ policy }: PolicyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(policy.active);

  return (
    <div
      style={{
        background: '#151618',
        border: `1px solid ${expanded ? 'rgba(26,200,210,0.2)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded((v) => !v)}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '13px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              {policy.name}
            </span>
            <OutcomeBadge outcome={policy.effect as Outcome} size="sm" />
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: active ? '#2BC37B' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
              }}
              onClick={(e) => { e.stopPropagation(); setActive((v) => !v); }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: active ? '#2BC37B' : 'rgba(255,255,255,0.2)',
                }}
              />
              {active ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
            {policy.description}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
            {policy.conditions.map((c, i) => (
              <span
                key={i}
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '4px',
                  padding: '2px 7px',
                  color: 'rgba(255,255,255,0.45)',
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0, marginTop: '2px' }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* DSL Code Block */}
      {expanded && (
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: '#0A0C0F',
            padding: '16px 20px',
            overflowX: 'auto',
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            {syntaxHighlight(policy.dsl)}
          </pre>
        </div>
      )}
    </div>
  );
}
