import { Shield } from 'lucide-react';
import { PolicyCard } from '../components/PolicyCard';
import type { ScenarioData } from '../data/scenarios';

interface PoliciesViewProps {
  scenario: ScenarioData;
}

export function PoliciesView({ scenario }: PoliciesViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div
        style={{
          background: '#151618',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(26,200,210,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Shield size={20} color="#1AC8D2" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
            Active Policy Ruleset — {scenario.label}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            {scenario.policies.length} policies loaded · Click any policy to expand the PRAXIS DSL
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#2BC37B', fontVariantNumeric: 'tabular-nums' }}>
              {scenario.policies.filter((p) => p.active).length}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>Active</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontVariantNumeric: 'tabular-nums' }}>
              {scenario.policies.filter((p) => !p.active).length}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>Inactive</div>
          </div>
        </div>
      </div>

      {/* DSL info banner */}
      <div
        style={{
          background: 'rgba(26,200,210,0.05)',
          border: '1px solid rgba(26,200,210,0.15)',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span style={{ fontSize: '12px', color: 'rgba(26,200,210,0.8)' }}>
          Policies authored in PRAXIS DSL are version-controlled, git-native, and hot-reloadable without agent restart.
          Import from OPA/Rego or write directly in the PRAXIS policy language.
        </span>
      </div>

      {/* Policy list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {scenario.policies.map((policy) => (
          <PolicyCard key={policy.id} policy={policy} />
        ))}
      </div>
    </div>
  );
}
