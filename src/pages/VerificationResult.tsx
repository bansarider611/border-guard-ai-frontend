import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, AlertTriangle, ShieldCheck, Scan, FileText, User } from 'lucide-react';
import { getScreeningResult } from '@/services/api';
import { PageHeader, Section, DataField } from '@/components/DataField';
import { LoadingState, ErrorState } from '@/components/States';
import { RiskBadge } from '@/components/StatusBadge';
import type { ScreeningResult } from '@/types';

export function VerificationResult() {
  const navigate = useNavigate();
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getScreeningResult(sessionStorage.getItem('bga_current_upload_id') ?? 'mock');
      setResult(res);
    } catch {
      setError('Failed to retrieve screening result.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState label="Computing verification result" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!result) return null;

  const approved = result.decision === 'APPROVED';

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="AI Verification Result"
        subtitle={`Screening ${result.screeningId}`}
        meta={new Date(result.timestamp).toISOString().replace('T', ' ').split('.')[0] + ' UTC'}
      />

      {/* Decision banner */}
      <div className={`relative border rounded-sm overflow-hidden mb-6 ${
        approved ? 'border-sage/30 bg-sage/5' : 'border-vermilion/30 bg-vermilion/5'
      }`}>
        <div className="grid md:grid-cols-[auto_1fr_auto] items-center gap-6 p-6">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-sm flex items-center justify-center ${
            approved ? 'bg-sage/15' : 'bg-vermilion/15'
          }`}>
            {approved ? (
              <ShieldCheck className="w-8 h-8 text-sage" strokeWidth={1.5} />
            ) : (
              <AlertTriangle className="w-8 h-8 text-vermilion" strokeWidth={1.5} />
            )}
          </div>

          {/* Decision text */}
          <div>
            <h2 className={`text-2xl font-semibold tracking-tight ${approved ? 'text-sage dark:text-sage-light' : 'text-vermilion'}`}>
              {approved ? 'IDENTITY VERIFIED' : 'HIGH RISK DETECTED'}
            </h2>
            <p className="text-sm text-graphite/65 dark:text-lilac/50 mt-1">
              {approved
                ? 'All verification checks passed successfully.'
                : 'Multiple suspicious indicators identified during screening.'}
            </p>
          </div>

          {/* Risk score gauge */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" strokeWidth="3" className="stroke-black/8 dark:stroke-white/8" />
                <circle
                  cx="40" cy="40" r="34" fill="none" strokeWidth="3"
                  className={approved ? 'stroke-sage' : 'stroke-vermilion'}
                  strokeDasharray={`${(result.riskScore || 0) * 2.14} 214`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-lg font-semibold mono ${approved ? 'text-sage' : 'text-vermilion'}`}>
                  {result.riskScore}
                </span>
                <span className="micro-label text-graphite/50 dark:text-lilac/30">RISK</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/8 dark:bg-white/8 border border-black/8 dark:border-white/8 rounded-sm overflow-hidden mb-6">
        {[
          { icon: ShieldCheck, label: 'IDENTITY', value: approved ? 'VERIFIED' : 'FLAGGED', ok: approved },
          { icon: FileText, label: 'DOCUMENT', value: result.documentStatus, ok: approved },
          { icon: User, label: 'FACE MATCH', value: result.faceStatus, ok: approved },
          { icon: AlertTriangle, label: 'RISK', value: result.riskLevel, ok: approved, risk: true },
        ].map((item, i) => (
          <div key={i} className="bg-ivory dark:bg-charcoal px-4 py-3 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <item.icon className={`w-3.5 h-3.5 ${item.ok ? 'text-sage' : 'text-vermilion'}`} strokeWidth={1.5} />
              <span className="micro-label text-graphite/60 dark:text-lilac/40">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${item.ok ? 'text-graphite dark:text-ivory' : 'text-vermilion'}`}>
                {item.value}
              </span>
              {item.ok ? (
                <Check className="w-3.5 h-3.5 text-sage" strokeWidth={2} />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-vermilion" strokeWidth={2} />
              )}
            </div>
            {item.risk && <RiskBadge level={result.riskLevel} score={result.riskScore} />}
          </div>
        ))}
      </div>

      <Section title="AI DOCUMENT SCREENING" badge="ANALYSIS COMPLETE" className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px border border-black/8 dark:border-white/8 bg-black/8 dark:bg-white/8 rounded-sm overflow-hidden">
          {[
            ['OCR Confidence', result.aiChecks?.ocrConfidence != null ? `${result.aiChecks.ocrConfidence}%` : 'N/A'],
            ['MRZ Validation', result.aiChecks?.mrzValidation ?? 'PENDING'],
            ['Document Structure', result.aiChecks?.documentStructure != null ? `${result.aiChecks.documentStructure}%` : 'N/A'],
            ['Tampering Probability', result.aiChecks?.tamperingProbability != null ? `${result.aiChecks.tamperingProbability}%` : 'N/A'],
            ['Face Match', result.faceMatchScore != null ? `${result.faceMatchScore}%` : 'N/A'],
            ['Database Verification', result.aiChecks?.databaseVerification ?? 'PENDING'],
          ].map(([label, value]) => (
            <div key={label} className="bg-ivory dark:bg-charcoal p-4">
              <div className="micro-label text-graphite/55 dark:text-lilac/40 mb-1.5">{label}</div>
              <div className="text-sm font-medium mono text-graphite dark:text-ivory">{value}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Suspicious indicators (only if high risk) */}
      {!approved && (result.suspiciousIndicators.length > 0 || result.reasons.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {result.suspiciousIndicators.length > 0 && (
            <Section title="SUSPICIOUS INDICATORS" badge="FLAGGED">
              <div className="flex flex-col gap-3">
                {result.suspiciousIndicators.map((ind, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-sm border border-vermilion/30 bg-vermilion/5 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="w-3 h-3 text-vermilion" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm text-graphite dark:text-ivory">{ind}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}
          {result.reasons.length > 0 && (
            <Section title="REASONS" badge="ANALYSIS">
              <div className="flex flex-col gap-3">
                {result.reasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-sm border border-lilac/30 bg-lilac/5 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] mono text-lilac">{i + 1}</span>
                    </div>
                    <span className="text-sm text-graphite dark:text-ivory">{reason}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      )}

      {/* Face match score (if available) */}
      {result.faceMatchScore != null && (
        <Section title="FACE MATCH ANALYSIS" className="mb-6">
          <div className="flex items-center gap-6">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="27" fill="none" strokeWidth="3" className="stroke-black/8 dark:stroke-white/8" />
                <circle
                  cx="32" cy="32" r="27" fill="none" strokeWidth="3"
                  className={approved ? 'stroke-sage' : 'stroke-vermilion'}
                  strokeDasharray={`${result.faceMatchScore * 1.7} 170`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm font-semibold mono ${approved ? 'text-sage' : 'text-vermilion'}`}>
                  {result.faceMatchScore}%
                </span>
              </div>
            </div>
            <div>
              <DataField label="Match Score" value={`${result.faceMatchScore}%`} mono />
              <p className="text-xs text-graphite/60 dark:text-lilac/40 mt-1">
                {approved ? 'Above minimum threshold for identity match' : 'Below minimum threshold for identity match'}
              </p>
            </div>
          </div>
        </Section>
      )}

      {/* CTA */}
      <div className="flex items-center justify-between border-t border-black/8 dark:border-white/8 pt-6">
        <div className="flex flex-col gap-1">
          <span className="mono text-xs text-stone-warm/40 dark:text-lilac/30">SCREENING ID</span>
          <span className="mono text-sm text-graphite dark:text-ivory">{result.screeningId}</span>
        </div>
        <button
          onClick={() => navigate('/officer/scan')}
          className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-ivory bg-sage rounded-sm hover:bg-sage-dark transition-colors"
        >
          <Scan className="w-4 h-4" />
          RETURN TO SCAN
        </button>
      </div>
    </div>
  );
}
