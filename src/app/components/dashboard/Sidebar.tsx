import { TrendingUp, Heart, Building2, LayoutDashboard, Activity, Shield, ScrollText, ArrowLeft, GitBranch, AlertTriangle, Landmark } from 'lucide-react';
import { Link } from 'react-router';
import type { Industry } from './data/scenarios';

export type DashboardView = 'overview' | 'workflow' | 'escalations' | 'feed' | 'policies' | 'audit';

interface SidebarProps {
  industry: Industry;
  onIndustryChange: (industry: Industry) => void;
  view: DashboardView;
  onViewChange: (view: DashboardView) => void;
  pendingCount?: number;
}

const INDUSTRIES: { id: Industry; label: string; icon: typeof TrendingUp; color: string }[] = [
  { id: 'banking', label: 'Banking', icon: Landmark, color: '#D9532B' },
  { id: 'fintech', label: 'FinTech', icon: TrendingUp, color: '#1AC8D2' },
  { id: 'healthcare', label: 'Healthcare', icon: Heart, color: '#2BC37B' },
  { id: 'saas', label: 'Enterprise SaaS', icon: Building2, color: '#A78BFA' },
];

type NavItem = { id: DashboardView; label: string; icon: typeof LayoutDashboard; bankingOnly?: boolean };

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'workflow', label: 'Workflow Demo', icon: GitBranch, bankingOnly: true },
  { id: 'escalations', label: 'Escalations', icon: AlertTriangle, bankingOnly: true },
  { id: 'feed', label: 'Action Feed', icon: Activity },
  { id: 'policies', label: 'Policies', icon: Shield },
  { id: 'audit', label: 'Audit Log', icon: ScrollText },
];

export function Sidebar({ industry, onIndustryChange, view, onViewChange, pendingCount = 0 }: SidebarProps) {
  const activeIndustry = INDUSTRIES.find((i) => i.id === industry)!;
  const isBanking = industry === 'banking';

  const visibleNav = NAV_ITEMS.filter((item) => !item.bankingOnly || isBanking);

  function handleIndustryChange(newIndustry: Industry) {
    onIndustryChange(newIndustry);
    // Reset to overview when switching away from banking if on a banking-only view
    if (newIndustry !== 'banking' && (view === 'workflow' || view === 'escalations')) {
      onViewChange('overview');
    }
  }

  return (
    <aside
      style={{
        width: '224px',
        flexShrink: 0,
        background: '#0A0C0F',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#D9532B" fillOpacity="0.12" />
            <rect x="8" y="9" width="14" height="3" rx="1.5" fill="#D9532B" />
            <rect x="8" y="9" width="3" height="16" rx="1.5" fill="rgba(255,255,255,0.8)" />
            <rect x="8" y="15" width="10" height="2.5" rx="1.25" fill="rgba(255,255,255,0.5)" />
            <rect x="8" y="21" width="7" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
            <circle cx="19" cy="15" r="2" fill="#D9532B" />
          </svg>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>PRAXIS</div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '1px' }}>
              Enforcement Layer
            </div>
          </div>
        </div>
      </div>

      {/* Industry Switcher */}
      <div style={{ padding: '16px 14px 8px' }}>
        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '6px' }}>
          Industry Scenario
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {INDUSTRIES.map((ind) => {
            const isActive = industry === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => handleIndustryChange(ind.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? `${ind.color}15` : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <ind.icon size={15} color={isActive ? ind.color : 'rgba(255,255,255,0.3)'} />
                <span style={{ fontSize: '12px', fontWeight: isActive ? 600 : 400, color: isActive ? ind.color : 'rgba(255,255,255,0.45)', transition: 'color 0.15s' }}>
                  {ind.label}
                </span>
                {isActive && (
                  <span style={{ marginLeft: 'auto', width: '5px', height: '5px', borderRadius: '50%', background: ind.color, flexShrink: 0, display: 'inline-block' }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '8px 14px' }} />

      {/* Navigation */}
      <nav style={{ padding: '8px 14px', flex: 1 }}>
        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '6px' }}>
          Dashboard
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {visibleNav.map((item) => {
            const isActive = view === item.id;
            const isEscalations = item.id === 'escalations';
            const showBadge = isEscalations && pendingCount > 0;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <item.icon
                  size={15}
                  color={isActive ? '#fff' : isEscalations && pendingCount > 0 ? '#F5A623' : 'rgba(255,255,255,0.3)'}
                />
                <span style={{ fontSize: '13px', fontWeight: isActive ? 500 : 400, color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)', transition: 'color 0.15s', flex: 1 }}>
                  {item.label}
                </span>
                {showBadge && (
                  <span
                    style={{
                      minWidth: '18px',
                      height: '18px',
                      borderRadius: '9px',
                      background: '#F5A623',
                      color: '#000',
                      fontSize: '10px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                    }}
                  >
                    {pendingCount}
                  </span>
                )}
                {isActive && !showBadge && (
                  <div style={{ width: '3px', height: '16px', borderRadius: '2px', background: activeIndustry.color }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Banking-only note */}
        {!isBanking && (
          <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', lineHeight: 1.5 }}>
              Switch to <span style={{ color: '#D9532B' }}>Banking</span> to see the Workflow Demo and Escalations queue.
            </div>
          </div>
        )}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 10px',
            borderRadius: '8px',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '12px',
            textDecoration: 'none',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          <ArrowLeft size={14} />
          Back to landing
        </Link>

        <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(43,195,123,0.06)', border: '1px solid rgba(43,195,123,0.12)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2BC37B', display: 'inline-block' }} />
            <span style={{ fontSize: '10px', color: '#2BC37B', fontWeight: 600, letterSpacing: '0.06em' }}>SYSTEM OPERATIONAL</span>
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', lineHeight: 1.5 }}>
            Enforcement engine active<br />
            Latency: &lt;2ms P99
          </div>
        </div>
      </div>
    </aside>
  );
}
