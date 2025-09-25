import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getCandidates } from '../services/api';
import { Candidate, VerificationStatus } from '../types';
import { useTheme } from '../contexts/ThemeContext';

const ReportsPage: React.FC = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        statuses: Object.values(VerificationStatus),
    });

    const { theme } = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getCandidates();
                setCandidates(data);
            } catch (error) {
                console.error("Failed to fetch candidates", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const filteredReportData = useMemo(() => {
        if (loading) return [];

        const { startDate, endDate, statuses } = filters;
        return candidates.filter(c => {
            const requestedDate = new Date(c.requestedDate);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            
            if (start) {
                start.setHours(0, 0, 0, 0); // Compare from start of day
                if (requestedDate < start) return false;
            }
            if (end) {
                end.setHours(23, 59, 59, 999); // Include the whole end day
                if (requestedDate > end) return false;
            }
            if (statuses.length > 0 && !statuses.includes(c.overallStatus)) return false;
            
            return true;
        });
    }, [candidates, filters, loading]);


    const handleStatusToggle = (status: VerificationStatus) => {
        setFilters(prev => {
            const newStatuses = prev.statuses.includes(status)
                ? prev.statuses.filter(s => s !== status)
                : [...prev.statuses, status];
            return { ...prev, statuses: newStatuses };
        });
    };

    const downloadCsv = () => {
        if (filteredReportData.length === 0) return;
        
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Requested Date', 'Completed Date'];
        const rows = filteredReportData.map(c => [
            c.id,
            `"${c.name}"`,
            c.email,
            c.phone,
            c.overallStatus,
            new Date(c.requestedDate).toISOString(),
            c.completedDate ? new Date(c.completedDate).toISOString() : 'N/A'
        ].join(','));
        
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `candidate_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const turnaroundTimeData = useMemo(() => {
        const completedCandidates = candidates.filter(c => c.completedDate);
        const monthlyData: { [key: string]: { totalDays: number; count: number } } = {};

        completedCandidates.forEach(c => {
            const requested = new Date(c.requestedDate);
            const completed = new Date(c.completedDate!);
            const diffDays = (completed.getTime() - requested.getTime()) / (1000 * 3600 * 24);
            
            const monthKey = `${requested.getFullYear()}-${String(requested.getMonth() + 1).padStart(2, '0')}`;
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { totalDays: 0, count: 0 };
            }
            monthlyData[monthKey].totalDays += diffDays;
            monthlyData[monthKey].count++;
        });

        return Object.entries(monthlyData)
            .map(([month, data]) => ({
                name: new Date(month + '-02').toLocaleString('default', { month: 'short' }), // Use day 2 to avoid timezone issues
                'Avg Turnaround (Days)': parseFloat((data.totalDays / data.count).toFixed(1)),
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(-6); // Last 6 months
    }, [candidates]);
    
    const chartColors = {
        grid: theme === 'dark' ? '#334152' : '#e2e8f0',
        tick: theme === 'dark' ? '#94a3b8' : '#64748b',
        tooltipBg: theme === 'dark' ? '#1e293b' : '#ffffff',
        tooltipBorder: theme === 'dark' ? '#334152' : '#e2e8f0',
        legend: theme === 'dark' ? '#94a3b8' : '#475569',
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Reports & Analytics</h1>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2 bg-brand-primary-light dark:bg-brand-primary-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700 self-start">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Report Filters</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Start Date</label>
                                <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} className="mt-1 w-full bg-slate-100 dark:bg-slate-700 p-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                            </div>
                             <div>
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">End Date</label>
                                <input type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} className="mt-1 w-full bg-slate-100 dark:bg-slate-700 p-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                            </div>
                        </div>
                         <div>
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Statuses</label>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                {Object.values(VerificationStatus).map(status => (
                                    <label key={status} className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" checked={filters.statuses.includes(status)} onChange={() => handleStatusToggle(status)} className="h-4 w-4 rounded text-brand-accent focus:ring-brand-accent border-slate-400 dark:border-slate-500 bg-slate-200 dark:bg-slate-600" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">{status}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 bg-brand-primary-light dark:bg-brand-primary-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Avg. Turnaround Time</h2>
                     <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={turnaroundTimeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                            <XAxis dataKey="name" tick={{ fill: chartColors.tick }} stroke={chartColors.grid} fontSize={12} />
                            <YAxis tick={{ fill: chartColors.tick }} stroke={chartColors.grid} fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: chartColors.tooltipBg, border: `1px solid ${chartColors.tooltipBorder}`}} cursor={{fill: 'rgba(34, 197, 94, 0.1)'}} />
                            <Bar dataKey="Avg Turnaround (Days)" fill="#22c55e" />
                          </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            <div className="bg-brand-primary-light dark:bg-brand-primary-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Report Results ({loading ? '...' : filteredReportData.length})</h2>
                    <button onClick={downloadCsv} disabled={filteredReportData.length === 0} className="bg-green-100 dark:bg-green-900/50 text-brand-accent font-semibold py-2 px-4 rounded-lg text-sm flex items-center gap-2 hover:bg-green-200 dark:hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download CSV
                    </button>
                </div>
                 <div className="overflow-x-auto">
                    {loading ? (
                         <div className="text-center py-8 text-slate-500 dark:text-slate-400">Loading report data...</div>
                    ) : filteredReportData.length > 0 ? (
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-800">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Name</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Requested On</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Completed On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredReportData.map(c => (
                                    <tr key={c.id}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-200">{c.name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{c.overallStatus}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{new Date(c.requestedDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{c.completedDate ? new Date(c.completedDate).toLocaleDateString() : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                            <p className="font-semibold">No candidates match the current filters.</p>
                            <p className="text-sm mt-1">Try adjusting the date range or selected statuses.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ReportsPage;