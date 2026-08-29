import { useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { getDashboardStats, getHistory, getFrauds } from '@/services/api';
import { PageHeader, Section } from '@/components/DataField';
import { StatusBadge, RiskBadge, CaseStatusBadge } from '@/components/StatusBadge';
import { ErrorState, Skeleton } from '@/components/States';
import { useNavigate } from 'react-router-dom';
import type { DashboardStats, HistoryItem, FraudItem } from '@/types';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<HistoryItem[]>([]);
  const [frauds, setFrauds] = useState<FraudItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, h, f] = await Promise.all([getDashboardStats(), getHistory(), getFrauds()]);
      setStats(s);
      setRecent(h.slice(0, 4));
      setFrauds(f.slice(0, 3));
    } catch {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Admin Dashboard" subtitle="Border security intelligence overview" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={load} />;

  const cards = [
    { icon: ShieldCheck, label: 'TOTAL SCREENINGS', value: stats?.totalScreenings ?? '—', accent: 'text-graphite dark:text-ivory', sub: 'All-time screenings' },
    { icon: AlertTriangle, label: 'HIGH-RISK CASES', value: stats?.highRiskCases ?? '—', accent: 'text-vermilion', sub: 'Flagged screenings' },
    { icon: CheckCircle, label: 'APPROVED', value: stats?.approvedCount ?? '—', accent: 'text-sage', sub: 'Cleared screenings' },
    { icon: Users, label: 'ACTIVE OFFICERS', value: stats?.activeOfficers ?? '—', accent: 'text-gold', sub: 'Currently online' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Border security intelligence overview"
        meta="API-DRIVEN DATA"
      />

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {cards.map((card, i) => (
          <div key={i} className="border border-black/8 dark:border-white/8 rounded-sm bg-ivory/40 dark:bg-charcoal/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <card.icon className={`w-4 h-4 ${card.accent}`} strokeWidth={1.5} />
              <span className="micro-label text-graphite/50 dark:text-lilac/30">{card.label}</span>
            </div>
            <div className={`text-2xl font-semibold mono ${card.accent}`}>{card.value}</div>
            <div className="text-xs text-graphite/50 dark:text-lilac/30 mt-1">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent screenings */}
        <Section title="RECENT SCREENINGS">
          <div className="flex flex-col gap-2">
            {recent.map((item) => (
              <div
                key={item.screeningId}
                onClick={() => navigate(`/admin/history/${item.screeningId}`)}
                className="flex items-center justify-between px-3 py-2.5 rounded-sm hover:bg-black/3 dark:hover:bg-white/3 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="mono text-xs text-graphite dark:text-ivory">{item.screeningId}</span>
                  <StatusBadge status={item.decision} />
                </div>
                <div className="flex items-center gap-3">
                  <RiskBadge level={item.riskLevel} score={item.riskScore} />
                  <ArrowRight className="w-3.5 h-3.5 text-graphite/30 group-hover:text-gold transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Recent frauds */}
        <Section title="RECENT FRAUD CASES" badge="ACTIVE">
          <div className="flex flex-col gap-2">
            {frauds.map((fraud) => (
              <div
                key={fraud.caseId}
                onClick={() => navigate(`/admin/frauds/${fraud.caseId}`)}
                className="flex items-center justify-between px-3 py-2.5 rounded-sm hover:bg-black/3 dark:hover:bg-white/3 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="mono text-xs text-vermilion">{fraud.caseId}</span>
                  <CaseStatusBadge status={fraud.status} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-graphite/60 dark:text-lilac/40">{fraud.reason}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-warm/20 group-hover:text-vermilion transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          { label: 'Systems', path: '/admin/systems', icon: ShieldCheck },
          { label: 'Frauds', path: '/admin/frauds', icon: AlertTriangle },
          { label: 'History', path: '/admin/history', icon: TrendingUp },
          { label: 'Add Officer', path: '/admin/officers/new', icon: Users },
        ].map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className="flex items-center gap-3 px-4 py-3 border border-black/8 dark:border-white/8 rounded-sm hover:bg-black/3 dark:hover:bg-white/3 transition-colors text-left"
          >
            <link.icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
            <span className="text-sm text-graphite dark:text-ivory">{link.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
