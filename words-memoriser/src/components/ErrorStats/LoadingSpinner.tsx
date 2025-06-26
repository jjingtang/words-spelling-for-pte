// src/components/ErrorStats/LoadingSpinner.tsx
'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Loading statistics...</span>
      </div>
    </div>
  );
};