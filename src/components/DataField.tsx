interface DataFieldProps {
  label: string;
  value: string | null;
  mono?: boolean;
}

export function DataField({ label, value, mono }: DataFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="micro-label text-graphite/60 dark:text-lilac/40">{label}</span>
      <span className={`text-sm ${mono ? 'mono' : ''} ${value ? 'text-graphite dark:text-ivory' : 'text-graphite/50 dark:text-lilac/30 italic'}`}>
        {value || 'NOT AVAILABLE'}
      </span>
    </div>
  );
}

interface SectionProps {
  title: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ title, badge, children, className = '' }: SectionProps) {
  return (
    <div className={`border border-black/8 dark:border-white/8 rounded-sm bg-ivory/40 dark:bg-charcoal/30 ${className}`}>
      <div className="flex items-center justify-between px-5 py-3 border-b border-black/8 dark:border-white/8">
        <h3 className="micro-label text-graphite/85 dark:text-ivory/80">{title}</h3>
        {badge && <span className="micro-label text-gold">{badge}</span>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function PageHeader({ title, subtitle, meta }: { title: string; subtitle?: string; meta?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-graphite dark:text-ivory">{title}</h1>
        {meta && <span className="micro-label text-graphite/60 dark:text-lilac/40">{meta}</span>}
      </div>
      {subtitle && <p className="text-sm text-graphite/65 dark:text-lilac/50 mt-1">{subtitle}</p>}
    </div>
  );
}
