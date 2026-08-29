import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaceScanner } from '@/components/FaceScanner';
import { verifyPersonFace } from '@/services/api';
import { Check, Loader } from 'lucide-react';

export function PersonFaceScan() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'scan' | 'analyzing' | 'done'>('scan');

  if (phase === 'scan') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-8">
        <div className="w-full">
          <FaceScanner
            title="Person Verification"
            subtitle="Position the document holder's face within the frame"
            accent="sage"
            onVerify={(imageData) => verifyPersonFace(imageData)}
            onSuccess={() => {
              setPhase('analyzing');
              setTimeout(() => setPhase('done'), 2000);
            }}
            onCancel={() => navigate('/officer/document-details')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-20 gap-6">
      {phase === 'analyzing' ? (
        <>
          <div className="w-12 h-12 border-2 border-sage/30 border-t-sage rounded-full animate-spin" />
          <div className="text-center">
            <h2 className="text-lg font-semibold text-graphite dark:text-ivory mb-1">Analyzing Match</h2>
            <p className="text-sm text-graphite/65 dark:text-lilac/50">Comparing biometric data with document photograph</p>
          </div>
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 text-gold animate-spin" strokeWidth={1.5} />
            <span className="micro-label text-gold">PROCESSING</span>
          </div>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center animate-fade-in">
            <Check className="w-8 h-8 text-sage" strokeWidth={2} />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-graphite dark:text-ivory mb-1">Face Captured</h2>
            <p className="text-sm text-graphite/65 dark:text-lilac/50">Proceeding to AI verification result</p>
          </div>
          <button
            onClick={() => navigate('/officer/verification-result')}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-ivory bg-sage rounded-sm hover:bg-sage-dark transition-colors"
          >
            View Result
          </button>
        </>
      )}
    </div>
  );
}
