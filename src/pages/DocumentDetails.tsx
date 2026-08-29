import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, User, FileText, ShieldCheck } from 'lucide-react';
import { getDocumentDetails } from '@/services/api';
import { PageHeader, Section, DataField } from '@/components/DataField';
import { LoadingState, ErrorState } from '@/components/States';
import type { DocumentDetailsResponse } from '@/types';

export function DocumentDetails() {
  const navigate = useNavigate();
  const [data, setData] = useState<DocumentDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDocumentDetails(sessionStorage.getItem('bga_current_upload_id') ?? 'mock');
      setData(res);
    } catch {
      setError('Failed to retrieve document details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState label="Extracting document data" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data) return null;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Document Details"
        subtitle="Identity dossier extracted from uploaded document"
        meta="STEP 2 / 6"
      />

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Identity */}
        <Section title="IDENTITY" className="lg:col-span-2">
          <div className="flex gap-6">
            {/* Photo placeholder */}
            <div className="w-28 h-36 shrink-0 border border-black/10 dark:border-white/10 rounded-sm bg-graphite dark:bg-charcoal flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-30" />
              <User className="w-10 h-10 text-graphite/15" strokeWidth={1} />
              <div className="absolute bottom-1 left-1 right-1">
                <span className="micro-label text-ivory/30">PHOTO</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 flex-1">
              <DataField label="Full Name" value={data.identity.fullName} />
              <DataField label="Date of Birth" value={data.identity.dateOfBirth} />
              <DataField label="Gender" value={data.identity.gender} />
              <DataField label="Nationality" value={data.identity.nationality} />
              <div className="col-span-2">
                <DataField label="Address" value={data.identity.address} />
              </div>
            </div>
          </div>
        </Section>

        {/* Verification */}
        <Section title="VERIFICATION" badge="STATUS">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-graphite/60 dark:text-lilac/40" strokeWidth={1.5} />
                <span className="text-sm text-graphite dark:text-ivory">Document</span>
              </div>
              <span className="micro-label text-gold">{data.verification.documentStatus}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scan className="w-4 h-4 text-graphite/60 dark:text-lilac/40" strokeWidth={1.5} />
                <span className="text-sm text-graphite dark:text-ivory">Extraction</span>
              </div>
              <span className="micro-label text-sage">{data.verification.extractionStatus}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-graphite/60 dark:text-lilac/40" strokeWidth={1.5} />
                <span className="text-sm text-graphite dark:text-ivory">Analysis</span>
              </div>
              <span className="micro-label text-sage">{data.verification.analysisStatus}</span>
            </div>
          </div>
        </Section>
      </div>

      {/* Document */}
      <Section title="DOCUMENT" className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          <DataField label="Document Number" value={data.document.documentNumber} mono />
          <DataField label="Document Type" value={data.document.documentType} />
          <DataField label="Issuing Country" value={data.document.issuingCountry} />
          <DataField label="Issue Date" value={data.document.issueDate} />
          <DataField label="Expiry Date" value={data.document.expiryDate} />
          <DataField label="Visa Information" value={data.document.visaInfo} />
        </div>
      </Section>

      {/* CTA */}
      <div className="flex items-center justify-between border-t border-black/8 dark:border-white/8 pt-6">
        <div className="flex items-center gap-2 text-xs text-stone-warm/40 dark:text-lilac/30">
          <span className="mono">NEXT / PERSON FACE SCAN</span>
        </div>
        <button
          onClick={() => navigate('/officer/face-scan')}
          className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-ivory bg-sage rounded-sm hover:bg-sage-dark transition-colors"
        >
          <Scan className="w-4 h-4" />
          SCAN FACE
        </button>
      </div>
    </div>
  );
}
