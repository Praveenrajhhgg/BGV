
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { getCandidates } from '../services/api';
import { Candidate, VerificationStatus } from '../types';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const chartData = [
  { name: 'Jan', Completed: 40, 'In Progress': 24, Pending: 10 },
  { name: 'Feb', Completed: 30, 'In Progress': 13, Pending: 22 },
  { name: 'Mar', Completed: 50, 'In Progress': 38, Pending: 15 },
  { name: 'Apr', Completed: 47, 'In Progress': 39, Pending: 20 },
  { name: 'May', Completed: 60, 'In Progress': 48, Pending: 25 },
  { name: 'Jun', Completed: 58, 'In Progress': 38, Pending: 12 },
];

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState({ total: 0, inProgress: 0, completed: 0, failed: 0 });
    const [recentCandidates, setRecentCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const candidates = await getCandidates();
                const total = candidates.length;
                const inProgress = candidates.filter(c => c.overallStatus === VerificationStatus.IN_PROGRESS).length;
                const completed = candidates.filter(c => c.overallStatus === VerificationStatus.COMPLETED).length;
                const failed = candidates.filter(c => c.overallStatus === VerificationStatus.FAILED).length;
                setStats({ total, inProgress, completed, failed });
                setRecentCandidates(candidates.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    
    const chartColors = {
        grid: theme === 'dark' ? '#334152' : '#e2e8f0',
        tick: theme === 'dark' ? '#94a3b8' : '#64748b',
        tooltipBg: theme === 'dark' ? '#1e293b' : '#ffffff',
        tooltipBorder: theme === 'dark' ? '#334152' : '#e2e8f0',
        legend: theme === 'dark' ? '#94a3b8' : '#475569',
    };

    if (loading) {
        return <div className="text-center p-8">Loading dashboard...</div>;
    }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Client Dashboard</h1>
      
      <div id="tour-step-dashboard-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Candidates" value={stats.total} icon={<UsersIcon />} change="+12%" changeType="increase" />
        <Card title="In Progress" value={stats.inProgress} icon={<ClockIcon />} />
        <Card title="Completed" value={stats.completed} icon={<CheckCircleIcon />} change="+5%" changeType="increase" />
        <Card title="Failed / Discrepancy" value={stats.failed} icon={<XCircleIcon />} change="-2%" changeType="decrease" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-brand-primary-light dark:bg-brand-primary-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Verification Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="name" tick={{ fill: chartColors.tick }} stroke={chartColors.grid} fontSize={12} />
                <YAxis tick={{ fill: chartColors.tick }} stroke={chartColors.grid} fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: chartColors.tooltipBg, border: `1px solid ${chartColors.tooltipBorder}`, color: '#334152' }} cursor={{fill: 'rgba(34, 197, 94, 0.1)'}} />
                <Legend wrapperStyle={{ color: chartColors.legend, fontSize: '12px' }} />
                <Bar dataKey="Completed" stackId="a" fill="#22c55e" />
                <Bar dataKey="In Progress" stackId="a" fill="#3b82f6" />
                <Bar dataKey="Pending" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-brand-primary-light dark:bg-brand-primary-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Recent Candidates</h2>
          <div className="space-y-2">
            {recentCandidates.map(candidate => (
              <Link to={`/candidates/${candidate.id}`} key={candidate.id} className="block hover:bg-slate-50 dark:hover:bg-slate-700/50 p-3 rounded-lg transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{candidate.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{candidate.email}</p>
                  </div>
                  <Badge status={candidate.overallStatus} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


const UsersIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-1.78-4.125a4 4 0 00-6.44 0A6 6 0 003 20v1h12z" />
    </svg>
);

const ClockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CheckCircleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const XCircleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default DashboardPage;
