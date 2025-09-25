import React from 'react';

const BillingPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Billing & Invoices</h1>
      <div className="bg-brand-primary-light dark:bg-brand-primary-dark p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v.01M12 18v-2m0-4a2 2 0 00-2 2m2-2a2 2 0 012 2m0 0c0 1.105-.895 2-2 2m-2 2a2 2 0 012-2m2 2a2 2 0 002 2m-2-2a2 2 0 00-2-2m0 0A2.25 2.25 0 0012 5.25v.01A2.25 2.25 0 0012 3v.01A2.25 2.25 0 0012 5.25v.01A2.25 2.25 0 0012 3v.01M12 5.25A2.25 2.25 0 009.75 3v.01A2.25 2.25 0 0012 5.25v.01A2.25 2.25 0 0014.25 3v.01A2.25 2.25 0 0012 5.25z" />
        </svg>
        <h2 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-200">Billing Page Coming Soon</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">This is where you'll manage your subscription, view invoices, and update payment methods.</p>
      </div>
    </div>
  );
};

export default BillingPage;