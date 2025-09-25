import { Candidate, VerificationStatus, CheckType, VerificationCheck } from '../types';

const generateRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const createCheck = (type: CheckType): VerificationCheck => {
  const statuses = [VerificationStatus.PENDING, VerificationStatus.IN_PROGRESS, VerificationStatus.COMPLETED, VerificationStatus.FAILED];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  return {
    id: `check_${Math.random().toString(36).substr(2, 9)}`,
    type: type,
    status: status,
    updatedAt: generateRandomDate(new Date(2023, 0, 1), new Date()).toISOString(),
    verifier: status !== VerificationStatus.PENDING ? ['John Doe', 'Jane Smith', 'Alex Ray'][Math.floor(Math.random() * 3)] : undefined,
    details: status === VerificationStatus.COMPLETED ? 'Verified successfully.' : (status === VerificationStatus.FAILED ? 'Discrepancy found.' : 'Awaiting documents.')
  };
};

const DUMMY_CANDIDATES: Candidate[] = [
  {
    id: 'cand_1',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    phone: '555-0101',
    requestedDate: '2023-10-28T10:00:00Z',
    completedDate: '2023-11-05T14:30:00Z',
    overallStatus: VerificationStatus.COMPLETED,
    checks: [
      { id: 'chk_1a', type: CheckType.ID_VERIFICATION, status: VerificationStatus.COMPLETED, updatedAt: '2023-10-29T11:00:00Z', verifier: 'Jane Smith', details: 'Aadhaar card verified.' },
      { id: 'chk_1b', type: CheckType.EMPLOYMENT_HISTORY, status: VerificationStatus.COMPLETED, updatedAt: '2023-11-02T16:20:00Z', verifier: 'John Doe', details: 'Previous employment at TechCorp confirmed.' },
      { id: 'chk_1c', type: CheckType.EDUCATION_CHECK, status: VerificationStatus.COMPLETED, updatedAt: '2023-11-05T14:30:00Z', verifier: 'Jane Smith', details: 'Degree from University of Example verified.' },
    ],
  },
  {
    id: 'cand_2',
    name: 'Bob Williams',
    email: 'bob.w@example.com',
    phone: '555-0102',
    requestedDate: '2023-11-10T09:00:00Z',
    overallStatus: VerificationStatus.IN_PROGRESS,
    checks: [
      { id: 'chk_2a', type: CheckType.ID_VERIFICATION, status: VerificationStatus.COMPLETED, updatedAt: '2023-11-11T12:00:00Z', verifier: 'Jane Smith', details: 'PAN card verified.' },
      { id: 'chk_2b', type: CheckType.EMPLOYMENT_HISTORY, status: VerificationStatus.IN_PROGRESS, updatedAt: '2023-11-12T10:05:00Z', verifier: 'John Doe', details: 'Contacting previous employer.' },
      { id: 'chk_2c', type: CheckType.ADDRESS_VERIFICATION, status: VerificationStatus.PENDING, updatedAt: '2023-11-10T09:00:00Z', details: 'Awaiting utility bill submission.' },
    ],
  },
  {
    id: 'cand_3',
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    phone: '555-0103',
    requestedDate: '2023-11-15T11:30:00Z',
    overallStatus: VerificationStatus.PENDING,
    checks: [
      { id: 'chk_3a', type: CheckType.ID_VERIFICATION, status: VerificationStatus.PENDING, updatedAt: '2023-11-15T11:30:00Z', details: 'Awaiting document upload.' },
    ],
  },
    {
    id: 'cand_4',
    name: 'Diana Prince',
    email: 'diana.p@example.com',
    phone: '555-0104',
    requestedDate: '2023-10-20T14:00:00Z',
    completedDate: '2023-10-25T18:00:00Z',
    overallStatus: VerificationStatus.FAILED,
    checks: [
      { id: 'chk_4a', type: CheckType.ID_VERIFICATION, status: VerificationStatus.COMPLETED, updatedAt: '2023-10-21T10:00:00Z', verifier: 'Jane Smith', details: 'Passport verified.' },
      { id: 'chk_4b', type: CheckType.COURT_RECORDS, status: VerificationStatus.FAILED, updatedAt: '2023-10-25T18:00:00Z', verifier: 'Alex Ray', details: 'Record found in district court database.' },
    ],
  },
];

for (let i = 5; i <= 20; i++) {
    const overallStatuses = [VerificationStatus.PENDING, VerificationStatus.IN_PROGRESS, VerificationStatus.COMPLETED, VerificationStatus.FAILED];
    const overallStatus = overallStatuses[Math.floor(Math.random() * overallStatuses.length)];
    const requestedDate = generateRandomDate(new Date(2023, 8, 1), new Date());
    DUMMY_CANDIDATES.push({
        id: `cand_${i}`,
        name: `User ${i}`,
        email: `user.${i}@example.com`,
        phone: `555-01${i.toString().padStart(2, '0')}`,
        requestedDate: requestedDate.toISOString(),
        completedDate: overallStatus === VerificationStatus.COMPLETED || overallStatus === VerificationStatus.FAILED ? new Date(requestedDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        overallStatus: overallStatus,
        checks: [createCheck(CheckType.ID_VERIFICATION), createCheck(CheckType.EMPLOYMENT_HISTORY), createCheck(CheckType.EDUCATION_CHECK)]
    });
}


const mockApi = <T,>(data: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (data === undefined) {
                resolve(data);
                return;
            }
            resolve(JSON.parse(JSON.stringify(data)));
        }, 500 + Math.random() * 500);
    });
}

export const getCandidates = (): Promise<Candidate[]> => {
    return mockApi(DUMMY_CANDIDATES);
};

export const getCandidateById = (id: string): Promise<Candidate | undefined> => {
    const candidate = DUMMY_CANDIDATES.find(c => c.id === id);
    return mockApi(candidate);
};

export const addCandidate = (candidateData: Omit<Candidate, 'id' | 'requestedDate' | 'overallStatus' | 'checks'>, checks: CheckType[]): Promise<Candidate> => {
    const newCandidate: Candidate = {
        id: `cand_${Math.random().toString(36).substr(2, 9)}`,
        ...candidateData,
        requestedDate: new Date().toISOString(),
        overallStatus: VerificationStatus.PENDING,
        checks: checks.map(type => ({
            id: `check_${Math.random().toString(36).substr(2, 9)}`,
            type,
            status: VerificationStatus.PENDING,
            updatedAt: new Date().toISOString(),
            details: 'Initiated'
        }))
    };
    DUMMY_CANDIDATES.unshift(newCandidate);
    return mockApi(newCandidate);
};

export const addVerificationCheck = (candidateId: string, checkData: Omit<VerificationCheck, 'id' | 'updatedAt'>): Promise<Candidate | undefined> => {
    const candidate = DUMMY_CANDIDATES.find(c => c.id === candidateId);
    if (candidate) {
        const newCheck: VerificationCheck = {
            ...checkData,
            id: `check_${Math.random().toString(36).substr(2, 9)}`,
            updatedAt: new Date().toISOString(),
        };
        candidate.checks.push(newCheck);

        // Recalculate overall status
        const hasFailed = candidate.checks.some(c => c.status === VerificationStatus.FAILED);
        const hasPending = candidate.checks.some(c => c.status === VerificationStatus.PENDING);
        const hasInProgress = candidate.checks.some(c => c.status === VerificationStatus.IN_PROGRESS);

        if (hasFailed) {
            candidate.overallStatus = VerificationStatus.FAILED;
            candidate.completedDate = new Date().toISOString();
        } else if (hasPending) {
            candidate.overallStatus = VerificationStatus.PENDING;
             candidate.completedDate = undefined;
        } else if (hasInProgress) {
            candidate.overallStatus = VerificationStatus.IN_PROGRESS;
             candidate.completedDate = undefined;
        } else {
            candidate.overallStatus = VerificationStatus.COMPLETED;
            candidate.completedDate = new Date().toISOString();
        }
    }
    return mockApi(candidate);
};