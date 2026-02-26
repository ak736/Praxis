import { useState } from 'react';
import { Search } from 'lucide-react';
import { OutcomeBadge } from '../components/OutcomeBadge';
import type { ActionEntry } from '../data/simulation';
import type { Outcome } from '../data/scenarios';

type Filter = 'ALL' | Outcome;

function formatFull(ts: Date): string {
  return ts.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

interface AuditLogViewProps {
  entries: ActionEntry[];
}

export function AuditLogView({ entries }: AuditLogViewProps) {
  const [filter, setFilter] = useState<Filter>('ALL');
  const [search, setSearch] = useState('');

  const filtered = entries.filter((e) => {
    const matchOutcome = filter === 'ALL' || e.outcome === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      e.actionType.toLowerCase().includes(q) ||
      e.agent.toLowerCase().includes(q) ||
      e.policyMatched.toLowerCase().includes(q) ||
      e.traceId.toLowerCase().includes(q);
    return matchOutcome && matchSearch;
  });

  const filterDefs: { label: string; value: Filter; color: string }[] = [
    { label: 'ALL', value: 'ALL', color: 'rgba(255,255,255,0.6)' },
    { label: 'ALLOW', value: 'ALLOW', color: '#1AC8D2' },
    { label: 'BLOCK', value: 'BLOCK', color: '#D9532B' },
    { label: 'ESCALATE', value: 'ESCALATE', color: '#F5A623' },
  ];

  return (
    <div
      style={{
        background: '#151618',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 180px)',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '0 0 240px' }}>
          <Search
            size={13}
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }}
          />
          <input
            type="text"
            placeholder="Search agent, action, policy, trace…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 12px 7px 30px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '6px',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {filterDefs.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                padding: '5px 12px',
                borderRadius: '6px',
                border: `1px solid ${filter === f.value ? f.color : 'rgba(255,255,255,0.08)'}`,
                background: filter === f.value ? `${f.color}15` : 'transparent',
                color: filter === f.value ? f.color : 'rgba(255,255,255,0.35)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontFamily: 'JetBrains Mono, monospace' }}>
          {filtered.length} records
        </span>
      </div>

      {/* Table header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '160px 110px 130px 160px 100px 160px 56px',
          gap: '12px',
          padding: '8px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.01)',
        }}
      >
        {['TIMESTAMP', 'TRACE ID', 'AGENT', 'ACTION', 'OUTCOME', 'POLICY', 'LATENCY'].map((h) => (
          <span
            key={h}
            style={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.25)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Table rows */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {filtered.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>
            No matching audit records
          </div>
        )}
        {filtered.map((entry, i) => (
          <div
            key={entry.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '160px 110px 130px 160px 100px 160px 56px',
              gap: '12px',
              padding: '9px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
              alignItems: 'center',
            }}
          >
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
              {formatFull(entry.ts)}
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {entry.traceId}
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {entry.agent}
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {entry.actionType}
            </span>
            <OutcomeBadge outcome={entry.outcome} size="sm" />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {entry.policyMatched}
            </span>
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                color: entry.latencyMs < 1.5 ? '#1AC8D2' : 'rgba(255,255,255,0.4)',
                textAlign: 'right',
              }}
            >
              {entry.latencyMs}ms
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '8px 20px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono, monospace' }}>
          Immutable · Tamper-evident · SIEM-compatible (Splunk, Datadog, Elastic)
        </span>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono, monospace' }}>
          Retention: ∞
        </span>
      </div>
    </div>
  );
}
