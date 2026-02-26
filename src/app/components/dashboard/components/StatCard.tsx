import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  accentColor?: string;
  trend?: { value: string; positive: boolean };
}

export function StatCard({ label, value, subtext, icon: Icon, accentColor = '#1AC8D2', trend }: StatCardProps) {
  return (
    <div
      style={{
        background: '#151618',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '24px',
          right: '24px',
          height: '2px',
          background: `linear-gradient(90deg, ${accentColor}80, transparent)`,
          borderRadius: '0 0 2px 2px',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: `${accentColor}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={16} color={accentColor} />
        </div>
      </div>

      <div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </div>
        {(subtext || trend) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            {subtext && (
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{subtext}</span>
            )}
            {trend && (
              <span
                style={{
                  fontSize: '11px',
                  color: trend.positive ? '#2BC37B' : '#D9532B',
                  fontWeight: 600,
                }}
              >
                {trend.positive ? '▲' : '▼'} {trend.value}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
