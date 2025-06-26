// src/components/ErrorStats/SortControls.tsx
'use client';

import React from 'react';

interface SortControlsProps {
  currentSort: 'errorRate' | 'errorCount' | 'totalAttempts';
  onSortChange: (sort: 'errorRate' | 'errorCount' | 'totalAttempts') => void;
}

export const SortControls: React.FC<SortControlsProps> = ({ currentSort, onSortChange }) => {
  const sortOptions = [
    { key: 'errorRate' as const, label: 'Error Rate' },
    { key: 'errorCount' as const, label: 'Error Count' },
    { key: 'totalAttempts' as const, label: 'Total Attempts' }
  ];

  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-gray-700 mb-2">Sort by:</p>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map(option => (
          <button
            key={option.key}
            onClick={() => onSortChange(option.key)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentSort === option.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};