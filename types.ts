
export enum VerificationStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

export enum CheckType {
  ID_VERIFICATION = 'ID Verification',
  EMPLOYMENT_HISTORY = 'Employment History',
  EDUCATION_CHECK = 'Education Check',
  ADDRESS_VERIFICATION = 'Address Verification',
  COURT_RECORDS = 'Court Records',
}

export interface VerificationCheck {
  id: string;
  type: CheckType;
  status: VerificationStatus;
  updatedAt: string;
  verifier?: string;
  details: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  requestedDate: string;
  completedDate?: string;
  overallStatus: VerificationStatus;
  checks: VerificationCheck[];
}
