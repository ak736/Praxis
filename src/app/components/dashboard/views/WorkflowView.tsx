import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { OutcomeBadge } from '../components/OutcomeBadge';

// ─── Scenario definitions ────────────────────────────────────────────────────

interface WorkflowStep {
  side: 'agent' | 'praxis';
  type: 'log' | 'decision' | 'action' | 'waiting' | 'resolved';
  text: string;
  highlight?: string;
  delay: number; // ms from start
}

interface WorkflowScenario {
  id: string;
  title: string;
  subtitle: string;
  outcome: 'ALLOW' | 'BLOCK' | 'ESCALATE';
  color: string;
  agentName: string;
  actionType: string;
  payload: Record<string, string | number>;
  steps: WorkflowStep[];
}

const SCENARIOS: WorkflowScenario[] = [
  // ── ALLOW ──────────────────────────────────────────────────────────────────
  {
    id: 'allow',
    title: 'Standard Trade',
    subtitle: '$4,200 AAPL buy — within all policy limits',
    outcome: 'ALLOW',
    color: '#1AC8D2',
    agentName: 'TradeBot-v2',
    actionType: 'transaction.create',
    payload: { amount: 4200, currency: 'USD', instrument: 'AAPL', side: 'BUY', accountId: 'ACC-00291' },
    steps: [
      { side: 'agent', type: 'log', text: 'Received signal: BUY AAPL @ market price', delay: 0 },
      { side: 'agent', type: 'log', text: 'Evaluating order parameters...', delay: 600 },
      { side: 'agent', type: 'action', text: 'Sending action to PRAXIS for enforcement check', highlight: 'transaction.create  ·  $4,200  ·  AAPL  ·  BUY', delay: 1200 },
      { side: 'praxis', type: 'log', text: 'Action intercepted — evaluating against ruleset', delay: 1600 },
      { side: 'praxis', type: 'log', text: 'Checking TRANSACTION_LIMIT → $4,200 < $10,000 ✓', delay: 2000 },
      { side: 'praxis', type: 'log', text: 'Checking TRADING_HOURS → 10:32 ET, weekday ✓', delay: 2500 },
      { side: 'praxis', type: 'log', text: 'Checking KYC_REQUIRED → status: VERIFIED ✓', delay: 3000 },
      { side: 'praxis', type: 'log', text: 'Checking MAX_POSITION_SIZE → $4,200 < $30,000 ✓', delay: 3500 },
      { side: 'praxis', type: 'decision', text: 'All policies passed — decision: ALLOW (1.4ms)', highlight: 'ALLOW', delay: 4100 },
      { side: 'agent', type: 'log', text: 'PRAXIS response received: ALLOW', delay: 4500 },
      { side: 'agent', type: 'resolved', text: 'Executing trade — BUY 28 shares AAPL @ $148.72', delay: 5000 },
    ],
  },

  // ── BLOCK ───────────────────────────────────────────────────────────────────
  {
    id: 'block',
    title: 'Oversized Position',
    subtitle: '$72,000 TSLA long — exceeds MAX_POSITION_SIZE hard limit',
    outcome: 'BLOCK',
    color: '#D9532B',
    agentName: 'TradeBot-v2',
    actionType: 'position.open',
    payload: { symbol: 'TSLA', notional: 72000, side: 'LONG', leverage: 2, accountId: 'ACC-00291' },
    steps: [
      { side: 'agent', type: 'log', text: 'Strategy signal: open leveraged long on TSLA', delay: 0 },
      { side: 'agent', type: 'log', text: 'Calculating notional: $72,000 (2x leverage)', delay: 600 },
      { side: 'agent', type: 'action', text: 'Sending action to PRAXIS for enforcement check', highlight: 'position.open  ·  $72,000  ·  TSLA  ·  LONG  ·  2x', delay: 1200 },
      { side: 'praxis', type: 'log', text: 'Action intercepted — evaluating against ruleset', delay: 1600 },
      { side: 'praxis', type: 'log', text: 'Checking TRADING_HOURS → 11:14 ET, weekday ✓', delay: 2100 },
      { side: 'praxis', type: 'log', text: 'Checking MAX_POSITION_SIZE → notional: $72,000', delay: 2600 },
      { side: 'praxis', type: 'log', text: 'Rule violation: $72,000 > $50,000 hard limit', highlight: 'MAX_POSITION_SIZE VIOLATED', delay: 3100 },
      { side: 'praxis', type: 'decision', text: 'Policy breach — decision: BLOCK (1.8ms)', highlight: 'BLOCK', delay: 3700 },
      { side: 'praxis', type: 'log', text: 'Alert sent → risk-desk@apexcapital.com', delay: 4100 },
      { side: 'praxis', type: 'log', text: 'Audit record written — trace: PRX-A9F3C1', delay: 4500 },
      { side: 'agent', type: 'log', text: 'PRAXIS response received: BLOCK', delay: 5000 },
      { side: 'agent', type: 'resolved', text: 'Action cancelled — policy MAX_POSITION_SIZE. Notifying portfolio manager.', delay: 5400 },
    ],
  },

  // ── ESCALATE ────────────────────────────────────────────────────────────────
  {
    id: 'escalate',
    title: 'Borderline Position',
    subtitle: '$38,000 MSFT long — within escalation band, frozen for human review',
    outcome: 'ESCALATE',
    color: '#F5A623',
    agentName: 'PortfolioManager',
    actionType: 'position.open',
    payload: { symbol: 'MSFT', notional: 38000, side: 'LONG', leverage: 1, accountId: 'ACC-00184' },
    steps: [
      { side: 'agent', type: 'log', text: 'Rebalancing portfolio — opening MSFT position', delay: 0 },
      { side: 'agent', type: 'log', text: 'Calculating notional: $38,000 (1x leverage)', delay: 600 },
      { side: 'agent', type: 'action', text: 'Sending action to PRAXIS for enforcement check', highlight: 'position.open  ·  $38,000  ·  MSFT  ·  LONG', delay: 1200 },
      { side: 'praxis', type: 'log', text: 'Action intercepted — evaluating against ruleset', delay: 1600 },
      { side: 'praxis', type: 'log', text: 'Checking TRADING_HOURS → 14:22 ET, weekday ✓', delay: 2100 },
      { side: 'praxis', type: 'log', text: 'Checking MAX_POSITION_SIZE → notional: $38,000', delay: 2600 },
      { side: 'praxis', type: 'log', text: 'Escalation band triggered: $30,000–$50,000 range', highlight: 'ESCALATION BAND: $30K–$50K', delay: 3100 },
      { side: 'praxis', type: 'decision', text: 'Action frozen — decision: ESCALATE (1.6ms)', highlight: 'ESCALATE', delay: 3700 },
      { side: 'praxis', type: 'log', text: 'Routing to: senior-trader  ·  SLA: 15 minutes', delay: 4100 },
      { side: 'agent', type: 'waiting', text: 'PRAXIS response received: ESCALATE — trade frozen, awaiting senior-trader approval', delay: 4600 },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

type EscalationDecision = 'approve' | 'reject' | null;

export function WorkflowView() {
  const [activeScenario, setActiveScenario] = useState<WorkflowScenario>(SCENARIOS[0]);
  const [visibleSteps, setVisibleSteps] = useState<WorkflowStep[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [escalationDecision, setEscalationDecision] = useState<EscalationDecision>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  function runScenario(scenario: WorkflowScenario) {
    clearTimers();
    setVisibleSteps([]);
    setRunning(true);
    setDone(false);
    setEscalationDecision(null);

    scenario.steps.forEach((step) => {
      const t = setTimeout(() => {
        setVisibleSteps((prev) => [...prev, step]);
      }, step.delay);
      timersRef.current.push(t);
    });

    const totalDuration = Math.max(...scenario.steps.map((s) => s.delay)) + 800;
    const endTimer = setTimeout(() => {
      setRunning(false);
      setDone(true);
    }, totalDuration);
    timersRef.current.push(endTimer);
  }

  function reset() {
    clearTimers();
    setVisibleSteps([]);
    setRunning(false);
    setDone(false);
    setEscalationDecision(null);
  }

  function handleScenarioSelect(scenario: WorkflowScenario) {
    reset();
    setActiveScenario(scenario);
  }

  function handleEscalationDecision(decision: 'approve' | 'reject') {
    setEscalationDecision(decision);
    const finalStep: WorkflowStep = {
      side: 'agent',
      type: 'resolved',
      text: decision === 'approve'
        ? 'Approval received from senior-trader — executing trade: BUY 487 shares MSFT @ $77.89'
        : 'Rejected by senior-trader — action cancelled. Portfolio rebalance deferred.',
      delay: 0,
    };
    setVisibleSteps((prev) => [...prev, finalStep]);
  }

  useEffect(() => () => clearTimers(), []);

  const agentSteps = visibleSteps.filter((s) => s.side === 'agent');
  const praxisSteps = visibleSteps.filter((s) => s.side === 'praxis');
  const isEscalateScenario = activeScenario.id === 'escalate';
  const showEscalationButtons = isEscalateScenario && done && escalationDecision === null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Scenario selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {SCENARIOS.map((s) => {
          const isActive = activeScenario.id === s.id;
          return (
            <button
              key={s.id}
              onClick={() => handleScenarioSelect(s)}
              style={{
                padding: '14px 18px',
                borderRadius: '10px',
                border: `1px solid ${isActive ? s.color : 'rgba(255,255,255,0.07)'}`,
                background: isActive ? `${s.color}10` : '#151618',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <OutcomeBadge outcome={s.outcome} size="sm" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: isActive ? '#fff' : 'rgba(255,255,255,0.7)' }}>
                  {s.title}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
                {s.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Run / Reset controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => runScenario(activeScenario)}
          disabled={running}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '9px 20px',
            borderRadius: '6px',
            border: 'none',
            background: running ? 'rgba(255,255,255,0.06)' : '#D9532B',
            color: running ? 'rgba(255,255,255,0.3)' : '#fff',
            cursor: running ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '13px',
            transition: 'all 0.15s',
          }}
        >
          <Play size={13} />
          {running ? 'Running…' : 'Run Scenario'}
        </button>
        {(done || visibleSteps.length > 0) && (
          <button
            onClick={reset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '9px 16px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.15s',
            }}
          >
            <RotateCcw size={13} />
            Reset
          </button>
        )}
        {running && (
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>
            Simulating enforcement flow…
          </span>
        )}
      </div>

      {/* Split-screen */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* LEFT — Agent side */}
        <div
          style={{
            background: '#0A0C0F',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '420px',
          }}
        >
          {/* Terminal header */}
          <div
            style={{
              padding: '10px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#FF5F57', '#FFBD2E', '#28C940'].map((c) => (
                <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
              ))}
            </div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginLeft: '6px' }}>
              {activeScenario.agentName}
            </span>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '10px',
                fontFamily: 'JetBrains Mono, monospace',
                color: 'rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.04)',
                padding: '2px 7px',
                borderRadius: '4px',
              }}
            >
              AI AGENT
            </span>
          </div>

          {/* Logs */}
          <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
            {visibleSteps.length === 0 && (
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
                $ waiting for scenario…
              </span>
            )}
            {agentSteps.map((step, i) => (
              <AgentLogLine key={i} step={step} scenarioColor={activeScenario.color} />
            ))}

            {/* Escalation approval buttons */}
            {showEscalationButtons && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '12px',
                  background: 'rgba(245,166,35,0.06)',
                  border: '1px solid rgba(245,166,35,0.2)',
                  borderRadius: '8px',
                }}
              >
                <div style={{ fontSize: '11px', color: '#F5A623', fontFamily: 'JetBrains Mono, monospace', marginBottom: '10px', fontWeight: 600 }}>
                  ⏳ Awaiting your decision — SLA: 15 min remaining
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEscalationDecision('approve')}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(43,195,123,0.3)',
                      background: 'rgba(43,195,123,0.1)',
                      color: '#2BC37B',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '12px',
                    }}
                  >
                    <CheckCircle size={13} /> Approve Trade
                  </button>
                  <button
                    onClick={() => handleEscalationDecision('reject')}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(217,83,43,0.3)',
                      background: 'rgba(217,83,43,0.1)',
                      color: '#D9532B',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '12px',
                    }}
                  >
                    <XCircle size={13} /> Reject Trade
                  </button>
                </div>
              </div>
            )}

            {escalationDecision && (
              <div style={{ fontSize: '11px', color: escalationDecision === 'approve' ? '#2BC37B' : '#D9532B', fontFamily: 'JetBrains Mono, monospace', marginTop: '4px' }}>
                Decision recorded by senior-trader. Audit log updated.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — PRAXIS side */}
        <div
          style={{
            background: '#0A0C0F',
            border: '1px solid rgba(26,200,210,0.15)',
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '420px',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '10px 16px',
              borderBottom: '1px solid rgba(26,200,210,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(26,200,210,0.03)',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: running ? '#1AC8D2' : done ? activeScenario.color : 'rgba(255,255,255,0.2)',
                boxShadow: running ? '0 0 6px #1AC8D2' : 'none',
              }}
            />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(26,200,210,0.7)' }}>
              PRAXIS Enforcement Engine
            </span>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '10px',
                fontFamily: 'JetBrains Mono, monospace',
                color: 'rgba(26,200,210,0.5)',
                background: 'rgba(26,200,210,0.06)',
                padding: '2px 7px',
                borderRadius: '4px',
                border: '1px solid rgba(26,200,210,0.12)',
              }}
            >
              POLICY ENGINE
            </span>
          </div>

          {/* Logs */}
          <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
            {praxisSteps.length === 0 && (
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
                Listening for intercepted actions…
              </span>
            )}
            {praxisSteps.map((step, i) => (
              <PraxisLogLine key={i} step={step} />
            ))}
          </div>
        </div>
      </div>

      {/* Payload preview */}
      <div
        style={{
          background: '#151618',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '10px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
          INTERCEPTED ACTION
        </span>
        <code
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.55)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {activeScenario.actionType} → {JSON.stringify(activeScenario.payload)}
        </code>
        {done && (
          <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
            <OutcomeBadge outcome={escalationDecision === 'approve' ? 'ALLOW' : escalationDecision === 'reject' ? 'BLOCK' : activeScenario.outcome} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AgentLogLine({ step, scenarioColor }: { step: WorkflowStep; scenarioColor: string }) {
  const isAction = step.type === 'action';
  const isWaiting = step.type === 'waiting';
  const isResolved = step.type === 'resolved';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.2)', flexShrink: 0, marginTop: '1px' }}>$</span>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            color: isResolved ? '#2BC37B' : isWaiting ? '#F5A623' : isAction ? '#fff' : 'rgba(255,255,255,0.55)',
            lineHeight: 1.5,
          }}
        >
          {step.text}
        </span>
      </div>
      {step.highlight && (
        <div
          style={{
            marginLeft: '16px',
            padding: '4px 10px',
            background: `${scenarioColor}10`,
            border: `1px solid ${scenarioColor}25`,
            borderRadius: '4px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: scenarioColor,
          }}
        >
          {step.highlight}
        </div>
      )}
      {isWaiting && (
        <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
          <Clock size={11} color="#F5A623" />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#F5A623' }}>
            Trade held in PRAXIS queue — scroll down to review
          </span>
        </div>
      )}
    </div>
  );
}

function PraxisLogLine({ step }: { step: WorkflowStep }) {
  const isDecision = step.type === 'decision';
  const isViolation = step.highlight?.includes('VIOLATED') || step.highlight?.includes('BAND');

  const outcomeColor: Record<string, string> = {
    ALLOW: '#1AC8D2',
    BLOCK: '#D9532B',
    ESCALATE: '#F5A623',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(26,200,210,0.3)', flexShrink: 0, marginTop: '1px' }}>›</span>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            color: isDecision
              ? (outcomeColor[step.highlight ?? ''] ?? '#fff')
              : isViolation
                ? '#F5A623'
                : 'rgba(255,255,255,0.5)',
            fontWeight: isDecision ? 700 : 400,
            lineHeight: 1.5,
          }}
        >
          {step.text}
        </span>
      </div>
      {step.highlight && (
        <div
          style={{
            marginLeft: '16px',
            padding: '4px 10px',
            background: isDecision
              ? `${outcomeColor[step.highlight] ?? 'rgba(255,255,255,0.1)'}15`
              : 'rgba(245,166,35,0.08)',
            border: `1px solid ${isDecision ? `${outcomeColor[step.highlight] ?? 'rgba(255,255,255,0.1)'}30` : 'rgba(245,166,35,0.2)'}`,
            borderRadius: '4px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            fontWeight: 700,
            color: isDecision ? (outcomeColor[step.highlight] ?? '#fff') : '#F5A623',
            letterSpacing: '0.06em',
          }}
        >
          {step.highlight}
        </div>
      )}
    </div>
  );
}
