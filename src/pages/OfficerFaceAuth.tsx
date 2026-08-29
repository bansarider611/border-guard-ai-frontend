import { useNavigate } from 'react-router-dom';
import { FaceScanner } from '@/components/FaceScanner';
import { verifyFace } from '@/services/api';

export function OfficerFaceAuth() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8">
      <div className="w-full">
        <FaceScanner
          title="Officer Verification"
          subtitle="Position your face inside the frame"
          accent="gold"
          onVerify={(imageData) => verifyFace(imageData)}
          onSuccess={() => navigate('/officer/scan')}
          onCancel={() => navigate('/officer/login')}
        />
      </div>
    </div>
  );
}
