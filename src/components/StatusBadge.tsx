import type { ScreeningStatus, RiskLevel } from '@/types';

export function StatusBadge({ status }: { status: ScreeningStatus }) {
  const config: Record<ScreeningStatus, { label: string; cls: string; dot: string }> = {
    APPROVED: {
      label: 'APPROVED',
      cls: 'text-sage dark:text-sage-light border-sage/30 bg-sage/5',
      dot: 'bg-sage',
    },
    HIGH_RISK: {
      label: 'HIGH RISK',
      cls: 'text-vermilion border-vermilion/30 bg-vermilion/5',
      dot: 'bg-vermilion',
    },
    PENDING: {
      label: 'PENDING',
      cls: 'text-gold dark:text-gold-light border-gold/30 bg-gold/5',
      dot: 'bg-gold',
    },
    FAILED: {
      label: 'FAILED',
      cls: 'text-lilac dark:text-lilac-light border-lilac/30 bg-lilac/5',
      dot: 'bg-lilac',
    },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] mono font-medium tracking-wider border rounded-sm ${c.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export function RiskBadge({ level, score }: { level: RiskLevel; score?: number | null }) {
  const config: Record<RiskLevel, { cls: string; dot: string }> = {
    LOW: { cls: 'text-sage dark:text-sage-light', dot: 'bg-sage' },
    MEDIUM: { cls: 'text-gold dark:text-gold-light', dot: 'bg-gold' },
    HIGH: { cls: 'text-vermilion', dot: 'bg-vermilion' },
  };
  const c = config[level];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] mono font-medium tracking-wider ${c.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {level}
      {score != null && <span className="text-graphite/60 dark:text-lilac/40 ml-1">({score})</span>}
    </span>
  );
}

export function SystemStatusBadge({ status }: { status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' }) {
  const config = {
    ACTIVE: { cls: 'text-sage dark:text-sage-light border-sage/30', dot: 'bg-sage' },
    INACTIVE: { cls: 'text-lilac dark:text-lilac-light border-lilac/30', dot: 'bg-lilac' },
    MAINTENANCE: { cls: 'text-gold dark:text-gold-light border-gold/30', dot: 'bg-gold' },
  } as const;
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] mono font-medium tracking-wider border rounded-sm ${c.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

export function CaseStatusBadge({ status }: { status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'ESCALATED' }) {
  const config = {
    OPEN: { cls: 'text-vermilion border-vermilion/30 bg-vermilion/5', dot: 'bg-vermilion' },
    UNDER_REVIEW: { cls: 'text-gold dark:text-gold-light border-gold/30 bg-gold/5', dot: 'bg-gold' },
    RESOLVED: { cls: 'text-sage dark:text-sage-light border-sage/30 bg-sage/5', dot: 'bg-sage' },
    ESCALATED: { cls: 'text-vermilion border-vermilion/30 bg-vermilion/5', dot: 'bg-vermilion' },
  } as const;
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] mono font-medium tracking-wider border rounded-sm ${c.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status.replace('_', ' ')}
    </span>
  );
}
