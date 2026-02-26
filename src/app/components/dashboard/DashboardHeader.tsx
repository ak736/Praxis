import { useState, useEffect } from 'react';
import type { ScenarioData } from './data/scenarios';
import type { DashboardView } from './Sidebar';

const VIEW_LABELS: Record<DashboardView, string> = {
  overview: 'Overview',
  workflow: 'Workflow Demo',
  escalations: 'Escalations',
  feed: 'Action Feed',
  policies: 'Policies',
  audit: 'Audit Log',
};

const VIEW_DESCRIPTIONS: Record<DashboardView, string> = {
  overview: 'Real-time enforcement metrics and live action stream',
  workflow: 'Step-by-step simulation of how PRAXIS intercepts and evaluates agent actions',
  escalations: 'Frozen agent actions awaiting human review — approve or reject to resolve',
  feed: 'Live stream of all intercepted agent actions and decisions',
  policies: 'Active policy ruleset — PRAXIS DSL definitions',
  audit: 'Immutable audit log of all enforcement decisions',
};

interface DashboardHeaderProps {
  view: DashboardView;
  scenario: ScenarioData;
  isLive: boolean;
}

export function DashboardHeader({ view, scenario, isLive }: DashboardHeaderProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header
      style={{
        padding: '16px 28px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        background: '#0F1114',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>
            Dashboard
          </span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>/</span>
          <span
            style={{
              fontSize: '11px',
              color: scenario.color,
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 500,
            }}
          >
            {scenario.label}
          </span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>/</span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>
            {VIEW_LABELS[view]}
          </span>
        </div>
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#fff' }}>
          {VIEW_LABELS[view]}
        </h1>
        <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
          {VIEW_DESCRIPTIONS[view]}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Agents badge */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '2px', letterSpacing: '0.06em' }}>ACTIVE AGENTS</div>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
            {scenario.agents.map((agent) => (
              <span
                key={agent}
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '4px',
                  padding: '2px 7px',
                  color: 'rgba(255,255,255,0.5)',
                  whiteSpace: 'nowrap',
                }}
              >
                {agent}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.08)' }} />

        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '6px',
              background: isLive ? 'rgba(26,200,210,0.08)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isLive ? 'rgba(26,200,210,0.2)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: isLive ? '#1AC8D2' : 'rgba(255,255,255,0.2)',
                display: 'inline-block',
              }}
            />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: isLive ? '#1AC8D2' : 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
              {isLive ? 'LIVE' : 'PAUSED'}
            </span>
          </div>

          {/* Clock */}
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'rgba(255,255,255,0.3)', minWidth: '80px' }}>
            {now.toLocaleTimeString('en-US', { hour12: false })}
          </span>
        </div>
      </div>
    </header>
  );
}
