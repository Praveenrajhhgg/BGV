import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCandidateById, addVerificationCheck } from '../services/api';
import { Candidate, VerificationCheck, VerificationStatus, CheckType } from '../types';
import Badge from '../components/ui/Badge';
import { CHECK_TYPES_AVAILABLE } from '../constants';

const StatusIcon: React.FC<{ status: VerificationStatus }> = ({ status }) => {
    const baseClasses = "h-10 w-10 rounded-full flex items-center justify-center text-white flex-shrink-0";
    let icon;
    let color;

    switch (status) {
        case VerificationStatus.COMPLETED:
            color = "bg-status-completed";
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
            break;
        case VerificationStatus.IN_PROGRESS:
            color = "bg-status-progress animate-pulse";
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
            break;
        case VerificationStatus.FAILED:
            color = "bg-status-failed";
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
            break;
        default:
            color = "bg-status-pending";
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
            break;
    }

    return <div className={`${baseClasses} ${color}`}>{icon}</div>;
};

const CheckItem: React.FC<{ check: VerificationCheck, isLast: boolean }> = ({ check, isLast }) => (
    <div className="relative flex items-start">
        {!isLast && <div className="absolute left-5 top-5 -ml-px mt-0.5 h-full w-0.5 bg-slate-300 dark:bg-slate-700"></div>}
        <StatusIcon status={check.status} />
        <div className="ml-4 sm:ml-6 flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h4 className="text-md font-semibold text-slate-800 dark:text-slate-200">{check.type}</h4>
                <div className="mt-1 sm:mt-0 sm:ml-4 flex-shrink-0">
                     <Badge status={check.status} />
                </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 break-words">{check.details}</p>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-500 flex flex-col sm:flex-row">
                <span>Last updated: {new Date(check.updatedAt).toLocaleString()}</span>
                {check.verifier && <span className="hidden sm:inline mx-2">|</span>}
                {check.verifier && <span>Verifier: {check.verifier}</span>}
            </div>
        </div>
    </div>
);


const CandidateDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAddingCheck, setIsAddingCheck] = useState(false);
    const [newCheck, setNewCheck] = useState<{
        type: CheckType | '';
        status: VerificationStatus;
        verifier: string;
        details: string;
    }>({
        type: '',
        status: VerificationStatus.PENDING,
        verifier: '',
        details: '',
    });

    const fetchCandidate = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const data = await getCandidateById(id);
            setCandidate(data || null);
        } catch (error) {
            console.error("Failed to fetch candidate details", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidate();
    }, [id]);
    
    const handleAddCheckSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !newCheck.type || !newCheck.details) {
            alert('Please select a check type and provide details.');
            return;
        }
        
        try {
            const updatedCandidate = await addVerificationCheck(id, {
                type: newCheck.type,
                status: newCheck.status,
                verifier: newCheck.verifier || undefined,
                details: newCheck.details
            });
            if(updatedCandidate) {
                setCandidate(updatedCandidate);
                setIsAddingCheck(false);
                setNewCheck({ type: '', status: VerificationStatus.PENDING, verifier: '', details: '' });
            }
        } catch (error) {
             console.error("Failed to add check", error);
             alert("Failed to add verification check.");
        }
    };
    
    const availableCheckTypes = useMemo(() => {
        if (!candidate) return [];
        const existingTypes = new Set(candidate.checks.map(c => c.type));
        return CHECK_TYPES_AVAILABLE.filter(type => !existingTypes.has(type));
    }, [candidate]);


    if (loading) {
        return <div className="text-center p-8 text-slate-500 dark:text-slate-400">Loading candidate details...</div>;
    }

    if (!candidate) {
        return <div className="text-center p-8 text-status-failed">Candidate not found.</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Link to="/candidates" className="text-brand-accent hover:underline flex items-center font-semibold text-sm print:hidden">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Candidates
            </Link>

            <div className="bg-brand-primary-light dark:bg-brand-primary-dark p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">{candidate.name}</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 break-all">{candidate.email} &bull; {candidate.phone}</p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-4 print:hidden">
                        <Badge status={candidate.overallStatus} />
                        <button onClick={() => window.print()} className="p-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-2 text-sm font-semibold">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            <span className="hidden sm:inline">Download PDF Report</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-brand-primary-light dark:bg-brand-primary-dark p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 print:hidden">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Verification Timeline</h2>
                    {!isAddingCheck && availableCheckTypes.length > 0 && (
                        <button onClick={() => setIsAddingCheck(true)} className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center transition-colors w-full sm:w-auto justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Check
                        </button>
                    )}
                </div>
                
                {isAddingCheck && (
                    <form onSubmit={handleAddCheckSubmit} className="mb-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4 animate-fade-in print:hidden">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">New Verification Check</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <select value={newCheck.type} onChange={e => setNewCheck({...newCheck, type: e.target.value as CheckType})} required className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent">
                                <option value="" disabled>Select Check Type</option>
                                {availableCheckTypes.map(type => <option key={type} value={type}>{type}</option>)}
                           </select>
                           <select value={newCheck.status} onChange={e => setNewCheck({...newCheck, status: e.target.value as VerificationStatus})} required className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent">
                                {Object.values(VerificationStatus).map(status => <option key={status} value={status}>{status}</option>)}
                           </select>
                        </div>
                        <input type="text" placeholder="Verifier Name (Optional)" value={newCheck.verifier} onChange={e => setNewCheck({...newCheck, verifier: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                        <textarea placeholder="Details and notes..." value={newCheck.details} onChange={e => setNewCheck({...newCheck, details: e.target.value})} required rows={3} className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"></textarea>
                        <div className="flex justify-end space-x-3 pt-2">
                             <button type="button" onClick={() => setIsAddingCheck(false)} className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-100 font-semibold transition-colors">Cancel</button>
                             <button type="submit" className="px-4 py-2 rounded-lg bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold transition-colors">Save Check</button>
                         </div>
                    </form>
                )}

                <div className="space-y-8">
                    {candidate.checks.map((check, index) => (
                        <CheckItem key={check.id} check={check} isLast={index === candidate.checks.length - 1} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CandidateDetailPage;