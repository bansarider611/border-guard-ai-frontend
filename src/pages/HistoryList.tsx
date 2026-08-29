import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ArrowUpDown, ChevronRight } from 'lucide-react';
import { getHistory } from '@/services/api';
import { PageHeader } from '@/components/DataField';
import { StatusBadge, RiskBadge } from '@/components/StatusBadge';
import { ErrorState, EmptyState, Skeleton } from '@/components/States';
import type { HistoryItem, ScreeningStatus, RiskLevel } from '@/types';

interface HistoryListProps {
  basePath?: string;
  title?: string;
}

export function HistoryList({ basePath: basePath, title = 'Screening History' }: HistoryListProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine basePath from current location
  const resolvedBasePath = basePath || (location.pathname.includes('/admin') ? '/admin/history' : '/officer/history');
  
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ScreeningStatus | 'ALL'>('ALL');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'risk'>('date');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistory();
      setItems(data);
    } catch {
      setError('Failed to load screening history.');
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
        i.screeningId.toLowerCase().includes(q) ||
        i.documentNumber.toLowerCase().includes(q) ||
        i.personName.toLowerCase().includes(q) ||
        i.officerId.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'ALL') result = result.filter((i) => i.decision === statusFilter);
    if (riskFilter !== 'ALL') result = result.filter((i) => i.riskLevel === riskFilter);
    result = [...result].sort((a, b) => {
      if (sortBy === 'date') return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
      return (b.riskScore || 0) - (a.riskScore || 0);
    });
    return result;
  }, [items, search, statusFilter, riskFilter, sortBy]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title={title} subtitle="All screening records" />
        <div className="flex flex-col gap-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="animate-fade-in">
      <PageHeader title={title} subtitle="All screening records" meta={`${filtered.length} RECORDS`} />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite/40 dark:text-lilac/40" strokeWidth={1.5} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, document, person, or officer"
            className="w-full pl-10 pr-4 py-2 text-sm bg-transparent border border-black/10 dark:border-white/10 rounded-sm text-graphite dark:text-ivory placeholder:text-graphite/30 dark:placeholder:text-lilac/30 focus:outline-none focus:border-sage transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ScreeningStatus | 'ALL')}
          className="px-3 py-2 text-sm bg-transparent border border-black/10 dark:border-white/10 rounded-sm text-graphite dark:text-ivory focus:outline-none focus:border-sage"
        >
          <option value="ALL">All Statuses</option>
          <option value="APPROVED">Approved</option>
          <option value="HIGH_RISK">High Risk</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'ALL')}
          className="px-3 py-2 text-sm bg-transparent border border-black/10 dark:border-white/10 rounded-sm text-graphite dark:text-ivory focus:outline-none focus:border-sage"
        >
          <option value="ALL">All Risk</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <button
          onClick={() => setSortBy(s => s === 'date' ? 'risk' : 'date')}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-black/10 dark:border-white/10 rounded-sm text-graphite dark:text-lilac hover:text-graphite dark:hover:text-ivory transition-colors"
        >
          <ArrowUpDown className="w-4 h-4" />
          {sortBy === 'date' ? 'Date' : 'Risk'}
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState message="No screening records match your filters." />
      ) : (
        <div className="border border-black/8 dark:border-white/8 rounded-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/8 dark:border-white/8 bg-black/3 dark:bg-white/3">
                {['SCREENING ID', 'PERSON', 'DOCUMENT', 'DATE/TIME', 'DECISION', 'RISK', 'OFFICER', ''].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left micro-label text-graphite/60 dark:text-lilac/40 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.screeningId}
                  onClick={() => navigate(`${resolvedBasePath}/${item.screeningId}`)}
                  className="border-b border-black/5 dark:border-white/5 hover:bg-black/3 dark:hover:bg-white/3 cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3 mono text-xs text-graphite dark:text-ivory whitespace-nowrap">{item.screeningId}</td>
                  <td className="px-4 py-3 text-graphite/65 dark:text-lilac/50 whitespace-nowrap">{item.personName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs text-graphite dark:text-ivory">{item.documentType}</span>
                    <span className="mono text-[11px] text-graphite/60 dark:text-lilac/40 ml-2">{item.documentNumber}</span>
                  </td>
                  <td className="px-4 py-3 mono text-xs text-graphite/65 dark:text-lilac/50 whitespace-nowrap">{item.dateTime.replace('T', ' ').split('.')[0]}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.decision} /></td>
                  <td className="px-4 py-3"><RiskBadge level={item.riskLevel} score={item.riskScore} /></td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs text-graphite dark:text-ivory">{item.officerName}</span>
                    <span className="mono text-[11px] text-graphite/60 dark:text-lilac/40 ml-1.5">{item.officerId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight className="w-4 h-4 text-stone-warm/30 dark:text-lilac/30 group-hover:text-sage transition-colors" />
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
