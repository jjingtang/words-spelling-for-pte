// src/components/Stats/GameStats.tsx
'use client';

import React from 'react';
import { StatBadge } from './StatBadge';

interface GameStatsProps {
  correct: number;
  total: number;
  skipped: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ correct, total, skipped }) => {
  const wrong = total - correct;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="flex flex-wrap gap-4 text-sm mt-2">
      <StatBadge 
        label="Correct" 
        value={correct} 
        bgColor="bg-green-100" 
        textColor="text-green-800" 
      />
      <StatBadge 
        label="Wrong" 
        value={wrong} 
        bgColor="bg-red-100" 
        textColor="text-red-800" 
      />
      <StatBadge 
        label="Skipped" 
        value={skipped} 
        bgColor="bg-yellow-100" 
        textColor="text-yellow-800" 
      />
      {total > 0 && (
        <StatBadge 
          label="Accuracy" 
          value={`${accuracy}%`} 
          bgColor="bg-blue-100" 
          textColor="text-blue-800" 
        />
      )}
    </div>
  );
};