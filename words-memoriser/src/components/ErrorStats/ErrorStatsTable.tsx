// src/components/ErrorStats/ErrorStatsTable.tsx
'use client';

import React from 'react';
import { Target } from 'lucide-react';
import { ErrorStats } from '@/types';

interface ErrorStatsTableProps {
  errorStats: ErrorStats[];
}

export const ErrorStatsTable: React.FC<ErrorStatsTableProps> = ({ errorStats }) => {
  const getErrorRateColor = (rate: number) => {
    if (rate === 0) return 'text-green-600 bg-green-50';
    if (rate <= 20) return 'text-yellow-600 bg-yellow-50';
    if (rate <= 50) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Word
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Translation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Error Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Errors
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attempts
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Error
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {errorStats.map((stat) => (
              <tr key={stat.vocabularyId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{stat.english}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{stat.chinese}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getErrorRateColor(stat.errorRate)}`}>
                    {stat.errorRate.toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stat.errorCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stat.totalAttempts}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stat.errorCount > 0 ? (
                    new Date(stat.lastError).toLocaleDateString()
                  ) : (
                    'No errors'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errorStats.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600">Start playing the vocabulary game to see your statistics here.</p>
        </div>
      )}
    </div>
  );
};
