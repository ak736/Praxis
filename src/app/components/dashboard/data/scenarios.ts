export type Outcome = 'ALLOW' | 'BLOCK' | 'ESCALATE';
export type Industry = 'banking' | 'fintech' | 'healthcare' | 'saas';

export interface ActionTemplate {
  type: string;
  agent: string;
  payload: Record<string, unknown>;
  outcomes: Outcome[];   // weighted: repeat to increase probability
  policies: Record<Outcome, string>;
  latencyRange: [number, number]; // [min, max] ms
}

export interface PolicyDef {
  id: string;
  name: string;
  description: string;
  effect: 'ALLOW' | 'BLOCK' | 'ESCALATE';
  conditions: string[];
  dsl: string;
  active: boolean;
}

export interface ScenarioData {
  label: string;
  icon: string;
  color: string;
  agents: string[];
  actions: ActionTemplate[];
  policies: PolicyDef[];
  stats24h: { total: number; blocked: number; escalated: number; avgLatency: number };
}

// ─────────────────────────────────────────────
// FINTECH
// ─────────────────────────────────────────────
const fintechScenario: ScenarioData = {
  label: 'FinTech',
  icon: 'TrendingUp',
  color: '#1AC8D2',
  agents: ['trading-bot-v2', 'risk-analyzer', 'portfolio-manager'],
  stats24h: { total: 48291, blocked: 9134, escalated: 3847, avgLatency: 1.4 },
  actions: [
    {
      type: 'transaction.create',
      agent: 'trading-bot-v2',
      payload: { amount: 4200, currency: 'USD', instrument: 'AAPL', side: 'BUY' },
      outcomes: ['ALLOW', 'ALLOW', 'ALLOW', 'ALLOW', 'BLOCK'],
      policies: { ALLOW: 'TRANSACTION_LIMIT', BLOCK: 'TRANSACTION_LIMIT', ESCALATE: 'TRANSACTION_LIMIT' },
      latencyRange: [0.8, 1.6],
    },
    {
      type: 'position.open',
      agent: 'trading-bot-v2',
      payload: { symbol: 'TSLA', notional: 72000, side: 'LONG', leverage: 2 },
      outcomes: ['BLOCK', 'BLOCK', 'ESCALATE', 'ALLOW'],
      policies: { ALLOW: 'MAX_POSITION_SIZE', BLOCK: 'MAX_POSITION_SIZE', ESCALATE: 'MAX_POSITION_SIZE' },
      latencyRange: [1.1, 2.2],
    },
    {
      type: 'data.export',
      agent: 'risk-analyzer',
      payload: { dataset: 'trade_history', rows: 15000, format: 'CSV', destination: 's3://reports' },
      outcomes: ['BLOCK', 'ALLOW', 'ALLOW'],
      policies: { ALLOW: 'DATA_EXPORT_LIMIT', BLOCK: 'DATA_EXPORT_LIMIT', ESCALATE: 'DATA_EXPORT_LIMIT' },
      latencyRange: [0.9, 1.8],
    },
    {
      type: 'margin.adjust',
      agent: 'portfolio-manager',
      payload: { account: 'ACC-00291', adjustment: -15000, reason: 'rebalance' },
      outcomes: ['ALLOW', 'ALLOW', 'ESCALATE'],
      policies: { ALLOW: 'MARGIN_CONTROL', BLOCK: 'MARGIN_CONTROL', ESCALATE: 'MARGIN_CONTROL' },
      latencyRange: [0.7, 1.4],
    },
    {
      type: 'account.read',
      agent: 'risk-analyzer',
      payload: { accountId: 'ACC-00184', fields: ['balance', 'positions'] },
      outcomes: ['ALLOW', 'ALLOW', 'ALLOW', 'ALLOW'],
      policies: { ALLOW: 'KYC_REQUIRED', BLOCK: 'KYC_REQUIRED', ESCALATE: 'KYC_REQUIRED' },
      latencyRange: [0.5, 1.0],
    },
    {
      type: 'trade.cancel',
      agent: 'trading-bot-v2',
      payload: { orderId: 'ORD-88234', reason: 'risk_limit_breach' },
      outcomes: ['ALLOW', 'ALLOW', 'ALLOW'],
      policies: { ALLOW: 'TRADING_HOURS', BLOCK: 'TRADING_HOURS', ESCALATE: 'TRADING_HOURS' },
      latencyRange: [0.6, 1.2],
    },
  ],
  policies: [
    {
      id: 'MAX_POSITION_SIZE',
      name: 'MAX_POSITION_SIZE',
      description: 'Blocks any position with notional value exceeding $50,000 without senior trader approval.',
      effect: 'BLOCK',
      conditions: ['notional > 50000', 'approval_level < SENIOR'],
      active: true,
      dsl: `policy MAX_POSITION_SIZE {
  version: "1.3.0"
  applies_to: [position.open, position.increase]

  rule block_oversized_positions {
    when {
      action.payload.notional > 50000
      AND context.approval_level < "SENIOR"
    }
    effect: BLOCK
    reason: "Position size exceeds single-trade limit without senior approval"
    notify: [risk-desk@firm.com]
  }

  rule escalate_large_positions {
    when {
      action.payload.notional >= 30000
      AND action.payload.notional <= 50000
    }
    effect: ESCALATE
    escalate_to: "risk-manager"
    sla_minutes: 15
  }
}`,
    },
    {
      id: 'TRADING_HOURS',
      name: 'TRADING_HOURS',
      description: 'Restricts automated trading to NYSE market hours (9:30am–4:00pm ET, weekdays).',
      effect: 'BLOCK',
      conditions: ['time NOT IN 09:30–16:00 ET', 'day IN [MON–FRI]'],
      active: true,
      dsl: `policy TRADING_HOURS {
  version: "2.1.0"
  applies_to: [transaction.create, position.open]

  rule market_hours_only {
    when {
      context.timestamp.hour NOT IN [9..16]
      OR context.timestamp.weekday IN ["SAT", "SUN"]
    }
    effect: BLOCK
    reason: "Automated trades are only permitted during NYSE market hours"
  }

  rule pre_market_escalate {
    when {
      context.timestamp.hour IN [8, 9]
      AND context.timestamp.weekday NOT IN ["SAT", "SUN"]
    }
    effect: ESCALATE
    escalate_to: "trading-desk"
    sla_minutes: 5
  }
}`,
    },
    {
      id: 'TRANSACTION_LIMIT',
      name: 'TRANSACTION_LIMIT',
      description: 'Blocks single transactions exceeding $10,000. SOX compliance rule.',
      effect: 'BLOCK',
      conditions: ['amount > 10000'],
      active: true,
      dsl: `policy TRANSACTION_LIMIT {
  version: "1.0.4"
  applies_to: [transaction.create]
  tags: [SOX, MiFID-II]

  rule block_large_transactions {
    when {
      action.payload.amount > 10000
    }
    effect: BLOCK
    reason: "Single transaction limit exceeded — SOX §302 compliance"
    audit: REQUIRED
  }
}`,
    },
    {
      id: 'DATA_EXPORT_LIMIT',
      name: 'DATA_EXPORT_LIMIT',
      description: 'Prevents bulk data exports exceeding 10,000 rows without compliance sign-off.',
      effect: 'BLOCK',
      conditions: ['rows > 10000', 'compliance_approved != true'],
      active: true,
      dsl: `policy DATA_EXPORT_LIMIT {
  version: "1.1.0"
  applies_to: [data.export]
  tags: [GDPR, MiFID-II]

  rule block_bulk_export {
    when {
      action.payload.rows > 10000
      AND context.compliance_approved != true
    }
    effect: BLOCK
    reason: "Bulk data export requires compliance pre-approval"
  }
}`,
    },
  ],
};

// ─────────────────────────────────────────────
// HEALTHCARE
// ─────────────────────────────────────────────
const healthcareScenario: ScenarioData = {
  label: 'Healthcare',
  icon: 'Heart',
  color: '#2BC37B',
  agents: ['diagnostic-ai', 'scheduling-bot', 'records-agent'],
  stats24h: { total: 31042, blocked: 4812, escalated: 6231, avgLatency: 1.7 },
  actions: [
    {
      type: 'patient.record.access',
      agent: 'records-agent',
      payload: { patientId: 'PAT-00471', fields: ['diagnosis', 'medications', 'lab_results'], purpose: 'treatment' },
      outcomes: ['ALLOW', 'ALLOW', 'ALLOW', 'ESCALATE'],
      policies: { ALLOW: 'PHI_ACCESS_CONTROL', BLOCK: 'PHI_ACCESS_CONTROL', ESCALATE: 'PHI_ACCESS_CONTROL' },
      latencyRange: [1.2, 2.1],
    },
    {
      type: 'phi.export',
      agent: 'diagnostic-ai',
      payload: { dataType: 'MRI_scans', patientCount: 240, destination: 'research-db', anonymized: false },
      outcomes: ['BLOCK', 'BLOCK', 'ESCALATE'],
      policies: { ALLOW: 'HIPAA_MINIMUM_NECESSARY', BLOCK: 'HIPAA_MINIMUM_NECESSARY', ESCALATE: 'HIPAA_MINIMUM_NECESSARY' },
      latencyRange: [1.5, 2.5],
    },
    {
      type: 'prescription.write',
      agent: 'diagnostic-ai',
      payload: { patientId: 'PAT-00892', drug: 'Amoxicillin 500mg', dosage: '3x daily', duration: '7 days' },
      outcomes: ['ESCALATE', 'ESCALATE', 'ALLOW'],
      policies: { ALLOW: 'PHYSICIAN_OVERSIGHT', BLOCK: 'PHYSICIAN_OVERSIGHT', ESCALATE: 'PHYSICIAN_OVERSIGHT' },
      latencyRange: [1.0, 1.9],
    },
    {
      type: 'appointment.create',
      agent: 'scheduling-bot',
      payload: { patientId: 'PAT-00293', provider: 'Dr. Chen', type: 'follow-up', date: '2026-03-15' },
      outcomes: ['ALLOW', 'ALLOW', 'ALLOW', 'ALLOW'],
      policies: { ALLOW: 'SCHEDULING_POLICY', BLOCK: 'SCHEDULING_POLICY', ESCALATE: 'SCHEDULING_POLICY' },
      latencyRange: [0.6, 1.1],
    },
    {
      type: 'lab.order',
      agent: 'diagnostic-ai',
      payload: { patientId: 'PAT-00741', tests: ['CBC', 'CMP', 'HbA1c'], priority: 'STAT' },
      outcomes: ['ALLOW', 'ALLOW', 'ESCALATE'],
      policies: { ALLOW: 'LAB_ORDER_POLICY', BLOCK: 'LAB_ORDER_POLICY', ESCALATE: 'LAB_ORDER_POLICY' },
      latencyRange: [0.9, 1.6],
    },
  ],
  policies: [
    {
      id: 'PHI_ACCESS_CONTROL',
      name: 'PHI_ACCESS_CONTROL',
      description: 'Enforces HIPAA minimum necessary standard for all PHI access by AI agents.',
      effect: 'BLOCK',
      conditions: ['purpose NOT IN [treatment, payment, operations]', 'agent_role MISSING'],
      active: true,
      dsl: `policy PHI_ACCESS_CONTROL {
  version: "3.0.1"
  applies_to: [patient.record.access, phi.read]
  tags: [HIPAA, PHI]

  rule enforce_minimum_necessary {
    when {
      action.payload.purpose NOT IN ["treatment", "payment", "healthcare_operations"]
      OR context.agent_role IS NULL
    }
    effect: BLOCK
    reason: "PHI access denied — purpose not within HIPAA minimum necessary standard"
    audit: REQUIRED
    notify: [privacy-officer@hospital.org]
  }

  rule escalate_after_hours {
    when {
      context.timestamp.hour NOT IN [7..20]
      AND action.payload.purpose != "emergency"
    }
    effect: ESCALATE
    escalate_to: "on-call-privacy-officer"
    sla_minutes: 10
  }
}`,
    },
    {
      id: 'HIPAA_MINIMUM_NECESSARY',
      name: 'HIPAA_MINIMUM_NECESSARY',
      description: 'Blocks bulk PHI exports to non-anonymized destinations.',
      effect: 'BLOCK',
      conditions: ['anonymized != true', 'patientCount > 100'],
      active: true,
      dsl: `policy HIPAA_MINIMUM_NECESSARY {
  version: "2.2.0"
  applies_to: [phi.export, data.export]
  tags: [HIPAA, GDPR]

  rule block_non_anonymized_bulk {
    when {
      action.payload.anonymized != true
      AND action.payload.patientCount > 100
    }
    effect: BLOCK
    reason: "Bulk PHI export must be fully anonymized per HIPAA Safe Harbor"
  }

  rule require_irb_approval {
    when {
      action.payload.destination CONTAINS "research"
    }
    effect: ESCALATE
    escalate_to: "irb-committee"
    sla_minutes: 2880
  }
}`,
    },
    {
      id: 'PHYSICIAN_OVERSIGHT',
      name: 'PHYSICIAN_OVERSIGHT',
      description: 'All AI-generated prescriptions must be reviewed by a licensed physician.',
      effect: 'ESCALATE',
      conditions: ['actor.type == AI_AGENT', 'action.type == prescription.write'],
      active: true,
      dsl: `policy PHYSICIAN_OVERSIGHT {
  version: "1.0.0"
  applies_to: [prescription.write, treatment.plan.create]

  rule ai_prescription_review {
    when {
      context.actor.type == "AI_AGENT"
    }
    effect: ESCALATE
    escalate_to: "supervising-physician"
    sla_minutes: 30
    reason: "AI-generated prescriptions require physician sign-off"
    block_on_timeout: true
  }
}`,
    },
  ],
};

// ─────────────────────────────────────────────
// BANKING
// ─────────────────────────────────────────────
const bankingScenario: ScenarioData = {
  label: 'Banking',
  icon: 'Landmark',
  color: '#D9532B',
  agents: ['TradeBot-v2', 'RiskAnalyzer', 'PortfolioManager'],
  stats24h: { total: 53840, blocked: 11204, escalated: 6319, avgLatency: 1.4 },
  actions: [
    {
      type: 'transaction.create',
      agent: 'TradeBot-v2',
      payload: { amount: 4200, currency: 'USD', instrument: 'AAPL', side: 'BUY', accountId: 'ACC-00291' },
      outcomes: ['ALLOW', 'ALLOW', 'ALLOW', 'ALLOW', 'BLOCK'],
      policies: { ALLOW: 'TRANSACTION_LIMIT', BLOCK: 'TRANSACTION_LIMIT', ESCALATE: 'TRANSACTION_LIMIT' },
      latencyRange: [0.8, 1.6],
    },
    {
      type: 'position.open',
      agent: 'TradeBot-v2',
      payload: { symbol: 'TSLA', notional: 72000, side: 'LONG', leverage: 2, accountId: 'ACC-00291' },
      outcomes: ['BLOCK', 'BLOCK', 'ESCALATE'],
      policies: { ALLOW: 'MAX_POSITION_SIZE', BLOCK: 'MAX_POSITION_SIZE', ESCALATE: 'MAX_POSITION_SIZE' },
      latencyRange: [1.1, 2.2],
    },
    {
      type: 'position.open',
      agent: 'PortfolioManager',
      payload: { symbol: 'MSFT', notional: 38000, side: 'LONG', leverage: 1, accountId: 'ACC-00184' },
      outcomes: ['ESCALATE', 'ESCALATE', 'ALLOW'],
      policies: { ALLOW: 'MAX_POSITION_SIZE', BLOCK: 'MAX_POSITION_SIZE', ESCALATE: 'MAX_POSITION_SIZE' },
      latencyRange: [1.0, 1.9],
    },
    {
      type: 'wire.transfer',
      agent: 'TradeBot-v2',
      payload: { amount: 95000, currency: 'USD', fromAccount: 'ACC-00291', toAccount: 'EXT-884721', purpose: 'settlement' },
      outcomes: ['BLOCK', 'BLOCK', 'ESCALATE'],
      policies: { ALLOW: 'WIRE_TRANSFER_POLICY', BLOCK: 'WIRE_TRANSFER_POLICY', ESCALATE: 'WIRE_TRANSFER_POLICY' },
      latencyRange: [1.3, 2.1],
    },
    {
      type: 'account.read',
      agent: 'RiskAnalyzer',
      payload: { accountId: 'ACC-00184', fields: ['balance', 'positions', 'exposure'] },
      outcomes: ['ALLOW', 'ALLOW', 'ALLOW', 'ALLOW'],
      policies: { ALLOW: 'KYC_REQUIRED', BLOCK: 'KYC_REQUIRED', ESCALATE: 'KYC_REQUIRED' },
      latencyRange: [0.5, 1.0],
    },
    {
      type: 'margin.adjust',
      agent: 'RiskAnalyzer',
      payload: { accountId: 'ACC-00384', adjustment: -18000, reason: 'risk_rebalance', triggeredBy: 'volatility_spike' },
      outcomes: ['ALLOW', 'ALLOW', 'ESCALATE'],
      policies: { ALLOW: 'MARGIN_CONTROL', BLOCK: 'MARGIN_CONTROL', ESCALATE: 'MARGIN_CONTROL' },
      latencyRange: [0.7, 1.4],
    },
    {
      type: 'trade.cancel',
      agent: 'TradeBot-v2',
      payload: { orderId: 'ORD-88234', symbol: 'AAPL', reason: 'risk_limit_breach' },
      outcomes: ['ALLOW', 'ALLOW', 'ALLOW'],
      policies: { ALLOW: 'TRADING_HOURS', BLOCK: 'TRADING_HOURS', ESCALATE: 'TRADING_HOURS' },
      latencyRange: [0.6, 1.2],
    },
  ],
  policies: [
    {
      id: 'MAX_POSITION_SIZE',
      name: 'MAX_POSITION_SIZE',
      description: 'Blocks positions over $50,000. Escalates positions between $30,000–$50,000 to senior trader. SOX §302 compliance.',
      effect: 'BLOCK',
      conditions: ['notional > 50000', 'approval_level < SENIOR'],
      active: true,
      dsl: `policy MAX_POSITION_SIZE {
  version: "1.3.0"
  applies_to: [position.open, position.increase]
  tags: [SOX, MiFID-II]

  rule block_oversized_positions {
    when {
      action.payload.notional > 50000
      AND context.approval_level < "SENIOR"
    }
    effect: BLOCK
    reason: "Position size exceeds single-trade limit without senior approval"
    notify: [risk-desk@apexcapital.com]
    audit: REQUIRED
  }

  rule escalate_large_positions {
    when {
      action.payload.notional >= 30000
      AND action.payload.notional <= 50000
    }
    effect: ESCALATE
    escalate_to: "senior-trader"
    sla_minutes: 15
    block_on_timeout: true
  }
}`,
    },
    {
      id: 'TRANSACTION_LIMIT',
      name: 'TRANSACTION_LIMIT',
      description: 'Blocks single transactions exceeding $10,000 without KYC verification. SOX compliance.',
      effect: 'BLOCK',
      conditions: ['amount > 10000', 'kyc_verified != true'],
      active: true,
      dsl: `policy TRANSACTION_LIMIT {
  version: "1.0.4"
  applies_to: [transaction.create]
  tags: [SOX, AML]

  rule block_large_unverified {
    when {
      action.payload.amount > 10000
      AND context.kyc_verified != true
    }
    effect: BLOCK
    reason: "Transaction exceeds limit — KYC verification required"
    audit: REQUIRED
  }

  rule flag_suspicious_amount {
    when {
      action.payload.amount > 7500
      AND action.payload.amount <= 10000
    }
    effect: ESCALATE
    escalate_to: "aml-team"
    sla_minutes: 30
    reason: "Transaction near reporting threshold — AML review required"
  }
}`,
    },
    {
      id: 'WIRE_TRANSFER_POLICY',
      name: 'WIRE_TRANSFER_POLICY',
      description: 'All outbound wire transfers above $50,000 require dual authorization from compliance.',
      effect: 'ESCALATE',
      conditions: ['amount > 50000', 'dual_auth != true'],
      active: true,
      dsl: `policy WIRE_TRANSFER_POLICY {
  version: "2.0.0"
  applies_to: [wire.transfer, external.payment]
  tags: [AML, SOX, SWIFT]

  rule block_unauthorized_wire {
    when {
      action.payload.amount > 100000
      AND context.dual_auth != true
    }
    effect: BLOCK
    reason: "Wire transfers above $100k require dual authorization"
    notify: [compliance@apexcapital.com, cro@apexcapital.com]
    audit: REQUIRED
  }

  rule escalate_large_wire {
    when {
      action.payload.amount > 50000
      AND context.dual_auth != true
    }
    effect: ESCALATE
    escalate_to: "compliance-officer"
    sla_minutes: 20
    block_on_timeout: true
  }
}`,
    },
    {
      id: 'TRADING_HOURS',
      name: 'TRADING_HOURS',
      description: 'Restricts automated trading to NYSE market hours (9:30am–4:00pm ET, weekdays only).',
      effect: 'BLOCK',
      conditions: ['time NOT IN 09:30–16:00 ET', 'weekday IN MON–FRI'],
      active: true,
      dsl: `policy TRADING_HOURS {
  version: "2.1.0"
  applies_to: [transaction.create, position.open, trade.execute]

  rule market_hours_only {
    when {
      context.timestamp.hour NOT IN [9..16]
      OR context.timestamp.weekday IN ["SAT", "SUN"]
    }
    effect: BLOCK
    reason: "Automated trades are only permitted during NYSE market hours"
  }
}`,
    },
    {
      id: 'KYC_REQUIRED',
      name: 'KYC_REQUIRED',
      description: 'Ensures KYC status is verified before any account data is read by an agent.',
      effect: 'ALLOW',
      conditions: ['kyc_status == VERIFIED', 'audit: REQUIRED'],
      active: true,
      dsl: `policy KYC_REQUIRED {
  version: "1.1.0"
  applies_to: [account.read, account.update]
  tags: [KYC, AML]

  rule require_kyc_verification {
    when {
      context.kyc_status == "VERIFIED"
    }
    effect: ALLOW
    audit: REQUIRED
    log_level: INFO
  }

  rule block_unverified_access {
    when {
      context.kyc_status != "VERIFIED"
    }
    effect: BLOCK
    reason: "Account access requires completed KYC verification"
  }
}`,
    },
  ],
};

// ─────────────────────────────────────────────
// ENTERPRISE SAAS
// ─────────────────────────────────────────────
const saasScenario: ScenarioData = {
  label: 'Enterprise SaaS',
  icon: 'Building',
  color: '#A78BFA',
  agents: ['data-sync-agent', 'admin-bot', 'analytics-engine'],
  stats24h: { total: 61003, blocked: 9241, escalated: 5822, avgLatency: 1.2 },
  actions: [
    {
      type: 'tenant.data.access',
      agent: 'analytics-engine',
      payload: { tenantId: 'tenant-acme-corp', targetTenantId: 'tenant-globex', table: 'orders' },
      outcomes: ['BLOCK', 'BLOCK', 'BLOCK'],
      policies: { ALLOW: 'TENANT_ISOLATION', BLOCK: 'TENANT_ISOLATION', ESCALATE: 'TENANT_ISOLATION' },
      latencyRange: [0.8, 1.6],
    },
    {
      type: 'user.delete',
      agent: 'admin-bot',
      payload: { userId: 'usr-00481', tenantId: 'tenant-stark-ind', reason: 'offboarding' },
      outcomes: ['ESCALATE', 'ALLOW', 'ALLOW'],
      policies: { ALLOW: 'RBAC_ENFORCEMENT', BLOCK: 'RBAC_ENFORCEMENT', ESCALATE: 'RBAC_ENFORCEMENT' },
      latencyRange: [0.9, 1.8],
    },
    {
      type: 'bulk.export',
      agent: 'data-sync-agent',
      payload: { tenantId: 'tenant-wayne-ent', records: 85000, format: 'JSON', destination: 'external-api' },
      outcomes: ['BLOCK', 'ESCALATE', 'BLOCK'],
      policies: { ALLOW: 'DATA_EXPORT_LIMIT', BLOCK: 'DATA_EXPORT_LIMIT', ESCALATE: 'DATA_EXPORT_LIMIT' },
      latencyRange: [1.1, 2.0],
    },
    {
      type: 'config.override',
      agent: 'admin-bot',
      payload: { tenantId: 'tenant-acme-corp', setting: 'max_api_rate', value: 100000 },
      outcomes: ['ESCALATE', 'ALLOW'],
      policies: { ALLOW: 'TENANT_CONFIG_POLICY', BLOCK: 'TENANT_CONFIG_POLICY', ESCALATE: 'TENANT_CONFIG_POLICY' },
      latencyRange: [0.7, 1.4],
    },
    {
      type: 'report.generate',
      agent: 'analytics-engine',
      payload: { tenantId: 'tenant-umbrella', reportType: 'usage_analytics', period: '30d' },
      outcomes: ['ALLOW', 'ALLOW', 'ALLOW', 'ALLOW'],
      policies: { ALLOW: 'ANALYTICS_POLICY', BLOCK: 'ANALYTICS_POLICY', ESCALATE: 'ANALYTICS_POLICY' },
      latencyRange: [0.5, 1.0],
    },
  ],
  policies: [
    {
      id: 'TENANT_ISOLATION',
      name: 'TENANT_ISOLATION',
      description: 'Enforces strict tenant data isolation. Cross-tenant data access is always blocked.',
      effect: 'BLOCK',
      conditions: ['context.tenantId != action.payload.targetTenantId'],
      active: true,
      dsl: `policy TENANT_ISOLATION {
  version: "5.0.0"
  applies_to: [tenant.data.access, data.query, report.generate]
  tags: [MULTI_TENANT, SOC2]

  rule block_cross_tenant_access {
    when {
      context.tenant_id != action.payload.tenantId
      OR action.payload.targetTenantId IS NOT NULL
        AND action.payload.targetTenantId != context.tenant_id
    }
    effect: BLOCK
    reason: "Cross-tenant data access is strictly prohibited"
    audit: REQUIRED
    severity: CRITICAL
    notify: [security@saas.io, cto@saas.io]
  }
}`,
    },
    {
      id: 'RBAC_ENFORCEMENT',
      name: 'RBAC_ENFORCEMENT',
      description: 'Validates agent roles match required permissions before any destructive operation.',
      effect: 'BLOCK',
      conditions: ['agent.role < REQUIRED_ROLE', 'operation IN [delete, update, admin]'],
      active: true,
      dsl: `policy RBAC_ENFORCEMENT {
  version: "2.3.1"
  applies_to: [user.delete, user.update, tenant.suspend]

  rule validate_role {
    when {
      context.agent_role NOT IN action.required_roles
    }
    effect: BLOCK
    reason: "Insufficient role permissions for this operation"
  }

  rule escalate_admin_ops {
    when {
      action.type IN ["user.delete", "tenant.suspend"]
      AND context.agent_role == "ADMIN"
    }
    effect: ESCALATE
    escalate_to: "account-owner"
    sla_minutes: 30
  }
}`,
    },
    {
      id: 'DATA_EXPORT_LIMIT',
      name: 'DATA_EXPORT_LIMIT',
      description: 'Limits bulk exports to 10,000 records per request without explicit approval.',
      effect: 'BLOCK',
      conditions: ['records > 10000', 'approval IS NULL'],
      active: true,
      dsl: `policy DATA_EXPORT_LIMIT {
  version: "1.4.0"
  applies_to: [bulk.export, data.sync]
  tags: [GDPR, DATA_GOVERNANCE]

  rule block_oversized_export {
    when {
      action.payload.records > 10000
      AND context.export_approval IS NULL
    }
    effect: BLOCK
    reason: "Export exceeds per-request limit. Submit export approval request."
  }

  rule escalate_large_export {
    when {
      action.payload.records > 5000
      AND action.payload.records <= 10000
    }
    effect: ESCALATE
    escalate_to: "data-governance-team"
    sla_minutes: 120
  }
}`,
    },
  ],
};

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────
export const SCENARIOS: Record<Industry, ScenarioData> = {
  banking: bankingScenario,
  fintech: fintechScenario,
  healthcare: healthcareScenario,
  saas: saasScenario,
};
