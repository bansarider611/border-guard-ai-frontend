import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Activity, Clock, MapPin } from 'lucide-react';
import { getSystemDetails } from '@/services/api';
import { PageHeader, Section, DataField } from '@/components/DataField';
import { SystemStatusBadge } from '@/components/StatusBadge';
import { LoadingState, ErrorState } from '@/components/States';
import type { SystemDetail } from '@/types';

export function SystemDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<SystemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getSystemDetails(id);
      setDetail(data);
    } catch {
      setError('Failed to load system details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <LoadingState label="Loading system details" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!detail) return null;

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => navigate('/admin/systems')}
        className="flex items-center gap-2 text-sm text-graphite/65 dark:text-lilac/50 hover:text-graphite dark:hover:text-ivory transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Systems
      </button>

      <div className="flex items-center justify-between mb-6">
        <PageHeader title={detail.systemId} subtitle={detail.location} />
        <SystemStatusBadge status={detail.status} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: ShieldCheck, label: 'TOTAL SCREENINGS', value: detail.totalScreenings, accent: 'text-graphite dark:text-ivory' },
          { icon: Activity, label: 'APPROVED', value: detail.approvedCount, accent: 'text-sage' },
          { icon: ShieldCheck, label: 'HIGH RISK', value: detail.highRiskCount, accent: 'text-vermilion' },
        ].map((stat, i) => (
          <div key={i} className="border border-black/8 dark:border-white/8 rounded-sm bg-ivory/40 dark:bg-charcoal/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-3.5 h-3.5 ${stat.accent}`} strokeWidth={1.5} />
              <span className="micro-label text-graphite/50 dark:text-lilac/30">{stat.label}</span>
            </div>
            <div className={`text-xl font-semibold mono ${stat.accent}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Officer info */}
      <Section title="OFFICER INFORMATION" className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          <DataField label="Officer Name" value={detail.officerName} />
          <DataField label="Officer ID" value={detail.officerId} mono />
          <DataField label="Department" value={detail.department} />
          <DataField label="Designation" value={detail.designation} />
          <DataField label="Last Login" value={detail.lastLogin.replace('T', ' ').split('.')[0]} mono />
          <DataField label="Latest Activity" value={detail.latestActivity.replace('T', ' ').split('.')[0]} mono />
        </div>
      </Section>

      {/* Location */}
      <Section title="SYSTEM LOCATION">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-gold" strokeWidth={1.5} />
          <div>
            <div className="text-sm text-graphite dark:text-ivory">{detail.location}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <Clock className="w-3 h-3 text-graphite/50" strokeWidth={1.5} />
              <span className="mono text-xs text-stone-warm/50 dark:text-lilac/40">
                Last activity: {detail.latestActivity.replace('T', ' ').split('.')[0]} UTC
              </span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
