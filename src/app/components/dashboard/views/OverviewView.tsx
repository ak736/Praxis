import { Activity, ShieldX, AlertTriangle, Zap } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { EnforcementChart } from '../components/EnforcementChart';
import { ActionEntryRow } from '../components/ActionEntry';
import { OutcomeBadge } from '../components/OutcomeBadge';
import type { SimStats, ActionEntry } from '../data/simulation';
import type { ScenarioData } from '../data/scenarios';

interface OverviewViewProps {
  stats: SimStats;
  entries: ActionEntry[];
  scenario: ScenarioData;
}

export function OverviewView({ stats, entries, scenario }: OverviewViewProps) {
  const hist = scenario.stats24h;
  const totalActions = (hist.total + stats.total).toLocaleString();
  const blocked = (hist.blocked + stats.blocked).toLocaleString();
  const escalated = (hist.escalated + stats.escalated).toLocaleString();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <StatCard
          label="Actions (24h)"
          value={totalActions}
          icon={Activity}
          accentColor="#1AC8D2"
          subtext="intercepted"
          trend={{ value: '12.4%', positive: true }}
        />
        <StatCard
          label="Blocked"
          value={blocked}
          icon={ShieldX}
          accentColor="#D9532B"
          subtext={`${((hist.blocked + stats.blocked) / (hist.total + stats.total) * 100).toFixed(1)}% of total`}
        />
        <StatCard
          label="Escalated"
          value={escalated}
          icon={AlertTriangle}
          accentColor="#F5A623"
          subtext="pending human review"
        />
        <StatCard
          label="Avg Latency"
          value={`${stats.avgLatency || hist.avgLatency}ms`}
          icon={Zap}
          accentColor="#2BC37B"
          subtext="P99 evaluation"
          trend={{ value: '0.2ms', positive: true }}
        />
      </div>

      {/* Chart + recent feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '16px' }}>
        {/* Enforcement breakdown */}
        <div
          style={{
            background: '#151618',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            padding: '20px 24px',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Enforcement Breakdown
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
              Live + 24h historical data
            </p>
          </div>
          <EnforcementChart stats={stats} historicalStats={hist} />
        </div>

        {/* Recent actions */}
        <div
          style={{
            background: '#151618',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Live Action Feed
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#1AC8D2',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <span style={{ fontSize: '11px', color: '#1AC8D2', fontFamily: 'JetBrains Mono, monospace' }}>LIVE</span>
              </div>
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
            }}
          >
            {['TIME', 'AGENT', 'ACTION', 'PAYLOAD', 'OUTCOME', 'POLICY', 'LATENCY'].map((h) => (
              <span key={h} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontWeight: 600, letterSpacing: '0.08em', fontFamily: 'JetBrains Mono, monospace' }}>
                {h}
              </span>
            ))}
          </div>

          <div style={{ overflowY: 'auto', maxHeight: '280px' }}>
            {entries.slice(0, 8).map((entry, i) => (
              <ActionEntryRow key={entry.id} entry={entry} isNew={i === 0} />
            ))}
          </div>
        </div>
      </div>

      {/* Recent policy violations */}
      <div
        style={{
          background: '#151618',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px',
          padding: '20px 24px',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Recent Policy Violations
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {entries
            .filter((e) => e.outcome === 'BLOCK' || e.outcome === 'ESCALATE')
            .slice(0, 5)
            .map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                }}
              >
                <OutcomeBadge outcome={entry.outcome} size="sm" />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
                  {entry.actionType}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
                  {entry.agent}
                </span>
                <span
                  style={{
                    marginLeft: 'auto',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '4px',
                    padding: '2px 7px',
                    color: 'rgba(255,255,255,0.4)',
                  }}
                >
                  {entry.policyMatched}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                  {entry.latencyMs}ms
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
