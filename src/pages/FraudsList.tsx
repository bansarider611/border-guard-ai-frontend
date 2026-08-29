import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { getFrauds } from '@/services/api';
import { PageHeader } from '@/components/DataField';
import { RiskBadge, CaseStatusBadge } from '@/components/StatusBadge';
import { ErrorState, EmptyState, Skeleton } from '@/components/States';
import type { FraudItem, RiskLevel } from '@/types';

export function FraudsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');
  const basePath = isAdmin ? '/admin/frauds' : '/officer/fraud';
  
  const [items, setItems] = useState<FraudItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'ESCALATED'>('ALL');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFrauds();
      setItems(data);
    } catch {
      setError('Failed to load fraud cases.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let result = items;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((i) =>
        i.caseId.toLowerCase().includes(q) ||
        i.documentNumber.toLowerCase().includes(q) ||
        i.personName.toLowerCase().includes(q) ||
        i.reason.toLowerCase().includes(q)
      );
    }
    if (riskFilter !== 'ALL') result = result.filter((i) => i.riskLevel === riskFilter);
    if (statusFilter !== 'ALL') result = result.filter((i) => i.status === statusFilter);
    return result;
  }, [items, search, riskFilter, statusFilter]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Frauds" subtitle="Investigative fraud case registry" />
        <div className="flex flex-col gap-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="animate-fade-in">
      <PageHeader title="Frauds" subtitle="Investigative fraud case registry" meta={`${filtered.length} CASES`} />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite/40 dark:text-lilac/40" strokeWidth={1.5} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by case ID, document, person, or reason"
            className="w-full pl-10 pr-4 py-2 text-sm bg-transparent border border-black/10 dark:border-white/10 rounded-sm text-graphite dark:text-ivory placeholder:text-graphite/30 dark:placeholder:text-lilac/30 focus:outline-none focus:border-vermilion transition-colors"
          />
        </div>
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'ALL')}
          className="px-3 py-2 text-sm bg-transparent border border-black/10 dark:border-white/10 rounded-sm text-graphite dark:text-ivory focus:outline-none focus:border-vermilion"
        >
          <option value="ALL">All Risk</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'ESCALATED')}
          className="px-3 py-2 text-sm bg-transparent border border-black/10 dark:border-white/10 rounded-sm text-graphite dark:text-ivory focus:outline-none focus:border-vermilion"
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="RESOLVED">Resolved</option>
          <option value="ESCALATED">Escalated</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No fraud cases match your filters." />
      ) : (
        <div className="border border-black/8 dark:border-white/8 rounded-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/8 dark:border-white/8 bg-black/3 dark:bg-white/3">
                {['CASE ID', 'PERSON', 'DOCUMENT', 'DATE/TIME', 'RISK', 'REASON', 'STATUS', ''].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left micro-label text-graphite/60 dark:text-lilac/40 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.caseId}
                  onClick={() => navigate(`${basePath}/${item.caseId}`)}
                  className="border-b border-black/5 dark:border-white/5 hover:bg-black/3 dark:hover:bg-white/3 cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3 mono text-xs text-vermilion whitespace-nowrap">{item.caseId}</td>
                  <td className="px-4 py-3 text-graphite/65 dark:text-lilac/50 whitespace-nowrap">{item.personName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs text-graphite dark:text-ivory">{item.documentType}</span>
                    <span className="mono text-[11px] text-graphite/60 dark:text-lilac/40 ml-2">{item.documentNumber}</span>
                  </td>
                  <td className="px-4 py-3 mono text-xs text-graphite/65 dark:text-lilac/50 whitespace-nowrap">{item.dateTime.replace('T', ' ').split('.')[0]}</td>
                  <td className="px-4 py-3"><RiskBadge level={item.riskLevel} score={item.riskScore} /></td>
                  <td className="px-4 py-3 text-xs text-graphite dark:text-ivory whitespace-nowrap">{item.reason}</td>
                  <td className="px-4 py-3"><CaseStatusBadge status={item.status} /></td>
                  <td className="px-4 py-3">
                    <ChevronRight className="w-4 h-4 text-stone-warm/30 dark:text-lilac/30 group-hover:text-vermilion transition-colors" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
