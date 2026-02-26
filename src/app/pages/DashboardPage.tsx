import { useState } from 'react';
import { Sidebar, type DashboardView } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { OverviewView } from '../components/dashboard/views/OverviewView';
import { WorkflowView } from '../components/dashboard/views/WorkflowView';
import { EscalationsView } from '../components/dashboard/views/EscalationsView';
import { ActionFeedView } from '../components/dashboard/views/ActionFeedView';
import { PoliciesView } from '../components/dashboard/views/PoliciesView';
import { AuditLogView } from '../components/dashboard/views/AuditLogView';
import { useActionSimulation } from '../components/dashboard/data/simulation';
import { SCENARIOS, type Industry } from '../components/dashboard/data/scenarios';

export function DashboardPage() {
  const [industry, setIndustry] = useState<Industry>('banking');
  const [view, setView] = useState<DashboardView>('overview');

  const { entries, stats, isLive, toggleLive, pendingEscalations, approveEscalation, rejectEscalation } =
    useActionSimulation(industry);

  const scenario = SCENARIOS[industry];

  function handleIndustryChange(newIndustry: Industry) {
    setIndustry(newIndustry);
    if (newIndustry !== 'banking' && (view === 'workflow' || view === 'escalations')) {
      setView('overview');
    }
  }

  function renderView() {
    switch (view) {
      case 'overview':
        return <OverviewView stats={stats} entries={entries} scenario={scenario} />;
      case 'workflow':
        return <WorkflowView />;
      case 'escalations':
        return (
          <EscalationsView
            pendingEscalations={pendingEscalations}
            onApprove={approveEscalation}
            onReject={rejectEscalation}
          />
        );
      case 'feed':
        return <ActionFeedView entries={entries} isLive={isLive} toggleLive={toggleLive} />;
      case 'policies':
        return <PoliciesView scenario={scenario} />;
      case 'audit':
        return <AuditLogView entries={entries} />;
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#0F1114',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <Sidebar
        industry={industry}
        onIndustryChange={handleIndustryChange}
        view={view}
        onViewChange={setView}
        pendingCount={pendingEscalations.length}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        <DashboardHeader view={view} scenario={scenario} isLive={isLive} />
        <main style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
          {renderView()}
        </main>
      </div>
    </div>
  );
}
