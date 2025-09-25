import React from 'react';
import { VerificationStatus } from '../../types';
import { STATUS_COLORS } from '../../constants';

interface BadgeProps {
  status: VerificationStatus;
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const statusColor = STATUS_COLORS[status] || { badge: 'bg-gray-100 text-gray-800', dot: 'bg-gray-500' };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center ${statusColor.badge}`}>
      <span className={`h-2 w-2 mr-2 rounded-full ${statusColor.dot}`}></span>
      {status}
    </span>
  );
};

export default Badge;