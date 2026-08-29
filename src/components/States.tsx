import { AlertCircle, RefreshCw, Inbox } from 'lucide-react';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-sm ${className}`} />;
}

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-6 h-6 border-2 border-sage/30 border-t-sage rounded-full animate-spin" />
      <span className="micro-label text-graphite/65 dark:text-lilac/50">{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 rounded-sm border border-vermilion/30 bg-vermilion/5 flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-vermilion" strokeWidth={1.5} />
      </div>
      <div className="text-center max-w-sm">
        <p className="text-sm font-medium text-graphite dark:text-ivory mb-1">Unable to load data</p>
        <p className="text-xs text-graphite/65 dark:text-lilac/50">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-xs mono tracking-wider border border-black/10 dark:border-white/10 rounded-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-graphite dark:text-ivory"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          RETRY
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-12 h-12 rounded-sm border border-black/8 dark:border-white/8 flex items-center justify-center">
        <Inbox className="w-6 h-6 text-graphite/50 dark:text-lilac/40" strokeWidth={1.5} />
      </div>
      <p className="text-sm text-graphite/65 dark:text-lilac/50">{message}</p>
    </div>
  );
}
