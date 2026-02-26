import { useState, useEffect, useRef } from 'react';
import { Pause, Play } from 'lucide-react';
import { ActionEntryRow } from '../components/ActionEntry';
import { OutcomeBadge } from '../components/OutcomeBadge';
import type { ActionEntry } from '../data/simulation';
import type { Outcome } from '../data/scenarios';

type Filter = 'ALL' | Outcome;

interface ActionFeedViewProps {
  entries: ActionEntry[];
  isLive: boolean;
  toggleLive: () => void;
}

export function ActionFeedView({ entries, isLive, toggleLive }: ActionFeedViewProps) {
  const [filter, setFilter] = useState<Filter>('ALL');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const filtered = filter === 'ALL' ? entries : entries.filter((e) => e.outcome === filter);

  useEffect(() => {
    if (autoScroll && isLive && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [entries, autoScroll, isLive]);

  const filters: { label: string; value: Filter; color: string }[] = [
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
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {filters.map((f) => (
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
              {f.value !== 'ALL' && (
                <span style={{ marginLeft: '6px', opacity: 0.6 }}>
                  {entries.filter((e) => e.outcome === f.value).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Auto-scroll toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              style={{ accentColor: '#1AC8D2' }}
            />
            Auto-scroll
          </label>

          {/* Live toggle */}
          <button
            onClick={toggleLive}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '6px',
              border: `1px solid ${isLive ? '#1AC8D2' : 'rgba(255,255,255,0.12)'}`,
              background: isLive ? 'rgba(26,200,210,0.1)' : 'rgba(255,255,255,0.04)',
              color: isLive ? '#1AC8D2' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {isLive ? <Pause size={12} /> : <Play size={12} />}
            {isLive ? 'LIVE' : 'PAUSED'}
          </button>
        </div>
      </div>

      {/* Column headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '72px 140px 180px 1fr 100px 160px 56px',
          gap: '12px',
          padding: '8px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.01)',
        }}
      >
        {['TIME', 'AGENT', 'ACTION', 'PAYLOAD', 'OUTCOME', 'POLICY', 'LATENCY'].map((h) => (
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

      {/* Entries */}
      <div ref={scrollRef} style={{ overflowY: 'auto', flex: 1 }}>
        {filtered.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>
            No entries for this filter
          </div>
        )}
        {filtered.map((entry, i) => (
          <ActionEntryRow key={entry.id} entry={entry} isNew={i === 0 && isLive} />
        ))}
      </div>

      {/* Footer count */}
      <div
        style={{
          padding: '8px 16px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontFamily: 'JetBrains Mono, monospace' }}>
          Showing {filtered.length} of {entries.length} entries (last 100)
        </span>
        {!isLive && (
          <span style={{ fontSize: '11px', color: '#F5A623', fontFamily: 'JetBrains Mono, monospace' }}>
            ⏸ Stream paused
          </span>
        )}
      </div>
    </div>
  );
}
