import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, X, Check, AlertTriangle, RotateCcw, Scan } from 'lucide-react';
import type { FaceScanState } from '@/types';

interface FaceScannerProps {
  title: string;
  subtitle?: string;
  onVerify: (imageData: string | null) => Promise<{ success: boolean; message: string }>;
  onSuccess: () => void;
  onCancel: () => void;
  accent?: 'sage' | 'gold' | 'vermilion';
}

const STATE_LABELS: Record<FaceScanState, string> = {
  INITIALIZING: 'INITIALIZING CAMERA',
  POSITION_FACE: 'POSITION FACE IN FRAME',
  FACE_DETECTED: 'FACE DETECTED',
  SCANNING: 'SCANNING BIOMETRIC DATA',
  VERIFYING: 'VERIFYING IDENTITY',
  VERIFIED: 'VERIFICATION COMPLETE',
  FAILED: 'VERIFICATION FAILED',
};

export function FaceScanner({
  title,
  subtitle,
  onVerify,
  onSuccess,
  onCancel,
  accent = 'sage',
}: FaceScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<FaceScanState>('INITIALIZING');
  const [hasCamera, setHasCamera] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accentColor =
    accent === 'vermilion' ? 'text-vermilion' : accent === 'gold' ? 'text-gold' : 'text-sage';
  const accentBorder =
    accent === 'vermilion' ? 'border-vermilion' : accent === 'gold' ? 'border-gold' : 'border-sage';
  const accentBg =
    accent === 'vermilion' ? 'bg-vermilion' : accent === 'gold' ? 'bg-gold' : 'bg-sage';

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        });
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setTimeout(() => mounted && setState('POSITION_FACE'), 800);
      } catch {
        if (mounted) {
          setHasCamera(false);
          setState('POSITION_FACE');
        }
      }
    };

    startCamera();
    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleCapture = useCallback(async () => {
    const video = videoRef.current;
    let imageData: string | null = null;

    if (video && video.videoWidth && video.videoHeight) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
      imageData = canvas.toDataURL('image/jpeg', 0.85);
    }

    if (!imageData || imageData.length < 1000) {
      setError('No face detected. Please position your face in the frame and try again.');
      setState('FAILED');
      return;
    }

    setState('SCANNING');
    await new Promise((r) => setTimeout(r, 1500));
    setState('VERIFYING');
    try {
      const result = await onVerify(imageData);
      if (result.success) {
        setState('VERIFIED');
        setTimeout(() => onSuccess(), 1200);
      } else {
        setError(result.message);
        setState('FAILED');
      }
    } catch {
      setError('Verification service unavailable');
      setState('FAILED');
    }
  }, [onVerify, onSuccess]);

  const handleRetake = () => {
    setError(null);
    setState('POSITION_FACE');
  };

  const stateColor =
    state === 'FAILED'
      ? 'text-vermilion'
      : state === 'VERIFIED'
      ? accentColor
      : 'text-stone-warm dark:text-lilac';

  return (
    <div className="w-full max-w-[52rem] mx-auto flex flex-col items-center gap-6 animate-fade-in md:gap-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-graphite dark:text-ivory tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-graphite/65 dark:text-lilac/50 mt-1">{subtitle}</p>}
      </div>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-[44rem] flex flex-col items-center gap-5 md:flex-row md:items-center md:justify-center md:gap-8">
          <div className="relative w-full max-w-md md:max-w-[28rem] md:flex-shrink-0">
            <div className={`relative aspect-square rounded-sm border-2 ${state === 'VERIFIED' ? accentBorder : 'border-black/10 dark:border-white/10'} overflow-hidden bg-charcoal dark:bg-graphite`}>
              {hasCamera ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover opacity-80"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-charcoal grid-bg">
                  <Camera className="w-12 h-12 text-stone-warm/20" strokeWidth={1} />
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-48 h-56">
                  {[
                    'top-0 left-0 border-t-2 border-l-2',
                    'top-0 right-0 border-t-2 border-r-2',
                    'bottom-0 left-0 border-b-2 border-l-2',
                    'bottom-0 right-0 border-b-2 border-r-2',
                  ].map((pos, i) => (
                    <div
                      key={i}
                      className={`absolute w-6 h-6 ${pos} ${
                        state === 'VERIFIED'
                          ? accentColor.replace('text-', 'border-')
                          : state === 'FAILED'
                          ? 'border-vermilion'
                          : 'border-ivory/60'
                      } rounded-sm`}
                    />
                  ))}

                  {(state === 'SCANNING' || state === 'VERIFYING') && (
                    <div className="absolute inset-0 overflow-hidden">
                      <div className={`absolute left-0 right-0 h-[2px] ${accentBg} opacity-70 animate-scan-line shadow-[0_0_8px_rgba(130,151,127,0.5)]`} />
                    </div>
                  )}

                  {state === 'VERIFIED' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-16 h-16 rounded-full ${accentBg}/20 flex items-center justify-center animate-fade-in`}>
                        <Check className={`w-8 h-8 ${accentColor}`} strokeWidth={2} />
                      </div>
                    </div>
                  )}

                  {state === 'FAILED' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-vermilion/20 flex items-center justify-center animate-fade-in">
                        <AlertTriangle className="w-8 h-8 text-vermilion" strokeWidth={2} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="micro-label text-ivory/50">BIO-CAM-01</span>
                <span className="micro-label text-ivory/50">{hasCamera ? 'LIVE' : 'NO-CAM'}</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="micro-label text-ivory/40">FRONT-FACING</span>
                <span className="micro-label text-ivory/40">640×480</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                state === 'VERIFIED' ? accentBg : state === 'FAILED' ? 'bg-vermilion' : state === 'SCANNING' || state === 'VERIFYING' ? 'bg-gold animate-pulse' : 'bg-stone-warm/40'
              }`} />
              <span className={`micro-label ${stateColor}`}>{STATE_LABELS[state]}</span>
            </div>
          </div>

          <div className="flex w-full max-w-[12rem] flex-col gap-3 md:w-[12rem] md:pt-2">
            {state === 'FAILED' ? (
              <button
                onClick={handleRetake}
                className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm border border-black/10 dark:border-white/10 rounded-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-graphite dark:text-ivory"
              >
                <RotateCcw className="w-4 h-4" />
                Retake
              </button>
            ) : state === 'POSITION_FACE' || state === 'FACE_DETECTED' ? (
              <button
                onClick={handleCapture}
                className={`flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-ivory ${accentBg} rounded-sm hover:opacity-90 transition-opacity`}
              >
                <Scan className="w-4 h-4" />
                Capture & Verify
              </button>
            ) : null}

            {(state === 'INITIALIZING' || state === 'POSITION_FACE' || state === 'FAILED') && (
              <button
                onClick={onCancel}
                className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm border border-black/10 dark:border-white/10 rounded-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-stone-warm dark:text-lilac"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-md text-center px-4 py-3 rounded-sm border border-vermilion/20 bg-vermilion/5">
          <p className="text-xs text-vermilion">{error}</p>
        </div>
      )}

      {!hasCamera && state === 'POSITION_FACE' && (
        <div className="max-w-md text-center px-4 py-2">
          <p className="text-xs text-graphite/60 dark:text-lilac/40">
            Camera not available — simulation mode active. Click verify to continue.
          </p>
        </div>
      )}
    </div>
  );
}
