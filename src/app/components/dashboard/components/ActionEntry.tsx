import { OutcomeBadge } from './OutcomeBadge';
import type { ActionEntry as ActionEntryType } from '../data/simulation';

function formatTs(ts: Date): string {
  return ts.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function payloadPreview(payload: Record<string, unknown>): string {
  const entries = Object.entries(payload).slice(0, 3);
  return entries.map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('  ·  ');
}

interface ActionEntryProps {
  entry: ActionEntryType;
  isNew?: boolean;
}

export function ActionEntryRow({ entry, isNew }: ActionEntryProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '72px 140px 180px 1fr 100px 160px 56px',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: isNew ? 'rgba(26,200,210,0.03)' : 'transparent',
        transition: 'background 0.5s',
        minWidth: 0,
      }}
    >
      {/* Timestamp */}
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
        {formatTs(entry.ts)}
      </span>

      {/* Agent */}
      <span
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.6)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {entry.agent}
      </span>

      {/* Action type */}
      <span
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.85)',
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {entry.actionType}
      </span>

      {/* Payload preview */}
      <span
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.28)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        title={JSON.stringify(entry.payload, null, 2)}
      >
        {payloadPreview(entry.payload)}
      </span>

      {/* Outcome badge */}
      <div>
        <OutcomeBadge outcome={entry.outcome} size="sm" />
      </div>

      {/* Policy */}
      <span
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.35)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {entry.policyMatched}
      </span>

      {/* Latency */}
      <span
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          color: entry.latencyMs < 1.5 ? '#1AC8D2' : 'rgba(255,255,255,0.5)',
          textAlign: 'right',
          whiteSpace: 'nowrap',
        }}
      >
        {entry.latencyMs}ms
      </span>
    </div>
  );
}
