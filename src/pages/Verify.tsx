import { useNavigate } from 'react-router-dom';
import { PageHeader, Section } from '@/components/DataField';
import { FileUp } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';

export function Verify() {
  const navigate = useNavigate();

  const steps = [
    { num: '1', label: 'DOCUMENT', desc: 'Upload and scan travel document' },
    { num: '2', label: 'IDENTITY', desc: 'Extract identity information' },
    { num: '3', label: 'FACE', desc: 'Capture and match face' },
    { num: '4', label: 'FRAUD ANALYSIS', desc: 'Run AI fraud detection' },
    { num: '5', label: 'DECISION', desc: 'Final verification result' },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title="Verification Workflow"
        subtitle="Complete the identity verification process"
        meta="STEP 1 / 5"
      />

      {/* Progress indicator */}
      <div className="border border-black/8 dark:border-white/8 rounded-sm bg-ivory/40 dark:bg-charcoal/30 p-6">
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div key={step.num} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-sm font-bold ${
                idx === 0 ? 'bg-sage text-ivory' : idx < 1 ? 'bg-sage/30 text-sage' : 'bg-graphite/10 text-graphite/60'
              }`}>
                {step.num}
              </div>
              <div className="flex-1">
                <h4 className="micro-label text-graphite/60 dark:text-ivory/60">{step.label}</h4>
                <p className="text-xs text-graphite/60 dark:text-lilac/40 mt-0.5">{step.desc}</p>
              </div>
              {idx === 0 ? (
                <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Primary action */}
      <Section title="START VERIFICATION" className="border-sage/30">
        <div className="space-y-4">
          <p className="text-sm text-graphite/65 dark:text-lilac/50">
            Begin the screening process by uploading a travel document.
          </p>
          <button
            onClick={() => navigate('/officer/document-upload')}
            className="w-full py-3 rounded-sm bg-sage hover:bg-sage-dark text-ivory font-medium text-sm tracking-wide transition-colors flex items-center justify-center gap-2 group"
          >
            <FileUp className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={2} />
            UPLOAD DOCUMENT
          </button>
        </div>
      </Section>

      {/* Info boxes */}
      <div className="grid md:grid-cols-2 gap-6">
        <Section title="REQUIREMENTS" badge="IMPORTANT">
          <ul className="space-y-2 text-xs text-graphite/65 dark:text-lilac/50">
            <li className="flex gap-2">
              <span className="text-sage">•</span>
              <span>Valid travel document (passport, visa, national ID)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-sage">•</span>
              <span>Clear document image</span>
            </li>
            <li className="flex gap-2">
              <span className="text-sage">•</span>
              <span>Proper lighting for face capture</span>
            </li>
            <li className="flex gap-2">
              <span className="text-sage">•</span>
              <span>Steady internet connection</span>
            </li>
          </ul>
        </Section>

        <Section title="GUIDANCE" badge="TIPS">
          <ul className="space-y-2 text-xs text-graphite/65 dark:text-lilac/50">
            <li className="flex gap-2">
              <span className="text-gold">→</span>
              <span>Ensure document is fully visible and unobstructed</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gold">→</span>
              <span>Remove glasses for face capture</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gold">→</span>
              <span>Follow on-screen instructions carefully</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gold">→</span>
              <span>Wait for all processing to complete</span>
            </li>
          </ul>
        </Section>
      </div>

      {/* Disclaimer */}
      <div className="flex gap-3 p-4 rounded-sm bg-lilac/5 border border-lilac/20">
        <AlertTriangle className="w-4 h-4 text-lilac shrink-0 mt-0.5" strokeWidth={2} />
        <p className="text-xs text-lilac/70">
          This screening system is authorized for border security personnel only. All data is processed securely and in compliance with local regulations.
        </p>
      </div>
    </div>
  );
}
