
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getCandidates, addCandidate } from '../services/api';
import { Candidate, VerificationStatus, CheckType } from '../types';
import Badge from '../components/ui/Badge';
import { CHECK_TYPES_AVAILABLE } from '../constants';

const AddCandidateModal: React.FC<{ isOpen: boolean; onClose: () => void; onAdd: () => void; }> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedChecks, setSelectedChecks] = useState<CheckType[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCheckboxChange = (checkType: CheckType) => {
        setSelectedChecks(prev => 
            prev.includes(checkType) 
            ? prev.filter(c => c !== checkType) 
            : [...prev, checkType]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || selectedChecks.length === 0) {
            alert('Please fill in name, email and select at least one check.');
            return;
        }
        setIsSubmitting(true);
        try {
            await addCandidate({ name, email, phone }, selectedChecks);
            onAdd();
            onClose();
            // Reset form
            setName(''); setEmail(''); setPhone(''); setSelectedChecks([]);
        } catch (error) {
            console.error("Failed to add candidate", error);
            alert('Failed to add candidate. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-primary-light dark:bg-brand-primary-dark rounded-xl p-6 sm:p-8 w-full max-w-lg m-4 border border-slate-200 dark:border-slate-700 max-h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Add New Candidate</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-3xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                    <input type="tel" placeholder="Phone Number (Optional)" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                    
                    <div className="pt-2">
                        <p className="text-slate-700 dark:text-slate-300 font-semibold mb-3">Select Verification Checks:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {CHECK_TYPES_AVAILABLE.map(check => (
                                <label key={check} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 has-[:checked]:bg-green-50 dark:has-[:checked]:bg-green-900/20 has-[:checked]:border-brand-accent">
                                    <input type="checkbox" checked={selectedChecks.includes(check)} onChange={() => handleCheckboxChange(check)} className="h-5 w-5 rounded bg-slate-200 dark:bg-slate-600 border-slate-400 dark:border-slate-500 text-brand-accent focus:ring-brand-accent" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{check}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-100 font-semibold transition-colors">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-lg bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? 'Adding...' : 'Add Candidate'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const CandidatesPage: React.FC = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCandidates = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getCandidates();
            setCandidates(data);
        } catch (error) {
            console.error("Failed to fetch candidates", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);
    
    const filteredCandidates = useMemo(() => {
        return candidates.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            c.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [candidates, searchTerm]);
    
    const handleAddCandidate = () => {
        fetchCandidates(); // Refetch candidates after adding a new one
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Candidates</h1>
                <button id="tour-step-add-candidate" onClick={() => setIsModalOpen(true)} className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center sm:justify-start transition-colors w-full sm:w-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Add Candidate
                </button>
            </div>

            <div className="bg-brand-primary-light dark:bg-brand-primary-dark p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-4 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
            </div>
            
            <div className="bg-brand-primary-light dark:bg-brand-primary-dark rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Requested On</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Completed On</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-8 text-slate-500 dark:text-slate-400">Loading candidates...</td></tr>
                            ) : filteredCandidates.map((candidate) => (
                                <tr key={candidate.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{candidate.name}</div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400 truncate">{candidate.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"><Badge status={candidate.overallStatus} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 hidden sm:table-cell">{new Date(candidate.requestedDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 hidden md:table-cell">{candidate.completedDate ? new Date(candidate.completedDate).toLocaleDateString() : 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/candidates/${candidate.id}`} className="text-brand-accent hover:text-brand-accent-hover font-semibold">View Details</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <AddCandidateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddCandidate} />
        </div>
    );
};

export default CandidatesPage;
