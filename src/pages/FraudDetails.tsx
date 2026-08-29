import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, User, FileText, AlertTriangle, Clock, Check, Camera } from 'lucide-react';
import { getFraudDetails } from '@/services/api';
import { PageHeader, Section, DataField } from '@/components/DataField';
import { RiskBadge, CaseStatusBadge } from '@/components/StatusBadge';
import { LoadingState, ErrorState } from '@/components/States';
import type { FraudDetail } from '@/types';

export function FraudDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');
  const basePath = isAdmin ? '/admin/frauds' : '/officer/fraud';
  
  const [detail, setDetail] = useState<FraudDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getFraudDetails(id);
      setDetail(data);
    } catch {
      setError('Failed to load fraud case details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <LoadingState label="Loading fraud case" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!detail) return null;

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => navigate(basePath)}
        className="flex items-center gap-2 text-sm text-graphite/65 dark:text-lilac/50 hover:text-graphite dark:hover:text-ivory transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Frauds
      </button>

      <div className="flex items-center justify-between mb-6">
        <PageHeader title={detail.caseId} subtitle={`Recorded ${detail.dateTime.replace('T', ' ').split('.')[0]} UTC`} />
        <div className="flex items-center gap-3">
          <RiskBadge level={detail.riskLevel} score={detail.riskScore} />
          <CaseStatusBadge status={detail.status} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Identity */}
        <Section title="IDENTITY">
          <div className="flex gap-5">
            <div className="w-24 h-32 shrink-0 border border-vermilion/20 rounded-sm bg-graphite dark:bg-charcoal flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-30" />
              <User className="w-8 h-8 text-graphite/15" strokeWidth={1} />
              <div className="absolute top-1 left-1">
                <AlertTriangle className="w-3 h-3 text-vermilion/40" strokeWidth={1.5} />
              </div>
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

      {/* Suspicious indicators */}
      <Section title="SUSPICIOUS INDICATORS" badge="FLAGGED" className="mb-6">
        <div className="flex flex-col gap-3">
          {detail.suspiciousIndicators.map((ind, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-sm border border-vermilion/30 bg-vermilion/5 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-3 h-3 text-vermilion" strokeWidth={1.5} />
              </div>
              <span className="text-sm text-graphite dark:text-ivory">{ind}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* AI Findings */}
      <Section title="AI FINDINGS" badge="FORENSIC" className="mb-6">
        <div className="flex flex-col gap-3">
          {detail.aiFindings.map((finding, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-sm border border-lilac/30 bg-lilac/5 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] mono text-lilac">{i + 1}</span>
              </div>
              <span className="text-sm text-graphite dark:text-ivory">{finding}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Evidence preview */}
      <Section title="EVIDENCE / DOCUMENT PREVIEW" className="mb-6">
        <div className="aspect-video border border-black/10 dark:border-white/10 rounded-sm bg-graphite dark:bg-charcoal flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <FileText className="w-12 h-12 text-graphite/15" strokeWidth={1} />
          <div className="absolute bottom-3 left-3">
            <span className="micro-label text-ivory/30">EVIDENCE / {detail.caseId}</span>
          </div>
        </div>
      </Section>

      {/* Timeline */}
      <Section title="CASE TIMELINE" className="mb-6">
        <div className="flex flex-col gap-0">
          {detail.timeline.map((entry, i) => (
            <div key={i} className="flex items-start gap-4 pb-5 last:pb-0 relative">
              {i < detail.timeline.length - 1 && (
                <div className="absolute left-[11px] top-7 bottom-0 w-px bg-black/8 dark:bg-white/8" />
              )}
              <div className="w-6 h-6 rounded-full bg-sage/15 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-sage" strokeWidth={2} />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm text-graphite dark:text-ivory">{entry.step}</span>
                <span className="mono text-xs text-graphite/50 dark:text-lilac/30 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" strokeWidth={1.5} />
                  {entry.timestamp.replace('T', ' ').split('.')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <div className="flex items-center justify-between border-t border-black/8 dark:border-white/8 pt-6">
        <div className="flex flex-col gap-1">
          <span className="mono text-xs text-stone-warm/40 dark:text-lilac/30">CASE STATUS</span>
          <span className="text-sm text-graphite dark:text-ivory">{detail.caseStatus.replace('_', ' ')}</span>
        </div>
        <button
          onClick={() => navigate(`${basePath}/${detail.caseId}/face-scan`)}
          className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-ivory bg-vermilion rounded-sm hover:bg-vermilion-dark transition-colors"
        >
          <Camera className="w-4 h-4" />
          SCAN FACE
        </button>
      </div>
    </div>
  );
}
