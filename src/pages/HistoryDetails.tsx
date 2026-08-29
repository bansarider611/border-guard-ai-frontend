import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, User, FileText, Scan, ShieldCheck, AlertTriangle, Check, Clock } from 'lucide-react';
import { getHistoryDetails } from '@/services/api';
import { PageHeader, Section, DataField } from '@/components/DataField';
import { StatusBadge, RiskBadge } from '@/components/StatusBadge';
import { LoadingState, ErrorState } from '@/components/States';
import type { HistoryDetail } from '@/types';

interface HistoryDetailProps {
  basePath?: string;
}

export function HistoryDetails({ basePath: basePath }: HistoryDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine basePath from current location
  const resolvedBasePath = basePath || (location.pathname.includes('/admin') ? '/admin/history' : '/officer/history');
  
  const [detail, setDetail] = useState<HistoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getHistoryDetails(id);
      setDetail(data);
    } catch {
      setError('Failed to load screening record.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <LoadingState label="Loading screening record" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!detail) return null;

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => navigate(resolvedBasePath)}
        className="flex items-center gap-2 text-sm text-graphite/65 dark:text-lilac/50 hover:text-graphite dark:hover:text-ivory transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to History
      </button>

      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title={`Screening ${detail.screeningId}`}
          subtitle={`Recorded ${detail.dateTime.replace('T', ' ').split('.')[0]} UTC`}
        />
        <div className="flex items-center gap-3">
          <StatusBadge status={detail.decision} />
          <RiskBadge level={detail.riskLevel} score={detail.riskScore} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Identity */}
        <Section title="IDENTITY">
          <div className="flex gap-5">
            <div className="w-24 h-32 shrink-0 border border-black/10 dark:border-white/10 rounded-sm bg-graphite dark:bg-charcoal flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-30" />
              <User className="w-8 h-8 text-graphite/15" strokeWidth={1} />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 flex-1">
              <DataField label="Full Name" value={detail.identity.fullName} />
              <DataField label="Date of Birth" value={detail.identity.dateOfBirth} />
              <DataField label="Gender" value={detail.identity.gender} />
              <DataField label="Nationality" value={detail.identity.nationality} />
            </div>
          </div>
        </Section>

        {/* Document */}
        <Section title="DOCUMENT">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <DataField label="Document Number" value={detail.document.documentNumber} mono />
            <DataField label="Document Type" value={detail.document.documentType} />
            <DataField label="Issuing Country" value={detail.document.issuingCountry} />
            <DataField label="Expiry Date" value={detail.document.expiryDate} />
          </div>
        </Section>
      </div>

      {/* Face Verification */}
      <Section title="FACE VERIFICATION" className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          <DataField label="Status" value={detail.faceVerification.status} />
          <DataField label="Match Score" value={detail.faceVerification.matchScore != null ? `${detail.faceVerification.matchScore}%` : null} mono />
          <DataField label="Timestamp" value={detail.faceVerification.timestamp.replace('T', ' ').split('.')[0]} mono />
        </div>
      </Section>

      {/* AI Analysis */}
      <Section title="AI ANALYSIS" badge="FORENSIC" className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          <DataField label="Document Confidence" value={detail.aiAnalysis.documentConfidence != null ? `${detail.aiAnalysis.documentConfidence}%` : null} mono />
          <DataField label="MRZ Validation" value={detail.aiAnalysis.mrzValidation} />
          <DataField label="Tampering Probability" value={detail.aiAnalysis.tamperingProbability != null ? `${detail.aiAnalysis.tamperingProbability}%` : null} mono />
          <DataField label="Face Match Score" value={detail.aiAnalysis.faceMatchScore != null ? `${detail.aiAnalysis.faceMatchScore}%` : null} mono />
          <DataField label="Database Verification" value={detail.aiAnalysis.databaseVerification} />
        </div>
      </Section>

      {/* Risk Assessment */}
      <Section title="RISK ASSESSMENT" className="mb-6">
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" strokeWidth="3" className="stroke-black/8 dark:stroke-white/8" />
              <circle
                cx="40" cy="40" r="34" fill="none" strokeWidth="3"
                className={detail.riskLevel === 'HIGH' ? 'stroke-vermilion' : detail.riskLevel === 'MEDIUM' ? 'stroke-gold' : 'stroke-sage'}
                strokeDasharray={`${(detail.riskScore || 0) * 2.14} 214`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-lg font-semibold mono ${detail.riskLevel === 'HIGH' ? 'text-vermilion' : 'text-sage'}`}>
                {detail.riskScore ?? '—'}
              </span>
              <span className="micro-label text-graphite/50 dark:text-lilac/30">SCORE</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {detail.riskAssessment.reasons.map((reason, i) => (
              <div key={i} className="flex items-start gap-2.5">
                {detail.riskLevel === 'HIGH' ? (
                  <AlertTriangle className="w-4 h-4 text-vermilion shrink-0 mt-0.5" strokeWidth={1.5} />
                ) : (
                  <Check className="w-4 h-4 text-sage shrink-0 mt-0.5" strokeWidth={1.5} />
                )}
                <span className="text-sm text-graphite dark:text-ivory">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Timeline */}
      <Section title="SCREENING TIMELINE">
        <div className="flex flex-col gap-0">
          {detail.timeline.map((entry, i) => (
            <div key={i} className="flex items-start gap-4 pb-5 last:pb-0 relative">
              {/* Line */}
              {i < detail.timeline.length - 1 && (
                <div className="absolute left-[11px] top-7 bottom-0 w-px bg-black/8 dark:bg-white/8" />
              )}
              {/* Dot */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                entry.status === 'COMPLETE' ? 'bg-sage/15' : 'bg-vermilion/15'
              }`}>
                {entry.status === 'COMPLETE' ? (
                  <Check className="w-3.5 h-3.5 text-sage" strokeWidth={2} />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-vermilion" strokeWidth={2} />
                )}
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {i === 0 && <FileText className="w-3.5 h-3.5 text-graphite/50" strokeWidth={1.5} />}
                  {i === 1 && <Scan className="w-3.5 h-3.5 text-graphite/50" strokeWidth={1.5} />}
                  {i === 2 && <ShieldCheck className="w-3.5 h-3.5 text-graphite/50" strokeWidth={1.5} />}
                  {i === 3 && <User className="w-3.5 h-3.5 text-graphite/50" strokeWidth={1.5} />}
                  {i === 4 && <Scan className="w-3.5 h-3.5 text-graphite/50" strokeWidth={1.5} />}
                  {i === 5 && <ShieldCheck className="w-3.5 h-3.5 text-stone-warm/40" strokeWidth={1.5} />}
                  <span className="text-sm text-graphite dark:text-ivory">{entry.step}</span>
                </div>
                <span className="mono text-xs text-stone-warm/40 dark:text-lilac/30 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" strokeWidth={1.5} />
                  {entry.timestamp.replace('T', ' ').split('.')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
