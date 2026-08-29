import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaceScanner } from '@/components/FaceScanner';
import { verifyFraudFace } from '@/services/api';

export function FraudFaceScan() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/admin') ? '/admin/frauds' : '/officer/fraud';

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8">
      <div className="w-full">
        <FaceScanner
          title="Biometric Re-verification"
          subtitle="Capture the subject's current face for analyst review"
          accent="vermilion"
          onVerify={(imageData) => verifyFraudFace(imageData)}
          onSuccess={() => navigate(`${basePath}/${id}`)}
          onCancel={() => navigate(`${basePath}/${id}`)}
        />
      </div>
    </div>
  );
}
