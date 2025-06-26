// src/components/Stats/StatBadge.tsx
'use client';

import React from 'react';

interface StatBadgeProps {
  label: string;
  value: string | number;
  bgColor: string;
  textColor: string;
}

export const StatBadge: React.FC<StatBadgeProps> = ({ label, value, bgColor, textColor }) => {
  return (
    <span className={`${bgColor} ${textColor} px-2 py-1 rounded font-medium`}>
      {label}: {value}
    </span>
  );
};