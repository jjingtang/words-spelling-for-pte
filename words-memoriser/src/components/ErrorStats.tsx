'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { ErrorStats, Vocabulary } from '@/types';
import { OverallStats } from './ErrorStats/OverallStats';
import { SortControls } from './ErrorStats/SortControls';
import { ErrorStatsTable } from './ErrorStats/ErrorStatsTable';
import { LoadingSpinner } from './ErrorStats/LoadingSpinner';

interface ErrorStatsProps {
  vocabulary: Vocabulary[];
  onBack: () => void;
}

export default function ErrorStatsComponent({ vocabulary, onBack }: ErrorStatsProps) {
  const [errorStats, setErrorStats] = useState<ErrorStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'errorRate' | 'errorCount' | 'totalAttempts'>('errorRate');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/error-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vocabulary })
      });
      
      const data = await response.json();
      if (data.success) {
        setErrorStats(data.errorStats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, [vocabulary]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const sortedStats = [...errorStats].sort((a, b) => {
    switch (sortBy) {
      case 'errorRate':
        return b.errorRate - a.errorRate;
      case 'errorCount':
        return b.errorCount - a.errorCount;
      case 'totalAttempts':
        return b.totalAttempts - a.totalAttempts;
      default:
        return 0;
    }
  });

  const overallStats = errorStats.length > 0 ? {
    totalWords: errorStats.length,
    totalAttempts: errorStats.reduce((sum, stat) => sum + stat.totalAttempts, 0),
    totalErrors: errorStats.reduce((sum, stat) => sum + stat.errorCount, 0),
    averageErrorRate: errorStats.reduce((sum, stat) => sum + stat.errorRate, 0) / errorStats.length,
    wordsWithErrors: errorStats.filter(stat => stat.errorCount > 0).length
  } : null;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Game
          </button>
          <div className="ml-6">
            <h1 className="text-3xl font-bold text-gray-800">Learning Statistics</h1>
            <p className="text-gray-600">Track your vocabulary learning progress</p>
          </div>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Overall Statistics */}
      {overallStats && <OverallStats stats={overallStats} />}

      {/* Sort Controls */}
      <SortControls currentSort={sortBy} onSortChange={setSortBy} />

      {/* Statistics Table */}
      <ErrorStatsTable errorStats={sortedStats} />
    </div>
  );
}