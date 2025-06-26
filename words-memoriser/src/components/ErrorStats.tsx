'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingDown, Target, Clock, RefreshCw } from 'lucide-react';
import { ErrorStats, Vocabulary } from '@/types';

interface ErrorStatsProps {
  vocabulary: Vocabulary[];
  onBack: () => void;
}

export default function ErrorStatsComponent({ vocabulary, onBack }: ErrorStatsProps) {
  const [errorStats, setErrorStats] = useState<ErrorStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'errorRate' | 'errorCount' | 'totalAttempts'>('errorRate');

  const fetchStats = async () => {
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
  };

  useEffect(() => {
    fetchStats();
  }, [vocabulary]);

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

  const getErrorRateColor = (rate: number) => {
    if (rate === 0) return 'text-green-600 bg-green-50';
    if (rate <= 20) return 'text-yellow-600 bg-yellow-50';
    if (rate <= 50) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Loading statistics...</span>
        </div>
      </div>
    );
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
            <h1 className="text-3xl font-bold text-gray-800">Error Statistics</h1>
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
      {overallStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Words</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.totalWords}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.totalAttempts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Errors</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.totalErrors}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Error Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overallStats.averageErrorRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sort Controls */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Sort by:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'errorRate', label: 'Error Rate' },
            { key: 'errorCount', label: 'Error Count' },
            { key: 'totalAttempts', label: 'Total Attempts' }
          ].map(option => (
            <button
              key={option.key}
              onClick={() => setSortBy(option.key as typeof sortBy)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortBy === option.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Table */}
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
              {sortedStats.map((stat) => (
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

        {sortedStats.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600">Start playing the vocabulary game to see your statistics here.</p>
          </div>
        )}
      </div>
    </div>
  );
}