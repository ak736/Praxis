import type { Outcome } from '../data/scenarios';

const CONFIG: Record<Outcome, { label: string; bg: string; color: string; dot: string }> = {
  ALLOW: {
    label: 'ALLOW',
    bg: 'rgba(26,200,210,0.12)',
    color: '#1AC8D2',
    dot: '#1AC8D2',
  },
  BLOCK: {
    label: 'BLOCK',
    bg: 'rgba(217,83,43,0.12)',
    color: '#D9532B',
    dot: '#D9532B',
  },
  ESCALATE: {
    label: 'ESCALATE',
    bg: 'rgba(245,166,35,0.12)',
    color: '#F5A623',
    dot: '#F5A623',
  },
};

interface OutcomeBadgeProps {
  outcome: Outcome;
  size?: 'sm' | 'md';
}

export function OutcomeBadge({ outcome, size = 'md' }: OutcomeBadgeProps) {
  const cfg = CONFIG[outcome];
  const fontSize = size === 'sm' ? '10px' : '11px';
  const padding = size === 'sm' ? '2px 6px' : '3px 8px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.color}30`,
        borderRadius: '4px',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize,
        fontWeight: 600,
        padding,
        whiteSpace: 'nowrap',
        letterSpacing: '0.04em',
      }}
    >
      <span
        style={{
          width: size === 'sm' ? '5px' : '6px',
          height: size === 'sm' ? '5px' : '6px',
          borderRadius: '50%',
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}
