import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileImage, X, Check, Loader } from 'lucide-react';
import { uploadDocument, getDocumentDetails } from '@/services/api';
import { PageHeader } from '@/components/DataField';
import type { ProcessingStage } from '@/types';

const STAGES: ProcessingStage[] = [
  'CAPTURING',
  'UPLOADING',
  'READING_DOCUMENT',
  'EXTRACTING_DATA',
  'ANALYZING',
  'COMPLETE',
];

const STAGE_LABELS: Record<ProcessingStage, string> = {
  CAPTURING: 'Capturing image',
  UPLOADING: 'Uploading document',
  READING_DOCUMENT: 'Reading document',
  EXTRACTING_DATA: 'Extracting data',
  ANALYZING: 'Analyzing document',
  COMPLETE: 'Analysis complete',
};

export function DocumentUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [stage, setStage] = useState<ProcessingStage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const uploadIdKey = 'bga_current_upload_id';

  const handleFile = useCallback((f: File) => {
    setError(null);
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setStage(null);
    setError(null);
  };

  const handleProcess = async () => {
    if (!file) return;
    setError(null);

    for (let i = 0; i < STAGES.length - 1; i++) {
      setStage(STAGES[i]);
      if (STAGES[i] === 'UPLOADING') {
        try {
          const { uploadId } = await uploadDocument(file);
          sessionStorage.setItem(uploadIdKey, uploadId);
        } catch {
          setError('Failed to upload document. Please try again.');
          return;
        }
      } else if (STAGES[i] === 'ANALYZING') {
        try {
          await getDocumentDetails(sessionStorage.getItem(uploadIdKey) ?? 'mock');
        } catch {
          setError('Document analysis failed. Please try again.');
          return;
        }
      } else {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
    setStage('COMPLETE');
    setTimeout(() => navigate('/officer/document-details'), 800);
  };

  const currentStageIndex = stage ? STAGES.indexOf(stage) : -1;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Document Upload"
        subtitle="Upload identity document for analysis"
        meta="STEP 1 / 6"
      />

      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-sm cursor-pointer transition-all min-h-[320px] flex flex-col items-center justify-center gap-4 ${
            dragging
              ? 'border-sage bg-sage/5'
              : 'border-black/15 dark:border-white/15 hover:border-sage/50 hover:bg-black/2 dark:hover:bg-white/2'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="w-14 h-14 rounded-sm border border-black/10 dark:border-white/10 flex items-center justify-center">
            <UploadCloud className="w-7 h-7 text-sage" strokeWidth={1.25} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-graphite dark:text-ivory mb-1">
              Drag and drop document here
            </p>
            <p className="text-xs text-graphite/60 dark:text-lilac/40">
              or click to browse — PNG, JPG up to 10MB
            </p>
          </div>
          <button
            type="button"
            onClick={(event) => { event.stopPropagation(); cameraInputRef.current?.click(); }}
            className="relative px-4 py-2 text-xs font-medium text-sage border border-sage/40 rounded-sm hover:bg-sage/5 transition-colors"
          >
            USE DOCUMENT CAMERA
          </button>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="micro-label text-graphite/40 dark:text-lilac/20">DROP ZONE / DOC-01</span>
            <span className="micro-label text-graphite/40 dark:text-lilac/20">ENCRYPTED</span>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Preview */}
          <div className="border border-black/8 dark:border-white/8 rounded-sm bg-ivory/40 dark:bg-charcoal/30 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/8 dark:border-white/8">
              <div className="flex items-center gap-2">
                <FileImage className="w-4 h-4 text-sage" strokeWidth={1.5} />
                <span className="text-sm font-medium text-graphite dark:text-ivory">Document Preview</span>
              </div>
              {!stage && (
                <button onClick={handleRemove} className="text-graphite/60 dark:text-lilac/40 hover:text-vermilion transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="relative aspect-[4/3] bg-graphite dark:bg-charcoal flex items-center justify-center overflow-hidden">
              {preview ? (
                <img src={preview} alt="Document preview" className="w-full h-full object-contain" />
              ) : (
                <FileImage className="w-12 h-12 text-graphite/15" strokeWidth={1} />
              )}
              {stage && stage !== 'COMPLETE' && (
                <div className="absolute inset-0 bg-graphite/40 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-sage/30 border-t-sage rounded-full animate-spin" />
                </div>
              )}
              {/* Corner markers */}
              {['top-2 left-2 border-t border-l', 'top-2 right-2 border-t border-r', 'bottom-2 left-2 border-b border-l', 'bottom-2 right-2 border-b border-r'].map((pos, i) => (
                <div key={i} className={`absolute w-4 h-4 ${pos} border-ivory/40`} />
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-black/8 dark:border-white/8">
              <p className="text-xs mono text-graphite/60 dark:text-lilac/40 truncate">{file.name}</p>
              <p className="text-[11px] text-graphite/50 dark:text-lilac/30 mt-0.5">{(file.size / 1024).toFixed(1)} KB · {file.type}</p>
            </div>
          </div>

          {/* Processing */}
          <div className="flex flex-col">
            {error ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 border border-vermilion/20 bg-vermilion/5 rounded-sm p-8">
                <div className="w-10 h-10 rounded-sm border border-vermilion/30 flex items-center justify-center">
                  <X className="w-5 h-5 text-vermilion" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-vermilion text-center">{error}</p>
                <button onClick={handleRemove} className="text-xs mono text-graphite/65 dark:text-lilac/50 hover:text-graphite dark:hover:text-ivory transition-colors">
                  TRY AGAIN
                </button>
              </div>
            ) : stage ? (
              <div className="border border-black/8 dark:border-white/8 rounded-sm bg-ivory/40 dark:bg-charcoal/30 p-5 flex-1">
                <h3 className="micro-label text-graphite/80 dark:text-ivory/80 mb-4">PROCESSING PIPELINE</h3>
                <div className="flex flex-col gap-3">
                  {STAGES.map((s, i) => {
                    const done = i < currentStageIndex || stage === 'COMPLETE';
                    const active = i === currentStageIndex && stage !== 'COMPLETE';
                    return (
                      <div key={s} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          done ? 'bg-sage/20' : active ? 'bg-gold/20' : 'border border-black/10 dark:border-white/10'
                        }`}>
                          {done ? (
                            <Check className="w-3 h-3 text-sage" strokeWidth={2} />
                          ) : active ? (
                            <Loader className="w-3 h-3 text-gold animate-spin" strokeWidth={2} />
                          ) : (
                            <span className="w-1 h-1 rounded-full bg-stone-warm/30" />
                          )}
                        </div>
                        <span className={`text-sm ${done ? 'text-graphite dark:text-ivory' : active ? 'text-gold dark:text-gold-light' : 'text-graphite/50 dark:text-lilac/30'}`}>
                          {STAGE_LABELS[s]}
                        </span>
                        {active && <span className="ml-auto micro-label text-gold animate-pulse">PROCESSING</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-4">
                <div className="border border-black/8 dark:border-white/8 rounded-sm bg-ivory/40 dark:bg-charcoal/30 p-5">
                  <h3 className="micro-label text-graphite/80 dark:text-ivory/80 mb-3">DOCUMENT UNDER ANALYSIS</h3>
                  <p className="text-sm text-stone-warm/60 dark:text-lilac/50">
                    This document will be processed through an AI-powered analysis pipeline including OCR extraction, MRZ validation, tampering detection, and biometric matching.
                  </p>
                </div>
                <button
                  onClick={handleProcess}
                  className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-ivory bg-sage rounded-sm hover:bg-sage-dark transition-colors"
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload & Process
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
