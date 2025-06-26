// src/components/ErrorStats/OverallStats.tsx
'use client';

import React from 'react';
import { Target, TrendingDown, Clock } from 'lucide-react';

interface OverallStatsProps {
  stats: {
    totalWords: number;
    totalAttempts: number;
    totalErrors: number;
    averageErrorRate: number;
    wordsWithErrors: number;
  };
}

export const OverallStats: React.FC<OverallStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={<Target className="h-8 w-8 text-blue-600" />}
        title="Total Words"
        value={stats.totalWords.toString()}
      />
      <StatCard
        icon={<TrendingDown className="h-8 w-8 text-green-600" />}
        title="Total Attempts"
        value={stats.totalAttempts.toString()}
      />
      <StatCard
        icon={<Clock className="h-8 w-8 text-orange-600" />}
        title="Total Errors"
        value={stats.totalErrors.toString()}
      />
      <StatCard
        icon={<TrendingDown className="h-8 w-8 text-purple-600" />}
        title="Avg Error Rate"
        value={`${stats.averageErrorRate.toFixed(1)}%`}
      />
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string }> = ({ 
  icon, 
  title, 
  value 
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      {icon}
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);