export type UserRole = 'officer' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  officerId?: string;
  department?: string;
  designation?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export type FaceScanState =
  | 'INITIALIZING'
  | 'POSITION_FACE'
  | 'FACE_DETECTED'
  | 'SCANNING'
  | 'VERIFYING'
  | 'VERIFIED'
  | 'FAILED';

export interface FaceScanResult {
  success: boolean;
  confidence: number;
  message: string;
}

export type DocumentType = 'PASSPORT' | 'NATIONAL_ID' | 'DRIVERS_LICENSE' | 'VISA';

export interface DocumentDetails {
  documentType: DocumentType;
  documentNumber: string | null;
  issuingCountry: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  visaInfo: string | null;
  documentStatus: 'VERIFIED' | 'SUSPICIOUS' | 'INVALID' | null;
  extractionStatus: 'PENDING' | 'PROCESSING' | 'COMPLETE' | 'FAILED' | null;
  analysisStatus: 'PENDING' | 'PROCESSING' | 'COMPLETE' | 'FAILED' | null;
}

export interface IdentityDetails {
  photograph: string | null;
  fullName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  nationality: string | null;
  address: string | null;
}

export interface DocumentDetailsResponse {
  identity: IdentityDetails;
  document: DocumentDetails;
  verification: {
    documentStatus: string;
    extractionStatus: string;
    analysisStatus: string;
  };
}

export type ProcessingStage =
  | 'CAPTURING'
  | 'UPLOADING'
  | 'READING_DOCUMENT'
  | 'EXTRACTING_DATA'
  | 'ANALYZING'
  | 'COMPLETE';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ScreeningStatus = 'APPROVED' | 'HIGH_RISK' | 'PENDING' | 'FAILED';

export interface ScreeningResult {
  screeningId: string;
  timestamp: string;
  decision: ScreeningStatus;
  riskLevel: RiskLevel;
  riskScore: number | null;
  documentStatus: string;
  faceStatus: string;
  faceMatchScore: number | null;
  suspiciousIndicators: string[];
  reasons: string[];
  identity: IdentityDetails;
  document: DocumentDetails;
  aiChecks?: {
    ocrConfidence: number | null;
    mrzValidation: 'PASS' | 'FAIL' | 'NOT_AVAILABLE';
    documentStructure: number | null;
    tamperingProbability: number | null;
    databaseVerification: 'PASS' | 'FLAGGED' | 'PENDING';
  };
}

export interface HistoryItem {
  screeningId: string;
  personName: string;
  documentType: string;
  documentNumber: string;
  dateTime: string;
  decision: ScreeningStatus;
  riskLevel: RiskLevel;
  riskScore: number | null;
  officerName: string;
  officerId: string;
}

export interface HistoryDetail extends HistoryItem {
  identity: IdentityDetails;
  document: DocumentDetails;
  faceVerification: {
    status: string;
    matchScore: number | null;
    timestamp: string;
  };
  aiAnalysis: {
    documentConfidence: number | null;
    mrzValidation: string | null;
    tamperingProbability: number | null;
    faceMatchScore: number | null;
    databaseVerification: string | null;
  };
  riskAssessment: {
    riskScore: number | null;
    riskLevel: RiskLevel;
    reasons: string[];
  };
  timeline: TimelineEntry[];
}

export interface TimelineEntry {
  step: string;
  timestamp: string;
  status: 'COMPLETE' | 'PENDING' | 'FAILED';
}

export interface SystemItem {
  systemId: string;
  officerName: string;
  officerId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  latestActivity: string;
  location: string;
}

export interface SystemDetail extends SystemItem {
  totalScreenings: number;
  approvedCount: number;
  highRiskCount: number;
  lastLogin: string;
  department: string;
  designation: string;
}

export interface FraudItem {
  caseId: string;
  personName: string;
  documentType: string;
  documentNumber: string;
  dateTime: string;
  riskLevel: RiskLevel;
  riskScore: number | null;
  reason: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'ESCALATED';
}

export interface FraudDetail extends FraudItem {
  identity: IdentityDetails;
  document: DocumentDetails;
  suspiciousIndicators: string[];
  aiFindings: string[];
  timeline: TimelineEntry[];
  caseStatus: string;
  evidencePreview: string | null;
}

export interface OfficerRegistration {
  fullName: string;
  officerId: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  username: string;
  password: string;
}

export interface OfficerCredentials {
  officerName: string;
  officerId: string;
  username: string;
  creationDate: string;
  credentialStatus: 'ACTIVE' | 'PENDING';
  department: string;
  designation: string;
}

export interface DashboardStats {
  totalScreenings: number;
  highRiskCases: number;
  approvedCount: number;
  activeOfficers: number;
}
