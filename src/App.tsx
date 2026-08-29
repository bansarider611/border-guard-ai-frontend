import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getSession } from '@/services/api';

// Auth Pages
import { OfficerLogin } from '@/pages/OfficerLogin';
import { AdminLogin } from '@/pages/AdminLogin';
import { OfficerFaceAuth } from '@/pages/OfficerFaceAuth';
import { AdminFaceAuth } from '@/pages/AdminFaceAuth';

// Layouts
import { OfficerLayout } from '@/layouts/OfficerLayout';
import { AdminLayout } from '@/layouts/AdminLayout';

// Officer Pages
import { OfficerScan } from '@/pages/OfficerScan';
import { Verify } from '@/pages/Verify';
import { DocumentUpload } from '@/pages/DocumentUpload';
import { DocumentDetails } from '@/pages/DocumentDetails';
import { PersonFaceScan } from '@/pages/PersonFaceScan';
import { VerificationResult } from '@/pages/VerificationResult';
import { HistoryList } from '@/pages/HistoryList';
import { HistoryDetails } from '@/pages/HistoryDetails';
import { FraudsList } from '@/pages/FraudsList';
import { FraudDetails } from '@/pages/FraudDetails';
import { FraudFaceScan } from '@/pages/FraudFaceScan';

// Admin Pages
import { AdminDashboard } from '@/pages/AdminDashboard';
import { SystemsList } from '@/pages/SystemsList';
import { SystemDetails } from '@/pages/SystemDetails';
import { OfficerRegistration } from '@/pages/OfficerRegistration';

// Protect routes based on role
interface ProtectedRouteProps {
  element: React.ReactNode;
  requiredRole?: 'officer' | 'admin';
}

function ProtectedRoute({ element, requiredRole }: ProtectedRouteProps) {
  const session = getSession();
  if (!session) {
    return <Navigate to="/" replace />;
  }
  if (requiredRole && session.user.role !== requiredRole) {
    return <Navigate to={session.user.role === 'admin' ? '/admin/dashboard' : '/officer/scan'} replace />;
  }
  return element;
}

function App() {
  // Get session at app level to determine initial routing
  const session = getSession();
  
  // Determine default redirect based on session
  const defaultRedirect = session 
    ? (session.user.role === 'admin' ? '/admin/dashboard' : '/officer/scan')
    : null;

  return (
    <BrowserRouter>
      <Routes>
        {/* Root route - redirect if session exists, otherwise show officer login */}
        <Route 
          path="/" 
          element={
            defaultRedirect ? (
              <Navigate to={defaultRedirect} replace />
            ) : (
              <OfficerLogin />
            )
          } 
        />
        <Route path="/officer/login" element={<OfficerLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Officer Routes */}
        <Route path="/officer" element={<ProtectedRoute element={<OfficerLayout />} requiredRole="officer" />}>
          <Route path="face-auth" element={<OfficerFaceAuth />} />
          <Route path="scan" element={<OfficerScan />} />
          <Route path="verify" element={<Verify />} />
          <Route path="document-upload" element={<DocumentUpload />} />
          <Route path="document-details" element={<DocumentDetails />} />
          <Route path="face-scan" element={<PersonFaceScan />} />
          <Route path="verification-result" element={<VerificationResult />} />
          <Route path="history" element={<HistoryList />} />
          <Route path="history/:id" element={<HistoryDetails />} />
          <Route path="fraud" element={<FraudsList />} />
          <Route path="fraud/:id" element={<FraudDetails />} />
          <Route path="fraud/:id/face-scan" element={<FraudFaceScan />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute element={<AdminLayout />} requiredRole="admin" />}>
          <Route path="face-auth" element={<AdminFaceAuth />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="systems" element={<SystemsList />} />
          <Route path="systems/:id" element={<SystemDetails />} />
          <Route path="frauds" element={<FraudsList />} />
          <Route path="frauds/:id" element={<FraudDetails />} />
          <Route path="history" element={<HistoryList />} />
          <Route path="history/:id" element={<HistoryDetails />} />
          <Route path="officers/new" element={<OfficerRegistration />} />
          <Route path="frauds/:id/face-scan" element={<FraudFaceScan />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
