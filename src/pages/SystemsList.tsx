import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { getSystems } from '@/services/api';
import { PageHeader } from '@/components/DataField';
import { SystemStatusBadge } from '@/components/StatusBadge';
import { ErrorState, EmptyState, Skeleton } from '@/components/States';
import type { SystemItem } from '@/types';

export function SystemsList() {
  const navigate = useNavigate();
  const [items, setItems] = useState<SystemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'>('ALL');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSystems();
      setItems(data);
    } catch {
      setError('Failed to load systems.');
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
        i.systemId.toLowerCase().includes(q) ||
        i.officerId.toLowerCase().includes(q) ||
        i.officerName.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'ALL') result = result.filter((i) => i.status === statusFilter);
    return result;
  }, [items, search, statusFilter]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Systems" subtitle="Registered screening workstations" />
        <div className="flex flex-col gap-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="animate-fade-in">
      <PageHeader title="Systems" subtitle="Registered screening workstations" meta={`${filtered.length} SYSTEMS`} />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite/40 dark:text-lilac/40" strokeWidth={1.5} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by system ID, officer, or location"
            className="w-full pl-10 pr-4 py-2 text-sm bg-transparent border border-black/10 dark:border-white/10 rounded-sm text-graphite dark:text-ivory placeholder:text-graphite/30 dark:placeholder:text-lilac/30 focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE')}
          className="px-3 py-2 text-sm bg-transparent border border-black/10 dark:border-white/10 rounded-sm text-graphite dark:text-ivory focus:outline-none focus:border-gold"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No systems match your filters." />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((item) => (
            <div
              key={item.systemId}
              onClick={() => navigate(`/admin/systems/${item.systemId}`)}
              className="flex items-center justify-between px-4 py-3.5 border border-black/8 dark:border-white/8 rounded-sm hover:bg-black/3 dark:hover:bg-white/3 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="mono text-sm text-graphite dark:text-ivory">{item.systemId}</span>
                  <span className="text-xs text-graphite/60 dark:text-lilac/40">{item.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end gap-0.5">
                  <span className="text-xs text-graphite dark:text-ivory">{item.officerName}</span>
                  <span className="mono text-[11px] text-graphite/60 dark:text-lilac/40">{item.officerId}</span>
                </div>
                <SystemStatusBadge status={item.status} />
                <span className="mono text-[11px] text-graphite/50 dark:text-lilac/30 hidden lg:inline">
                  {item.latestActivity.replace('T', ' ').split('.')[0]}
                </span>
                <ChevronRight className="w-4 h-4 text-stone-warm/30 dark:text-lilac/30 group-hover:text-gold transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
