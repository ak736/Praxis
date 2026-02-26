import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { SimStats } from '../data/simulation';

const COLORS = {
  ALLOW: '#1AC8D2',
  BLOCK: '#D9532B',
  ESCALATE: '#F5A623',
};

interface TooltipPayload {
  name: string;
  value: number;
  payload: { color: string };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div
      style={{
        background: '#1a1c1f',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '8px 12px',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '12px',
        color: item.payload.color,
      }}
    >
      <strong>{item.name}</strong>: {item.value.toLocaleString()}
    </div>
  );
}

interface EnforcementChartProps {
  stats: SimStats;
  historicalStats: { total: number; blocked: number; escalated: number };
}

export function EnforcementChart({ stats, historicalStats }: EnforcementChartProps) {
  const data = [
    { name: 'ALLOW', value: stats.allowed + (historicalStats.total - historicalStats.blocked - historicalStats.escalated) },
    { name: 'BLOCK', value: stats.blocked + historicalStats.blocked },
    { name: 'ESCALATE', value: stats.escalated + historicalStats.escalated },
  ];

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '24px' }}>
      <div style={{ width: 140, height: 140, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={42}
              outerRadius={62}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {data.map((item) => {
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
          const color = COLORS[item.name as keyof typeof COLORS];
          return (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color, minWidth: '72px', fontWeight: 600 }}>
                {item.name}
              </span>
              <div
                style={{
                  flex: 1,
                  height: '4px',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: color,
                    borderRadius: '2px',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.4)', minWidth: '36px', textAlign: 'right' }}>
                {pct}%
              </span>
            </div>
          );
        })}
        <div style={{ marginTop: '4px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>
            {total.toLocaleString()} total decisions
          </span>
        </div>
      </div>
    </div>
  );
}
