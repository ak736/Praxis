import { useState, useEffect, useCallback, useRef } from 'react';
import { SCENARIOS, type Industry, type Outcome } from './scenarios';

export interface ActionEntry {
  id: string;
  ts: Date;
  agent: string;
  actionType: string;
  payload: Record<string, unknown>;
  outcome: Outcome;
  policyMatched: string;
  latencyMs: number;
  traceId: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  resolvedOutcome?: 'ALLOW' | 'BLOCK';
}

export interface PendingEscalation {
  id: string;
  ts: Date;
  agent: string;
  actionType: string;
  payload: Record<string, unknown>;
  policyMatched: string;
  latencyMs: number;
  traceId: string;
  expiresAt: Date;
  escalateTo: string;
  slaMinutes: number;
}

export interface SimStats {
  total: number;
  blocked: number;
  escalated: number;
  allowed: number;
  avgLatency: number;
}

const ESCALATE_TO: Record<string, string> = {
  MAX_POSITION_SIZE: 'senior-trader',
  TRANSACTION_LIMIT: 'aml-team',
  WIRE_TRANSFER_POLICY: 'compliance-officer',
  MARGIN_CONTROL: 'risk-manager',
  PHI_ACCESS_CONTROL: 'on-call-privacy-officer',
  HIPAA_MINIMUM_NECESSARY: 'irb-committee',
  PHYSICIAN_OVERSIGHT: 'supervising-physician',
  RBAC_ENFORCEMENT: 'account-owner',
  DATA_EXPORT_LIMIT: 'data-governance-team',
};
const SLA_MINUTES: Record<string, number> = {
  MAX_POSITION_SIZE: 15,
  TRANSACTION_LIMIT: 30,
  WIRE_TRANSFER_POLICY: 20,
  MARGIN_CONTROL: 10,
  PHI_ACCESS_CONTROL: 10,
  HIPAA_MINIMUM_NECESSARY: 60,
  PHYSICIAN_OVERSIGHT: 30,
  RBAC_ENFORCEMENT: 30,
  DATA_EXPORT_LIMIT: 120,
};
const DEMO_EXPIRE_MS = 3 * 60 * 1000; // 3 min for demo

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function generateTraceId() {
  return 'prx-' + Math.random().toString(36).slice(2, 10).toUpperCase();
}
function pickWeightedOutcome(outcomes: Outcome[]): Outcome {
  return outcomes[Math.floor(Math.random() * outcomes.length)];
}

function buildEntry(industry: Industry): ActionEntry {
  const scenario = SCENARIOS[industry];
  const template = scenario.actions[Math.floor(Math.random() * scenario.actions.length)];
  const outcome = pickWeightedOutcome(template.outcomes);
  const latencyMs = parseFloat(randomBetween(...template.latencyRange).toFixed(1));
  const agent = scenario.agents[Math.floor(Math.random() * scenario.agents.length)];

  const payload = { ...template.payload } as Record<string, unknown>;
  if (typeof payload.amount === 'number') payload.amount = Math.round(randomBetween(500, 12000));
  if (typeof payload.notional === 'number') payload.notional = Math.round(randomBetween(8000, 90000));
  if (typeof payload.rows === 'number') payload.rows = Math.round(randomBetween(500, 20000));
  if (typeof payload.records === 'number') payload.records = Math.round(randomBetween(500, 95000));

  return {
    id: generateTraceId() + '-' + Date.now(),
    ts: new Date(),
    agent,
    actionType: template.type,
    payload,
    outcome,
    policyMatched: template.policies[outcome],
    latencyMs,
    traceId: generateTraceId(),
  };
}

const MAX_BUFFER = 100;
const INTERVAL_MS = 2500;

export function useActionSimulation(industry: Industry) {
  const [entries, setEntries] = useState<ActionEntry[]>(() =>
    Array.from({ length: 20 }, () => {
      const e = buildEntry(industry);
      e.ts = new Date(Date.now() - Math.random() * 3 * 60 * 1000);
      return e;
    }).sort((a, b) => b.ts.getTime() - a.ts.getTime())
  );

  const [pendingEscalations, setPendingEscalations] = useState<PendingEscalation[]>([]);
  const [isLive, setIsLive] = useState(true);
  const industryRef = useRef(industry);
  industryRef.current = industry;

  useEffect(() => {
    setPendingEscalations([]);
    setEntries(
      Array.from({ length: 20 }, () => {
        const e = buildEntry(industry);
        e.ts = new Date(Date.now() - Math.random() * 3 * 60 * 1000);
        return e;
      }).sort((a, b) => b.ts.getTime() - a.ts.getTime())
    );
  }, [industry]);

  useEffect(() => {
    if (!isLive) return;
    const timer = setInterval(() => {
      const newEntry = buildEntry(industryRef.current);
      if (newEntry.outcome === 'ESCALATE') {
        const pending: PendingEscalation = {
          id: newEntry.id,
          ts: newEntry.ts,
          agent: newEntry.agent,
          actionType: newEntry.actionType,
          payload: newEntry.payload,
          policyMatched: newEntry.policyMatched,
          latencyMs: newEntry.latencyMs,
          traceId: newEntry.traceId,
          expiresAt: new Date(Date.now() + DEMO_EXPIRE_MS),
          escalateTo: ESCALATE_TO[newEntry.policyMatched] ?? 'senior-reviewer',
          slaMinutes: SLA_MINUTES[newEntry.policyMatched] ?? 15,
        };
        setPendingEscalations((prev) => [pending, ...prev].slice(0, 20));
      }
      setEntries((prev) => [newEntry, ...prev].slice(0, MAX_BUFFER));
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isLive]);

  // Auto-expire escalations → BLOCK
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setPendingEscalations((prev) => {
        const expired = prev.filter((e) => new Date(e.expiresAt).getTime() <= now);
        if (expired.length > 0) {
          const blockedEntries: ActionEntry[] = expired.map((e) => ({
            id: e.id + '-timeout',
            ts: new Date(),
            agent: e.agent,
            actionType: e.actionType,
            payload: e.payload,
            outcome: 'BLOCK' as Outcome,
            policyMatched: e.policyMatched,
            latencyMs: e.latencyMs,
            traceId: e.traceId,
            resolvedBy: 'system (SLA timeout)',
            resolvedAt: new Date(),
            resolvedOutcome: 'BLOCK',
          }));
          setEntries((pe) => [...blockedEntries, ...pe].slice(0, MAX_BUFFER));
        }
        return prev.filter((e) => new Date(e.expiresAt).getTime() > now);
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const approveEscalation = useCallback((id: string) => {
    setPendingEscalations((prev) => {
      const item = prev.find((e) => e.id === id);
      if (item) {
        const resolved: ActionEntry = {
          id: item.id + '-approved',
          ts: new Date(),
          agent: item.agent,
          actionType: item.actionType,
          payload: item.payload,
          outcome: 'ALLOW',
          policyMatched: item.policyMatched,
          latencyMs: item.latencyMs,
          traceId: item.traceId,
          resolvedBy: 'senior-trader',
          resolvedAt: new Date(),
          resolvedOutcome: 'ALLOW',
        };
        setEntries((pe) => [resolved, ...pe].slice(0, MAX_BUFFER));
      }
      return prev.filter((e) => e.id !== id);
    });
  }, []);

  const rejectEscalation = useCallback((id: string) => {
    setPendingEscalations((prev) => {
      const item = prev.find((e) => e.id === id);
      if (item) {
        const resolved: ActionEntry = {
          id: item.id + '-rejected',
          ts: new Date(),
          agent: item.agent,
          actionType: item.actionType,
          payload: item.payload,
          outcome: 'BLOCK',
          policyMatched: item.policyMatched,
          latencyMs: item.latencyMs,
          traceId: item.traceId,
          resolvedBy: 'senior-trader',
          resolvedAt: new Date(),
          resolvedOutcome: 'BLOCK',
        };
        setEntries((pe) => [resolved, ...pe].slice(0, MAX_BUFFER));
      }
      return prev.filter((e) => e.id !== id);
    });
  }, []);

  const toggleLive = useCallback(() => setIsLive((v) => !v), []);

  const stats: SimStats = entries.reduce(
    (acc, e) => {
      acc.total++;
      if (e.outcome === 'BLOCK') acc.blocked++;
      if (e.outcome === 'ESCALATE') acc.escalated++;
      if (e.outcome === 'ALLOW') acc.allowed++;
      acc.avgLatency += e.latencyMs;
      return acc;
    },
    { total: 0, blocked: 0, escalated: 0, allowed: 0, avgLatency: 0 }
  );
  if (stats.total > 0) stats.avgLatency = parseFloat((stats.avgLatency / stats.total).toFixed(1));

  return { entries, stats, isLive, toggleLive, pendingEscalations, approveEscalation, rejectEscalation };
}
