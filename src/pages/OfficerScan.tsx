import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, Clock, ShieldCheck, Activity } from 'lucide-react';
import { getSession } from '@/services/api';
import { PageHeader } from '@/components/DataField';

export function OfficerScan() {
  const navigate = useNavigate();
  const session = getSession();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Scan Home"
        subtitle="Border security screening workstation"
        meta={`SESSION / ${session?.user.officerId || 'OFC-XXXX'}`}
      />

      {/* Status strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/8 dark:bg-white/8 border border-black/8 dark:border-white/8 rounded-sm overflow-hidden mb-8">
        {[
          { icon: ShieldCheck, label: 'CURRENT OFFICER', value: session?.user.name || 'Officer', sub: session?.user.officerId },
          { icon: Activity, label: 'SYSTEM STATUS', value: 'OPERATIONAL', sub: 'All systems online' },
          { icon: Clock, label: 'LAST SCREENING', value: 'SCR-7K3M9X', sub: '09:14 UTC' },
          { icon: ShieldCheck, label: 'SECURE SESSION', value: 'ACTIVE', sub: 'Encrypted channel' },
        ].map((item, i) => (
          <div key={i} className="bg-ivory dark:bg-charcoal px-4 py-3 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <item.icon className="w-3.5 h-3.5 text-sage" strokeWidth={1.5} />
              <span className="micro-label text-stone-warm/50 dark:text-lilac/40">{item.label}</span>
            </div>
            <span className="text-sm font-medium text-graphite dark:text-ivory">{item.value}</span>
            <span className="mono text-[11px] text-stone-warm/40 dark:text-lilac/30">{item.sub}</span>
          </div>
        ))}
      </div>

      {/* Main CTA */}
      <div className="border border-black/8 dark:border-white/8 rounded-sm bg-ivory/40 dark:bg-charcoal/30 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left: Visual */}
          <div className="relative aspect-video md:aspect-auto md:min-h-[340px] bg-graphite dark:bg-charcoal grid-bg flex items-center justify-center">
            <div className="relative w-40 h-40">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-full border border-sage/30"
                  style={{ transform: `scale(${1 + i * 0.25})`, borderWidth: '1px' }}
                />
              ))}
              <div className="absolute inset-0 rounded-full border-2 border-sage/40 animate-pulse-slow" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-sage/20" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-sage/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Scan className="w-12 h-12 text-sage/60" strokeWidth={1} />
              </div>
            </div>
            <div className="absolute top-4 left-4">
              <span className="micro-label text-ivory/40">READY</span>
            </div>
            <div className="absolute bottom-4 right-4">
              <span className="mono text-[11px] text-ivory/30">{time.toISOString().split('.')[0]}Z</span>
            </div>
          </div>

          {/* Right: Action */}
          <div className="flex flex-col justify-center p-8 md:p-10">
            <h2 className="text-xl font-semibold text-graphite dark:text-ivory mb-2">
              Start New Screening
            </h2>
            <p className="text-sm text-graphite/65 dark:text-lilac/50 mb-6">
              Begin a new identity and document verification screening. Upload an identity document, review extracted data, and perform biometric face matching.
            </p>
            <button
              onClick={() => navigate('/officer/document-upload')}
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-ivory bg-sage rounded-sm hover:bg-sage-dark transition-colors w-fit"
            >
              <Scan className="w-4 h-4" />
              START NEW SCREENING
            </button>
            <div className="mt-6 flex items-center gap-4 text-xs text-stone-warm/40 dark:text-lilac/30">
              <span className="mono">STEP 1 / 6</span>
              <span>Upload → Details → Face Scan → Result</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
