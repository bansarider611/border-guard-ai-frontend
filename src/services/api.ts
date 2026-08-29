import type {
  LoginRequest,
  LoginResponse,
  FaceScanResult,
  DocumentDetailsResponse,
  ScreeningResult,
  HistoryItem,
  HistoryDetail,
  SystemItem,
  SystemDetail,
  FraudItem,
  FraudDetail,
  OfficerRegistration,
  OfficerCredentials,
  DashboardStats,
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Simulate network delay
const delay = (ms: number = 800) => new Promise((r) => setTimeout(r, ms));

// ─── Session ──────────────────────────────────────────────
const SESSION_KEY = 'bga_session';

export function getSession(): { user: LoginResponse['user']; token: string } | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setSession(data: LoginResponse): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

// ─── Auth ─────────────────────────────────────────────────
export async function login(req: LoginRequest): Promise<LoginResponse> {
  await delay(700);
  if (!req.username || !req.password) {
    throw new Error('Invalid credentials');
  }
  const user = {
    id: crypto.randomUUID(),
    username: req.username,
    role: req.role,
    name: req.role === 'admin' ? 'Administrator' : 'Officer',
    officerId: req.role === 'admin' ? 'ADM-001' : 'OFC-' + Math.floor(1000 + Math.random() * 9000),
    department: req.role === 'admin' ? 'Command' : 'Terminal 3',
    designation: req.role === 'admin' ? 'System Administrator' : 'Border Security Officer',
  };
  const res: LoginResponse = { user, token: 'mock-token-' + crypto.randomUUID() };
  setSession(res);
  return res;
}

// ─── Face Verification ────────────────────────────────────
export async function verifyFace(imageData: string | null): Promise<FaceScanResult> {
  if (!imageData || imageData.length < 1000) {
    return { success: false, confidence: 0, message: 'No face detected. Please capture a clear face image.' };
  }

  await delay(2000);
  return { success: true, confidence: 0.97, message: 'Face verified successfully' };
}

export async function verifyPersonFace(imageData: string | null): Promise<FaceScanResult> {
  if (!imageData || imageData.length < 1000) {
    return { success: false, confidence: 0, message: 'No face detected. Please position the person in the frame.' };
  }

  await delay(2500);
  return { success: true, confidence: 0.94, message: 'Person face match confirmed' };
}

export async function verifyFraudFace(imageData: string | null): Promise<FaceScanResult> {
  if (!imageData || imageData.length < 1000) {
    return { success: false, confidence: 0, message: 'No face detected. Please capture the face before continuing.' };
  }

  await delay(2500);
  return { success: true, confidence: 0.91, message: 'Fraud verification complete' };
}

// ─── Document ─────────────────────────────────────────────
export async function uploadDocument(file: File): Promise<{ uploadId: string }> {
  void file;
  await delay(1500);
  return { uploadId: 'upl-' + crypto.randomUUID() };
}

export async function getDocumentDetails(uploadId: string): Promise<DocumentDetailsResponse> {
  void uploadId;
  await delay(1800);
  return {
    identity: {
      photograph: null,
      fullName: 'Demo Traveller',
      dateOfBirth: '1992-05-18',
      gender: 'Female',
      nationality: 'Indian',
      address: 'New Delhi, India',
    },
    document: {
      documentType: 'PASSPORT',
      documentNumber: 'P1234567',
      issuingCountry: 'IND',
      issueDate: '2021-06-01',
      expiryDate: '2031-05-31',
      visaInfo: 'Visitor visa / valid',
      documentStatus: 'VERIFIED',
      extractionStatus: 'COMPLETE',
      analysisStatus: 'COMPLETE',
    },
    verification: {
      documentStatus: 'VERIFIED',
      extractionStatus: 'COMPLETE',
      analysisStatus: 'COMPLETE',
    },
  };
}

// ─── Screening Result ─────────────────────────────────────
export async function getScreeningResult(uploadId: string): Promise<ScreeningResult> {
  void uploadId;
  await delay(2200);
  const approved = Math.random() > 0.4;
  return {
    screeningId: 'SCR-' + Date.now().toString(36).toUpperCase(),
    timestamp: new Date().toISOString(),
    decision: approved ? 'APPROVED' : 'HIGH_RISK',
    riskLevel: approved ? 'LOW' : 'HIGH',
    riskScore: approved ? 12 : 87,
    documentStatus: approved ? 'VERIFIED' : 'SUSPICIOUS',
    faceStatus: approved ? 'MATCHED' : 'MISMATCH',
    faceMatchScore: approved ? 96 : 41,
    suspiciousIndicators: approved
      ? []
      : ['Face mismatch detected', 'Document MRZ checksum anomaly', 'Photo does not match document holder'],
    reasons: approved
      ? []
      : ['Biometric face data does not match document photograph', 'Document tampering indicators detected in MRZ zone'],
    identity: {
      photograph: null,
      fullName: null,
      dateOfBirth: null,
      gender: null,
      nationality: null,
      address: null,
    },
    document: {
      documentType: 'PASSPORT',
      documentNumber: null,
      issuingCountry: null,
      issueDate: null,
      expiryDate: null,
      visaInfo: null,
      documentStatus: approved ? 'VERIFIED' : 'SUSPICIOUS',
      extractionStatus: 'COMPLETE',
      analysisStatus: 'COMPLETE',
    },
    aiChecks: {
      ocrConfidence: approved ? 98 : 73,
      mrzValidation: approved ? 'PASS' : 'FAIL',
      documentStructure: approved ? 94 : 58,
      tamperingProbability: approved ? 4 : 78,
      databaseVerification: approved ? 'PASS' : 'FLAGGED',
    },
  };
}

// ─── History ──────────────────────────────────────────────
export async function getHistory(): Promise<HistoryItem[]> {
  await delay(900);
  return MOCK_HISTORY;
}

export async function getHistoryDetails(id: string): Promise<HistoryDetail> {
  await delay(800);
  const item = MOCK_HISTORY.find((h) => h.screeningId === id);
  if (!item) throw new Error('Record not found');
  return {
    ...item,
    identity: {
      photograph: null,
      fullName: item.personName,
      dateOfBirth: null,
      gender: null,
      nationality: null,
      address: null,
    },
    document: {
      documentType: item.documentType as 'PASSPORT',
      documentNumber: item.documentNumber,
      issuingCountry: null,
      issueDate: null,
      expiryDate: null,
      visaInfo: null,
      documentStatus: item.decision === 'APPROVED' ? 'VERIFIED' : 'SUSPICIOUS',
      extractionStatus: 'COMPLETE',
      analysisStatus: 'COMPLETE',
    },
    faceVerification: {
      status: item.decision === 'APPROVED' ? 'MATCHED' : 'MISMATCH',
      matchScore: item.decision === 'APPROVED' ? 95 : 38,
      timestamp: item.dateTime,
    },
    aiAnalysis: {
      documentConfidence: item.decision === 'APPROVED' ? 92 : 44,
      mrzValidation: item.decision === 'APPROVED' ? 'VALID' : 'ANOMALY',
      tamperingProbability: item.decision === 'APPROVED' ? 3 : 78,
      faceMatchScore: item.decision === 'APPROVED' ? 95 : 38,
      databaseVerification: item.decision === 'APPROVED' ? 'CLEAR' : 'FLAGGED',
    },
    riskAssessment: {
      riskScore: item.riskScore,
      riskLevel: item.riskLevel,
      reasons:
        item.decision === 'HIGH_RISK'
          ? ['Biometric mismatch', 'Document tampering indicators']
          : ['No anomalies detected'],
    },
    timeline: [
      { step: 'Document Captured', timestamp: item.dateTime, status: 'COMPLETE' },
      { step: 'Data Extracted', timestamp: item.dateTime, status: 'COMPLETE' },
      { step: 'Document Analyzed', timestamp: item.dateTime, status: 'COMPLETE' },
      { step: 'Face Captured', timestamp: item.dateTime, status: 'COMPLETE' },
      { step: 'Biometric Check', timestamp: item.dateTime, status: 'COMPLETE' },
      { step: 'Final Decision', timestamp: item.dateTime, status: 'COMPLETE' },
    ],
  };
}

// ─── Systems ──────────────────────────────────────────────
export async function getSystems(): Promise<SystemItem[]> {
  await delay(800);
  return MOCK_SYSTEMS;
}

export async function getSystemDetails(id: string): Promise<SystemDetail> {
  await delay(700);
  const item = MOCK_SYSTEMS.find((s) => s.systemId === id);
  if (!item) throw new Error('System not found');
  return {
    ...item,
    totalScreenings: Math.floor(Math.random() * 500),
    approvedCount: Math.floor(Math.random() * 400),
    highRiskCount: Math.floor(Math.random() * 50),
    lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    department: 'Terminal ' + (Math.floor(Math.random() * 5) + 1),
    designation: 'Border Security Officer',
  };
}

// ─── Frauds ────────────────────────────────────────────────
export async function getFrauds(): Promise<FraudItem[]> {
  await delay(800);
  return MOCK_FRAUDS;
}

export async function getFraudDetails(id: string): Promise<FraudDetail> {
  await delay(800);
  const item = MOCK_FRAUDS.find((f) => f.caseId === id);
  if (!item) throw new Error('Case not found');
  return {
    ...item,
    identity: {
      photograph: null,
      fullName: item.personName,
      dateOfBirth: null,
      gender: null,
      nationality: null,
      address: null,
    },
    document: {
      documentType: item.documentType as 'PASSPORT',
      documentNumber: item.documentNumber,
      issuingCountry: null,
      issueDate: null,
      expiryDate: null,
      visaInfo: null,
      documentStatus: 'SUSPICIOUS',
      extractionStatus: 'COMPLETE',
      analysisStatus: 'COMPLETE',
    },
    suspiciousIndicators: [
      'Face mismatch detected',
      'Document MRZ checksum anomaly',
      'Photograph does not match document holder',
    ],
    aiFindings: [
      'Biometric face data does not match document photograph',
      'Document tampering indicators detected in MRZ zone',
      'Identity not found in verification database',
    ],
    timeline: [
      { step: 'Document Captured', timestamp: item.dateTime, status: 'COMPLETE' },
      { step: 'Data Extracted', timestamp: item.dateTime, status: 'COMPLETE' },
      { step: 'Document Analyzed', timestamp: item.dateTime, status: 'COMPLETE' },
      { step: 'Face Captured', timestamp: item.dateTime, status: 'COMPLETE' },
      { step: 'Biometric Check', timestamp: item.dateTime, status: 'COMPLETE' },
      { step: 'Final Decision', timestamp: item.dateTime, status: 'COMPLETE' },
    ],
    caseStatus: item.status,
    evidencePreview: null,
  };
}

// ─── Officer Registration ─────────────────────────────────
export async function createOfficer(data: OfficerRegistration): Promise<{ officerId: string }> {
  await delay(1200);
  return { officerId: data.officerId };
}

export async function getCredentials(officerId: string): Promise<OfficerCredentials> {
  await delay(600);
  return {
    officerName: 'New Officer',
    officerId,
    username: 'officer_' + officerId.toLowerCase(),
    creationDate: new Date().toISOString(),
    credentialStatus: 'ACTIVE',
    department: 'Terminal 3',
    designation: 'Border Security Officer',
  };
}

export async function downloadCredentials(officerId: string): Promise<Blob> {
  await delay(800);
  return new Blob(['Credential document for ' + officerId], { type: 'application/pdf' });
}

// ─── Dashboard ────────────────────────────────────────────
export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(800);
  return {
    totalScreenings: 1247,
    highRiskCases: 38,
    approvedCount: 1186,
    activeOfficers: 12,
  };
}

export { API_BASE_URL };

// ─── Mock Data ────────────────────────────────────────────
const MOCK_HISTORY: HistoryItem[] = [
  {
    screeningId: 'SCR-7K3M9X',
    personName: 'Not Available',
    documentType: 'PASSPORT',
    documentNumber: 'P******9023',
    dateTime: '2026-08-28T09:14:00Z',
    decision: 'APPROVED',
    riskLevel: 'LOW',
    riskScore: 8,
    officerName: 'Officer',
    officerId: 'OFC-2041',
  },
  {
    screeningId: 'SCR-7K3M8Q',
    personName: 'Not Available',
    documentType: 'NATIONAL_ID',
    documentNumber: 'ID******4471',
    dateTime: '2026-08-28T08:42:00Z',
    decision: 'HIGH_RISK',
    riskLevel: 'HIGH',
    riskScore: 89,
    officerName: 'Officer',
    officerId: 'OFC-2041',
  },
  {
    screeningId: 'SCR-7K3M7L',
    personName: 'Not Available',
    documentType: 'PASSPORT',
    documentNumber: 'P******1124',
    dateTime: '2026-08-28T07:55:00Z',
    decision: 'APPROVED',
    riskLevel: 'LOW',
    riskScore: 5,
    officerName: 'Officer',
    officerId: 'OFC-1893',
  },
  {
    screeningId: 'SCR-7K3M5R',
    personName: 'Not Available',
    documentType: 'PASSPORT',
    documentNumber: 'P******8830',
    dateTime: '2026-08-27T22:10:00Z',
    decision: 'PENDING',
    riskLevel: 'MEDIUM',
    riskScore: null,
    officerName: 'Officer',
    officerId: 'OFC-2041',
  },
  {
    screeningId: 'SCR-7K3M4D',
    personName: 'Not Available',
    documentType: 'VISA',
    documentNumber: 'V******2210',
    dateTime: '2026-08-27T18:33:00Z',
    decision: 'FAILED',
    riskLevel: 'MEDIUM',
    riskScore: null,
    officerName: 'Officer',
    officerId: 'OFC-1120',
  },
  {
    screeningId: 'SCR-7K3M2B',
    personName: 'Not Available',
    documentType: 'PASSPORT',
    documentNumber: 'P******6677',
    dateTime: '2026-08-27T14:05:00Z',
    decision: 'APPROVED',
    riskLevel: 'LOW',
    riskScore: 11,
    officerName: 'Officer',
    officerId: 'OFC-1893',
  },
];

const MOCK_SYSTEMS: SystemItem[] = [
  {
    systemId: 'SYS-T1-OFC2041',
    officerName: 'Officer',
    officerId: 'OFC-2041',
    status: 'ACTIVE',
    latestActivity: '2026-08-28T09:14:00Z',
    location: 'Terminal 1 — Checkpoint A',
  },
  {
    systemId: 'SYS-T2-OFC1893',
    officerName: 'Officer',
    officerId: 'OFC-1893',
    status: 'ACTIVE',
    latestActivity: '2026-08-28T07:55:00Z',
    location: 'Terminal 2 — Checkpoint B',
  },
  {
    systemId: 'SYS-T3-OFC1120',
    officerName: 'Officer',
    officerId: 'OFC-1120',
    status: 'MAINTENANCE',
    latestActivity: '2026-08-27T18:33:00Z',
    location: 'Terminal 3 — Checkpoint C',
  },
  {
    systemId: 'SYS-T4-OFC3350',
    officerName: 'Officer',
    officerId: 'OFC-3350',
    status: 'INACTIVE',
    latestActivity: '2026-08-26T11:20:00Z',
    location: 'Terminal 4 — Checkpoint D',
  },
];

const MOCK_FRAUDS: FraudItem[] = [
  {
    caseId: 'FRD-2026-0042',
    personName: 'Not Available',
    documentType: 'PASSPORT',
    documentNumber: 'P******9023',
    dateTime: '2026-08-28T08:42:00Z',
    riskLevel: 'HIGH',
    riskScore: 89,
    reason: 'Biometric mismatch',
    status: 'OPEN',
  },
  {
    caseId: 'FRD-2026-0041',
    personName: 'Not Available',
    documentType: 'NATIONAL_ID',
    documentNumber: 'ID******5530',
    dateTime: '2026-08-27T16:22:00Z',
    riskLevel: 'HIGH',
    riskScore: 92,
    reason: 'Document tampering',
    status: 'UNDER_REVIEW',
  },
  {
    caseId: 'FRD-2026-0040',
    personName: 'Not Available',
    documentType: 'PASSPORT',
    documentNumber: 'P******1199',
    dateTime: '2026-08-27T10:15:00Z',
    riskLevel: 'HIGH',
    riskScore: 85,
    reason: 'Identity not in database',
    status: 'ESCALATED',
  },
  {
    caseId: 'FRD-2026-0039',
    personName: 'Not Available',
    documentType: 'VISA',
    documentNumber: 'V******8841',
    dateTime: '2026-08-26T14:48:00Z',
    riskLevel: 'HIGH',
    riskScore: 78,
    reason: 'Forged visa stamp',
    status: 'RESOLVED',
  },
];
