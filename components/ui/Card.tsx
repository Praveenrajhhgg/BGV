import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'increase' | 'decrease';
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, change, changeType, className = '' }) => {
  const changeColor = changeType === 'increase' ? 'text-green-500' : 'text-red-500';
  
  return (
    <div className={`bg-brand-primary-light dark:bg-brand-primary-dark p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start justify-between ${className}`}>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{value}</p>
        {change && (
          <div className="flex items-center mt-2 text-xs">
            <span className={`${changeColor} font-semibold`}>{change}</span>
            <span className="text-slate-500 dark:text-slate-400 ml-1">vs last month</span>
          </div>
        )}
      </div>
      <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-lg">
        {icon}
      </div>
    </div>
  );
};

export default Card;