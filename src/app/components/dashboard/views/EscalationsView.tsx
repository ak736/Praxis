import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import type { PendingEscalation } from '../data/simulation';

function useCountdown(expiresAt: Date) {
  const [remaining, setRemaining] = useState(() => Math.max(0, expiresAt.getTime() - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(Math.max(0, expiresAt.getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const totalMs = 3 * 60 * 1000;
  const pct = (remaining / totalMs) * 100;
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const label = remaining <= 0 ? 'EXPIRED' : `${mins}:${secs.toString().padStart(2, '0')}`;
  const urgent = remaining < 60000 && remaining > 0;
  return { label, pct, urgent, expired: remaining <= 0 };
}

interface EscalationCardProps {
  item: PendingEscalation;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

function EscalationCard({ item, onApprove, onReject }: EscalationCardProps) {
  const { label, pct, urgent, expired } = useCountdown(item.expiresAt);
  const [decided, setDecided] = useState<'approve' | 'reject' | null>(null);

  function handleApprove() {
    setDecided('approve');
    setTimeout(() => onApprove(item.id), 500);
  }
  function handleReject() {
    setDecided('reject');
    setTimeout(() => onReject(item.id), 500);
  }

  const borderColor = urgent ? 'rgba(245,166,35,0.3)' : 'rgba(255,255,255,0.08)';

  return (
    <div
      style={{
        background: '#151618',
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        overflow: 'hidden',
        opacity: decided ? 0.5 : 1,
        transition: 'opacity 0.4s',
      }}
    >
      {/* Top bar — SLA timer */}
      <div
        style={{
          height: '3px',
          background: 'rgba(255,255,255,0.06)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${pct}%`,
            background: urgent ? '#D9532B' : '#F5A623',
            transition: 'width 1s linear, background 0.3s',
          }}
        />
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <AlertTriangle size={14} color="#F5A623" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                Action pending human review
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#F5A623',
                  background: 'rgba(245,166,35,0.1)',
                  border: '1px solid rgba(245,166,35,0.2)',
                  borderRadius: '4px',
                  padding: '2px 8px',
                }}
              >
                ESCALATE
              </span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.6)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '4px',
                  padding: '2px 8px',
                }}
              >
                {item.actionType}
              </span>
            </div>
          </div>

          {/* SLA countdown */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'flex-end', marginBottom: '2px' }}>
              <Clock size={11} color={urgent ? '#D9532B' : '#F5A623'} />
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: urgent ? '#D9532B' : '#F5A623',
                  letterSpacing: '0.04em',
                }}
              >
                {label}
              </span>
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
              SLA: {item.slaMinutes}min (demo: 3min)
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            padding: '12px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '8px',
            marginBottom: '14px',
          }}
        >
          {[
            { label: 'Agent', value: item.agent },
            { label: 'Policy', value: item.policyMatched },
            { label: 'Latency', value: `${item.latencyMs}ms` },
            { label: 'Escalate To', value: item.escalateTo },
            { label: 'Trace ID', value: item.traceId },
            { label: 'Received', value: item.ts.toLocaleTimeString('en-US', { hour12: false }) },
          ].map((d) => (
            <div key={d.label}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '2px', letterSpacing: '0.06em' }}>
                {d.label}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {d.value}
              </div>
            </div>
          ))}
        </div>

        {/* Payload */}
        <div
          style={{
            padding: '8px 12px',
            background: '#0A0C0F',
            borderRadius: '6px',
            marginBottom: '14px',
            overflowX: 'auto',
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.45)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {JSON.stringify(item.payload, null, 2)}
          </pre>
        </div>

        {/* Action buttons */}
        {decided ? (
          <div
            style={{
              padding: '10px',
              borderRadius: '6px',
              textAlign: 'center',
              background: decided === 'approve' ? 'rgba(43,195,123,0.08)' : 'rgba(217,83,43,0.08)',
              border: `1px solid ${decided === 'approve' ? 'rgba(43,195,123,0.2)' : 'rgba(217,83,43,0.2)'}`,
              color: decided === 'approve' ? '#2BC37B' : '#D9532B',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {decided === 'approve' ? '✓ Approved — trade executing' : '✗ Rejected — action blocked'}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={handleApprove}
              disabled={expired}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(43,195,123,0.3)',
                background: 'rgba(43,195,123,0.08)',
                color: expired ? 'rgba(255,255,255,0.2)' : '#2BC37B',
                cursor: expired ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '13px',
                transition: 'all 0.15s',
              }}
            >
              <CheckCircle size={15} />
              Approve
            </button>
            <button
              onClick={handleReject}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(217,83,43,0.3)',
                background: 'rgba(217,83,43,0.08)',
                color: '#D9532B',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
                transition: 'all 0.15s',
              }}
            >
              <XCircle size={15} />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface EscalationsViewProps {
  pendingEscalations: PendingEscalation[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function EscalationsView({ pendingEscalations, onApprove, onReject }: EscalationsViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div
        style={{
          background: 'rgba(245,166,35,0.06)',
          border: '1px solid rgba(245,166,35,0.15)',
          borderRadius: '10px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <AlertTriangle size={18} color="#F5A623" />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
            Human Review Queue
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
            These AI agent actions were frozen by PRAXIS — they require your approval before executing.
            Actions auto-block after the SLA expires.
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#F5A623', lineHeight: 1 }}>
            {pendingEscalations.length}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>pending</div>
        </div>
      </div>

      {/* Cards */}
      {pendingEscalations.length === 0 ? (
        <div
          style={{
            padding: '60px',
            textAlign: 'center',
            background: '#151618',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
          }}
        >
          <CheckCircle size={32} color="rgba(43,195,123,0.4)" style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
            No pending escalations
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginTop: '6px' }}>
            All agent actions are within policy bounds or have been reviewed.
            New escalations appear here automatically.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pendingEscalations.map((item) => (
            <EscalationCard key={item.id} item={item} onApprove={onApprove} onReject={onReject} />
          ))}
        </div>
      )}
    </div>
  );
}
